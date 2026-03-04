import type { Area } from "./constants";

type AreaConfig = {
  label: string;
  accent: string;
  subtle: string;
  border: string;
  text: string;
};

export const AREA_CONFIG: Record<Area, AreaConfig> = {
  work: {
    label: "Work",
    accent: "var(--color-work-accent)",
    subtle: "var(--color-work-subtle)",
    border: "var(--color-work-border)",
    text: "var(--color-work-text)",
  },
  personal: {
    label: "Personal",
    accent: "var(--color-personal-accent)",
    subtle: "var(--color-personal-subtle)",
    border: "var(--color-personal-border)",
    text: "var(--color-personal-text)",
  },
  identity: {
    label: "Identity",
    accent: "var(--color-identity-accent)",
    subtle: "var(--color-identity-subtle)",
    border: "var(--color-identity-border)",
    text: "var(--color-identity-text)",
  },
};
