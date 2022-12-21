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
  id: number;
  name: string;
  memo: string;
  tel: string;
  email: string;
  url: string;
  progress_id: number;
}
