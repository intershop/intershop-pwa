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

npx ng g pipe warehouses
stat src/app/core/pipes/warehouses.pipe.ts
grep "WarehousesPipe" src/app/core/pipes.module.ts

npx ng g c shared/warehouse/warehouse
stat src/app/shared/warehouse/components/warehouse/warehouse.component.ts
grep "WarehouseComponent" src/app/shared/shared.module.ts

(cd src/app/shared/warehouse && npx ng g cc warehouse)
stat src/app/shared/warehouse/containers/warehouse/warehouse.container.ts
grep "WarehouseContainerComponent" src/app/shared/shared.module.ts


npx ng g p warehouses
stat src/app/pages/warehouses/warehouses-page.module.ts
stat src/app/pages/warehouses/warehouses-page.container.ts
grep "WarehousesPageContainerComponent" src/app/pages/warehouses/warehouses-page.module.ts
stat src/app/pages/warehouses/components/warehouses-page/warehouses-page.component.ts
grep "WarehousesPageComponent" src/app/pages/warehouses/warehouses-page.module.ts
grep "warehouses" src/app/pages/app-routing.module.ts


npx ng g s super -e awesome
stat src/app/extensions/awesome/services/super/super.service.ts

npx ng g s src/app/extensions/awesome/duper
stat src/app/extensions/awesome/services/duper/duper.service.ts

(cd src/app/extensions/awesome && npx ng g s hyper)
stat src/app/extensions/awesome/services/hyper/hyper.service.ts


npm run check
