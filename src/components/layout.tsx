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
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

const Layout = () => {
  return (
    <Provider store={store}>
      <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route path="/" element={<SplashScreen />}></Route>
              <Route path="/home" element={<HomeScreen />}></Route>
              <Route
                path="/program/:id"
                element={<ProgramDetailScreen />}
              ></Route>
              <Route path="/history" element={<HistoryScreen />}></Route>
              <Route path="/otp" element={<OtpScreen />} />
            </AnimationRoutes>
          </ZMPRouter>
        </SnackbarProvider>
        <ToastContainer position="bottom-center" stacked={false} />
      </App>
    </Provider>
  );
};
export default Layout;
