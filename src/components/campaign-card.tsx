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

      <div className="absolute right-3 top-0 inline-flex items-center gap-2 rounded-b-xl bg-white/80 px-3 py-2 text-xs text-gray-900">
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
        {p.remaining} lượt chọn
      </div>
      <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-4 py-1.5 text-sm font-semibold text-[#009345] shadow-lg transition-all duration-300 hover:bg-[#009345] hover:text-white">
        Chi tiết
        <ChevronRight size={14} strokeWidth={2} />
      </div>
    </div>
  </button>
);

export default CampaignCard;
