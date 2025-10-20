export type TGetListCampaignReq = {
  p: string;
};

export type TGetCampaignDetailReq = {
  p: string;
  c: string;
};

export type TGetListGiftReq = {
  c: string;
};

export type TGetLuckyNumberReq = {
  phone: string;
  zalo_user_id: string;
  turn_all: number;
  campaign_code: string;
};

export type TGetListCampaignHistoryReq = {
  c: string;
  p: string;
};

export type TSearchCampaignReq = {
  k: string;
};

export type TResultLuckyNumberReq = {
  c: string;
  p: string;
};
