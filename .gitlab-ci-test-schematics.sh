#!/bin/sh

set -x
set -e

npx ng g c shared/warehouse/warehouse
stat src/app/shared/warehouse/components/warehouse/warehouse.component.ts
grep "WarehouseComponent" src/app/shared/shared.module.ts

(cd src/app/shared/warehouse && npx ng g cc warehouse)
stat src/app/shared/warehouse/containers/warehouse/warehouse.container.ts
grep "WarehouseContainerComponent" src/app/shared/shared.module.ts


(cd src/app/pages && npx ng g module warehouses/warehouses-page --flat)
stat src/app/pages/warehouses/warehouses-page.module.ts

(cd src/app/pages/warehouses && npx ng g cc warehouses-page --flat)
stat src/app/pages/warehouses/warehouses-page.container.ts
grep "WarehousesPageContainerComponent" src/app/pages/warehouses/warehouses-page.module.ts

(cd src/app/pages/warehouses && npx ng g c warehouses-page)
stat src/app/pages/warehouses/components/warehouses-page/warehouses-page.component.ts
grep "WarehousesPageComponent" src/app/pages/warehouses/warehouses-page.module.ts

npm run lint -- --fix --format stylish
