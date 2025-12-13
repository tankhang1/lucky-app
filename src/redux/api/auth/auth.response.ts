export type TOtpRes = {};
export type TConfirmOtpRes = {};
export type TLoginRes = {};
export type TCheckUserIdRes = {
  data: {
    phone: string;
    zalo_user_id: string;
  };
  message: string;
  status: number;
};
export type TUpdateZaloInfoRes = {
  data: {
    phone: string;
    zalo_user_id: string;
  };
  message: string;
};

export type TGetZaloInfoRes = {
  code: string;
  province: string;
  phone: string;
  name: string;
  avatar: string;
  address: string;
  group: string;
  are: string;
};
