import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("static export renders the Audit Room case desk", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>Audit Room — 공시로 배우는 감사 게임<\/title>/i);
  assert.match(html, /실제 기업 공시 사건/);
  assert.match(html, /완전한 가상 감사사건/);
  assert.match(html, /커머스 플랫폼 A사/);
  assert.match(html, /해외 플랫폼 E사/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps real and fictional engagements explicitly separated", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const realCases: AuditCase\[\]/);
  assert.match(page, /const fictionalCases: AuditCase\[\]/);
  assert.equal((page.match(/fictional: true/g) ?? []).length, 5);
  assert.match(page, /기업명·식별코드·수치·상황·보고결론/);
  assert.match(css, /\.fictional-collection/);
  assert.match(layout, /Audit Room — 공시로 배우는 감사 게임/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
});
