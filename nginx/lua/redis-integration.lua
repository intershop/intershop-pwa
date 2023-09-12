local function extract_ssl(uri)
    if string.sub(uri,1,9) == "rediss://" then
        return true, string.gsub(uri, "rediss://", "redis://")
    else
        return false, uri
    end
end

local function connect()
    local uri = os.getenv("REDIS_URI")
    if not uri then
        ngx.log(ngx.ERR, "REDIS_URI not set")
        ngx.exit(500)
    end

    local ssl, uri = extract_ssl(uri)

    local redis, err = require("resty.redis.connector").new({
        url = uri,
        connection_options = {
            ssl = ssl
        }
    }):connect()

    if err ~= nil then
        ngx.log(ngx.ERR, "Failed to connect to redis, error -> ", err)
        ngx.exit(500)
    end

    return redis
end

return {
    connect = connect
}
