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

npx ng g store-group training
stat src/app/core/store/training/training-store.ts
grep "TrainingStoreModule" src/app/core/store/core-store.module.ts

npx ng g store core/store/training/warehouses --entity warehouse
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

npx ng g s super -e awesome
stat src/app/extensions/awesome/services/super/super.service.ts

npx ng g s src/app/extensions/awesome/duper
stat src/app/extensions/awesome/services/duper/duper.service.ts

(cd src/app/extensions/awesome && npx ng g s hyper)
stat src/app/extensions/awesome/services/hyper/hyper.service.ts

npx ng g store -e awesome super
stat src/app/extensions/awesome/store/super/super.actions.ts
stat src/app/extensions/awesome/store/super/super.effects.ts
stat src/app/extensions/awesome/store/super/super.reducer.ts
stat src/app/extensions/awesome/store/super/super.selectors.ts
grep "SuperState" src/app/extensions/awesome/store/awesome-store.ts

npx ng g cms --definitionQualifiedName app:component.custom.inventory.pagelet2-Component inventory
stat src/app/shared/cms/components/cms-inventory/cms-inventory.component.ts
grep "CMSInventoryComponent" src/app/shared/cms/cms.module.ts
grep "CMSInventoryComponent" src/app/shared/shared.module.ts

npx ng g cms --definitionQualifiedName app:component.custom.audio.pagelet2-Component --noCMSPrefixing audio
stat src/app/shared/cms/components/audio/audio.component.ts
grep "AudioComponent" src/app/shared/cms/cms.module.ts
grep "AudioComponent" src/app/shared/shared.module.ts


node schematics/customization custom
npx ng g customized-copy shell/footer/footer

stat src/app/shell/footer/custom-footer/custom-footer.component.ts
grep 'custom-footer' src/app/app.component.html


git add -A
npx lint-staged
npx tsc --project tsconfig.spec.json

sed -i -e "s%icmBaseURL.*%icmBaseURL: 'http://localhost:4200',%g" src/environments/environment.prod.ts

if grep mockServerAPI src/environments/environment.prod.ts
then
  sed -i -e 's/mockServerAPI.*/mockServerAPI: true,/g' src/environments/environment.prod.ts
else
  sed -i -e 's/^};$/mockServerAPI: true };/' src/environments/environment.prod.ts
fi

npm run build

nohup bash -c "npm run serve &"
wget -q --wait 10 --tries 10 --retry-connrefused http://localhost:4200

wget -O - -q "http://localhost:4200/warehouses" | grep -q "warehouses-page works"

npx ng g kubernetes-deployment
find charts

npx ng g azure-pipeline
stat azure-pipelines.yml
