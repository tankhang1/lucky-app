import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TGetCampaignDetailReq,
  TGetListCampaignReq,
  TGetListGiftReq,
} from "./campaign.request";
import {
  TGetCampaignDetailRes,
  TGetListCampaignRes,
  TGetListGiftRes,
} from "./campaign.response";
export const campaignApi = createApi({
  reducerPath: "campaignApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://172.16.3.179:9080",
  }),
  endpoints: (build) => ({
    getListActiveCampagin: build.query<
      TGetListCampaignRes,
      TGetListCampaignReq
    >({
      query: ({ p }) => ({
        url: "/zalo/campaign/active/list",
        method: "GET",
        params: {
          p,
        },
      }),
    }),
    getListExpiredCampagin: build.query<
      TGetListCampaignRes,
      TGetListCampaignReq
    >({
      query: ({ p }) => ({
        url: "/zalo/campaign/expired/list",
        method: "GET",
        params: {
          p,
        },
      }),
    }),
    getCampaignDetail: build.query<
      TGetCampaignDetailRes,
      TGetCampaignDetailReq
    >({
      query: ({ p, c }) => ({
        url: "/zalo/campaign/detail/info",
        method: "GET",
        params: {
          p,
          c,
        },
      }),
    }),
    getListGift: build.query<TGetListGiftRes, TGetListGiftReq>({
      query: ({ c }) => ({
        url: "/zalo/campaign/gift/list",
        method: "GET",
        params: {
          c,
        },
      }),
    }),
  }),
});

export const {
  useGetListActiveCampaginQuery,
  useGetListExpiredCampaginQuery,
  useGetCampaignDetailQuery,
  useGetListGiftQuery,
} = campaignApi;
