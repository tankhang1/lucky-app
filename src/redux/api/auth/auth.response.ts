export type TOtpRes = {};
export type TConfirmOtpRes = {};
export type TLoginRes = {};
export type TCheckUserIdRes = {
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
