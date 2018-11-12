#!/bin/sh

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

universalTest 1 "http://localhost:4200/" "router-outlet><ish-home-page-container>"
universalTest 2 "http://localhost:4200/category/Cameras-Camcorders.584" "router-outlet><ish-category-page-container>"
universalTest 3 "http://localhost:4200/login" "Forgot your password?"
universalTest 4 "http://localhost:4200/register" "Create Account"
universalTest 5 "http://localhost:4200/category/Cameras-Camcorders" "<h1>Cameras</h1>"
universalTest 6 "http://localhost:4200/category/Cameras-Camcorders" "<h3>Webcams</h3>"
universalTest 7 "http://localhost:4200/category/Cameras-Camcorders.584" "add-to-compare"
universalTest 8 "http://localhost:4200/home" "intershop-pwa-state"
universalTest 9 "http://localhost:4200/home" "&q;icmBaseURL&q;:&q;$ICM_BASE_URL"
universalTest 10 "http://localhost:4200/home" "<ish-cms-carousel>"

exit 0
