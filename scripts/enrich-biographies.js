#!/usr/bin/env node
/**
 * Merge enriched biographies into existing king HTML pages.
 * Strategy:
 * 1. Load base kings JSON and enriched JSON.
 * 2. Build a lookup of slug -> enriched text.
 * 3. For each slug with enrichment, open corresponding HTML file under html-output/kings/<slug>.html.
 * 4. Replace placeholder biography paragraph ONLY if it contains 'Historical information coming soon.' or empty section.
 * 5. If a detailed section already exists (e.g., manually authored), skip unless --force passed.
 * 6. Wrap enriched text in a standardized section structure similar to Abhaya Naga II template.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const KINGS_PATH = path.join(ROOT, 'data', 'kings.json');
const ENRICHED_PATH = path.join(ROOT, 'data', 'enriched-biographies.json');
const OUTPUT_DIR = path.join(ROOT, 'html-output', 'kings');

const force = process.argv.includes('--force');

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function buildEnrichedMap(enriched) {
  const map = new Map();
  for (const entry of enriched) {
    if (entry.slug && entry.biography_enriched) {
      map.set(entry.slug, entry.biography_enriched.trim());
    }
  }
  return map;
}

function generateSection(text, reign, kingdom, name) {
  return `                <h2>Biography</h2>\n                <section id="biography" class="biography">\n                    <h3>Overview</h3>\n                    <p><strong>${name}</strong> (${reign}) – ${text}</p>\n                    <div class="notice" style="background:#f5f8ff;border:1px solid #d0daf5;padding:12px;border-radius:8px;font-size:14px;">\n                        <strong>Source Note:</strong> Enriched narrative synthesized from early Sri Lankan chronicles (e.g. Mahāvaṃsa) and modern historiographical patterns; phrasing is original and avoids verbatim reproduction.\n                    </div>\n                </section>`;
}

function patchHTML(slug, enrichedText, meta) {
  const filePath = path.join(OUTPUT_DIR, `${slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.warn(`[skip] No HTML page for slug '${slug}'`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const hasDetailed = html.includes('<section id="biography"');
  if (hasDetailed && !force) {
    console.log(`[skip] Detailed section already present for '${slug}'`);
    return;
  }
  const placeholderRegex = /(\s*<h2>Biography<\/h2>\s*<p>Historical information coming soon.<\/p>)/;
  const match = placeholderRegex.exec(html);
  if (!match) {
    if (!force) {
      console.log(`[skip] No placeholder found for '${slug}'`);
      return;
    }
  }
  const section = generateSection(enrichedText, meta.reign || 'Reign unknown', meta.kingdom || 'Kingdom', meta.name || slug);
  let newHtml;
  if (match) {
    newHtml = html.replace(placeholderRegex, section);
  } else if (force) {
    newHtml = html.replace('</div>\n        </div>\n    </main>', section + '\n        </div>\n        </div>\n    </main>');
  }
  fs.writeFileSync(filePath, newHtml, 'utf8');
  console.log(`[updated] Biography inserted for '${slug}'`);
}

function main() {
  const kings = loadJSON(KINGS_PATH);
  const enriched = loadJSON(ENRICHED_PATH);
  const map = buildEnrichedMap(enriched);
  let count = 0;
  for (const k of kings) {
    if (map.has(k.slug)) {
      patchHTML(k.slug, map.get(k.slug), k);
      count++;
    }
  }
  console.log(`\nCompleted. Enriched biographies processed: ${count}`);
}

if (require.main === module) {
  try { main(); } catch (e) { console.error(e); process.exit(1); }
}
