#!/bin/sh

set -x
set -e

node schematics/customization/add --default brand
grep brand angular.json
grep brand package.json

# format without source folder prefix from project root
npx ng g customized-copy shell/footer/footer

stat src/app/shell/footer/custom-footer/custom-footer.component.ts
grep 'custom-footer' src/app/app.component.html

# format with source folder prefix from project root
npx ng g customized-copy src/app/shared/components/basket/basket-promotion
stat src/app/shared/components/basket/custom-basket-promotion/custom-basket-promotion.component.html
grep 'custom-basket-promotion' src/app/shared/components/basket/basket-cost-summary/basket-cost-summary.component.html

# from subfolder
(cd src/app/pages/checkout-review && npx ng g customized-copy checkout-review)
stat src/app/pages/checkout-review/custom-checkout-review/custom-checkout-review.component.html
grep 'custom-checkout-review' src/app/pages/checkout-review/checkout-review-page.component.html

npx ng g customized-copy src/app/extensions/quoting/shared/quote-widget
stat src/app/extensions/quoting/shared/custom-quote-widget/custom-quote-widget.component.ts
# TODO
# grep 'custom-lazy-quote-widget' src/app/pages/account-overview/account-overview/account-overview.component.html

npx ng g override --theme brand --html --ts --scss src/app/pages/home/home-page.component.ts
stat src/app/pages/home/home-page.component.brand.html
stat src/app/pages/home/home-page.component.brand.scss
stat src/app/pages/home/home-page.component.brand.ts
stat src/app/pages/home/home-page.component.scss
grep './home-page.component.scss' src/app/pages/home/home-page.component.brand.ts
grep './home-page.component.scss' src/app/pages/home/home-page.component.ts
echo '<p>COMPONENT_OVERRIDES</p>' > src/app/pages/home/home-page.component.brand.html
echo "@import 'variables';" > src/app/pages/home/home-page.component.brand.scss

npx ng g override --theme brand --html --ts src/app/shared/components/product/product-image/product-image.component.ts
stat src/app/shared/components/product/product-image/product-image.component.brand.ts
stat src/app/shared/components/product/product-image/product-image.component.brand.html

npx ng g override --theme brand --ts src/app/core/routing/product/product.route.ts
stat src/app/core/routing/product/product.route.brand.ts

npx ng g override --theme brand --ts src/app/core/services/cms/cms.service.ts
stat src/app/core/services/cms/cms.service.brand.ts

sed -i -e "s%icmBaseURL.*%icmBaseURL: 'http://localhost:4200',%g" src/environments/environment.ts

node schematics/customization/service-worker false
grep '"serviceWorker": false' angular.json

git add -A
npm run clean
npx lint-staged
npx tsc --project tsconfig.all.json

export NODE_OPTIONS=--max_old_space_size=8192

npm run build

nohup bash -c "npm run serve &"
wget -q --wait 10 --tries 10 --retry-connrefused http://localhost:4200

wget -O - -q "http://localhost:4200/home" | grep -q "COMPONENT_OVERRIDES"
wget -O - -q "http://localhost:4200/home" | grep -q "<custom-footer"
