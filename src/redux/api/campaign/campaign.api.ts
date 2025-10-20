import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TGetCampaignDetailReq,
  TGetListCampaignHistoryReq,
  TGetListCampaignReq,
  TGetListGiftReq,
  TGetLuckyNumberReq,
  TResultLuckyNumberReq,
  TSearchCampaignReq,
} from "./campaign.request";
import {
  TGetCampaignDetailRes,
  TGetListCampaignHistoryRes,
  TGetListCampaignRes,
  TGetListGiftRes,
  TGetLuckyNumberRes,
  TResultLuckyNumberRes,
  TSearchCampaignRes,
} from "./campaign.response";
export const campaignApi = createApi({
  reducerPath: "campaignApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://mps-api.vmarketing.vn",
  }),
  tagTypes: ["Campaign-Detail"],
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
      providesTags: (result) => [{ type: "Campaign-Detail", id: result?.code }],
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
      invalidatesTags: (result, error, arg) => [
        { type: "Campaign-Detail", id: arg.campaign_code },
      ],
    }),
    getListCampaignHistory: build.query<
      TGetListCampaignHistoryRes,
      TGetListCampaignHistoryReq
    >({
      query: (params) => ({
        url: "/zalo/campaign/consumer/history",
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
    getListResultNumber: build.query<
      TResultLuckyNumberRes,
      TResultLuckyNumberReq
    >({
      query: (params) => ({
        url: "/zalo/campaign/detail/number",
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
  useGetListResultNumberQuery,
} = campaignApi;
