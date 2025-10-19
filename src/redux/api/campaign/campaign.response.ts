export type TCampaginItem = {
  code: string;
  banner: string;
  description_short: string;
  status: number; // 1: active, 2: expired, 0: waitting
  joined: number; // 0: chua tham gia, 1: da tham gia
  name: string;
  time: string;
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
