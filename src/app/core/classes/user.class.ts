export interface IUser {
  id?: number;
  name?: string;
  middleName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  avatar?: any;
  email?: string;
  ReferingId?: IUser;
  Business?: any;
  status?: any;
  lastLogout?: any;
  description?: string;
  address?: string;
  phone?: any;
  token?: string;
  roles?: any[];
}

export interface IMessenger {
  id?: number;
  name?: string;
  middleName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  avatar?: any;
  email?: string;
  ReferingId?: IUser;
  status?: any;
  lastLogout?: any;
  description?: string;
  address?: string;
  phone?: any;
  token?: string;
  roles?: any[];
  city?: any;
  Country: any;
  CountryId?: any;
  dni?: any;
  Countries?: any[];
  Person?: IUser;
}
