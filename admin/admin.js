const STORAGE_PRODUCTS = "rpvProductsDraft";
const STORAGE_SITE = "rpvSiteDraft";

const pageDefaults = [
  {
    id: "home",
    label: "Home",
    path: "../index.html",
    title: "เลือกหมวดสินค้า",
    description: "เครื่องจักร วัสดุขัด อุปกรณ์ และน้ำยาสำหรับงานขัดผิวอุตสาหกรรม",
    ctaText: "สอบถามสินค้า",
    ctaLink: "contact.html",
    status: "published",
    sections: [
      { id: "hero", title: "ค้นหาสินค้าที่เหมาะกับงานของคุณ", text: "ค้นหาจากชื่อสินค้า รุ่น ประเภทเครื่อง หรือวัสดุขัด", visible: true },
      { id: "categories", title: "เลือกหมวดสินค้า", text: "กดหมวดเพื่อกรองสินค้าในหน้านี้ทันที", visible: true },
      { id: "products", title: "รายการสินค้า", text: "ดูสินค้าที่ตรงกับงานของคุณ", visible: true },
      { id: "contact", title: "ต้องการคำแนะนำเพิ่มเติม?", text: "ส่งรายละเอียดงานเพื่อให้ทีม RPV ช่วยเลือกสินค้า", visible: true }
    ]
  },
  {
    id: "products",
    label: "Products",
    path: "../products.html",
    title: "Products",
    description: "รวมเครื่องขัดผิว วัสดุขัด และอุปกรณ์ที่เกี่ยวข้อง",
    ctaText: "ติดต่อทีมขาย",
    ctaLink: "contact.html",
    status: "published",
    sections: [
      { id: "header", title: "สินค้าทั้งหมด", text: "เลือกหมวดและค้นหาสินค้าที่ต้องการ", visible: true },
      { id: "grid", title: "Product Grid", text: "แสดงรายการสินค้าแบบการ์ด", visible: true }
    ]
  },
  {
    id: "solutions",
    label: "Solutions",
    path: "../solutions.html",
    title: "Solutions",
    description: "แนวทางเลือกเครื่องและวัสดุขัดตามลักษณะงาน",
    ctaText: "ปรึกษางานผลิต",
    ctaLink: "contact.html",
    status: "published",
    sections: [
      { id: "overview", title: "Industrial solutions", text: "แนะนำระบบสำหรับงานขัด ลบคม และเตรียมผิว", visible: true },
      { id: "process", title: "Process guide", text: "เลือกกระบวนการให้เหมาะกับชิ้นงาน", visible: true }
    ]
  },
  {
    id: "about",
    label: "About",
    path: "../about.html",
    title: "About RPV",
    description: "ข้อมูลบริษัท ประสบการณ์ และแนวทางให้บริการ",
    ctaText: "รู้จัก RPV",
    ctaLink: "contact.html",
    status: "published",
    sections: [
      { id: "story", title: "เรื่องราวของ RPV", text: "ผู้จัดจำหน่ายเครื่องจักรและวัสดุขัดสำหรับอุตสาหกรรม", visible: true },
      { id: "values", title: "จุดเด่น", text: "ให้คำแนะนำตามงานจริงและดูแลหลังการขาย", visible: true }
    ]
  },
  {
    id: "contact",
    label: "Contact",
    path: "../contact.html",
    title: "Contact RPV",
    description: "ส่งรายละเอียดงานเพื่อขอคำแนะนำหรือใบเสนอราคา",
    ctaText: "ส่งข้อความ",
    ctaLink: "mailto:sales@rpv.co.th",
    status: "published",
    sections: [
      { id: "contact-info", title: "ข้อมูลติดต่อ", text: "โทร อีเมล หรือส่งรายละเอียดงานให้ทีม RPV", visible: true },
      { id: "map", title: "แผนที่", text: "ตำแหน่งบริษัทและช่องทางนัดหมาย", visible: true }
    ]
  }
];

const defaultSettings = {
  phone: "086-399-0785",
  email: "",
  line: "@rpvofficial",
  address: "บางบัวทอง นนทบุรี",
  primaryColor: "#1f8e3d",
  accentColor: "#f5a623"
};

const homeCategoryDefaults = [
  { id: "machine", title: "เครื่องขัดผิว", link: "products.html?group=polishing-machines", image: "../assets/itopplus/images/Screenshot2024-06-18133652z-z181602969884-934d1b8a39.webp" },
  { id: "special", title: "แม่เหล็ก / 8K", link: "products.html?group=special-polishing", image: "../assets/rpv-watermarked/rpv-MagneticPolishingz-z418977855235-91289e9807.webp" },
  { id: "blasting", title: "เครื่องพ่นทราย", link: "products.html?group=blasting-system", image: "../assets/itopplus/images/image-Photoroom-6-z-z449893161938-e7edeee5f2.png" },
  { id: "abrasive", title: "ทรายพ่น / เม็ดขัด", link: "products.html?group=blasting-abrasives", image: "../assets/itopplus/images/GBSandz-z1506707535607-3ac278e469.webp" },
  { id: "media", title: "หินขัด / น้ำยา", link: "products.html?group=media-compound", image: "../assets/itopplus/images/PolishingMediaz-z119638418684-8589fbfcdd.webp" },
  { id: "dryer", title: "อบแห้ง / แยกชิ้นงาน", link: "products.html?group=dryer-separator", image: "../assets/rpv-watermarked/rpv-Separatorz-z1628959849741-fbcea81c51.webp" },
  { id: "other", title: "สินค้าอื่นๆ", link: "products.html?group=other-products", image: "../assets/itopplus/images/BowlFeederz-z705132466308-d9974ce643.webp" },
  { id: "service", title: "บริการ", link: "products.html?group=services", image: "../assets/itopplus/images/ServiceRepairz-z1108734234555-def29d64e2.webp" }
];

let siteDraft = loadSiteDraft();
let products = loadProducts();
let selectedPageId = siteDraft.pages[0]?.id || "home";
let selectedProductId = products[0]?.id || "";
let activeAnalyticsTab = "website";
let analyticsStats = loadAnalyticsStats();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

async function handleAdminLogin(event) {
  event.preventDefault();
  const status = $("#adminLoginStatus");
  const email = readValue("#adminEmail");
  const password = readValue("#adminPassword");
  const demo = window.RPV_ADMIN_CONFIG?.demoAuth;

  const setLoginStatus = (message) => {
    if (status) status.textContent = message;
  };

  if (window.rpvSupabase?.enabled) {
    try {
      setLoginStatus("กำลังเข้าสู่ระบบ Supabase...");
      await window.rpvSupabase.signIn(email, password);
      window.location.href = "index.html#products";
    } catch (error) {
      setLoginStatus(`เข้าสู่ระบบไม่สำเร็จ: ${error.message}`);
    }
    return;
  }

  if (demo?.enabled && email === demo.email && password === demo.password) {
    localStorage.setItem("rpvAdminDemoSession", "1");
    window.location.href = "index.html#products";
    return;
  }

  setLoginStatus("ยังไม่ได้ตั้งค่า Supabase หรือข้อมูล demo ไม่ถูกต้อง");
}

if ($("#adminLoginForm")) {
  $("#adminLoginForm").addEventListener("submit", handleAdminLogin);
}

function loadSiteDraft() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_SITE) || "{}") || {};
  } catch {
    saved = {};
  }

  const savedPages = Array.isArray(saved.pages) ? saved.pages : [];
  const pages = pageDefaults.map((page) => {
    const existing = { ...(savedPages.find((item) => item.id === page.id) || {}) };
    return { ...page, ...existing, sections: mergeSections(page.sections, existing.sections) };
  });

  const extraPages = savedPages.filter((page) => !pages.some((item) => item.id === page.id));
  return {
    pages: [...pages, ...extraPages],
    settings: { ...defaultSettings, ...(saved.settings || {}) },
    appearance: saved.appearance || {},
    homeCategories: mergeHomeCategories(saved.homeCategories)
  };
}

function mergeSections(defaults, savedSections) {
  if (!Array.isArray(savedSections)) return defaults.map((section) => ({ ...section }));
  const saved = savedSections.map((section) => ({ ...section }));
  const missing = defaults.filter((section) => !saved.some((item) => item.id === section.id));
  return [...saved, ...missing.map((section) => ({ ...section }))];
}

function mergeHomeCategories(savedCategories) {
  if (!Array.isArray(savedCategories)) return homeCategoryDefaults.map((item) => ({ ...item }));
  const saved = savedCategories.map((item) => ({ ...item }));
  const missing = homeCategoryDefaults.filter((item) => !saved.some((entry) => entry.id === item.id));
  return [...saved, ...missing.map((item) => ({ ...item }))];
}

function loadProducts() {
  const staticProducts = window.rpvProducts || [];
  try {
    const draft = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS) || "null");
    if (!Array.isArray(draft)) return staticProducts.map(normalizeProduct).sort(sortProducts);

    const draftById = new Map(draft.map((product) => [product.id, product]));
    return staticProducts
      .map((staticProduct) => {
        const draftProduct = draftById.get(staticProduct.id);
        if (!draftProduct) return staticProduct;
        const savedImage = draftProduct.image || draftProduct.image_url || "";
        const shouldUseStaticImage = !savedImage || savedImage.startsWith("assets/products/") || savedImage.startsWith("../assets/products/");
        const image = shouldUseStaticImage ? staticProduct.image || "" : savedImage;
        return {
          ...staticProduct,
          ...draftProduct,
          image,
          gallery: shouldUseStaticImage ? staticProduct.gallery || (image ? [image] : []) : draftProduct.gallery || (image ? [image] : [])
        };
      })
      .map(normalizeProduct)
      .sort(sortProducts);
  } catch {
    return staticProducts.map(normalizeProduct).sort(sortProducts);
  }
}

async function hydrateProductsFromSupabase() {
  if (!window.rpvSupabase?.enabled) return;

  try {
    const remoteProducts = await window.rpvSupabase.loadProducts({ includeHidden: true });
    if (!remoteProducts?.length) {
      setStatus("Supabase พร้อมใช้งาน แต่ยังไม่มีสินค้าในฐานข้อมูล");
      return;
    }

    products = remoteProducts.map(normalizeProduct).sort(sortProducts);
    selectedProductId = products[0]?.id || "";
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products.map(productForWebsite)));
    setStatus("โหลดสินค้าจาก Supabase แล้ว");
    renderAll();
  } catch (error) {
    console.warn("RPV Supabase admin load failed.", error);
    setStatus(`โหลด Supabase ไม่สำเร็จ: ${error.message}`);
  }
}

async function hydrateSiteFromSupabase() {
  if (!window.rpvSupabase?.enabled) return;

  try {
    const remoteDraft = await window.rpvSupabase.loadSiteDraft();
    if (!remoteDraft) return;

    siteDraft = {
      ...siteDraft,
      ...remoteDraft,
      pages: Array.isArray(remoteDraft.pages) ? remoteDraft.pages : siteDraft.pages,
      settings: { ...siteDraft.settings, ...(remoteDraft.settings || {}) },
      homeCategories: Array.isArray(remoteDraft.homeCategories) ? remoteDraft.homeCategories : siteDraft.homeCategories
    };
    localStorage.setItem(STORAGE_SITE, JSON.stringify(siteDraft));
    setStatus("โหลดหน้าเว็บจาก Supabase แล้ว");
    renderAll();
  } catch (error) {
    console.warn("RPV Supabase site load failed.", error);
    setStatus(`โหลดหน้าเว็บไม่สำเร็จ: ${error.message}`);
  }
}

function enableSiteRealtime() {
  if (!window.rpvSupabase?.enabled || !window.rpvSupabase.subscribeToSiteDraft) return;

  window.rpvSupabase.subscribeToSiteDraft((remoteDraft) => {
    if (!remoteDraft) return;

    siteDraft = {
      ...siteDraft,
      ...remoteDraft,
      pages: Array.isArray(remoteDraft.pages) ? remoteDraft.pages : siteDraft.pages,
      settings: { ...siteDraft.settings, ...(remoteDraft.settings || {}) },
      homeCategories: Array.isArray(remoteDraft.homeCategories) ? remoteDraft.homeCategories : siteDraft.homeCategories
    };
    localStorage.setItem(STORAGE_SITE, JSON.stringify(siteDraft));
    setStatus("อัปเดตหน้าเว็บแบบ realtime แล้ว");
    renderAll();
  });
}

function enableProductRealtime() {
  if (!window.rpvSupabase?.enabled || !window.rpvSupabase.subscribeToProducts) return;

  window.rpvSupabase.subscribeToProducts(async () => {
    await hydrateProductsFromSupabase();
    setStatus("อัปเดตสินค้าแบบ realtime แล้ว");
  });
}

async function hydrateAnalyticsFromSupabase({ silent = false } = {}) {
  if (!window.rpvSupabase?.enabled || !window.rpvSupabase.loadAnalytics) {
    analyticsStats = { ...loadAnalyticsStats(), source: "Local browser" };
    renderAnalytics();
    return;
  }

  try {
    const remoteStats = await window.rpvSupabase.loadAnalytics({ limit: 1000 });
    analyticsStats = remoteStats || { ...loadAnalyticsStats(), source: "Local browser" };
    renderAnalytics();
    if (!silent) setStatus("โหลดสถิติรวมจาก Supabase แล้ว");
  } catch (error) {
    console.warn("RPV Supabase analytics load failed.", error);
    analyticsStats = { ...loadAnalyticsStats(), source: "Local browser" };
    renderAnalytics();
    if (!silent) setStatus(`โหลดสถิติ Supabase ไม่สำเร็จ: ${error.message}`);
  }
}

function enableAnalyticsRealtime() {
  if (!window.rpvSupabase?.enabled || !window.rpvSupabase.subscribeToAnalytics) return;

  window.rpvSupabase.subscribeToAnalytics(() => {
    hydrateAnalyticsFromSupabase({ silent: true });
  });
}

function normalizeProduct(product, index = 0) {
  const id = product.id || product.slug || crypto.randomUUID();
  return {
    id,
    slug: product.slug || slugify(product.nameEn || product.nameTh || id),
    nameTh: product.nameTh || product.name_th || product.name || "",
    nameEn: product.nameEn || product.name_en || product.name || "",
    model: product.model || "",
    category: product.category || product.categories?.name_th || product.categories?.name_en || "",
    status: product.status === "published" ? "active" : product.status || "active",
    sortOrder: Number(product.sortOrder || product.sort_order || index + 1),
    image: product.image || product.image_url || "",
    gallery: product.gallery || [],
    descTh: product.descTh || product.shortDescriptionTh || product.description_th || product.description || "",
    descEn: product.descEn || product.shortDescriptionEn || product.description_en || product.description || "",
    features: product.features || []
  };
}

function productForWebsite(product) {
  return {
    id: product.id,
    slug: product.slug || slugify(product.nameEn || product.nameTh || product.id),
    nameTh: product.nameTh,
    nameEn: product.nameEn,
    name_th: product.nameTh,
    name_en: product.nameEn,
    model: product.model,
    category: product.category,
    categories: { name_th: product.category, name_en: product.category },
    status: product.status,
    sortOrder: Number(product.sortOrder) || 100,
    sort_order: Number(product.sortOrder) || 100,
    image: product.image,
    gallery: product.gallery && product.gallery.length ? product.gallery : product.image ? [product.image] : [],
    shortDescriptionTh: product.descTh,
    shortDescriptionEn: product.descEn,
    description_th: product.descTh,
    description_en: product.descEn,
    features: product.features || []
  };
}

function sortProducts(a, b) {
  return (Number(a.sortOrder) || 100) - (Number(b.sortOrder) || 100);
}

function persistSite() {
  localStorage.setItem(STORAGE_SITE, JSON.stringify(siteDraft));
  setStatus("บันทึก Page Draft แล้ว");
  persistSiteToSupabase();
  renderAll();
}

async function persistSiteToSupabase() {
  if (!window.rpvSupabase?.enabled) return;

  try {
    setStatus("กำลังบันทึกหน้าเว็บไป Supabase...");
    await window.rpvSupabase.saveSiteDraft(siteDraft);
    setStatus("บันทึกหน้าเว็บไป Supabase แล้ว");
  } catch (error) {
    console.warn("RPV Supabase site save failed.", error);
    setStatus(`บันทึกหน้าเว็บไม่สำเร็จ: ${error.message}`);
  }
}

function persistProducts() {
  products = products.sort(sortProducts);
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products.map(productForWebsite)));
  setStatus("บันทึก Product Draft แล้ว");
  persistProductsToSupabase();
  renderAll();
}

async function persistProductsToSupabase() {
  if (!window.rpvSupabase?.enabled) return;

  try {
    setStatus("กำลังบันทึกสินค้าไป Supabase...");
    await window.rpvSupabase.saveProducts(products.map(productForWebsite));
    setStatus("บันทึกสินค้าไป Supabase แล้ว");
  } catch (error) {
    console.warn("RPV Supabase product save failed.", error);
    setStatus(`บันทึก Supabase ไม่สำเร็จ: ${error.message}`);
  }
}

function setStatus(message) {
  const state = $("#saveState");
  if (!state) return;
  state.textContent = message;
  window.clearTimeout(setStatus.timer);
  setStatus.timer = window.setTimeout(() => {
    state.textContent = "Ready";
  }, 2600);
}

function renderAll() {
  renderStats();
  renderPageSelect();
  renderPageEditor();
  renderProducts();
  renderProductForm();
  renderMedia();
  renderAnalytics();
  renderSettings();
}

function renderStats() {
  $("#statPages").textContent = siteDraft.pages.length;
  $("#statProducts").textContent = products.length;
  $("#statImages").textContent = uniqueImages().length;
  if (window.rpvSupabase?.enabled) {
    $("#statDraft").textContent = "Supabase";
  } else {
    $("#statDraft").textContent = localStorage.getItem(STORAGE_SITE) || localStorage.getItem(STORAGE_PRODUCTS) ? "Draft" : "Static";
  }
}

function renderPageSelect() {
  const select = $("#pageSelect");
  if (!select) return;
  const current = select.value || selectedPageId;
  select.innerHTML = siteDraft.pages.map((page) => `<option value="${escapeAttr(page.id)}">${escapeHtml(page.label)}</option>`).join("");
  select.value = siteDraft.pages.some((page) => page.id === current) ? current : siteDraft.pages[0]?.id;
  selectedPageId = select.value;
}

function currentPage() {
  return siteDraft.pages.find((page) => page.id === selectedPageId) || siteDraft.pages[0];
}

function renderPageEditor() {
  const page = currentPage();
  if (!page) return;
  setValue("#pageMenuLabel", page.label);
  setValue("#pageTitle", page.title);
  setValue("#pageDescription", page.description);
  setValue("#pageCta", page.ctaText);
  setValue("#pageCtaLink", page.ctaLink);
  setValue("#pageStatus", page.status || "published");
  $("#pagePreviewLink").href = page.path || "../index.html";
  renderHomeCategoryEditor(page);
  renderSections(page);
  renderPagePreview(page);
}

function renderHomeCategoryEditor(page) {
  const editor = $("#homeCategoryEditor");
  const list = $("#homeCategoryList");
  if (!editor || !list) return;
  const isHome = page.id === "home";
  editor.hidden = !isHome;
  if (!isHome) {
    list.innerHTML = "";
    return;
  }

  list.innerHTML = siteDraft.homeCategories.map((category, index) => `
    <article class="admin-home-category-item" data-home-category-id="${escapeAttr(category.id)}">
      <div class="admin-home-category-thumb"><img src="${escapeAttr(category.image || "../assets/rpv-banner-reference.jpg")}" alt=""></div>
      <div>
        <label>ชื่อกลางรูป
          <input type="text" data-home-category-field="title" value="${escapeAttr(category.title)}">
        </label>
        <label>ลิงก์
          <input type="text" data-home-category-field="link" value="${escapeAttr(category.link || "products.html")}">
        </label>
        <label>รูป / path รูป
          <input type="text" data-home-category-field="image" value="${escapeAttr(category.image || "")}" placeholder="../assets/...">
        </label>
        <label class="admin-file-picker">เลือกรูปหมวด ${index + 1}
          <input type="file" data-home-category-file accept="image/png,image/jpeg,image/webp">
        </label>
      </div>
    </article>
  `).join("");
}

function renderSections(page) {
  const list = $("#sectionList");
  if (!list) return;
  list.innerHTML = page.sections.map((section) => `
    <article class="admin-section-item${section.visible === false ? " is-hidden" : ""}" data-section-id="${escapeAttr(section.id)}">
      <label>ชื่อ Section
        <input type="text" data-section-field="title" value="${escapeAttr(section.title)}">
      </label>
      <label>รายละเอียด
        <textarea rows="3" data-section-field="text">${escapeHtml(section.text)}</textarea>
      </label>
      <div class="admin-section-toolbar">
        <button class="admin-mini-button" type="button" data-section-action="up">ขึ้น</button>
        <button class="admin-mini-button" type="button" data-section-action="down">ลง</button>
        <button class="admin-mini-button" type="button" data-section-action="toggle">${section.visible === false ? "แสดง" : "ซ่อน"}</button>
        <button class="admin-mini-button danger" type="button" data-section-action="remove">ลบ</button>
      </div>
    </article>
  `).join("");
}

function renderPagePreview(page) {
  if (page.id === "home") {
    renderHomeCatalogPreview(page);
    return;
  }

  const navItems = siteDraft.pages
    .filter((item) => item.status !== "hidden")
    .map((item) => `<span class="${item.id === page.id ? "is-current" : ""}">${escapeHtml(item.label)}</span>`)
    .join("");

  $("#pagePreview").innerHTML = `
    <header class="admin-web-site-header">
      <div class="admin-web-brand">
        <img src="../assets/logoRPV.png" alt="RPV">
        <span><strong>RPV INDUSTRIAL SUPPLY</strong><small>Surface Finishing Solutions</small></span>
      </div>
      <nav>${navItems}</nav>
      <span class="admin-web-quote" data-preview-field="ctaText" contenteditable="true">${escapeHtml(page.ctaText || "สอบถามราคา")}</span>
    </header>
    <main>
      <section class="admin-web-home-hero">
        <p class="admin-web-eyebrow">${escapeHtml(page.label)}</p>
        <h2 data-preview-field="title" contenteditable="true">${escapeHtml(page.title)}</h2>
        <p data-preview-field="description" contenteditable="true">${escapeHtml(page.description)}</p>
      </section>
      ${page.sections.filter((section) => section.visible !== false).map(previewSectionMarkup).join("")}
    </main>
  `;
}

function renderHomeCatalogPreview(page) {
  const navItems = siteDraft.pages
    .filter((item) => item.status !== "hidden")
    .map((item) => `<span class="${item.id === page.id ? "is-current" : ""}">${escapeHtml(item.label)}</span>`)
    .join("");

  $("#pagePreview").innerHTML = `
    <header class="admin-web-site-header">
      <div class="admin-web-brand">
        <img src="../assets/logoRPV.png" alt="RPV">
        <span><strong>RPV INDUSTRIAL SUPPLY</strong><small>Surface Finishing Solutions</small></span>
      </div>
      <nav>${navItems}</nav>
      <span class="admin-web-quote" data-preview-field="ctaText" contenteditable="true">${escapeHtml(page.ctaText || "สอบถามราคา")}</span>
    </header>
    <main class="admin-home-catalog-preview">
      <section class="admin-home-catalog-layout">
        <aside class="admin-home-info-rail">
          <div>
            <p class="admin-web-eyebrow">RPV INDUSTRIAL SUPPLY</p>
            <h2 data-preview-field="title" contenteditable="true">${escapeHtml(page.title || "เลือกหมวดสินค้า")}</h2>
            <p data-preview-field="description" contenteditable="true">${escapeHtml(page.description || "")}</p>
          </div>
          <div class="admin-home-info-list">
            <span><strong>โทร</strong><small>${escapeHtml(siteDraft.settings.phone || "086-399-0785")}</small></span>
            <span><strong>LINE</strong><small>${escapeHtml(siteDraft.settings.line || "@rpvofficial")}</small></span>
            <span><strong>ที่อยู่</strong><small>${escapeHtml(siteDraft.settings.address || "บางบัวทอง นนทบุรี")}</small></span>
          </div>
        </aside>
        <div class="admin-home-category-grid">
          ${siteDraft.homeCategories.map((category) => `
            <a class="admin-home-category-tile" href="${escapeAttr(category.link || "#")}" style="background-image: linear-gradient(180deg, rgba(13, 36, 29, 0.08), rgba(13, 36, 29, 0.58)), url('${escapeCssUrl(category.image || "../assets/rpv-banner-reference.jpg")}')">
              <span data-preview-home-category="${escapeAttr(category.id)}" contenteditable="true">${escapeHtml(category.title)}</span>
            </a>
          `).join("")}
        </div>
      </section>
    </main>
  `;
}

function previewSectionMarkup(section) {
  return `
    <section class="admin-web-section" data-preview-section="${escapeAttr(section.id)}">
      <h3 data-preview-section-field="title" contenteditable="true">${escapeHtml(section.title)}</h3>
      <p data-preview-section-field="text" contenteditable="true">${escapeHtml(section.text)}</p>
    </section>
  `;
}

function updateCurrentPageFromFields() {
  const page = currentPage();
  if (!page) return;
  page.label = readValue("#pageMenuLabel");
  page.title = readValue("#pageTitle");
  page.description = readValue("#pageDescription");
  page.ctaText = readValue("#pageCta");
  page.ctaLink = readValue("#pageCtaLink");
  page.status = readValue("#pageStatus");
}

function renderProducts() {
  const list = $("#productList");
  if (!list) return;
  const search = readValue("#productSearch").toLowerCase();
  const status = readValue("#productStatusFilter");
  const filtered = products.filter((product) => {
    const text = [product.nameTh, product.nameEn, product.model, product.category].join(" ").toLowerCase();
    return (!search || text.includes(search)) && (!status || product.status === status);
  });

  list.innerHTML = filtered.map((product) => `
    <article class="admin-product-item${product.id === selectedProductId ? " is-active" : ""}" data-product-id="${escapeAttr(product.id)}">
      <div class="admin-product-thumb">${product.image ? `<img src="${escapeAttr(product.image)}" alt="">` : "No image"}</div>
      <div>
        <strong>${escapeHtml(product.nameTh || product.nameEn || "Untitled product")}</strong>
        <div class="admin-product-meta">${escapeHtml(product.model || "-")} / ${escapeHtml(product.category || "-")}</div>
        <span class="admin-badge ${escapeAttr(product.status)}">${escapeHtml(product.status)}</span>
      </div>
    </article>
  `).join("") || `<p class="admin-note">ไม่พบสินค้า</p>`;
}

function currentProduct() {
  return products.find((product) => product.id === selectedProductId) || products[0] || null;
}

function renderProductForm() {
  renderCategoryOptions();
  const product = currentProduct();
  if (!product) {
    $("#productForm")?.reset();
    setValue("#productId", "");
    $("#productFormTitle").textContent = "เพิ่มสินค้า";
    return;
  }
  $("#productFormTitle").textContent = "แก้สินค้า";
  setValue("#productId", product.id);
  setValue("#productNameTh", product.nameTh);
  setValue("#productNameEn", product.nameEn);
  setValue("#productModel", product.model);
  setValue("#productCategory", product.category);
  setValue("#productStatus", product.status);
  setValue("#productSortOrder", product.sortOrder);
  setValue("#productImage", product.image);
  setValue("#productDescTh", product.descTh);
  setValue("#productDescEn", product.descEn);
}

function renderCategoryOptions() {
  const options = $("#categoryOptions");
  if (!options) return;
  options.innerHTML = [...new Set(products.map((product) => product.category).filter(Boolean))]
    .sort()
    .map((category) => `<option value="${escapeAttr(category)}"></option>`)
    .join("");
}

function readProductForm() {
  const id = readValue("#productId") || crypto.randomUUID();
  return {
    id,
    slug: slugify(readValue("#productNameEn") || readValue("#productNameTh") || id),
    nameTh: readValue("#productNameTh"),
    nameEn: readValue("#productNameEn"),
    model: readValue("#productModel"),
    category: readValue("#productCategory"),
    status: readValue("#productStatus") || "active",
    sortOrder: Number(readValue("#productSortOrder")) || products.length + 1,
    image: readValue("#productImage"),
    gallery: readValue("#productImage") ? [readValue("#productImage")] : [],
    descTh: readValue("#productDescTh"),
    descEn: readValue("#productDescEn"),
    features: []
  };
}

function renderMedia() {
  const grid = $("#mediaGrid");
  if (!grid) return;
  const images = uniqueImages();
  grid.innerHTML = images.map((image) => `
    <article class="admin-media-card">
      <div class="admin-media-thumb"><img src="${escapeAttr(image)}" alt=""></div>
      <strong>${escapeHtml(shorten(image, 42))}</strong>
      <small>${image.startsWith("data:") ? "Draft upload" : "Asset path"}</small>
      <button class="admin-mini-button primary" type="button" data-copy-image="${escapeAttr(image)}">Copy path</button>
    </article>
  `).join("") || `<p class="admin-note">ยังไม่มีรูปในสินค้า</p>`;
}

function renderAnalytics() {
  const stats = analyticsStats || loadAnalyticsStats();
  const today = new Date().toISOString().slice(0, 10);
  const pageEntries = Object.entries(stats.pages || {}).sort((a, b) => b[1] - a[1]);
  const topPage = pageEntries[0]?.[0] || "-";
  renderDailyChart(stats);

  setText("#trafficViews", stats.totalViews || 0);
  setText("#trafficVisitors", Array.isArray(stats.visitors) ? stats.visitors.length : 0);
  setText("#trafficToday", stats.daily?.[today] || 0);
  setText("#trafficTopPage", topPage);
  setText("#trafficSource", stats.source || "Local browser");

  const pages = $("#trafficPages");
  if (pages) {
    pages.innerHTML = pageEntries.length
      ? pageEntries.map(([page, count]) => `
        <div class="admin-table-row">
          <div><strong>${escapeHtml(page)}</strong><small>Page views</small></div>
          <span>${count}</span>
        </div>
      `).join("")
      : `<p class="admin-note">ยังไม่มีข้อมูลเข้าชม ถ้าใช้ Supabase ให้ตรวจว่า run SQL และใส่ config แล้ว</p>`;
  }

  const recent = $("#trafficRecent");
  if (recent) {
    recent.innerHTML = (stats.recent || []).slice(0, 12).map((item) => `
      <div class="admin-table-row">
        <div>
          <strong>${escapeHtml(item.page || "-")}</strong>
          <small>${escapeHtml(formatDateTime(item.time))} / ${escapeHtml(item.deviceType || detectDevice(item.userAgent || ""))} / ${escapeHtml(item.referrer || "direct")}</small>
        </div>
        <span>view</span>
      </div>
    `).join("") || `<p class="admin-note">ยังไม่มีรายการล่าสุด</p>`;
  }
}

function renderDailyChart(daily) {
  const chart = $("#trafficDailyChart");
  if (!chart) return;

  const sets = {
    website: buildDailyTrafficSeries(daily.daily || {}),
    device: buildDeviceTrafficSeries(daily.recent || []),
    referrer: buildReferrerTrafficSeries(daily.referrers || {})
  };
  const labels = {
    website: "สถิติการเข้าชมเว็บไซต์",
    device: "สถิติอุปกรณ์ที่เข้าชม",
    referrer: "สถิติการเข้าชมจากการอ้างอิง"
  };
  const legends = {
    website: "ผู้เข้าชม",
    device: "ผู้เข้าชม",
    referrer: "ผู้เข้าชม"
  };
  const series = sets[activeAnalyticsTab] || sets.website;

  setText("#trafficLineTitle", activeAnalyticsTab === "website" ? `${labels.website}, ระหว่างวันที่${formatChartRange(series)}` : labels[activeAnalyticsTab]);
  setText("#trafficLineLegend", legends[activeAnalyticsTab]);

  $$(".analytics-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.analyticsTab === activeAnalyticsTab);
  });

  chart.innerHTML = renderLineChart(series);
}

function buildDailyTrafficSeries(daily) {
  return Array.from({ length: 31 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).replace(" ", " "),
      value: Number(daily[key]) || 0
    };
  });
}

function buildDeviceTrafficSeries(recent) {
  const counts = { Desktop: 0, Mobile: 0, Tablet: 0, Other: 0 };
  recent.forEach((item) => {
    const device = item.deviceType || detectDevice(item.userAgent || "");
    counts[counts[device] === undefined ? "Other" : device] += 1;
  });
  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({ key, label: key, value }));
}

function buildReferrerTrafficSeries(referrers) {
  return Object.entries(referrers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, value]) => ({ key, label: key === "direct" ? "direct" : shorten(key, 16), value: Number(value) || 0 }));
}

function renderLineChart(series) {
  const safeSeries = series.length ? series : [{ key: "empty", label: "-", value: 0 }];
  const width = Math.max(760, safeSeries.length * 48);
  const height = 330;
  const margin = { top: 18, right: 28, bottom: 62, left: 48 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxValue = Math.max(10, ...safeSeries.map((item) => item.value));
  const axisMax = Math.ceil(maxValue / 10) * 10;
  const stepX = safeSeries.length > 1 ? plotWidth / (safeSeries.length - 1) : plotWidth;
  const points = safeSeries.map((item, index) => {
    const x = margin.left + index * stepX;
    const y = margin.top + plotHeight - ((Number(item.value) || 0) / axisMax) * plotHeight;
    return { ...item, x, y };
  });
  const yTicks = Array.from({ length: 6 }, (_, index) => Math.round((axisMax / 5) * index));
  const xGuides = points.map((point) => `<line class="traffic-grid-line" x1="${point.x}" y1="${margin.top}" x2="${point.x}" y2="${margin.top + plotHeight}" />`).join("");
  const yGuides = yTicks.map((tick) => {
    const y = margin.top + plotHeight - (tick / axisMax) * plotHeight;
    return `
      <line class="traffic-grid-line" x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" />
      <text class="traffic-axis-label" x="${margin.left - 10}" y="${y + 4}" text-anchor="end">${tick}</text>
    `;
  }).join("");
  const labels = points.map((point, index) => `
    <text class="traffic-x-label" x="${point.x}" y="${height - 18}" text-anchor="end" transform="rotate(-90 ${point.x} ${height - 18})">${escapeHtml(point.label)}</text>
    ${safeSeries.length <= 12 || index % 2 === 0 ? `<text class="traffic-point-value" x="${point.x}" y="${point.y - 10}" text-anchor="middle">${point.value}</text>` : ""}
  `).join("");
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const dots = points.map((point) => `
    <circle class="traffic-point" cx="${point.x}" cy="${point.y}" r="4">
      <title>${escapeHtml(point.key)}: ${point.value}</title>
    </circle>
  `).join("");

  return `
    <svg class="traffic-line-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Traffic line chart">
      ${xGuides}
      ${yGuides}
      <line class="traffic-axis" x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${width - margin.right}" y2="${margin.top + plotHeight}" />
      <path class="traffic-line" d="${line}" />
      ${dots}
      ${labels}
    </svg>
  `;
}

function formatChartRange(series) {
  if (!series.length || !/^\d{4}-\d{2}-\d{2}$/.test(series[0].key)) return "";
  const first = new Date(series[0].key);
  const last = new Date(series[series.length - 1].key);
  const format = (date) => date.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
  return `${format(first)} - ${format(last)}`;
}

function renderPageChart(pageEntries) {
  const chart = $("#trafficPageChart");
  if (!chart) return;
  const entries = pageEntries.slice(0, 6);
  const max = Math.max(1, ...entries.map((entry) => entry[1] || 0));
  chart.innerHTML = entries.length
    ? entries.map(([page, count]) => `
      <div class="admin-chart-row">
        <strong>${escapeHtml(page)}</strong>
        <div><span style="width:${Math.max(4, (count / max) * 100)}%"></span></div>
        <em>${count}</em>
      </div>
    `).join("")
    : `<p class="admin-note">ยังไม่มีข้อมูลสำหรับกราฟ</p>`;
}

function loadAnalyticsStats() {
  try {
    const stats = JSON.parse(localStorage.getItem("rpvAnalyticsStats") || "{}");
    return {
      totalViews: Number(stats.totalViews) || 0,
      visitors: Array.isArray(stats.visitors) ? stats.visitors : [],
      pages: stats.pages && typeof stats.pages === "object" ? stats.pages : {},
      daily: stats.daily && typeof stats.daily === "object" ? stats.daily : {},
      referrers: stats.referrers && typeof stats.referrers === "object" ? stats.referrers : {},
      recent: Array.isArray(stats.recent) ? stats.recent : [],
      source: "Local browser"
    };
  } catch {
    return { totalViews: 0, visitors: [], pages: {}, daily: {}, referrers: {}, recent: [], source: "Local browser" };
  }
}

function uniqueImages() {
  return [...new Set(products.map((product) => product.image).filter(Boolean))];
}

function renderSettings() {
  const settings = siteDraft.settings || defaultSettings;
  setValue("#settingPhone", settings.phone);
  setValue("#settingEmail", settings.email);
  setValue("#settingLine", settings.line);
  setValue("#settingAddress", settings.address);
  setValue("#settingPrimaryColor", settings.primaryColor || "#1f8e3d");
  setValue("#settingAccentColor", settings.accentColor || "#f5a623");
}

function saveSettings() {
  siteDraft.settings = {
    phone: readValue("#settingPhone"),
    email: readValue("#settingEmail"),
    line: readValue("#settingLine"),
    address: readValue("#settingAddress"),
    primaryColor: readValue("#settingPrimaryColor"),
    accentColor: readValue("#settingAccentColor")
  };
  persistSite();
}

function switchPanel(panelId) {
  $$("[data-panel-section]").forEach((panel) => panel.classList.toggle("is-active", panel.id === panelId));
  $$(".admin-nav").forEach((button) => button.classList.toggle("is-active", button.dataset.panel === panelId));
  window.location.hash = panelId;
}

function downloadFile(filename, content, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportProducts() {
  const content = `globalThis.rpvProducts = ${JSON.stringify(products.map(productForWebsite), null, 2)};\n`;
  downloadFile("rpv-products.js", content, "text/javascript");
  setStatus("Export Products แล้ว");
}

function exportSite() {
  downloadFile("rpv-site-draft.json", JSON.stringify(siteDraft, null, 2));
  setStatus("Export Site แล้ว");
}

function resetDrafts() {
  if (!window.confirm("ล้าง Draft ทั้งหมดใน browser นี้ใช่ไหม?")) return;
  localStorage.removeItem(STORAGE_PRODUCTS);
  localStorage.removeItem(STORAGE_SITE);
  siteDraft = loadSiteDraft();
  products = loadProducts();
  selectedPageId = siteDraft.pages[0]?.id || "home";
  selectedProductId = products[0]?.id || "";
  setStatus("ล้าง Draft แล้ว");
  renderAll();
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setValue(selector, value) {
  const control = $(selector);
  if (control) control.value = value ?? "";
}

function readValue(selector) {
  return ($(selector)?.value || "").trim();
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, "-")
    .replace(/^-+|-+$/g, "") || `item-${Date.now()}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function escapeCssUrl(value) {
  return String(value || "").replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

function shorten(value, max) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function detectDevice(userAgent = "") {
  const agent = String(userAgent).toLowerCase();
  if (/ipad|tablet/.test(agent)) return "Tablet";
  if (/mobile|android|iphone/.test(agent)) return "Mobile";
  if (agent) return "Desktop";
  return "Other";
}

document.addEventListener("click", (event) => {
  const jump = event.target.closest("[data-panel-jump]");
  if (jump) switchPanel(jump.dataset.panelJump);

  const nav = event.target.closest(".admin-nav");
  if (nav) switchPanel(nav.dataset.panel);

  const productItem = event.target.closest("[data-product-id]");
  if (productItem) {
    selectedProductId = productItem.dataset.productId;
    renderProducts();
    renderProductForm();
  }

  const copyButton = event.target.closest("[data-copy-image]");
  if (copyButton) {
    navigator.clipboard?.writeText(copyButton.dataset.copyImage);
    setStatus("คัดลอก path รูปแล้ว");
  }
});

$("#pageSelect")?.addEventListener("change", (event) => {
  selectedPageId = event.target.value;
  renderPageEditor();
});

["#pageMenuLabel", "#pageTitle", "#pageDescription", "#pageCta", "#pageCtaLink", "#pageStatus"].forEach((selector) => {
  $(selector)?.addEventListener("input", () => {
    updateCurrentPageFromFields();
    renderPagePreview(currentPage());
  });
});

$("#sectionList")?.addEventListener("input", (event) => {
  const item = event.target.closest("[data-section-id]");
  const field = event.target.dataset.sectionField;
  if (!item || !field) return;
  const section = currentPage().sections.find((entry) => entry.id === item.dataset.sectionId);
  if (section) {
    section[field] = event.target.value;
    renderPagePreview(currentPage());
  }
});

$("#sectionList")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-section-action]");
  if (!button) return;
  const page = currentPage();
  const item = button.closest("[data-section-id]");
  const index = page.sections.findIndex((section) => section.id === item.dataset.sectionId);
  if (index < 0) return;
  const action = button.dataset.sectionAction;

  if (action === "up" && index > 0) [page.sections[index - 1], page.sections[index]] = [page.sections[index], page.sections[index - 1]];
  if (action === "down" && index < page.sections.length - 1) [page.sections[index + 1], page.sections[index]] = [page.sections[index], page.sections[index + 1]];
  if (action === "toggle") page.sections[index].visible = page.sections[index].visible === false;
  if (action === "remove") page.sections.splice(index, 1);
  renderPageEditor();
});

$("#homeCategoryList")?.addEventListener("input", (event) => {
  const item = event.target.closest("[data-home-category-id]");
  const field = event.target.dataset.homeCategoryField;
  if (!item || !field) return;
  const category = siteDraft.homeCategories.find((entry) => entry.id === item.dataset.homeCategoryId);
  if (!category) return;
  category[field] = event.target.value;
  const thumb = item.querySelector(".admin-home-category-thumb img");
  if (thumb && field === "image") thumb.src = category.image || "../assets/rpv-banner-reference.jpg";
  renderPagePreview(currentPage());
});

$("#homeCategoryList")?.addEventListener("change", async (event) => {
  const fileInput = event.target.closest("[data-home-category-file]");
  if (!fileInput) return;
  const item = fileInput.closest("[data-home-category-id]");
  const category = siteDraft.homeCategories.find((entry) => entry.id === item?.dataset.homeCategoryId);
  const file = fileInput.files?.[0];
  if (!category || !file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    window.alert("รองรับเฉพาะ JPG, PNG หรือ WebP");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    window.alert("รูปใหญ่เกิน 5MB กรุณาย่อรูปก่อน");
    return;
  }
  category.image = await readImageFile(file);
  const pathInput = item.querySelector('[data-home-category-field="image"]');
  if (pathInput) pathInput.value = category.image;
  const thumb = item.querySelector(".admin-home-category-thumb img");
  if (thumb) thumb.src = category.image;
  renderPagePreview(currentPage());
  setStatus("โหลดรูปหมวดแล้ว");
});

$("#pagePreview")?.addEventListener("input", (event) => {
  const page = currentPage();
  const categoryTitle = event.target.closest("[data-preview-home-category]");
  if (categoryTitle) {
    const category = siteDraft.homeCategories.find((entry) => entry.id === categoryTitle.dataset.previewHomeCategory);
    if (!category) return;
    category.title = categoryTitle.textContent.trim();
    const titleInput = $(`[data-home-category-id="${CSS.escape(category.id)}"] [data-home-category-field="title"]`);
    if (titleInput) titleInput.value = category.title;
    return;
  }

  const fieldElement = event.target.closest("[data-preview-field]");
  if (fieldElement) {
    const field = fieldElement.dataset.previewField;
    page[field] = fieldElement.textContent.trim();
    if (field === "title") setValue("#pageTitle", page[field]);
    if (field === "description") setValue("#pageDescription", page[field]);
    if (field === "ctaText") setValue("#pageCta", page[field]);
    return;
  }

  const sectionField = event.target.closest("[data-preview-section-field]");
  if (!sectionField) return;
  const sectionNode = sectionField.closest("[data-preview-section]");
  const section = page.sections.find((entry) => entry.id === sectionNode?.dataset.previewSection);
  if (!section) return;
  section[sectionField.dataset.previewSectionField] = sectionField.textContent.trim();
  renderSections(page);
});

$("#addSectionButton")?.addEventListener("click", () => {
  currentPage().sections.push({
    id: `section-${Date.now()}`,
    title: "Section ใหม่",
    text: "เพิ่มรายละเอียดของส่วนนี้",
    visible: true
  });
  renderPageEditor();
});

$("#savePageButton")?.addEventListener("click", () => {
  updateCurrentPageFromFields();
  persistSite();
});

$("#productSearch")?.addEventListener("input", renderProducts);
$("#productStatusFilter")?.addEventListener("change", renderProducts);

$("#newProductButton")?.addEventListener("click", () => {
  const id = crypto.randomUUID();
  products.unshift({
    id,
    slug: "",
    nameTh: "",
    nameEn: "",
    model: "",
    category: "",
    status: "draft",
    sortOrder: products.length + 1,
    image: "",
    gallery: [],
    descTh: "",
    descEn: "",
    features: []
  });
  selectedProductId = id;
  renderAll();
});

$("#duplicateProductButton")?.addEventListener("click", () => {
  const product = currentProduct();
  if (!product) return;
  const copy = { ...product, id: crypto.randomUUID(), nameTh: `${product.nameTh} Copy`, sortOrder: products.length + 1 };
  products.unshift(copy);
  selectedProductId = copy.id;
  persistProducts();
});

$("#deleteProductButton")?.addEventListener("click", () => {
  const product = currentProduct();
  if (!product) return;
  if (!window.confirm(`ซ่อนสินค้า "${product.nameTh || product.nameEn}" ใช่ไหม?`)) return;
  product.status = "hidden";
  persistProducts();
});

$("#productForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextProduct = readProductForm();
  const index = products.findIndex((product) => product.id === nextProduct.id);
  if (index >= 0) products[index] = nextProduct;
  else products.unshift(nextProduct);
  selectedProductId = nextProduct.id;
  persistProducts();
});

$("#productImageFile")?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    window.alert("รองรับเฉพาะ JPG, PNG หรือ WebP");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    window.alert("รูปใหญ่เกิน 5MB กรุณาย่อรูปก่อน");
    return;
  }
  $("#productImage").value = await readImageFile(file);
  setStatus("โหลดรูปสินค้าแล้ว");
});

$("#saveSettingsButton")?.addEventListener("click", saveSettings);
$("#exportProductsButton")?.addEventListener("click", exportProducts);
$("#exportSiteButton")?.addEventListener("click", exportSite);
$("#resetDraftButton")?.addEventListener("click", resetDrafts);
$("#resetAnalyticsButton")?.addEventListener("click", async () => {
  if (!window.confirm("ล้างสถิติเข้าชมทั้งหมดใช่ไหม? ถ้า Supabase เปิดอยู่จะล้างข้อมูลสถิติรวม")) return;
  try {
    if (window.rpvSupabase?.enabled && window.rpvSupabase.resetAnalytics) {
      await window.rpvSupabase.resetAnalytics();
      analyticsStats = { totalViews: 0, visitors: [], pages: {}, daily: {}, referrers: {}, recent: [], source: "Supabase" };
    } else {
      localStorage.removeItem("rpvAnalyticsStats");
      analyticsStats = { ...loadAnalyticsStats(), source: "Local browser" };
    }
    renderAnalytics();
    setStatus("ล้างสถิติแล้ว");
  } catch (error) {
    setStatus(`ล้างสถิติไม่สำเร็จ: ${error.message}`);
  }
});

$$(".analytics-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeAnalyticsTab = button.dataset.analyticsTab || "website";
    renderAnalytics();
  });
});

$(".analytics-calendar")?.addEventListener("click", () => {
  setStatus("ตอนนี้แสดงช่วง 31 วันล่าสุด ถ้าต้องการเลือกวันที่เองค่อยต่อ date picker เพิ่มได้");
});

const initialPanel = (window.location.hash || "#dashboard").slice(1);
if ($("[data-panel-section]")) {
  switchPanel($(`[data-panel-section]#${CSS.escape(initialPanel)}`) ? initialPanel : "dashboard");
  renderAll();
  hydrateSiteFromSupabase();
  hydrateProductsFromSupabase();
  hydrateAnalyticsFromSupabase({ silent: true });
  enableSiteRealtime();
  enableProductRealtime();
  enableAnalyticsRealtime();
}
