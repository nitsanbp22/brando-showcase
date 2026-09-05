export type UserRole =
  | "owner"
  | "full_editor"
  | "content_editor"
  | "viewer"
  | null
  | undefined;

/**
 * Application-level capability helpers used to keep the UI consistent.
 *
 * These helpers are NOT the security boundary. Sensitive data access and
 * mutations are also enforced through server/database authorization and RLS.
 */
export function canManageTeam(role: UserRole): boolean {
  return role === "owner";
}

export function canManageSettings(role: UserRole): boolean {
  return role === "owner";
}

export function canManageIntegrations(role: UserRole): boolean {
  return role === "owner" || role === "full_editor";
}

export function canEditBrand(role: UserRole): boolean {
  return role === "owner" || role === "full_editor";
}

export function canManageContentPillars(role: UserRole): boolean {
  return role === "owner" || role === "full_editor";
}

export function canCreateContent(role: UserRole): boolean {
  return (
    role === "owner" ||
    role === "full_editor" ||
    role === "content_editor"
  );
}

export const canEditContent = canCreateContent;
export const canDeleteContent = canCreateContent;
export const canUseAI = canCreateContent;

export function isReadOnly(role: UserRole): boolean {
  return role === "viewer" || !role;
}
