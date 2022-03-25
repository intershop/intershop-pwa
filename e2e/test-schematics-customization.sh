#!/bin/sh

# disable interactive mode with `| cat` at end of call

set -e
set -x

node schematics/customization/add --default brand
grep brand angular.json
grep brand package.json

# format without source folder prefix from project root
npx ng g customized-copy shell/footer/footer

test -f src/app/shell/footer/custom-footer/custom-footer.component.ts
grep 'custom-footer' src/app/app.component.html

# format with source folder prefix from project root
npx ng g customized-copy src/app/shared/components/basket/basket-promotion
test -f src/app/shared/components/basket/custom-basket-promotion/custom-basket-promotion.component.html
grep 'custom-basket-promotion' src/app/shared/components/basket/basket-cost-summary/basket-cost-summary.component.html

# from subfolder
(cd src/app/pages/checkout-review && npx ng g customized-copy checkout-review)
test -f src/app/pages/checkout-review/custom-checkout-review/custom-checkout-review.component.html
grep 'custom-checkout-review' src/app/pages/checkout-review/checkout-review-page.component.html

npx ng g override --theme brand --html --ts --scss src/app/pages/home/home-page.component.ts | cat
test -f src/app/pages/home/home-page.component.brand.html
test -f src/app/pages/home/home-page.component.brand.scss
test -f src/app/pages/home/home-page.component.brand.ts
test -f src/app/pages/home/home-page.component.scss
grep './home-page.component.scss' src/app/pages/home/home-page.component.brand.ts
grep './home-page.component.scss' src/app/pages/home/home-page.component.ts
echo '<p>COMPONENT_OVERRIDES</p>' > src/app/pages/home/home-page.component.brand.html
echo "@import 'variables';" > src/app/pages/home/home-page.component.brand.scss

npx ng g override --theme brand --html --ts src/app/shared/components/product/product-image/product-image.component.ts | cat
test -f src/app/shared/components/product/product-image/product-image.component.brand.ts
test -f src/app/shared/components/product/product-image/product-image.component.brand.html

npx ng g override --theme brand --ts src/app/core/routing/product/product.route.ts | cat
test -f src/app/core/routing/product/product.route.brand.ts

npx ng g override --theme brand --ts src/app/core/services/cms/cms.service.ts | cat
test -f src/app/core/services/cms/cms.service.brand.ts

node schematics/customization/service-worker false
grep '"serviceWorker": false' angular.json

export NODE_OPTIONS=--max_old_space_size=8192

npm exec npm-run-all format "lint -- --fix" compile build

nohup bash -c "npm run serve &"
npx wait-on --verbose --interval 1000 --delay 1000 --timeout 30000 tcp:4200

curl -s "http://localhost:4200/home" | grep -q "COMPONENT_OVERRIDES"
curl -s "http://localhost:4200/home" | grep -q "<custom-footer"
