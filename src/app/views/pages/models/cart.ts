export class Cart {
  items?: CartItem[];
}

export class CartItem {
  product?: any;
  quantity?: number;
  /** Route API: cart item id for update/delete */
  _id?: string;
}

export class CartItemDetailed {
  product?: any;
  quantity?: number;
}
