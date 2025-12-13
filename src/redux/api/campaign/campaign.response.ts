export type TCampaginItem = {
  code: string;
  banner: string;
  description_short: string;
  status: number; // 1: active, 2: expired, 0: waitting
  joined: number; // 0: chua tham gia, 1: da tham gia
  name: string;
  time: string;
  number_get: number;
  number_limit: number;
};
export type TGetListCampaignRes = TCampaginItem[];

export type TGetCampaignDetailRes = {
  code: string;
  pdf: string;
  number_get: number;
  joined: number;
  name: string;
  banner: string;
  description: string;
  number_limit: number;
  time: string;
  time_end: string;
  time_start: string;
  status: number;
};

export type TGiftItem = {
  id: number;
  campaign_item: number;
  campaign_code: string;
  award_name: string;
  gift_code: string;
  gift_name: string;
  gift_image: string;
  gift_image_thumb: string;
  counter: number;
  limits: string;
};

export type TGetListGiftRes = TGiftItem[];
export type TLuckResultItem = {
  number: number;
  gift_image: string;
  gift_name: string;
};
export type TGetLuckyNumberRes = {
  data: TLuckResultItem[];
  message: string;
  status: number;
};

export type TGetListCampaignHistoryItem = {
  number: number;
  time: string;
  name: string;
  award_name: string;
  award_time: string;
  gift_image: string;
  gift_name: string;
};

export type TGetListCampaignHistoryRes = TGetListCampaignHistoryItem[];

export type TSearchCampaignItem = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  time_create: string;
  time_create_number: number;
  time_start: string;
  time_start_number: number;
  time_end: string;
  time_end_number: number;
  time_deactive: string;
  time_deactive_number: number;
};
export type TSearchCampaignRes = TSearchCampaignItem[];

export type TResultLuckyNumberItem = {
  number: string;
  time: string;
  award_number: string;
  award_time: string;
  award_name: string;
  gift_name: string;
  gift_image: string;
};
export type TResultLuckyNumberRes = TResultLuckyNumberItem[];
