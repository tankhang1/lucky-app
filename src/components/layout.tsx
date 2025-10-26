import HistoryScreen from "@/pages/history-screen";
import HomeScreen from "@/pages/home-screen";
import OtpScreen from "@/pages/otp-screen";
import ProgramDetailScreen from "@/pages/program-detail";
import SplashScreen from "@/pages/splash-screen";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
  useLocation,
} from "zmp-ui";
import type { AppProps } from "zmp-ui/app";
import BottomTabBar from "./bottom-tab-bar";

function Shell() {
  const { pathname } = useLocation();
  const hideTabs =
    pathname === "/" || pathname === "/otp" || pathname.startsWith("/program/");

  return (
    <>
      <AnimationRoutes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/program/:id" element={<ProgramDetailScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/otp" element={<OtpScreen />} />
      </AnimationRoutes>

      {!hideTabs && <BottomTabBar />}
      {/* add bottom padding so content isn’t hidden behind the tab bar */}
      {!hideTabs && (
        <div
          style={{
            height: "56px",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        />
      )}
    </>
  );
}

export default function Layout() {
  return (
    <Provider store={store}>
      <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
        <SnackbarProvider>
          <ZMPRouter>
            <Shell />
          </ZMPRouter>
        </SnackbarProvider>
        <ToastContainer position="bottom-center" stacked={false} />
      </App>
    </Provider>
  );
}
