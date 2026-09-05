import { calculateBrandCompletion } from "../brand/brand-completion";

export interface BusinessInput {
  id: string;
  name?: string | null;
  industry?: string | null;
  description?: string | null;
  logoUrl?: string | null;
}

export interface BrandProfileInput {
  brandSummary?: string | null;
  brandVoice?: string | null;
  audience?: string | null;
  audienceSegments?: Array<{
    ageRange?: string;
    characteristic?: string;
    location?: string;
  }> | null;
  brandValues?: string | null;
  keyMessages?: string | null;
  wordsToUse?: string | null;
  wordsToAvoid?: string | null;
  brandDo?: string[] | null;
  brandDont?: string[] | null;
  visualNotes?: string | null;
  brandColors?: string[] | null;
  brandFonts?: string[] | null;
  services?: Array<{ name: string; description?: string }> | null;
  activePlatforms?: string[] | null;
  primaryContentTypes?: string[] | null;
  postingFrequency?: string | null;
}

export interface ContentPillarInput {
  id: string;
  name: string;
  color?: string | null;
}

export interface RecentContentInput {
  title: string;
  platform?: string | null;
  contentType?: string | null;
  marketingGoal?: string | null;
}

export interface NormalizedBrandContext {
  businessId: string;
  businessName: string;
  industry: string;
  description: string;
  logoUrl: string | null;
  brandSummary: string;
  brandVoice: string;
  primaryAudience: string;
  audienceSegments: NonNullable<BrandProfileInput["audienceSegments"]>;
  brandValues: string;
  keyMessages: string;
  wordsToUse: string;
  wordsToAvoid: string;
  brandDo: string[];
  brandDont: string[];
  visualNotes: string;
  brandColors: string[];
  brandFonts: string[];
  services: NonNullable<BrandProfileInput["services"]>;
  platforms: string[];
  contentTypes: string[];
  postingFrequency: string;
  pillars: Array<{ id: string; name: string; color: string }>;
  recentContent: RecentContentInput[];
}

export interface BrandContextResult {
  context: NormalizedBrandContext;
  score: number;
  readiness: "partial" | "ready" | "strong";
  missingFields: string[];
}

/**
 * Showcase-safe adaptation of the normalization stage used by BranDo before
 * building AI instructions. Data access is deliberately excluded here so the
 * domain transformation is easy to inspect in isolation.
 */
export function normalizeBrandContext(
  business: BusinessInput,
  profile: BrandProfileInput = {},
  pillars: ContentPillarInput[] = [],
  recentContent: RecentContentInput[] = [],
): BrandContextResult {
  const completion = calculateBrandCompletion(
    business,
    {
      audience: profile.audience,
      brandVoice: profile.brandVoice,
      keyMessages: profile.keyMessages,
      brandValues: profile.brandValues,
      brandColors: profile.brandColors,
      brandFonts: profile.brandFonts,
      visualNotes: profile.visualNotes,
      services: profile.services,
      activePlatforms: profile.activePlatforms,
      postingFrequency: profile.postingFrequency,
      primaryContentTypes: profile.primaryContentTypes,
    },
    pillars,
  );

  const readiness: BrandContextResult["readiness"] =
    completion.score > 85
      ? "strong"
      : completion.score >= 50
        ? "ready"
        : "partial";

  return {
    score: completion.score,
    readiness,
    missingFields: completion.missingFields,
    context: {
      businessId: business.id,
      businessName: business.name?.trim() ?? "",
      industry: business.industry?.trim() ?? "",
      description: business.description?.trim() ?? "",
      logoUrl: business.logoUrl ?? null,
      brandSummary: profile.brandSummary?.trim() ?? "",
      brandVoice: profile.brandVoice?.trim() ?? "",
      primaryAudience: profile.audience?.trim() ?? "",
      audienceSegments: profile.audienceSegments ?? [],
      brandValues: profile.brandValues?.trim() ?? "",
      keyMessages: profile.keyMessages?.trim() ?? "",
      wordsToUse: profile.wordsToUse?.trim() ?? "",
      wordsToAvoid: profile.wordsToAvoid?.trim() ?? "",
      brandDo: profile.brandDo ?? [],
      brandDont: profile.brandDont ?? [],
      visualNotes: profile.visualNotes?.trim() ?? "",
      brandColors: profile.brandColors ?? [],
      brandFonts: profile.brandFonts ?? [],
      services: profile.services ?? [],
      platforms: profile.activePlatforms ?? [],
      contentTypes: profile.primaryContentTypes ?? [],
      postingFrequency: profile.postingFrequency?.trim() ?? "",
      pillars: pillars.map((pillar) => ({
        id: pillar.id,
        name: pillar.name,
        color: pillar.color ?? "",
      })),
      recentContent,
    },
  };
}
