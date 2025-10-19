import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./api/auth/auth.api";
import { campaignApi } from "./api/campaign/campaign.api";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [campaignApi.reducerPath]: campaignApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(campaignApi.middleware),
});
setupListeners(store.dispatch);

export default store;
