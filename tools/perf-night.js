// Frame-time and main-thread A/B for the scroll-told night story. Run with Playwright MCP
// browser_run_code_unsafe against `python -m http.server 8765` in design-previews/.
// For an A/B, save the old page next to index.html (git show HEAD:design-previews/story-shelf/index.html > story-shelf/ab-before.html)
// and list both below. Compare medians of several rounds; this machine's numbers vary run to run.
async (page) => {
  const pages = ["story-shelf/"];
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Performance.enable");
  const metric = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  const out = [];
  for (const [w, h] of [[390, 844], [1280, 860]]) {
    await page.setViewportSize({ width: w, height: h });
    for (let round = 0; round < 3; round++) for (const p of pages) {
      await page.goto("http://127.0.0.1:8765/" + p + "?r=" + Math.random());
      await page.waitForTimeout(1200);
      await page.evaluate(() => { const s = document.querySelector("#tonight"); scrollTo(0, s.getBoundingClientRect().top + scrollY - 400); });
      await page.waitForTimeout(500);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      const m0 = await metric();
      const f = await page.evaluate(async () => {
        const sec = document.querySelector("#tonight");
        const top = sec.getBoundingClientRect().top + scrollY, end = top + sec.offsetHeight - innerHeight;
        const d = []; let last = performance.now(), y = top - 400;
        await new Promise((res) => { const step = (t) => { d.push(t - last); last = t; y += 14; scrollTo(0, y); if (y < end + 200) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
        d.shift(); const s = [...d].sort((a, b) => a - b);
        return { n: d.length, p50: +s[Math.floor(s.length * .5)].toFixed(1), p95: +s[Math.floor(s.length * .95)].toFixed(1) };
      });
      const m1 = await metric();
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
      const ms = (k) => Math.round((m1[k] - m0[k]) * 1000);
      out.push({ w, p: p.replace("story-shelf/", ""), ...f, task: ms("TaskDuration"), style: ms("RecalcStyleDuration"), layout: ms("LayoutDuration"), script: ms("ScriptDuration") });
    }
  }
  return out;
}
