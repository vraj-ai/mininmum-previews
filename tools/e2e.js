async (page) => {
  const BASE = globalThis.__BASE || "http://127.0.0.1:8765/";
  const concepts = ["story-shelf", "measured", "little-rooms"];
  const routes = ["", "#shop", "#product/hen-farm-house", "#product/frost-pond-morning", "#product/picnic-with-butterfly", "#product/jungle-parade", "#about", "#fabric", "#size-guide", "#contact"];
  const out = [];
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error" && !/favicon/.test(m.text())) errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
  for (const [w, h] of [[390, 844], [1280, 860]]) {
    await page.setViewportSize({ width: w, height: h });
    for (const c of concepts) {
      const res = { c, w, overflow: [], broken: [], steps: [] };
      await page.goto(BASE + c + "/");
      await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
      for (const r of routes) {
        await page.goto(BASE + c + "/" + r);
        await page.waitForTimeout(1050); // let the page-change view transition finish before measuring
        // scroll through to trigger lazy images
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
        await page.waitForTimeout(400);
        const info = await page.evaluate(() => ({
          ow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !i.closest("dialog:not([open])") && i.getAttribute("src")).map((i) => i.getAttribute("src")),
          h1: document.querySelector("main h1")?.textContent.trim().slice(0, 40),
          small: [...document.querySelectorAll("main button, main a, header button")].filter((e) => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.width > 0 && b.height > 0 && b.height < 40 && cs.display !== "inline" && !e.closest("p,li,dd,span.small"); }).map((e) => (e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 24) + ":" + Math.round(e.getBoundingClientRect().height)).slice(0, 6),
        }));
        if (info.ow > 0) res.overflow.push(r + " +" + info.ow);
        if (info.broken.length) res.broken.push(r + " " + info.broken.join(","));
        if (info.small.length) res.steps.push("small-targets " + (r || "home") + ": " + info.small.join(" | "));
        if (!info.h1) res.steps.push("no h1 on " + (r || "home"));
      }
      // Commerce flow on product page
      await page.goto(BASE + c + "/#product/picnic-with-butterfly");
      await page.waitForTimeout(300);
      const addSel = c === "measured" ? "#add" : c === "story-shelf" ? "#addBtn" : "#pdpAdd";
      await page.locator(addSel).scrollIntoViewIfNeeded();
      await page.click(addSel);
      const warned = await page.evaluate(() => [...document.querySelectorAll("#need,#err,.warn")].some((e) => !e.hidden && e.offsetParent));
      res.steps.push("size-required " + (warned ? "OK" : "FAIL"));
      if (c === "measured") await page.click('#sizeStep [role="radio"][data-v="3–4Y"]');
      else await page.locator(`${c === "story-shelf" ? "#buy" : "#pdpForm"} input[value="3–4Y"]`).check({ force: true });
      await page.locator(addSel).scrollIntoViewIfNeeded();
      await page.click(addSel);
      await page.waitForTimeout(200);
      const countSel = c === "story-shelf" ? "#bagCount" : "#bagN";
      res.steps.push("count after add " + (await page.textContent(countSel)));
      // add second size
      if (c === "measured") await page.click('#sizeStep [role="radio"][data-v="5–6Y"]');
      else await page.locator(`${c === "story-shelf" ? "#buy" : "#pdpForm"} input[value="5–6Y"]`).check({ force: true });
      await page.click(addSel);
      res.steps.push("count after 2nd " + (await page.textContent(countSel)));
      await page.click("#bagBtn");
      await page.waitForTimeout(450);
      const lines = await page.locator("#bag [data-d='1']").count();
      await page.locator("#bag [data-d='1']").first().click();
      await page.locator("#bag [data-d='1']").first().click();
      res.steps.push(`lines ${lines}, count after +2 ` + (await page.textContent(countSel)));
      await page.locator("#bag [data-d='-1']").first().click();
      res.steps.push("count after -1 " + (await page.textContent(countSel)));
      await page.locator("#bag [data-rm]").first().click();
      await page.locator("#bag [data-rm]").first().click();
      res.steps.push("count after remove all " + (await page.textContent(countSel)) + ", empty=" + (await page.locator("#bag :text('empty')").count()));
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      res.steps.push("bag closed by Escape " + !(await page.evaluate(() => document.querySelector("#bag").open)));
      // focus returns to the bag button
      res.steps.push("focus after close: " + (await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName)));
      // concept specifics
      if (c === "little-rooms") {
        await page.goto(BASE + c + "/");
        await page.click("#spot");
        await page.waitForTimeout(400);
        await page.locator("#qvForm input[value='2–3Y']").check({ force: true });
        await page.click("#qvForm button[type=submit]");
        res.steps.push("hotspot quick-add count " + (await page.textContent("#bagN")) + ", sheet closed " + !(await page.evaluate(() => document.querySelector("#qv").open)));
        await page.click('.roomchip[data-i="1"]');
        await page.waitForTimeout(900);
        res.steps.push("room switch title " + (await page.textContent("#tipTitle")));
      }
      if (c === "story-shelf") {
        // product page: the story book turns
        await page.goto(BASE + c + "/#product/frost-pond-morning");
        await page.waitForTimeout(1200);
        await page.locator("#turn").scrollIntoViewIfNeeded();
        const v1 = await page.textContent("#verse");
        await page.click("#turn");
        await page.waitForTimeout(1300);
        const v2 = await page.textContent("#verse");
        // home: scrolling tells the bedtime story line by line, and the last line offers the set
        await page.goto(BASE + c + "/");
        const [top, span] = await page.evaluate(() => { const s = document.querySelector("#tonight"); return [s.offsetTop, s.offsetHeight - innerHeight]; });
        await page.evaluate((y) => scrollTo(0, y), top + span * 0.5);
        await page.waitForTimeout(500);
        const mid = await page.evaluate(() => [document.querySelector("#stFolio").textContent, document.body.classList.contains("dark-head")]);
        await page.click('.st-tab[data-i="2"]');
        await page.evaluate((y) => scrollTo(0, y), top + span);
        await page.waitForTimeout(600);
        const end = await page.evaluate(() => [document.querySelector("#stTitle").textContent, document.querySelector("#stFolio").textContent, document.querySelector("#tonight").classList.contains("end"), document.querySelector("#stShop").getAttribute("href")]);
        res.steps.push(`book turned ${v1 !== v2}; night mid ${mid.join(" ")}; end ${end.join(" ")}`);
      }
      if (c === "measured") {
        await page.goto(BASE + c + "/");
        await page.click('#fitcard [role="radio"][data-v="5–6Y"]');
        res.steps.push("fit readout " + (await page.textContent("#readout")).replace(/\s+/g, " "));
        await page.goto(BASE + c + "/#shop");
        await page.waitForTimeout(1200); // the shop renders inside a view transition; clicking earlier hits the outgoing page
        await page.click('#sleeveSeg [data-v="Long sleeve"]');
        await page.waitForTimeout(300);
        res.steps.push("filter long: " + (await page.textContent("#countLine")));
        await page.click('#layoutSeg [data-v="list"]');
        await page.waitForTimeout(300);
        res.steps.push("list view " + (await page.evaluate(() => document.querySelector("#shopWrap").classList.contains("listview"))));
      }
      out.push(res);
    }
  }
  return JSON.stringify({ out, errors: [...new Set(errors)] }, null, 1);
}
