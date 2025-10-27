import { Dices, NotepadText, User } from "lucide-react";
import { ReactNode } from "react";
import { Box } from "zmp-ui";
import { useLocation, useNavigate } from "zmp-ui";
import Logo from "@/assets/logo.png";
type TabItem = {
  key: string;
  label?: string;
  icon: ReactNode;
  path: string;
  badge?: number;
  center?: boolean;
};

const TABS: TabItem[] = [
  { key: "home", label: "Trang chủ", icon: <NotepadText />, path: "/home" },
  {
    key: "logo",
    icon: <img src={Logo} className="w-14 object-contain" />,
    path: "",
    center: true,
  },
  { key: "profile", label: "Cá nhân", icon: <User />, path: "/profile" },
];

export default function BottomTabBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const isActive = (p: string) => pathname === p;

  return (
    <Box className="fixed bottom-0 inset-x-0 z-30">
      <Box className="pointer-events-none absolute -top-6 inset-x-6 h-12 rounded-full bg-gradient-to-t from-black/5 to-transparent blur" />
      <Box
        className="mx-auto mb-0 max-w-screen-sm rounded-t-2xl border border-neutral-200/70 bg-white/80 backdrop-blur-xl shadow-[0_-6px_24px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <Box className="grid grid-cols-3 h-16 px-2">
          {TABS.map((it) =>
            it.center ? (
              <div key={it.key} className="flex items-start justify-center">
                <button
                  onClick={() => {}}
                  aria-label="Random"
                  className="relative mt-[-26px] inline-flex items-center justify-center rounded-full h-14 w-14 bg-white text-white shadow-[0_10px_25px_rgba(0,147,69,0.45)] ring-4 ring-[#009345]/15 active:scale-95 transition-transform"
                >
                  {it.icon}
                  <span className="absolute -z-10 h-16 w-16 rounded-full bg-[#009345]/20 blur-xl" />
                </button>
              </div>
            ) : (
              <button
                key={it.key}
                onClick={() => nav(it.path)}
                aria-current={isActive(it.path) ? "page" : undefined}
                className="group relative flex flex-col items-center justify-center gap-1"
              >
                <span
                  className={`flex h-6 items-center text-[22px] transition-all ${
                    isActive(it.path)
                      ? "text-[#009345]"
                      : "text-neutral-500 group-active:scale-95"
                  }`}
                >
                  {it.icon}
                </span>
                <span
                  className={`text-[11px] leading-none transition-colors ${
                    isActive(it.path)
                      ? "text-[#009345] font-semibold"
                      : "text-neutral-500"
                  }`}
                >
                  {it.label}
                </span>
                <span
                  className={`absolute top-0 h-1 w-8 rounded-full transition-opacity ${
                    isActive(it.path) ? "opacity-100 bg-[#009345]" : "opacity-0"
                  }`}
                />
              </button>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}
