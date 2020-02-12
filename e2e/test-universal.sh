#!/bin/sh

PWA_BASE_URL=${PWA_BASE_URL:-"http://localhost:4200"}

universalTest() {
  NUM="$1"
  URL="$2"
  GREP="$3"
  echo "\n\nTEST $NUM: searching '$GREP' in '$URL'"
  timeout 5m sh -c "[ ! -z \"\$(wget -O - -q $URL | grep \"$GREP\")\" ]"
  res=$?
  [ "$res" -ne "0" ] && wget -O - -q "$URL"
  [ "$res" -eq "0" ] && echo "TEST $NUM: SUCCESS" || echo "\n\nTEST $NUM: searching '$GREP' in '$URL': FAILURE\n"
  [ "$res" -ne "0" ] && exit 1
}

universalTest 1 "${PWA_BASE_URL}/" "router-outlet><ish-home-page"
universalTest 2 "${PWA_BASE_URL}/catComputers.1835.151" "router-outlet><ish-category-page"
universalTest 3 "${PWA_BASE_URL}/login" "Forgot your password?"
universalTest 4 "${PWA_BASE_URL}/register" "Create Account"
universalTest 5 "${PWA_BASE_URL}/catComputers.1835" "<h1>Notebooks and PCs</h1>"
universalTest 6 "${PWA_BASE_URL}/catComputers.1835" "<h3>PCs</h3>"
universalTest 7 "${PWA_BASE_URL}/catComputers.1835.151" "add-to-compare"
universalTest 8 "${PWA_BASE_URL}/home" "intershop-pwa-state"
universalTest 9 "${PWA_BASE_URL}/home" "&q;baseURL&q;:"
universalTest 10 "${PWA_BASE_URL}/home" "<ish-content-include includeid=.pwa.include.homepage.pagelet2-Include"

exit 0
