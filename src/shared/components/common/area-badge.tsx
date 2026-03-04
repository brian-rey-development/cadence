import { AREA_CONFIG } from "@/shared/config/areas";
import type { Area } from "@/shared/config/constants";

type AreaBadgeProps = {
  area: Area;
};

export default function AreaBadge({ area }: AreaBadgeProps) {
  const config = AREA_CONFIG[area];

  return (
    <span
      className="inline-flex items-center px-2 py-[3px] rounded-[6px] text-[11px] font-medium font-['DM_Sans']"
      style={{
        backgroundColor: config.subtle,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
}
