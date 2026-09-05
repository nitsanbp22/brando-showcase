export interface BrandCompletionResult {
  score: number;
  status: "partial" | "ready" | "complete";
  missingFields: string[];
}

/**
 * Showcase-safe adaptation of BranDo's shared Brand Hub completion logic.
 *
 * A field counts as filled only when it contains meaningful data. This helper
 * tolerates differences in stored shapes across evolving environments, such
 * as plain text vs arrays / JSON structures.
 */
export function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.some((item) => isFilled(item));

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((item) =>
      isFilled(item),
    );
  }

  return false;
}

interface BusinessLike {
  name?: string | null;
  industry?: string | null;
  description?: string | null;
}

interface BrandProfileLike {
  audience?: unknown;
  brandVoice?: unknown;
  keyMessages?: unknown;
  brandValues?: unknown;
  brandColors?: string[] | null;
  brandFonts?: string[] | null;
  visualNotes?: string | null;
  services?: unknown[] | null;
  activePlatforms?: string[] | null;
  postingFrequency?: string | null;
  primaryContentTypes?: string[] | null;
}

export function calculateBrandCompletion(
  business?: BusinessLike | null,
  profile?: BrandProfileLike | null,
  contentPillars: unknown[] = [],
): BrandCompletionResult {
  let score = 0;
  const missingFields: string[] = [];

  const add = (condition: boolean, weight: number, label: string) => {
    if (condition) score += weight;
    else missingFields.push(label);
  };

  add(Boolean(business?.name?.trim()), 10, "Business name");
  add(Boolean(business?.industry?.trim()), 5, "Industry");
  add(Boolean(business?.description?.trim()), 5, "Business description");
  add(isFilled(profile?.audience), 10, "Target audience");
  add(isFilled(profile?.brandVoice), 10, "Brand voice");
  add(isFilled(profile?.keyMessages), 10, "Key messages");
  add(isFilled(profile?.brandValues), 10, "Brand values");

  const hasVisualLanguage = Boolean(
    profile?.brandColors?.length ||
      profile?.brandFonts?.length ||
      profile?.visualNotes?.trim(),
  );
  add(hasVisualLanguage, 10, "Visual language");

  add(contentPillars.length >= 3, 10, "At least three content pillars");
  add(Boolean(profile?.services?.length), 10, "At least one service");
  add(Boolean(profile?.activePlatforms?.length), 4, "Active platforms");

  const hasPostingFrequency = Boolean(
    profile?.postingFrequency &&
      profile.postingFrequency !== "unsure" &&
      profile.postingFrequency.trim(),
  );
  add(hasPostingFrequency, 3, "Preferred posting frequency");
  add(Boolean(profile?.primaryContentTypes?.length), 3, "Primary content types");

  const status: BrandCompletionResult["status"] =
    score >= 90 ? "complete" : score >= 50 ? "ready" : "partial";

  return { score, status, missingFields };
}
