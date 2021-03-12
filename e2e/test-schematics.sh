#!/bin/sh

set -x
set -e

npx ng g model warehouse
stat src/app/core/models/warehouse/warehouse.model.ts
stat src/app/core/models/warehouse/warehouse.interface.ts
stat src/app/core/models/warehouse/warehouse.mapper.ts
stat src/app/core/models/warehouse/warehouse.helper.ts

npx ng g model stock --simple
stat src/app/core/models/stock/stock.model.ts

npx ng g s warehouses
stat src/app/core/services/warehouses/warehouses.service.ts

npx ng g store dummy
stat src/app/core/store/core/dummy/dummy.actions.ts
stat src/app/core/store/core/dummy/dummy.effects.ts
stat src/app/core/store/core/dummy/dummy.reducer.ts
stat src/app/core/store/core/dummy/dummy.selectors.ts
grep "DummyState" src/app/core/store/core/core-store.ts

npx ng g store-group training
stat src/app/core/store/training/training-store.ts
grep "TrainingStoreModule" src/app/core/state-management.module.ts

npx ng g store training/warehouses --entity warehouse
stat src/app/core/store/training/warehouses/warehouses.actions.ts
stat src/app/core/store/training/warehouses/warehouses.effects.ts
stat src/app/core/store/training/warehouses/warehouses.reducer.ts
stat src/app/core/store/training/warehouses/warehouses.selectors.ts
grep "WarehousesState" src/app/core/store/training/training-store.ts

npx ng g pipe warehouses
stat src/app/core/pipes/warehouses.pipe.ts
grep "WarehousesPipe" src/app/core/pipes.module.ts

npx ng g c shared/components/inventory/warehouse
stat src/app/shared/components/inventory/warehouse/warehouse.component.ts
grep "WarehouseComponent" src/app/shared/shared.module.ts

npx ng g lazy-component src/app/shared/components/inventory/warehouse/warehouse.component.ts
stat src/app/shell/shared/lazy-warehouse/lazy-warehouse.component.ts
grep GenerateLazyComponent src/app/shared/components/inventory/warehouse/warehouse.component.ts


npx ng g p warehouses
stat src/app/pages/warehouses/warehouses-page.module.ts
stat src/app/pages/warehouses/warehouses-page.component.ts
grep "WarehousesPageComponent" src/app/pages/warehouses/warehouses-page.module.ts
grep "warehouses" src/app/pages/app-routing.module.ts


npx ng g e awesome
stat src/app/extensions/awesome/awesome.module.ts
stat src/app/extensions/awesome/pages/awesome-routing.module.ts
stat src/app/extensions/awesome/store/awesome-store.module.ts
stat src/app/extensions/awesome/exports/awesome-exports.module.ts

npx ng g c extensions/awesome/shared/dummy
stat src/app/extensions/awesome/shared/dummy/dummy.component.ts

npx ng g lazy-component extensions/awesome/shared/dummy/dummy.component.ts
stat src/app/extensions/awesome/exports/lazy-dummy/lazy-dummy.component.ts
grep "LazyDummyComponent" src/app/extensions/awesome/exports/awesome-exports.module.ts


npx ng g s super -e awesome
stat src/app/extensions/awesome/services/super/super.service.ts

npx ng g s src/app/extensions/awesome/duper
stat src/app/extensions/awesome/services/duper/duper.service.ts

npx ng g store -e awesome super
stat src/app/extensions/awesome/store/super/super.actions.ts
stat src/app/extensions/awesome/store/super/super.effects.ts
stat src/app/extensions/awesome/store/super/super.reducer.ts
stat src/app/extensions/awesome/store/super/super.selectors.ts
grep "SuperState" src/app/extensions/awesome/store/awesome-store.ts

npx ng g cms --definition-qualified-name app:component.custom.inventory.pagelet2-Component inventory
stat src/app/shared/cms/components/cms-inventory/cms-inventory.component.ts
grep "CMSInventoryComponent" src/app/shared/cms/cms.module.ts
grep "CMSInventoryComponent" src/app/shared/shared.module.ts

npx ng g cms --definition-qualified-name app:component.custom.audio.pagelet2-Component --noCMSPrefixing audio
stat src/app/shared/cms/components/audio/audio.component.ts
grep "AudioComponent" src/app/shared/cms/cms.module.ts
grep "AudioComponent" src/app/shared/shared.module.ts

npx ng g lazy-component --project organization-management --path projects/organization-management/src/app/components/user-profile-form/user-profile-form.component.ts
stat projects/organization-management/src/app/exports/lazy-user-profile-form/lazy-user-profile-form.component.ts
stat projects/organization-management/src/app/exports/lazy-user-profile-form/lazy-user-profile-form.component.html
stat projects/organization-management/src/app/exports/organization-management-exports.module.ts
grep "LazyUserProfileFormComponent" projects/organization-management/src/app/exports/organization-management-exports.module.ts
grep "LazyUserProfileFormComponent" projects/organization-management/src/app/exports/index.ts

npx ng g lazy-component --project organization-management --path projects/organization-management/src/app/components/user-roles-selection/user-roles-selection.component.ts
stat projects/organization-management/src/app/exports/lazy-user-roles-selection/lazy-user-roles-selection.component.ts
stat projects/organization-management/src/app/exports/lazy-user-roles-selection/lazy-user-roles-selection.component.html
grep "LazyUserRolesSelectionComponent" projects/organization-management/src/app/exports/organization-management-exports.module.ts
grep "LazyUserRolesSelectionComponent" projects/organization-management/src/app/exports/index.ts

npm run lint

node schematics/customization/add custom
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

sed -i -e "s%icmBaseURL.*%icmBaseURL: 'http://localhost:4200',%g" src/environments/environment.ts

node scripts/init-local-environment -f

node schematics/customization/service-worker false
grep '"serviceWorker": false' angular.json

git add -A
npm run clean
npx lint-staged
npx tsc --project tsconfig.all.json

npx ng g add-destroy src/app/extensions/awesome/shared/dummy/dummy.component.ts
grep destroy src/app/extensions/awesome/shared/dummy/dummy.component.ts

echo '<p>COMPONENT_OVERRIDES</p>' > src/app/pages/home/home-page.component.local.html

npm run build --configuration=local

nohup bash -c "npm run serve &"
wget -q --wait 10 --tries 10 --retry-connrefused http://localhost:4200

wget -O - -q "http://localhost:4200/warehouses" | grep -q "warehouses-page works"
wget -O - -q "http://localhost:4200/home" | grep -q "COMPONENT_OVERRIDES"

npx ng g kubernetes-deployment
find charts

npx ng g azure-pipeline
stat azure-pipelines.yml
