export interface LOGIN_USER {
  id: number;
  name: string;
  email: string;
}
export interface JWT {
  jwt: string;
}

export interface LOGIN_FORM {
  email: string;
  password: string;
}

export interface REGISTER_FORM {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface POST_CUSTOMER {
  id?: number;
  name: string;
  memo: string;
  tel: string;
  email: string;
  url: string;
  progress_id: number;
}

export interface CART {
  id: number;
  name: string;
  memo: string;
  price: number;
  quantity?: number;
  created_at?: string | any;
  updated_at?: string | any;
}
export interface PRODUCT {
  id: number;
  name: string;
  memo: string;
  price: number;
  created_at?: string | any;
  updated_at?: string | any;
  pivot: {
    order_id: number;
    product_id: number;
    quantity: number;
  };
}

export interface UPDATE_ORDER {
  order_id: number;
  status_id: number;
  customer_id: number;
  products: POST_PRODUCTS[];
}

export interface POST_CART {
  id: number;
  name: string;
  memo: string;
  price: number;
  quantity: number;
  created_at?: string | any;
  updated_at?: string | any;
}
export interface POST_PRODUCTS {
  product_id: number;
  quantity: number;
}
