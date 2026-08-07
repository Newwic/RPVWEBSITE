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
      { id: "map", title: "แผนที่", text: "ระบุตำแหน่งบริษัทหรือช่องทางนัดหมาย", visible: true }
    ]
  }
];

const defaultSettings = {
  phone: "",
  email: "",
  line: "",
  address: "",
  primaryColor: "#166534",
  accentColor: "#f59e0b"
};

const homeCategoryDefaults = [
  { id: "machine", className: "tile-machine", title: "เครื่องขัดผิว", link: "products.html", image: "../assets/rpv-banner-reference.jpg" },
  { id: "magnetic", className: "tile-magnetic", title: "เครื่องขัดแม่เหล็ก", link: "products.html", image: "../assets/rpv-banner-reference.jpg" },
  { id: "ceramic", className: "tile-ceramic", title: "หินขัดเซรามิก", link: "products.html", image: "../assets/rpv-banner-reference.jpg" },
  { id: "plastic", className: "tile-plastic", title: "หินขัดพลาสติก", link: "products.html", image: "../assets/rpv-banner-reference.jpg" },
  { id: "steel", className: "tile-steel", title: "วัสดุขัดสแตนเลส", link: "products.html", image: "../assets/rpv-banner-reference.jpg" },
  { id: "compound", className: "tile-compound", title: "น้ำยาขัดและเคมีภัณฑ์", link: "products.html", image: "../assets/rpv-banner-reference.jpg" },
  { id: "spare", className: "tile-spare", title: "อะไหล่และอุปกรณ์", link: "products.html", image: "../assets/rpv-banner-reference.jpg" },
  { id: "support", className: "tile-support", title: "ปรึกษางานขัดผิว", link: "solutions.html", image: "../assets/rpv-banner-reference.jpg" }
];

let siteDraft = loadSiteDraft();
let products = loadProducts();
let selectedPageId = siteDraft.pages[0]?.id || "home";
let selectedProductId = products[0]?.id || "";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

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
    if (page.id === "home" && existing.title === "RPV Industrial Supply") {
      existing.title = page.title;
      existing.description = page.description;
      existing.ctaText = page.ctaText;
    }
    return {
      ...page,
      ...existing,
      sections: mergeSections(page.sections, existing.sections)
    };
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
  try {
    const draft = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS) || "null");
    if (Array.isArray(draft)) {
      const staticProducts = window.rpvProducts || [];
      const staticById = new Map(staticProducts.map((product) => [product.id, product]));
      const draftById = new Map(draft.map((product) => [product.id, product]));
      const mergeProduct = (staticProduct) => {
        const product = draftById.get(staticProduct.id);
        if (!product) return staticProduct;

        const savedImage = product.image || product.image_url || "";
        const isGeneratedPlaceholder = savedImage.startsWith("assets/products/") && savedImage.endsWith(".svg");
        const isOldImportedImage = savedImage.startsWith("assets/products/") || savedImage.startsWith("../assets/products/");
        const shouldUseStaticImage = !savedImage || savedImage === "assets/nylon-shot-sample.svg" || isGeneratedPlaceholder || isOldImportedImage;
        const image = shouldUseStaticImage ? staticProduct.image || "" : savedImage;
        return {
          ...staticProduct,
          ...product,
          image,
          gallery: shouldUseStaticImage ? staticProduct.gallery || (image ? [image] : []) : product.gallery || (image ? [image] : [])
        };
      };

      if (staticProducts.length > 40) {
        return staticProducts.map(mergeProduct).map(normalizeProduct).sort(sortProducts);
      }

      const draftIds = new Set(draft.map((product) => product.id).filter(Boolean));
      const mergedDraft = draft.map((product) => (staticById.has(product.id) ? mergeProduct(staticById.get(product.id)) : product));
      const newStaticProducts = staticProducts.filter((product) => !draftIds.has(product.id));
      return [...mergedDraft, ...newStaticProducts].map(normalizeProduct).sort(sortProducts);
    }
  } catch {
    // Ignore invalid draft and use static data.
  }
  return (window.rpvProducts || []).map(normalizeProduct).sort(sortProducts);
}

function normalizeProduct(product, index = 0) {
  const id = product.id || product.slug || crypto.randomUUID();
  return {
    id,
    slug: product.slug || slugify(product.name_en || product.name_th || id),
    nameTh: product.nameTh || product.name_th || product.name || "",
    nameEn: product.nameEn || product.name_en || product.name || "",
    model: product.model || "",
    category: product.category || product.categories?.name_th || product.categories?.name_en || "",
    status: product.status === "published" ? "active" : product.status || "active",
    sortOrder: Number(product.sortOrder || product.sort_order || index + 1),
    image: product.image || product.image_url || "",
    gallery: product.gallery || [],
    descTh: product.descTh || product.description_th || product.description || "",
    descEn: product.descEn || product.description_en || product.description || "",
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
    status: product.status === "active" ? "active" : product.status,
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
  setStatus("Site draft saved");
  renderAll();
}

function persistProducts() {
  products = products.sort(sortProducts);
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products.map(productForWebsite)));
  setStatus("Product draft saved");
  renderAll();
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
  renderSettings();
}

function renderStats() {
  $("#statPages").textContent = siteDraft.pages.length;
  $("#statProducts").textContent = products.length;
  $("#statImages").textContent = uniqueImages().length;
  $("#statDraft").textContent = localStorage.getItem(STORAGE_SITE) || localStorage.getItem(STORAGE_PRODUCTS) ? "Draft" : "Static";
}

function renderPageSelect() {
  const select = $("#pageSelect");
  if (!select) return;
  const current = select.value || selectedPageId;
  select.innerHTML = siteDraft.pages
    .map((page) => `<option value="${escapeAttr(page.id)}">${escapeHtml(page.label)}</option>`)
    .join("");
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
      <div class="admin-home-category-thumb">
        <img src="${escapeAttr(category.image || "../assets/rpv-banner-reference.jpg")}" alt="">
      </div>
      <div class="admin-home-category-fields">
        <label>ชื่อกลางรูป
          <input type="text" data-home-category-field="title" value="${escapeAttr(category.title)}">
        </label>
        <label>ลิงก์
          <input type="text" data-home-category-field="link" value="${escapeAttr(category.link || "products.html")}">
        </label>
        <label>รูป / path รูป
          <input type="text" data-home-category-field="image" value="${escapeAttr(category.image || "")}" placeholder="../assets/rpv-banner-reference.jpg หรือ data:image/...">
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
  list.innerHTML = page.sections.map((section, index) => `
    <article class="admin-section-item${section.visible === false ? " is-hidden" : ""}" data-section-id="${escapeAttr(section.id)}">
      <label>ชื่อ Section
        <input type="text" data-section-field="title" value="${escapeAttr(section.title)}">
      </label>
      <label>รายละเอียด
        <textarea rows="3" data-section-field="text">${escapeHtml(section.text)}</textarea>
      </label>
      <div class="admin-section-toolbar">
        <button class="admin-mini-button" type="button" data-section-action="up" ${index === 0 ? "disabled" : ""}>ขึ้น</button>
        <button class="admin-mini-button" type="button" data-section-action="down" ${index === page.sections.length - 1 ? "disabled" : ""}>ลง</button>
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

  const visibleSections = page.sections.filter((section) => section.visible !== false);
  const navItems = siteDraft.pages
    .filter((item) => item.status !== "hidden")
    .map((item) => `<span class="${item.id === page.id ? "is-current" : ""}">${escapeHtml(item.label)}</span>`)
    .join("");
  const heroSection = visibleSections[0];
  const bodySections = visibleSections.slice(1);
  const sampleProducts = products.filter((product) => product.status !== "hidden").slice(0, 4);

  $("#pagePreview").innerHTML = `
    <header class="admin-web-site-header">
      <div class="admin-web-brand">
        <img src="../assets/logoRPV.png" alt="RPV">
        <span>
          <strong>RPV INDUSTRIAL SUPPLY</strong>
          <small>Surface Finishing Solutions</small>
        </span>
      </div>
      <nav>${navItems}</nav>
      <span class="admin-web-quote" data-preview-field="ctaText" contenteditable="true">${escapeHtml(page.ctaText || "สอบถามราคา")}</span>
    </header>

    <section class="admin-web-home-hero">
      <p class="admin-web-eyebrow">RPV PRODUCT SEARCH</p>
      <h2 data-preview-field="title" contenteditable="true">${escapeHtml(page.title)}</h2>
      <p data-preview-field="description" contenteditable="true">${escapeHtml(page.description)}</p>
      <div class="admin-web-search">ค้นหาชื่อสินค้า รุ่น หรือหมวดสินค้า</div>
    </section>

    <main class="admin-web-home-body">
      ${heroSection ? `
        <section class="admin-web-section admin-web-section-feature" data-preview-section="${escapeAttr(heroSection.id)}">
          <h3 data-preview-section-field="title" contenteditable="true">${escapeHtml(heroSection.title)}</h3>
          <p data-preview-section-field="text" contenteditable="true">${escapeHtml(heroSection.text)}</p>
        </section>
      ` : ""}

      ${bodySections.map((section) => previewSectionMarkup(section)).join("")}

      <section class="admin-web-product-panel">
        <div>
          <h3>รายการสินค้า</h3>
          <p>ตัวอย่างการ์ดสินค้าจากข้อมูลปัจจุบัน</p>
        </div>
        <div class="admin-web-product-grid">
          ${sampleProducts.map((product) => `
            <article>
              <div class="admin-web-product-image">${product.image ? `<img src="${escapeAttr(product.image)}" alt="">` : "No image"}</div>
              <strong>${escapeHtml(product.nameTh || product.nameEn || "Product")}</strong>
              <small>${escapeHtml(product.model || product.category || "RPV")}</small>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="admin-web-contact-band">
        <div>
          <p class="admin-web-eyebrow">CONTACT RPV</p>
          <h3 data-preview-field="ctaText" contenteditable="true">${escapeHtml(page.ctaText || "สอบถามราคา")}</h3>
          <p>Preview นี้แก้ได้ก่อน แล้วค่อยบันทึก Draft เพื่อทดลองบนหน้าเว็บจริง</p>
        </div>
        <span class="admin-web-button">${escapeHtml(page.ctaText || "ติดต่อเรา")}</span>
      </section>
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
        <span>
          <strong>RPV INDUSTRIAL SUPPLY</strong>
          <small>Surface Finishing Solutions</small>
        </span>
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
            <span><strong>โทร</strong><small>086-399-0785</small></span>
            <span><strong>LINE</strong><small>@rpvofficial</small></span>
            <span><strong>ที่อยู่</strong><small>บางบัวทอง นนทบุรี</small></span>
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
  const isContact = section.id.includes("contact");
  return `
    <section class="admin-web-section${isContact ? " admin-web-section-contact" : ""}" data-preview-section="${escapeAttr(section.id)}">
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
    $("#productForm").reset();
    $("#productId").value = "";
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
  $("#categoryOptions").innerHTML = [...new Set(products.map((product) => product.category).filter(Boolean))]
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
    descTh: readValue("#productDescTh"),
    descEn: readValue("#productDescEn"),
    features: []
  };
}

function renderMedia() {
  const grid = $("#mediaGrid");
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

function uniqueImages() {
  return [...new Set(products.map((product) => product.image).filter(Boolean))];
}

function renderSettings() {
  const settings = siteDraft.settings || defaultSettings;
  setValue("#settingPhone", settings.phone);
  setValue("#settingEmail", settings.email);
  setValue("#settingLine", settings.line);
  setValue("#settingAddress", settings.address);
  setValue("#settingPrimaryColor", settings.primaryColor || "#166534");
  setValue("#settingAccentColor", settings.accentColor || "#f59e0b");
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
  const content = `window.rpvProducts = ${JSON.stringify(products.map(productForWebsite), null, 2)};\n`;
  downloadFile("rpv-products.js", content, "text/javascript");
  setStatus("Products exported");
}

function exportSite() {
  downloadFile("rpv-site-draft.json", JSON.stringify(siteDraft, null, 2));
  setStatus("Site draft exported");
}

function resetDrafts() {
  if (!window.confirm("ล้าง Draft ทั้งหมดใน browser นี้ใช่ไหม?")) return;
  localStorage.removeItem(STORAGE_PRODUCTS);
  localStorage.removeItem(STORAGE_SITE);
  siteDraft = loadSiteDraft();
  products = loadProducts();
  selectedPageId = siteDraft.pages[0]?.id || "home";
  selectedProductId = products[0]?.id || "";
  setStatus("Draft cleared");
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

$$(".admin-nav").forEach((button) => {
  button.addEventListener("click", () => switchPanel(button.dataset.panel));
});

document.addEventListener("click", (event) => {
  const jump = event.target.closest("[data-panel-jump]");
  if (jump) switchPanel(jump.dataset.panelJump);

  const productItem = event.target.closest("[data-product-id]");
  if (productItem) {
    selectedProductId = productItem.dataset.productId;
    renderProducts();
    renderProductForm();
  }

  const copyButton = event.target.closest("[data-copy-image]");
  if (copyButton) {
    navigator.clipboard?.writeText(copyButton.dataset.copyImage);
    setStatus("Image path copied");
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

  if (action === "up" && index > 0) {
    [page.sections[index - 1], page.sections[index]] = [page.sections[index], page.sections[index - 1]];
  }
  if (action === "down" && index < page.sections.length - 1) {
    [page.sections[index + 1], page.sections[index]] = [page.sections[index], page.sections[index + 1]];
  }
  if (action === "toggle") {
    page.sections[index].visible = page.sections[index].visible === false;
  }
  if (action === "remove") {
    page.sections.splice(index, 1);
  }
  renderPageEditor();
});

$("#homeCategoryList")?.addEventListener("input", (event) => {
  const item = event.target.closest("[data-home-category-id]");
  const field = event.target.dataset.homeCategoryField;
  if (!item || !field) return;
  const category = siteDraft.homeCategories.find((entry) => entry.id === item.dataset.homeCategoryId);
  if (!category) return;
  category[field] = event.target.value;
  renderPagePreview(currentPage());
  const thumb = item.querySelector(".admin-home-category-thumb img");
  if (thumb && field === "image") thumb.src = category.image || "../assets/rpv-banner-reference.jpg";
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
  setStatus("Home category image loaded");
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
  const product = {
    id,
    slug: "",
    nameTh: "",
    nameEn: "",
    model: "",
    category: "",
    status: "draft",
    sortOrder: products.length + 1,
    image: "",
    descTh: "",
    descEn: "",
    features: []
  };
  products.unshift(product);
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
  setStatus("Image loaded into draft");
});

$("#saveSettingsButton")?.addEventListener("click", saveSettings);
$("#exportProductsButton")?.addEventListener("click", exportProducts);
$("#exportSiteButton")?.addEventListener("click", exportSite);
$("#resetDraftButton")?.addEventListener("click", resetDrafts);

const initialPanel = (window.location.hash || "#dashboard").slice(1);
switchPanel($(`[data-panel-section]#${CSS.escape(initialPanel)}`) ? initialPanel : "dashboard");
renderAll();
