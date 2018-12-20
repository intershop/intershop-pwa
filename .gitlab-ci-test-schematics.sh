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

npx ng g c shared/warehouse/warehouse
stat src/app/shared/warehouse/components/warehouse/warehouse.component.ts
grep "WarehouseComponent" src/app/shared/shared.module.ts

(cd src/app/shared/warehouse && npx ng g cc warehouse)
stat src/app/shared/warehouse/containers/warehouse/warehouse.container.ts
grep "WarehouseContainerComponent" src/app/shared/shared.module.ts


npx ng g ccp shared/warehouse/stocks
stat src/app/shared/warehouse/containers/stocks/stocks.container.ts
stat src/app/shared/warehouse/components/stocks/stocks.component.ts
grep "StocksContainerComponent" src/app/shared/shared.module.ts
grep "StocksComponent" src/app/shared/shared.module.ts


npx ng g p warehouses
stat src/app/pages/warehouses/warehouses-page.module.ts
stat src/app/pages/warehouses/warehouses-page.container.ts
grep "WarehousesPageContainerComponent" src/app/pages/warehouses/warehouses-page.module.ts
stat src/app/pages/warehouses/components/warehouses-page/warehouses-page.component.ts
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

git add -A
npx lint-staged
npx tsc --project src/tsconfig.spec.json

sed -i -e 's/needMock.*/needMock: true,/g' src/environments/environment.prod.ts
sed -i -e "s%icmBaseURL.*%icmBaseURL: 'http://localhost:4200',%g" src/environments/environment.prod.ts

npm run build

nohup bash -c "npm run serve &"
wget -q --wait 10 --tries 10 --retry-connrefused http://localhost:4200

wget -O - -q "http://localhost:4200/warehouses" | grep -q "warehouses-page works"
