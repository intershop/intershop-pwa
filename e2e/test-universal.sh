#!/bin/sh

PWA_BASE_URL=${PWA_BASE_URL:-"http://localhost:4200"}

universalTest() {
  NUM="$1"
  URL="$2"
  GREP="$3"
  echo "\n\nTEST $NUM: searching '$GREP' in '$URL'"
  timeout 5m sh -c "[ ! -z \"\$(wget -O - -q -t 0 --waitretry 5 $URL | grep \"$GREP\")\" ]"
  res=$?
  [ "$res" -ne "0" ] && curl -v "$URL"
  [ "$res" -eq "0" ] && echo "TEST $NUM: SUCCESS" || echo "\n\nTEST $NUM: searching '$GREP' in '$URL': FAILURE\n"
  [ "$res" -ne "0" ] && exit 1
}

universalTest 1 "${PWA_BASE_URL}/" "router-outlet><ish-home-page"
universalTest 2 "${PWA_BASE_URL}/catComputers.1835.151" "router-outlet><ish-category-page"
universalTest 3 "${PWA_BASE_URL}/login" "<ish-loading"
universalTest 4 "${PWA_BASE_URL}/register" "Create Account"
universalTest 5 "${PWA_BASE_URL}/catComputers.1835" "<h1>Notebooks and PCs</h1>"
universalTest 6 "${PWA_BASE_URL}/catComputers.1835" "<h3>PCs</h3>"
universalTest 7 "${PWA_BASE_URL}/catComputers.1835.151" "add-to-compare"
universalTest 8 "${PWA_BASE_URL}/home" "intershop-pwa-state"
universalTest 9 "${PWA_BASE_URL}/home" "&q;baseURL&q;:"
universalTest 10 "${PWA_BASE_URL}/home" "<ish-content-include includeid=.include.homepage.content.pagelet2-Include"
universalTest 11 "${PWA_BASE_URL}/home" "<link rel=.canonical. href=.${PWA_BASE_URL}/home.>"
universalTest 12 "${PWA_BASE_URL}/home" "<meta property=.og:image. content=.${PWA_BASE_URL}[^>]*og-image-default"
universalTest 13 "${PWA_BASE_URL}/home" "<title>inTRONICS Home | Intershop PWA</title>"
universalTest 14 "${PWA_BASE_URL}/sku6997041" "<link rel=.canonical. href=.${PWA_BASE_URL}/Notebooks/Asus-Eee-PC-1008P-Karim-Rashid-sku6997041-catComputers.1835.151.>"
universalTest 15 "${PWA_BASE_URL}/sku6997041" "<meta property=.og:image. content=[^>]*6997041"
universalTest 16 "${PWA_BASE_URL}/sku6997041" "<title>Asus Eee PC 1008P .Karim Rashid. [^>]* | Intershop PWA</title>"
universalTest 17 "${PWA_BASE_URL}/home;device=tablet" "class=.header container tablet"
universalTest 18 "${PWA_BASE_URL}/home;device=desktop" "class=.header container desktop"
universalTest 19 "${PWA_BASE_URL}/home;device=mobile" "class=.header container mobile"

exit 0
