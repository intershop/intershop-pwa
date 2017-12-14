#!/bin/bash

unset ICM_BASE_URL

./gradlew npmRun -Pnpmargs='run start:dynamic' &
trap 'jobs -p | xargs -r kill' EXIT

declare -A testmatrix

function universalTest {
  NUM="$1"
  URL="$2"
  GREP="$3"
  timeout 5m bash -c "[ ! -z \"\$(wget -O - -q --wait 10 --tries 1000 --retry-connrefused $URL | grep \"$GREP\")\" ]"
  res=$?
  echo -n "TEST $NUM: searching '$GREP' in '$URL': " >&2
  [ "$res" -eq "0" ] && echo "SUCCESS" >&2 || echo "FAILURE" >&2
  [ "$res" -ne "0" ] && wget -O - -q "$URL"
  return $res
}


testmatrix[1,0]="http://localhost:4000/"
testmatrix[1,1]="router-outlet><ish-home-page>"
testmatrix[2,0]="http://localhost:4000/category/Cameras-Camcorders/584"
testmatrix[2,1]="router-outlet><ish-category-page>"
testmatrix[3,0]="http://localhost:4000/login"
testmatrix[3,1]="Forgot your password?"
testmatrix[4,0]="http://localhost:4000/register"
testmatrix[4,1]="Create Account"
testmatrix[5,0]="http://localhost:4000/category/Cameras-Camcorders"
testmatrix[5,1]="<h1>Cameras</h1>"
testmatrix[6,0]="http://localhost:4000/category/Cameras-Camcorders"
testmatrix[6,1]="<h3>Webcams Mock</h3>"
testmatrix[7,0]="http://localhost:4000/category/Cameras-Camcorders/584"
testmatrix[7,1]="add-to-compare"
testmatrix[8,0]="http://localhost:4000/category/Cameras-Camcorders/584"
testmatrix[8,1]="proof-of-concept-state"
testmatrix[9,0]="http://localhost:4000/category/Cameras-Camcorders/584"
testmatrix[9,1]="&q;icmBaseURL&q;:&q;http://localhost:4000"
lasttest=9


testno=1
failures=0
while [ "$testno" -le "$lasttest" ]
do
  if [ -z "${testmatrix[$testno,0]}" ]
  then
    echo "TEST $testno: SKIPPED"
  else
    universalTest $testno "${testmatrix[$testno,0]}" "${testmatrix[$testno,1]}" || failures=$((failures + 1))
  fi
  testno=$((testno + 1))
done

exit $failures
