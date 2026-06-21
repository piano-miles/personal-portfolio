const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const LINKS_PATH = path.join(ROOT, "site-links.json");
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");
const NOT_FOUND_PATH = path.join(ROOT, "404.html");

const START_MARKER = "<!-- SITE-LINKS-START -->";
const END_MARKER = "<!-- SITE-LINKS-END -->";

const DOMAIN_LABELS = {
  main: "Main Site",
  blog: "Blog",
  projects: "Projects",
};

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateSitemap(links) {
  const mainLinks = links.filter((link) => link.domain === "main");

  const urlEntries = mainLinks
    .map((link) => {
      const parts = [`    <url>`, `        <loc>${escapeXml(link.url)}</loc>`];
      if (link.changefreq) parts.push(`        <changefreq>${link.changefreq}</changefreq>`);
      if (link.priority !== undefined) parts.push(`        <priority>${link.priority}</priority>`);
      parts.push(`    </url>`);
      return parts.join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urlEntries}

</urlset>
`;

  fs.writeFileSync(SITEMAP_PATH, xml);
  return mainLinks.length;
}

function generate404(links) {
  const visibleLinks = links.filter((link) => link.show_in_404);

  const domainOrder = ["main", "blog", "projects"];
  const grouped = domainOrder
    .map((domain) => ({
      domain,
      links: visibleLinks.filter((link) => link.domain === domain),
    }))
    .filter((group) => group.links.length > 0);

  const html = grouped
    .map((group) => {
      const items = group.links
        .map(
          (link) =>
            `                    <li><a href="${escapeHtml(link.url)}">${escapeHtml(link.title)}</a></li>`
        )
        .join("\n");
      return `                <div class="not-found-group">
                    <h3>${escapeHtml(DOMAIN_LABELS[group.domain] || group.domain)}</h3>
                    <ul class="not-found-links">
${items}
                    </ul>
                </div>`;
    })
    .join("\n");

  const original = fs.readFileSync(NOT_FOUND_PATH, "utf8");
  const startIndex = original.indexOf(START_MARKER);
  const endIndex = original.indexOf(END_MARKER);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not find ${START_MARKER} / ${END_MARKER} markers in 404.html`);
  }

  const before = original.slice(0, startIndex + START_MARKER.length);
  const after = original.slice(endIndex);

  const updated = `${before}\n${html}\n                ${after}`;
  fs.writeFileSync(NOT_FOUND_PATH, updated);

  return visibleLinks.length;
}

function main() {
  const links = JSON.parse(fs.readFileSync(LINKS_PATH, "utf8"));

  const sitemapCount = generateSitemap(links);
  const notFoundCount = generate404(links);

  console.log(`Updated sitemap.xml with ${sitemapCount} URLs, updated 404.html with ${notFoundCount} links`);
}

main();
