import {
  useCheckUserIdMutation,
  useUpdateZaloInfoMutation,
} from "@/redux/api/auth/auth.api";
import { updateBoth, updatePhone, updateUserId } from "@/redux/slices/appSlice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  authorize,
  getAccessToken,
  getLocation,
  getPhoneNumber,
  getUserID,
  getUserInfo,
} from "zmp-sdk";
import {
  Page,
  Box,
  Button,
  Text,
  useNavigate,
  Modal,
  Stack,
  Sheet,
} from "zmp-ui";
import Logo from "@/assets/logo.png";
import { PRIVACY_HTML } from "@/constants/privacy.constant";
const SplashScreen = () => {
  const dispatch = useDispatch();
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [hasInfo, setHasInfo] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const navigate = useNavigate();
  const [messageError, setMessageError] = useState("");
  const [checkUserId, { isLoading: isLoadingCheckUserId }] =
    useCheckUserIdMutation();
  const [updateZaloInfo] = useUpdateZaloInfoMutation();
  const onLoginWithZalo = async () => {
    if (hasInfo) {
      navigate("/home");
    } else {
      setManualLoading(true);

      try {
        const data = await authorize({
          scopes: ["scope.userLocation", "scope.userPhonenumber"],
        });
        if (data["scope.userLocation"] && data["scope.userPhonenumber"]) {
          try {
            const accessToken = await getAccessToken();
            const phone = await getPhoneNumber();
            const locationZalo = await getLocation();
            const userInfo = await getUserInfo();
            const userId = await getUserID();
            console.log("Update Info", {
              access_token: accessToken,
              avatar: userInfo.userInfo.avatar,
              code_get_location: locationZalo.token || "",
              code_get_phone: phone.token || "",
              followed_oa: userInfo.userInfo.followedOA || false,
              is_sensitive: userInfo.userInfo.isSensitive || false,
              name: userInfo.userInfo.name,
              zalo_app_id: "2789126480767308500",
              zalo_device_id: "",
              zalo_user_id: userId,
              code: "test",
              code_hash: "test",
            });
            await updateZaloInfo({
              access_token: accessToken,
              avatar: userInfo.userInfo.avatar,
              code_get_location: locationZalo.token || "",
              code_get_phone: phone.token || "",
              followed_oa: userInfo.userInfo.followedOA || false,
              is_sensitive: userInfo.userInfo.isSensitive || false,
              name: userInfo.userInfo.name,
              zalo_app_id: "2789126480767308500",
              zalo_device_id: "",
              zalo_user_id: userId,
              code: "test",
              code_hash: "test",
            })
              .unwrap()
              .then((value) => {
                dispatch(
                  updateBoth({
                    p: value.data.phone,
                    userId: value.data.zalo_user_id,
                  })
                );
                setManualLoading(false);
                const params = new URLSearchParams(location.search);
                const c = params.get("c");
                if (c) {
                  navigate(`/program/${c}`, {
                    state: {
                      isDeeplink: true,
                    },
                  });
                } else navigate("/home");
              })
              .catch((error) => {
                setManualLoading(false);
                setMessageError(error.data.message);
              });
          } catch (error) {
            setManualLoading(false);
            toast.error("Bạn cần cấp quyền để tiếp tục");
          }
        } else {
          setManualLoading(false);
          toast.error("Bạn cần cấp quyền để tiếp tục");
        }
      } catch (error) {
        setManualLoading(false);
        toast.error("Bạn cần cấp quyền để tiếp tục");
      }
    }
  };

  const onGetUserId = useCallback(async () => {
    const userId = await getUserID();
    dispatch(updateUserId(userId));
    await checkUserId({
      zalo_user_id: userId,
    })
      .unwrap()
      .then((value) => {
        if (value.status === 0) {
          dispatch(updatePhone(value.data.phone));
          setHasInfo(true);
          const params = new URLSearchParams(location.search);
          const c = params.get("c");
          if (c) {
            navigate(`/program/${c}`, {
              state: {
                isDeeplink: true,
              },
            });
          }
        } else {
          setHasInfo(false);
        }
      })
      .catch((error) => {
        setHasInfo(false);
      });
  }, []);
  useEffect(() => {
    onGetUserId();
  }, [onGetUserId]);
  useEffect(() => {
    try {
      localStorage.clear();
    } catch (error) {}
  }, []);
  return (
    <Page className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-100 via-green-50 to-amber-50 text-neutral-900">
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-emerald-200/70 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-amber-200/60 blur-3xl animate-pulse [animation-duration:3s]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.6),_transparent_60%)]" />

      <Box className="relative z-10 flex min-h-screen flex-col">
        <Box className="flex flex-1 items-center justify-center px-5">
          <Box className="w-full max-w-[480px]">
            <Box className="relative p-[2px] rounded-3xl bg-gradient-to-br from-white/70 via-emerald-200/60 to-amber-200/60">
              <Box className="rounded-3xl bg-white/80 backdrop-blur-md shadow-xl ring-1 ring-white/60 p-8 sm:p-10">
                <Box className="flex flex-col items-center gap-3">
                  <img
                    src={Logo}
                    alt="Mappacific"
                    className="mx-auto h-16 sm:h-20 w-auto object-contain"
                  />
                  <Text className="text-lg sm:text-2xl tracking-tight font-bold">
                    CHỌN SỐ MAY MẮN
                  </Text>
                  <Text className="text-xs text-neutral-500">
                    Đăng nhập để tiếp tục trải nghiệm
                  </Text>
                </Box>

                {/* <Box className="mt-6 space-y-4">
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại"
                    label="Số điện thoại"
                    prefix={<span className="ml-4 text-neutral-400">+84</span>}
                    className="h-12 rounded-xl"
                  />
                  <Button
                    disabled={!canSubmit || isLoadingRequestOtp}
                    loading={isLoadingRequestOtp}
                    onClick={onSubmit}
                    className={`h-12 w-full rounded-xl text-white font-semibold shadow-lg active:scale-[0.99] transition
                      ${
                        canSubmit
                          ? "bg-gradient-to-r from-emerald-500 to-amber-400 hover:opacity-95"
                          : "bg-neutral-300"
                      }`}
                    prefixIcon={<Phone className="mr-2 h-5 w-5" />}
                  >
                    Đăng nhập bằng OTP
                  </Button>
                </Box> */}

                {/* <Box className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                  <span className="text-[11px] text-neutral-500">hoặc</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                </Box> */}

                <Button
                  onClick={onLoginWithZalo}
                  disabled={isLoadingCheckUserId || manualLoading}
                  className="h-12 w-full rounded-xl font-semibold bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50 shadow mt-4"
                  prefixIcon={
                    <img
                      src="https://hidosport.vn/wp-content/uploads/2023/09/zalo-icon.png"
                      alt="Zalo"
                      className="h-5 w-5"
                    />
                  }
                >
                  {isLoadingCheckUserId || manualLoading
                    ? "Đang xử lí..."
                    : "Đăng nhập với Zalo"}
                </Button>

                <Box
                  className="mt-6 text-center"
                  onClick={() => setOpenPrivacy(true)}
                >
                  <Text className="text-[11px] leading-snug text-neutral-500">
                    Bằng việc tiếp tục, bạn đồng ý với{" "}
                    <a
                      href="#"
                      className="text-emerald-600 underline underline-offset-2"
                    >
                      Điều khoản
                    </a>{" "}
                    và{" "}
                    <a
                      href="#"
                      className="text-emerald-600 underline underline-offset-2"
                    >
                      Chính sách bảo mật
                    </a>
                    .
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500">
              <span>© 2025 Mappacific Singapore</span>
              <span>•</span>
              <span>All rights reserved</span>
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal
        visible={messageError !== ""}
        onClose={() => setMessageError("")}
        maskClosable
      >
        <Stack space="10px">
          <Box
            dangerouslySetInnerHTML={{
              __html: messageError,
            }}
          />
          <Button
            className="bg-green-600 font-bold hover:bg-green-500"
            onClick={() => setMessageError("")}
          >
            Xác nhận
          </Button>
        </Stack>
      </Modal>
      <Sheet
        visible={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        mask
        maskClosable
        swipeToClose
        height={400}
      >
        <Box
          p={2}
          className="overflow-auto font-manrope!"
          dangerouslySetInnerHTML={{ __html: PRIVACY_HTML }}
        />
      </Sheet>
    </Page>
  );
};

export default SplashScreen;
