import { Program } from "@/pages/home-screen";
import { ChevronRight } from "lucide-react";

const CampaignCard = ({
  p,
  onClick,
  className = "",
}: {
  p: Program;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    aria-label={`Xem ${p.title}`}
    className={`group relative overflow-hidden rounded-3xl shadow-lg ${className}`}
  >
    <div className="relative w-full aspect-[16/9]">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url("${p.thumbnail || ""}")`,
        }}
      />
      {!p.thumbnail && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#B50000] via-[#D62B2B] to-[#F55500]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />

      <div className="absolute right-3 top-0 inline-flex items-center gap-2 rounded-b-xl bg-white/15 px-3 py-2 text-xs text-white backdrop-blur-md">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            p.status === "open"
              ? "bg-emerald-400"
              : p.status === "upcoming"
              ? "bg-sky-400"
              : p.status === "joined"
              ? "bg-blue-400"
              : "bg-zinc-300"
          }`}
        />
        80 lượt chọn
      </div>
      <div className="absolute bottom-5 right-3 gap-1.5 rounded-lg backdrop-blur-md bg-white/15 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all inline-flex items-center">
        Chi tiết
        <ChevronRight size={14} />
      </div>
    </div>
  </button>
);

export default CampaignCard;
