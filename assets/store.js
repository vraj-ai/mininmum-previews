/* mininmum design previews: shared catalogue, demo bag and routing.
   Each concept renders its own markup from this data. Shapes mirror Shopify
   (product handle, Size option, variants, metafields) so the chosen concept maps
   to Liquid without reworking content. Everything marked `sample` is placeholder. */
(function () {
  const IMG = (window.MIN_ASSET_BASE || "../assets/img/");
  const img = (name, alt, kind, focus) => ({
    src: IMG + name + ".webp", small: IMG + name + "-s.webp",
    large: IMG + name + (kind === "print" ? "-hd.webp" : "-l.webp"),
    alt, kind, focus: focus || "50% 40%",
  });

  const SIZES = ["2–3Y", "3–4Y", "4–5Y", "5–6Y"];

  // Working fabric spec from the design files. Not supplier-confirmed (decision 2026-10-02).
  const FABRIC = {
    headline: "Bamboo viscose jersey",
    composition: "95% bamboo viscose, 5% spandex",
    weight: "210 GSM",
    status: "Working specification. Final fabric is confirmed with the mill before launch.",
  };
  const CARE = [
    "Machine wash cold on a gentle cycle",
    "Tumble dry low",
    "Wash before first wear",
    "Skip fabric softener",
  ];
  const CONSTRUCTION = [
    "Size label printed inside, so there is no tag at the neck",
    "No cords at the neck",
    "Comfort fit: not tight, not oversized",
  ];

  const products = [
    {
      handle: "hen-farm-house",
      title: "The Hen Farm House",
      code: "MIN-PJ-667",
      style: "Piped short set",
      sleeve: "Short sleeve",
      colour: { name: "Butter cream", hex: "#FBF3E0", ink: "#2F4A3A" },
      line: "Notched collar with soft piping, button front and easy shorts.",
      summary:
        "A farmyard at the end of the day. Hens put away their eggs, chicks follow them home, and the cats keep watch from the fence. A short set for warm Singapore nights.",
      details: ["Notched collar with contrast piping", "Short sleeves, button front", "Elastic-waist shorts"],
      story: [
        "Where would the little chicks sleep when the hens came home?",
        "One hen put her eggs away and took off her apron.",
        "One picked up the last fallen apple, then opened the door.",
        "The chicks followed her past the cats on the fence.",
        "Inside the little henhouse, Mum lifted one soft, warm wing.",
        "They crept under, and Mum closed her eyes to sleep, too.",
      ],
      listen: "https://mininmum.com/listen/hen-farm-house",
      images: [
        img("hen-girl", "Girl in the Hen Farm House short set building with wooden blocks", "on-child", "50% 30%"),
        img("hen-lifestyle", "Two children in matching Hen Farm House short sets at a wooden bench", "on-child", "50% 30%"),
        img("hen-boy", "Boy reading in an armchair in the Hen Farm House short set", "on-child", "50% 35%"),
        img("hen-tile", "Close view of the Hen Farm House print: hens, chicks, a henhouse and cats on a fence", "print"),
      ],
    },
    {
      handle: "frost-pond-morning",
      title: "Frost Pond Morning",
      code: "MIN-PJ-562",
      style: "Long-sleeve cuffed set",
      sleeve: "Long sleeve",
      colour: { name: "Ice blue", hex: "#CFE6F2", ink: "#3E6E9E" },
      line: "Round neck, ribbed cuffs and cuffed pants that stay put.",
      summary:
        "A village pond frozen overnight. Rabbit skates, Mouse pushes a sled, Duck slides on her tummy and Hedgehog warms his paws. A long set for air-conditioned rooms.",
      details: ["Round neck, pull-on top", "Long sleeves with ribbed cuffs", "Elastic waist, cuffed ankles"],
      story: [
        "The pond turned to glass overnight. Who would try it first?",
        "Rabbit glided on skates, but who came next?",
        "Mouse pushed a little wood sled, while Duck slid on her tummy. Would they stop?",
        "By the snowy fir, Hedgehog warmed his paws at a little fire. Rest now?",
        "Cottage smoke said, “Home,” but could their tired feet get there?",
        "They shared the ice, got home safe, and slept warm and cosy.",
      ],
      images: [
        img("frost-garment", "Frost Pond Morning set laid flat, front and back of top and pants", "garment", "50% 50%"),
        img("frost-lifestyle", "Two children in Frost Pond Morning sets looking out of a rainy window", "on-child", "50% 30%"),
        img("frost-tile", "Close view of the Frost Pond Morning print: skaters on an ice-blue pond", "print"),
      ],
    },
    {
      handle: "picnic-with-butterfly",
      title: "Picnic with Butterfly",
      code: "MIN-PJ-600",
      style: "Peter Pan collar set",
      sleeve: "Long sleeve",
      colour: { name: "Soft peach", hex: "#FADCCD", ink: "#B9634A" },
      line: "Rounded collar, gathered yoke, frilled cuffs and a bow at the waist.",
      summary:
        "A butterfly helps a tired mouse find his way home past lily pads and mushrooms. Our most detailed shape, with piping on the collar and yoke.",
      details: ["Peter Pan collar with piping", "Front yoke with soft gathers", "Elastic frill cuffs", "Elastic waist with a self-fabric bow"],
      story: [
        "A butterfly went to sip dew, but why stop?",
        "A tired Mouse took seeds in a leaf boat. Was he lost?",
        "Could her wings guide him past pond lily pads and home?",
        "She passed small flowers and a curved bench. What soft fluff flew behind?",
        "Two ladybugs sat on a stone; Snail ate a leaf. Would Mouse get home?",
        "He did, so she drank her dew and slept under the wide mushroom.",
      ],
      images: [
        img("butterfly-garment", "Picnic with Butterfly set laid flat, front and back of top and pants", "garment", "50% 50%"),
        img("butterfly-girl", "Girl folding paper boats in the Picnic with Butterfly set", "on-child", "50% 28%"),
        img("butterfly-tile", "Close view of the Picnic with Butterfly print: rabbits, trees and mushrooms on peach", "print"),
      ],
    },
    {
      handle: "jungle-parade",
      title: "Jungle Parade",
      code: "MIN-PJ-626",
      style: "Short-sleeve pocket set",
      sleeve: "Short sleeve",
      colour: { name: "Leaf green", hex: "#DBEEC2", ink: "#4E7A3A" },
      line: "Easy round-neck tee with a chest pocket and full-length pants.",
      summary:
        "A friendly tiger follows a winding stream home, with a monkey, a toucan and a parrot along the way. Short sleeves on top, full length below.",
      details: ["Round neck, pull-on top", "Short sleeves, chest pocket", "Full-length pants with elastic waist"],
      story: [
        "Before dusk, a friendly striped tiger follows the winding jungle stream with a flower for home.",
        "Above him, one little monkey swings beneath a leafy arch, carrying another blossom.",
        "A toucan waits at the first bend and a parrot watches from the tall banana leaves.",
        "The stream curls through soft green clearings until every friend reaches the sheltered grove,",
        "where the jungle settles gently for the night.",
      ],
      images: [
        img("jungle-lifestyle", "Two children walking in Jungle Parade sets", "on-child", "50% 30%"),
        img("jungle-girl", "Girl resting with a soft toy in the Jungle Parade set", "on-child", "45% 40%"),
        img("jungle-boy", "Boy asleep on a bed in the Jungle Parade set", "on-child", "50% 45%"),
        img("jungle-tile", "Close view of the Jungle Parade print: a tiger, a stream, palms and a monkey", "print"),
      ],
    },
  ];
  products.forEach((p) => {
    p.sizes = SIZES;
    p.price = null; // no prices are set yet; never invent one
    p.fabric = FABRIC;
    p.care = CARE;
    p.construction = CONSTRUCTION;
  });

  // Draft garment measurements (cm) from the design files' size chart.
  // Saved by the founder; physical fit approval is separate.
  const sizeChart = {
    note: "Draft garment measurements in centimetres, taken from the design files. They will be confirmed on finished samples before launch.",
    rows: [
      { label: "Top length", key: "top", values: [39, 42, 45, 48] },
      { label: "Pant length", key: "pant", values: [54, 59, 64, 69] },
      { label: "Shorts length", key: "shorts", values: [24, 26, 28, 30] },
    ],
  };

  const facts = {
    founder: "Sweety Gupta",
    phone: "+65 8900 1102",
    email: "sweety@mininmum.com",
    whatsapp: "https://wa.me/6589001102",
    city: "Singapore",
    shipping:
      "We will ship within Singapore from our own stock. Delivery times, fees and the returns window will be published before launch.",
    demo: "Design preview. Products, photos and details are samples for review. Nothing can be bought here.",
  };

  // ---- Demo bag ---------------------------------------------------------
  function createBag(storageKey) {
    let lines = [];
    try { lines = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch (e) { lines = []; }
    lines = lines.filter((l) => products.some((p) => p.handle === l.handle) && SIZES.includes(l.size) && l.qty > 0);
    const subs = new Set();
    const save = () => {
      try { localStorage.setItem(storageKey, JSON.stringify(lines)); } catch (e) { /* storage blocked: bag still works for this visit */ }
      subs.forEach((fn) => fn(api));
    };
    const MAX = 10;
    const api = {
      get lines() { return lines.map((l) => ({ ...l, product: products.find((p) => p.handle === l.handle) })); },
      get count() { return lines.reduce((n, l) => n + l.qty, 0); },
      add(handle, size, qty = 1) {
        const hit = lines.find((l) => l.handle === handle && l.size === size);
        if (hit) hit.qty = Math.min(MAX, hit.qty + qty); else lines.push({ handle, size, qty: Math.min(MAX, qty) });
        save();
      },
      setQty(handle, size, qty) {
        const hit = lines.find((l) => l.handle === handle && l.size === size);
        if (!hit) return;
        if (qty <= 0) lines = lines.filter((l) => l !== hit); else hit.qty = Math.min(MAX, qty);
        save();
      },
      remove(handle, size) { lines = lines.filter((l) => !(l.handle === handle && l.size === size)); save(); },
      clear() { lines = []; save(); },
      subscribe(fn) { subs.add(fn); fn(api); return () => subs.delete(fn); },
      MAX,
    };
    return api;
  }

  // ---- Hash routing: #shop, #product/<handle>, #about, #fabric, #size-guide, #contact
  const ROUTES = ["home", "shop", "product", "about", "fabric", "size-guide", "contact"];
  function parseRoute() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ""));
    const [name, arg] = h.split("/");
    if (!name) return { name: "home" };
    if (name === "product") {
      const p = products.find((x) => x.handle === arg);
      return p ? { name, product: p } : { name: "shop" };
    }
    return ROUTES.includes(name) ? { name } : { name: "home", anchor: name };
  }
  function onRoute(render) {
    const go = () => render(parseRoute());
    window.addEventListener("hashchange", go);
    go();
  }

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---- Motion helpers -------------------------------------------------
  // Page changes run inside a View Transition where supported, so the old and new
  // pages cross-fade and a tagged photo can travel between them. Elsewhere, instant.
  let vtNext = null, firstPaint = true;
  const markShared = (el) => { vtNext = el; };
  function transition(update) {
    const from = vtNext; vtNext = null;
    if (firstPaint || !document.startViewTransition || reducedMotion()) { firstPaint = false; update(false); return; }
    if (from && from.isConnected) from.style.viewTransitionName = "shared";
    const t = document.startViewTransition(() => {
      if (from) from.style.viewTransitionName = "";
      update(!!(from && from.isConnected));
    });
    t.finished.finally(() => { document.querySelectorAll('[style*="view-transition-name"]').forEach((e) => (e.style.viewTransitionName = "")); });
  }
  // Wrap each word of a headline so it can rise into place once. Text stays readable without JS.
  function splitWords(el) {
    if (!el || el.dataset.split) return;
    el.dataset.split = "1";
    el.innerHTML = el.innerHTML.split(/(<[^>]+>|\s+)/).map((t) => (!t || /^\s+$/.test(t) || t.startsWith("<")) ? t : `<span class="w"><span>${t}</span></span>`).join("");
    el.querySelectorAll(".w > span").forEach((s, i) => s.style.setProperty("--i", i));
  }

  window.MIN = { products, SIZES, sizeChart, facts, createBag, onRoute, parseRoute, reducedMotion, esc, transition, markShared, splitWords, find: (h) => products.find((p) => p.handle === h) };
})();
