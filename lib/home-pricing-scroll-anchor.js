/**
 * When sport changes on the homepage, product workflow cards resize above pricing.
 * If the user is already in the product/pricing band, keep the viewport anchored on pricing.
 */
export function anchorHomePricingScrollIfInView() {
  if (typeof window === "undefined") {
    return;
  }

  const pricing = document.getElementById("pricing");
  if (!pricing) {
    return;
  }

  const nav = document.querySelector(".dark-nav");
  const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 68;
  const product = document.getElementById("product");
  const bandStart = (product ?? pricing).offsetTop - navH - 80;

  if (window.scrollY < bandStart) {
    return;
  }

  const top = pricing.getBoundingClientRect().top + window.scrollY - navH - 12;
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
}
