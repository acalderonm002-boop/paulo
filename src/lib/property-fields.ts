/**
 * Whitelist of property column names that are safe to write from the admin
 * API routes. Anything outside this list (e.g. relations, server-managed
 * timestamps, the slug) is dropped from incoming patches before they reach
 * Supabase, so a stray client field can't blow up the insert/update.
 */
export const PROPERTY_WRITABLE_COLUMNS = [
  "title",
  "property_type",
  "operation",
  "price",
  "currency",
  "status",
  "location",
  "neighborhood",
  "city",
  "state",
  "bedrooms",
  "bathrooms",
  "parking_spots",
  "construction_m2",
  "total_m2",
  "floor",
  "year_built",
  "description",
  "features",
  "amenities",
  "video_url",
  "latitude",
  "longitude",
  "featured",
  "visible",
  "sort_order",
  // 2026-04 type-specific fields
  "building_name",
  "apartment_number",
  "age_range",
  "levels",
  "frontage_m",
  "depth_m",
  "land_use",
  "services",
  "ceiling_height_m",
  "loading_docks",
  "industrial_use",
  "furnished",
  "private_offices",
] as const;

export type PropertyWritableColumn =
  (typeof PROPERTY_WRITABLE_COLUMNS)[number];

const COLUMN_SET = new Set<string>(PROPERTY_WRITABLE_COLUMNS);

export function pickPropertyColumns(
  body: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(body)) {
    if (COLUMN_SET.has(key)) out[key] = body[key];
  }
  return out;
}
