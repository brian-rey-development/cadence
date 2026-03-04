type UserContextInput = {
  aiDisplayName?: string | null;
  aiRole?: string | null;
  aiAbout?: string | null;
  aiWorkStyle?: string | null;
};

export function buildUserContext(settings: UserContextInput): string | null {
  const { aiDisplayName, aiRole, aiAbout, aiWorkStyle } = settings;
  if (!aiDisplayName && !aiRole && !aiAbout && !aiWorkStyle) return null;

  const parts: string[] = [];
  const header = [
    aiDisplayName ? `Name: ${aiDisplayName}` : null,
    aiRole ? `Role: ${aiRole}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  if (header) parts.push(header);
  if (aiAbout) parts.push(`Context: ${aiAbout}`);
  if (aiWorkStyle) parts.push(`Work style: ${aiWorkStyle}`);

  return `About this user:\n${parts.join("\n")}`;
}
