export type TOtpReq = {
  phone: string;
};

export type TConfirmOtpReq = {
  phone: string;
  otp: string;
};

export type TLoginReq = {
  username: string;
  password: string;
};

export type TCheckUserIdReq = {
  zalo_user_id: string;
};

export type TUpdateZaloInfoReq = {
  accessToken: string;
  avatar: string;
  code_get_location: string;
  code_get_phone: string;
  followed_oa: boolean;
  is_sensitive: boolean;
  name: string;
  zalo_app_id: string;
  zalo_device_id: string;
  zalo_user_id: string;
};
