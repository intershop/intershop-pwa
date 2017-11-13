export class WishListModel {
  type: string;
  preferred: boolean;
  items: WishListItem[];
  itemsCount: number;
  title: string;
  creationDate: number;
  public: boolean;
}

class Value {
  type: string;
  value: string;
  unit: string;
}

class Attribute {
  name: string;
  type: string;
  value: Value;
}

export class WishListItem {
  type: string;
  attributes: Attribute[];
  uri: string;
}
