import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import {
  TCheckUserIdRes,
  TConfirmOtpRes,
  TLoginRes,
  TOtpRes,
  TUpdateZaloInfoRes,
} from "./auth.response";
import {
  TCheckUserIdReq,
  TConfirmOtpReq,
  TLoginReq,
  TOtpReq,
  TUpdateZaloInfoReq,
} from "./auth.request";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://mps-api.vmarketing.vn",
  }),
  endpoints: (build) => ({
    getOTP: build.mutation<TOtpRes, TOtpReq>({
      query: (body) => ({
        url: "/zalo/otp/get",
        method: "POST",
        body,
      }),
    }),
    confirmOTP: build.mutation<TConfirmOtpRes, TConfirmOtpReq>({
      query: (body) => ({
        url: "/zalo/otp/confirm",
        method: "POST",
        body,
      }),
    }),
    login: build.mutation<TLoginRes, TLoginReq>({
      query: (body) => ({
        url: "/app-login",
        method: "POST",
        body,
      }),
    }),
    checkUserId: build.mutation<TCheckUserIdRes, TCheckUserIdReq>({
      query: (body) => ({
        url: "/zalo/check",
        method: "POST",
        body,
      }),
    }),
    updateZaloInfo: build.mutation<TUpdateZaloInfoRes, TUpdateZaloInfoReq>({
      query: (body) => ({
        url: "/zalo/update",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCheckUserIdMutation,
  useConfirmOTPMutation,
  useGetOTPMutation,
  useLoginMutation,
  useUpdateZaloInfoMutation,
} = authApi;
