import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Audit Room case desk", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
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
