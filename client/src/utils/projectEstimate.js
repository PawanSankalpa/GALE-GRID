export function calcEstimate({ pages, features, timeline, addOns = [] }) {
  const base = 1200;
  const pagePrice = pages * 180;
  const featureMultiplier =
    features === "basic" ? 1 :
    features === "advanced" ? 1.6 : 2.2;
  const timelineMultiplier = timeline === "rush" ? 1.25 : 1;

  let addOnsCost = 0;
  if (addOns.includes("seo")) addOnsCost += 500;
  if (addOns.includes("copywriting")) addOnsCost += 800;
  if (addOns.includes("branding")) addOnsCost += 1200;
  if (addOns.includes("hosting")) addOnsCost += 300;

  return Math.round((base + pagePrice) * featureMultiplier * timelineMultiplier + addOnsCost);
}

export function getPlanForEstimate(estimate) {
  if (estimate < 1200) return "starter";
  if (estimate <= 3500) return "professional";
  return "enterprise";
}