import { Box, Page } from "zmp-ui";
import BottomTabBar from "@/components/bottom-tab-bar";
import { useEffect } from "react";

export default function LayoutMain({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Prevent rubber band scroll on iOS
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    document.body.addEventListener("touchmove", preventScroll, {
      passive: false,
    });

    return () => {
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, []);
  return (
    <Page
      className="bg-neutral-50 h-screen !overflow-hidden no-scrollbar"
      style={{
        overscrollBehavior: "none", // disables native overscroll
        WebkitOverflowScrolling: "auto", // disable momentum scroll on iOS
      }}
    >
      {/* page content */}
      <Box className="flex-1">{children}</Box>

      {/* bottom tabs */}
      <BottomTabBar />
    </Page>
  );
}
