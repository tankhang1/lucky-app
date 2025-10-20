import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./api/auth/auth.api";
import { campaignApi } from "./api/campaign/campaign.api";
import AppReducer from "./slices/appSlice";
const store = configureStore({
  reducer: {
    app: AppReducer,
    [authApi.reducerPath]: authApi.reducer,
    [campaignApi.reducerPath]: campaignApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(campaignApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);

export default store;
