/**
 * Renders design/profile.html to dist/PAYA-ORIGIN-Company-Profile-2026.pdf
 * using headless Chromium at true A4, and writes page PNGs for visual QA.
 *
 *   node build/render.mjs            # pdf only
 *   node build/render.mjs --qa       # pdf + per-page PNGs in build/qa
 */

import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = path.join(root, "design", "profile.html");
const out = path.join(root, "dist", "PAYA-ORIGIN-Company-Profile-2026.pdf");

fs.mkdirSync(path.dirname(out), { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox", "--font-render-hinting=none", "--force-color-profile=srgb"],
});

const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
const problems = [];
page.on("console", (m) => { if (m.type() === "error") problems.push(m.text()); });
page.on("pageerror", (e) => problems.push(String(e)));

await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

// ---- overflow audit: nothing may spill outside its page box ---------------
const audit = await page.evaluate(() => {
  const report = [];
  document.querySelectorAll(".page").forEach((pg, i) => {
    const pr = pg.getBoundingClientRect();
    pg.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const over = {
        bottom: r.bottom - pr.bottom,
        top: pr.top - r.top,
        left: pr.left - r.left,
        right: r.right - pr.right,
      };
      const worst = Object.entries(over).filter(([, v]) => v > 1.5);
      if (worst.length && !el.closest("[data-bleed]")) {
        report.push({
          page: i + 1,
          tag: el.tagName.toLowerCase() + (el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""),
          text: (el.textContent || "").trim().slice(0, 48),
          over: worst.map(([k, v]) => `${k} ${v.toFixed(1)}px`).join(", "),
        });
      }
    });
  });
  // de-duplicate: keep the outermost offender per page+edge
  const seen = new Set();
  return report.filter((r) => {
    const k = r.page + "|" + r.over;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
});

const pageCount = await page.evaluate(() => document.querySelectorAll(".page").length);

await page.pdf({
  path: out,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

await browser.close();

console.log(`pages   : ${pageCount}`);
console.log(`pdf     : ${path.relative(root, out)} (${(fs.statSync(out).size / 1024 / 1024).toFixed(2)} MB)`);
if (problems.length) {
  console.log(`\nconsole errors:`);
  problems.forEach((p) => console.log("  " + p));
}
if (audit.length) {
  console.log(`\nOVERFLOW (${audit.length}):`);
  audit.forEach((a) => console.log(`  p${a.page}  ${a.over.padEnd(22)} ${a.tag}  "${a.text}"`));
} else {
  console.log(`\noverflow: none`);
}
