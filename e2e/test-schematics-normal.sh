#!/bin/sh

set -e
set -x

npx ng g model warehouse
test -f src/app/core/models/warehouse/warehouse.model.ts
test -f src/app/core/models/warehouse/warehouse.interface.ts
test -f src/app/core/models/warehouse/warehouse.mapper.ts
test -f src/app/core/models/warehouse/warehouse.helper.ts

npx ng g model stock --simple
test -f src/app/core/models/stock/stock.model.ts

npx ng g s warehouses
test -f src/app/core/services/warehouses/warehouses.service.ts

npx ng g store dummy
test -f src/app/core/store/core/dummy/dummy.actions.ts
test -f src/app/core/store/core/dummy/dummy.effects.ts
test -f src/app/core/store/core/dummy/dummy.reducer.ts
test -f src/app/core/store/core/dummy/dummy.selectors.ts
grep "DummyState" src/app/core/store/core/core-store.ts

npx ng g store-group training
test -f src/app/core/store/training/training-store.ts
grep "TrainingStoreModule" src/app/core/state-management.module.ts

npx ng g store training/warehouses --entity warehouse
test -f src/app/core/store/training/warehouses/warehouses.actions.ts
test -f src/app/core/store/training/warehouses/warehouses.effects.ts
test -f src/app/core/store/training/warehouses/warehouses.reducer.ts
test -f src/app/core/store/training/warehouses/warehouses.selectors.ts
grep "WarehousesState" src/app/core/store/training/training-store.ts

npx ng g pipe warehouses
test -f src/app/core/pipes/warehouses.pipe.ts
grep "WarehousesPipe" src/app/core/pipes.module.ts

npx ng g c shared/components/inventory/warehouse
test -f src/app/shared/components/inventory/warehouse/warehouse.component.ts
grep "WarehouseComponent" src/app/shared/shared.module.ts

npx ng g lazy-component src/app/shared/components/inventory/warehouse/warehouse.component.ts
test -f src/app/shell/shared/lazy-warehouse/lazy-warehouse.component.ts
grep GenerateLazyComponent src/app/shared/components/inventory/warehouse/warehouse.component.ts


npx ng g p warehouses
test -f src/app/pages/warehouses/warehouses-page.module.ts
test -f src/app/pages/warehouses/warehouses-page.component.ts
grep "WarehousesPageComponent" src/app/pages/warehouses/warehouses-page.module.ts
grep "warehouses" src/app/pages/app-routing.module.ts


npx ng g e awesome
test -f src/app/extensions/awesome/awesome.module.ts
test -f src/app/extensions/awesome/pages/awesome-routing.module.ts
test -f src/app/extensions/awesome/store/awesome-store.module.ts
test -f src/app/extensions/awesome/exports/awesome-exports.module.ts

npx ng g c extensions/awesome/shared/dummy
test -f src/app/extensions/awesome/shared/dummy/dummy.component.ts

npx ng g lazy-component extensions/awesome/shared/dummy/dummy.component.ts
test -f src/app/extensions/awesome/exports/lazy-dummy/lazy-dummy.component.ts
grep "LazyDummyComponent" src/app/extensions/awesome/exports/awesome-exports.module.ts

(cd src/app/shared && npx ng g c common/foobar --export)
test -f src/app/shared/common/foobar/foobar.component.ts
grep "FoobarComponent" src/app/shared/common/foobar/foobar.component.ts
grep "FoobarComponent" src/app/shared/shared.module.ts

npx ng g s super -e awesome
test -f src/app/extensions/awesome/services/super/super.service.ts

npx ng g s src/app/extensions/awesome/duper
test -f src/app/extensions/awesome/services/duper/duper.service.ts

npx ng g store -e awesome super
test -f src/app/extensions/awesome/store/super/super.actions.ts
test -f src/app/extensions/awesome/store/super/super.effects.ts
test -f src/app/extensions/awesome/store/super/super.reducer.ts
test -f src/app/extensions/awesome/store/super/super.selectors.ts
grep "SuperState" src/app/extensions/awesome/store/awesome-store.ts

npx ng g cms --definition-qualified-name app:component.custom.inventory.pagelet2-Component inventory
test -f src/app/shared/cms/components/cms-inventory/cms-inventory.component.ts
grep "CMSInventoryComponent" src/app/shared/cms/cms.module.ts
grep "CMSInventoryComponent" src/app/shared/shared.module.ts

npx ng g cms --definition-qualified-name app:component.custom.audio.pagelet2-Component --cms-prefixing=false audio
test -f src/app/shared/cms/components/audio/audio.component.ts
grep "AudioComponent" src/app/shared/cms/cms.module.ts
grep "AudioComponent" src/app/shared/shared.module.ts

npx ng g lazy-component --project organization-management --path projects/organization-management/src/app/components/user-profile-form/user-profile-form.component.ts
test -f projects/organization-management/src/app/exports/lazy-user-profile-form/lazy-user-profile-form.component.ts
test -f projects/organization-management/src/app/exports/lazy-user-profile-form/lazy-user-profile-form.component.html
test -f projects/organization-management/src/app/exports/organization-management-exports.module.ts
grep "LazyUserProfileFormComponent" projects/organization-management/src/app/exports/organization-management-exports.module.ts
grep "LazyUserProfileFormComponent" projects/organization-management/src/app/exports/index.ts

npx ng g lazy-component --project organization-management --path projects/organization-management/src/app/components/user-roles-selection/user-roles-selection.component.ts
test -f projects/organization-management/src/app/exports/lazy-user-roles-selection/lazy-user-roles-selection.component.ts
test -f projects/organization-management/src/app/exports/lazy-user-roles-selection/lazy-user-roles-selection.component.html
grep "LazyUserRolesSelectionComponent" projects/organization-management/src/app/exports/organization-management-exports.module.ts
grep "LazyUserRolesSelectionComponent" projects/organization-management/src/app/exports/index.ts

node schematics/customization/service-worker false
grep '"serviceWorker": false' angular.json

npx ng g add-destroy src/app/extensions/awesome/shared/dummy/dummy.component.ts
grep destroy src/app/extensions/awesome/shared/dummy/dummy.component.ts

export NODE_OPTIONS=--max_old_space_size=8192

npm exec npm-run-all format "lint -- --fix" compile build

nohup bash -c "npm run serve &"
npx wait-on --verbose --interval 1000 --delay 1000 --timeout 30000 tcp:4200

curl -s "http://localhost:4200/warehouses" | grep -q "warehouses-page works"

npx ng g kubernetes-deployment
find charts

npx ng g azure-pipeline
test -f azure-pipelines.yml
