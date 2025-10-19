import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TGetCampaignDetailReq,
  TGetListCampaignHistoryReq,
  TGetListCampaignReq,
  TGetListGiftReq,
  TGetLuckyNumberReq,
  TSearchCampaignReq,
} from "./campaign.request";
import {
  TGetCampaignDetailRes,
  TGetListCampaignHistoryRes,
  TGetListCampaignRes,
  TGetListGiftRes,
  TGetLuckyNumberRes,
  TSearchCampaignRes,
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
    requestLuckNumber: build.mutation<TGetLuckyNumberRes, TGetLuckyNumberReq>({
      query: (body) => ({
        url: "/zalo/process-get-number",
        method: "POST",
        body,
      }),
    }),
    getListCampaignHistory: build.query<
      TGetListCampaignHistoryRes,
      TGetListCampaignHistoryReq
    >({
      query: (params) => ({
        url: "/campaign/consumer/history",
        method: "GET",
        params,
      }),
    }),
    searchHistoryCampaign: build.query<TSearchCampaignRes, TSearchCampaignReq>({
      query: (params) => ({
        url: "/zalo/campaign/search",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetListActiveCampaginQuery,
  useGetListExpiredCampaginQuery,
  useGetCampaignDetailQuery,
  useGetListGiftQuery,
  useGetListCampaignHistoryQuery,
  useRequestLuckNumberMutation,
  useSearchHistoryCampaignQuery,
} = campaignApi;
