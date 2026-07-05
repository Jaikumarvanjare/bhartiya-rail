export const CLASS_OPTIONS = [
  ["SL", "Sleeper"],
  ["3A", "AC 3 Tier"],
  ["2A", "AC 2 Tier"],
  ["1A", "AC First"],
  ["CC", "Chair Car"],
  ["EC", "Exec Chair"]
];

export const QUOTA_OPTIONS = [
  ["GN", "General"],
  ["TQ", "Tatkal"],
  ["PT", "Premium Tatkal"],
  ["LD", "Ladies"],
  ["SS", "Senior Citizen"],
  ["HP", "Physically Handicapped"]
];

export function defaultJourneyDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}
