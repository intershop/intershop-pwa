#!/bin/bash

if [ -z "$ICM_BASE_URL" ]; then
    echo "Error: ICM_BASE_URL is not set."
    exit 1
fi
if [ -z "$UPSTREAM_PWA" ]; then
    echo "Error: UPSTREAM_PWA is not set."
    exit 2
fi

# read MULTI_CHANNEL_CONF from the possible sources, source file, environment, default multi-channel.yaml file
if [ -z "$MULTI_CHANNEL_SOURCE" ]
then
  if [ -z "$MULTI_CHANNEL" ]
  then
    MULTI_CHANNEL_CONF="$(cat ./multi-channel.yaml)"
  else
    MULTI_CHANNEL_CONF=$MULTI_CHANNEL
  fi
else
  MULTI_CHANNEL_CONF="$(/gomplate -d data=$MULTI_CHANNEL_SOURCE -i '{{ ds "data" | toYAML }}')"
fi

# interval in seconds to poll the ICM webadapter statistics to check for changed cache IDs
# default is 15 seconds
CACHE_CLEARER_POLL_INTERVAL="${CACHE_CLEARER_POLL_INTERVAL:-15}"

# get a unique list of channels (sites)
MULTI_CHANNEL_SITES=$(echo "$MULTI_CHANNEL_CONF" | grep -oE 'channel: [^ ]+' | awk '{print $2}' | tr ' ' '\n' | sort -u | tr '\n' ' ')
echo "Info: Sites from MULTI_CHANNEL configuration found: '$MULTI_CHANNEL_SITES'"

# get_endpoints() gets k8s endpoints for upstream pwa service
# fallback to UPSTREAM_PWA if not on k8s or if k8s endpoints can not be retrieved
# return codes: 
#   0   successfully determined the endpoints
#   1   not able to determine k8s via /var/run/secrets/kubernetes.io/
get_endpoints() {
    local token_file="/var/run/secrets/kubernetes.io/serviceaccount/token"
    local ca_cert="/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
    local ns_file="/var/run/secrets/kubernetes.io/serviceaccount/namespace"

    if [[ -f "$token_file" && -f "$ca_cert" && -f "$ns_file" ]]; then
        local namespace service protocol token
        namespace=$(<"$ns_file")
        service=$(echo "$UPSTREAM_PWA" | awk -F[/:] '{print $4}')
        protocol=$(echo "$UPSTREAM_PWA" | awk -F[/:] '{print $1}')
        token=$(<"$token_file")
        local response
        response=$(curl -sS --cacert "$ca_cert" \
            -H "Authorization: Bearer $token" \
            "https://kubernetes.default.svc/api/v1/namespaces/$namespace/endpoints/$service")
        local ips ports
        ips=$(echo "$response" | grep -o '"ip":[[:space:]]*"[^"]*"' | sed 's/.*"ip":[[:space:]]*"\([^"]*\)".*/\1/')
        ports=$(echo "$response" | grep -o '"port":[[:space:]]*[0-9]*' | sed 's/[^0-9]*//g')
        if [[ -n "$ips" && -n "$ports" ]]; then
            for port in $ports; do
                for ip in $ips; do
                    echo "$protocol://$ip:$port"
                done
                break
            done
            return 0
        fi
    fi
    echo "$UPSTREAM_PWA"
    return 1
}

purge_icm_calls_cache() {
    # send a PURGE request to the upstream PWA to clear any cached ICM calls
    for endpoint in $(get_endpoints); do
        if [ -z "$endpoint" ]; then
            continue
        fi
        local purge_status=$(curl -X PURGE -sS -o /dev/null -w "%{http_code}" "$endpoint/PURGE_CACHE_ICM_CALLS")
        if [ "$purge_status" -ne 200 ]; then
            echo "Error: purging cache of ICM calls failed for $endpoint with status: $purge_status"
        else
            echo "Info: successfully requested to purge the cache of ICM calls for $endpoint."
        fi
    done
}

echo "Info: Starting nginx cache clear monitor based on ICM webadapter statistics"
ENDPOINTS=$(get_endpoints)
if [ $? -ne 0 ]; then
    MESSAGE="by using environment UPSTREAM_PWA"
else
    MESSAGE="by using k8s endpoints API"
fi
 ENDPOINTS=$(echo $ENDPOINTS | tr '\n' ', ')
echo "Info: Got current upstream PWA Endpoints: $ENDPOINTS $MESSAGE"

# associative array holding the cache state for each site
# key: site name, value: pipeline cache ID
declare -A SITE_CACHE_MAP

while true; do
    HTTP_STATUS=$(curl -sS -o /tmp/wastatistics_output -w "%{http_code}" "$ICM_BASE_URL/INTERSHOP/wastatistics")
    if [ "$HTTP_STATUS" -ne 200 ]; then
        echo "Error: Webadapter statistics request failed with status: $HTTP_STATUS"
        sleep $CACHE_CLEARER_POLL_INTERVAL
    
        continue
    fi

    SITES_CACHEIDS=$(cat /tmp/wastatistics_output | grep  '\-Site' | awk -F ' ' '{print $2 ":" $4}')
    # echo " Site - Cache IDS: $SITES_CACHEIDS"

    SITES_TO_CLEAR=()

    for SITE_CACHEID in $SITES_CACHEIDS; do
        SITE=$(echo $SITE_CACHEID | cut -d':' -f1)
        CACHEID=$(echo $SITE_CACHEID | cut -d':' -f2)

        if [[ -n "${SITE_CACHE_MAP[$SITE]}" ]]; then
            PREV_CACHEID=${SITE_CACHE_MAP[$SITE]}
            if [[ "$CACHEID" -gt "$PREV_CACHEID" ]]; then
                SITES_TO_CLEAR+=($SITE)
            fi
        fi
        # store each site and cache id in the associative array
        SITE_CACHE_MAP["$SITE"]="$CACHEID"
    done

    if [ ${#SITES_TO_CLEAR[@]} -gt 0 ]; then
        # only default configured, whole cache is cleared at every changed site
        if [[ "$MULTI_CHANNEL_SITES" == "default " ]]; then
            echo "Info: deleting whole default nginx cache due to increased cache ID for sites: ${SITES_TO_CLEAR[@]}"
            rm -rf /tmp/cache/default/*

            purge_icm_calls_cache
        else
            # clear cache for each site that was found having an increased cache ID and is part of the MULTI_CHANNEL_SITES
            SITE_CACHE_CLEAR="no"
            for SITE in "${SITES_TO_CLEAR[@]}"; do
                if echo "$MULTI_CHANNEL_SITES" | grep -qw "$SITE"; then
                    echo "Info: deleting nginx cache for site: $SITE"
                    rm -rf "/tmp/cache/$SITE"/*
                    SITE_CACHE_CLEAR="yes"
                fi
            done
            if [[ "$SITE_CACHE_CLEAR" == "yes" ]]; then
                purge_icm_calls_cache

    #            echo "Info: deleting nginx cache due to changed cache id for sites: ${SITES_TO_CLEAR[@]}"
    #            rm -rf /tmp/cache/*
            fi
        fi
    fi    

    sleep $CACHE_CLEARER_POLL_INTERVAL

done
