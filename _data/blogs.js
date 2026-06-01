// _data/blogs.js
// Loads every site's product JSON from /products and flattens them into a single
// list of blog entries. Each entry knows which SITE it belongs to and gets a SLUG.
// Eleventy uses this list to generate one /<site>/blogs/<slug>/ page per product.

const fs = require("fs");
const path = require("path");

// Map each site key -> its JSON file + the public sub-path / domain info.
const SITES = {
  onlinefinds:   { file: "index.json",         label: "Online Finds" },
  dailyloot:     { file: "dailyloot.json",      label: "DailyLoot" },
  justoneclick:  { file: "justoneclick.json",   label: "Just One Click" },
  phaseblank:    { file: "phaseblank.json",      label: "Phase Blank" },
  cartedupdaily: { file: "cartedupdaily.json",   label: "CartedUpDaily" }
};

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = function () {
  const all = [];
  const productsDir = path.join(__dirname, "..", "products");

  for (const [siteKey, meta] of Object.entries(SITES)) {
    const filePath = path.join(productsDir, meta.file);
    if (!fs.existsSync(filePath)) continue;

    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.warn("Could not parse", meta.file, e.message);
      continue;
    }

    const products = (data && data.products) || [];
    products.forEach((p) => {
      if (!p || !p.name) return;
      const slug = p.slug || slugify(p.name);
      all.push({
        site: siteKey,
        siteLabel: meta.label,
        slug,
        name: p.name,
        image: p.image || "",
        blogImage: p.blog_image || p.image || "",
        category: p.category || "",
        link: p.link || "#",
        lead: p.lead || "",
        pros: (p.pros || []).filter(Boolean),
        cons: (p.cons || []).filter(Boolean),
        verdict: p.verdict || ""
      });
    });
  }

  return all;
};
