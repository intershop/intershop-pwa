<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Data Handling with Mappers

The data models for server-side and client-side have to be separated, because the data sent by the server may change over iterations or may not be in the right format, while the client side shop data handling should be stable for a long time.
Therefore, each service communicating with the Intershop REST API should only respond with mapped PWA models.

The format of raw data from the server is defined by an interface (_<name>.interface.ts_) and mapped to a type used in the Angular application (_<name>.model.ts_).
Both files have to be close together so they share a parent directory in _src/core/models_.
Next to them is a _<name>.mapper.ts_ to map the raw type to the other.

**category.interface.ts**

```typescript
export interface CategoryData {
  id: string;
  name: string;
  raw: string;
}
```

**category.model.ts**

```typescript
export class Category {
  id: string;
  name: string;
  transformed: number;
}
```

**category.mapper.ts**

```typescript
@Injectable({ providedIn: 'root' })
export class CategoryMapper {
  fromData(categoryData: CategoryData): Category {
    const category: Category = {
      id: categoryData.id,
      name: categoryData.id,
      transformed: CategoryHelper.transform(categoryData.raw),
    };
    return category;
  }

  fromObject(category: Category): CategoryData {
    const categoryData: CategoryData = {
      id: category.id,
      name: category.id,
      raw: CategoryHelper.raw(categoryData.transformed),
    };
    return categoryData;
  }
}
```

A _<name>.helper.ts_ can be introduced to provide utility functions for the model.
