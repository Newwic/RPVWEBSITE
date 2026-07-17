const config = window.RPV_ADMIN_CONFIG || {};
const isConfigured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
const demoAuth = config.demoAuth || {
  enabled: true,
  email: "admin@rpv.co.th",
  password: "rpvadmin123"
};
const isDemoAuthEnabled = Boolean(demoAuth.enabled && demoAuth.email && demoAuth.password);

const loginForm = document.querySelector("#adminLoginForm");
const loginStatus = document.querySelector("#adminLoginStatus");
const guardStatus = document.querySelector("#adminGuardStatus");
const adminGuard = document.querySelector("#adminGuard");
const adminDashboard = document.querySelector("#adminDashboard");
const logoutButton = document.querySelector("#adminLogout");
const productsBody = document.querySelector("#adminProductsBody");
const statProducts = document.querySelector("#statProducts");
const statPublished = document.querySelector("#statPublished");
const statDraft = document.querySelector("#statDraft");
const statHidden = document.querySelector("#statHidden");
const productSearch = document.querySelector("#adminProductSearch");
const statusFilter = document.querySelector("#adminStatusFilter");
const adminModeText = document.querySelector("#adminModeText");
const adminModeBanner = document.querySelector("#adminModeBanner");
const adminActionStatus = document.querySelector("#adminActionStatus");
const addProductButton = document.querySelector("#addProductButton");
const addProductInlineButton = document.querySelector("#addProductInlineButton");
const exportProductsButton = document.querySelector("#exportProductsButton");
const clearDraftButton = document.querySelector("#clearDraftButton");
let adminNavLinks = document.querySelectorAll("[data-admin-nav]");
let adminSections = document.querySelectorAll("[data-admin-section]");
const adminCategoriesList = document.querySelector("#adminCategoriesList");
const adminMediaGrid = document.querySelector("#adminMediaGrid");
const openFirstProductEditor = document.querySelector("#openFirstProductEditor");
const settingDataMode = document.querySelector("#settingDataMode");
const revisionList = document.querySelector("#adminRevisionList");
let adminSidePreview = null;
let editorLivePreview = null;

const editorDialog = document.querySelector("#productEditorDialog");
const editorForm = document.querySelector("#productEditorForm");
const editorTitle = document.querySelector("#productEditorTitle");
const editorStatus = document.querySelector("#editorStatus");
const closeProductEditor = document.querySelector("#closeProductEditor");
const archiveProductButton = document.querySelector("#archiveProductButton");
const deleteProductButton = document.querySelector("#deleteProductButton");
const duplicateProductButton = document.querySelector("#duplicateProductButton");
const categorySuggestions = document.querySelector("#categorySuggestions");
const productImageFile = document.querySelector("#productImageFile");
const productImagePreview = document.querySelector("#productImagePreview");
const productImageCaption = document.querySelector("#productImageCaption");

const fields = {
  id: document.querySelector("#productId"),
  nameTh: document.querySelector("#productNameTh"),
  nameEn: document.querySelector("#productNameEn"),
  slug: document.querySelector("#productSlug"),
  model: document.querySelector("#productModel"),
  category: document.querySelector("#productCategory"),
  status: document.querySelector("#productStatus"),
  sortOrder: document.querySelector("#productSortOrder"),
  image: document.querySelector("#productImage"),
  descTh: document.querySelector("#productDescTh"),
  descEn: document.querySelector("#productDescEn"),
  features: document.querySelector("#productFeatures"),
  featured: document.querySelector("#productFeatured")
};

let supabaseClient = null;
let adminProducts = [];
let adminDataMode = "static";
let adminRevisions = [];
let siteDraft = loadSiteDraft();
let selectedLayoutBlockId = "hero";

const siteDraftDefaults = {
  home: {
    heroTitle: "ค้นหาเครื่องจักรและวัสดุขัดที่เหมาะกับงานของคุณ",
    heroText: "ค้นหาจากชื่อสินค้า รุ่น ประเภทเครื่อง หรือวัสดุขัด",
    ctaText: "ส่งรูปชิ้นงาน วัสดุ ปัญหาผิว และผลลัพธ์ที่ต้องการมาให้ทีมงานช่วยแนะนำ",
    sectionMode: "all"
  },
  contact: {
    office: "02-194-4346-7",
    mobile: "086-399-0785",
    line: "@rpvofficial",
    email: "sales@rpv.co.th",
    address: "21/62 หมู่ 3 ถ.345 ซ.ลำโพ 1 ต.ลำโพ อ.บางบัวทอง จ.นนทบุรี 11110"
  },
  appearance: {
    theme: "rpv-green",
    columns: "4",
    hero: "search"
  },
  pages: [
    {
      id: "home",
      menuLabel: "HOME",
      title: "RPV Industrial Supply",
      description: "หน้าแรกสำหรับแนะนำสินค้า เครื่องขัดผิว วัสดุขัด และช่องทางติดต่อ RPV",
      path: "../index.html",
      status: "published"
    },
    {
      id: "about",
      menuLabel: "ABOUT",
      title: "About RPV",
      description: "ข้อมูลบริษัท ประสบการณ์ และความเชี่ยวชาญของ RPV",
      path: "../about.html",
      status: "published"
    },
    {
      id: "products",
      menuLabel: "PRODUCTS",
      title: "Products",
      description: "รายการสินค้า หมวดสินค้า และรายละเอียดสินค้าอุตสาหกรรม",
      path: "../products.html",
      status: "published"
    },
    {
      id: "solutions",
      menuLabel: "SERVICE",
      title: "Service",
      description: "บริการให้คำแนะนำการเลือกเครื่องจักร วัสดุขัด และการแก้ปัญหาผิวงาน",
      path: "../solutions.html",
      status: "published"
    },
    {
      id: "contact",
      menuLabel: "CONTACT",
      title: "Contact RPV",
      description: "ข้อมูลติดต่อ เบอร์โทร LINE Email และที่อยู่บริษัท",
      path: "../contact.html",
      status: "published"
    }
  ]
};

function loadSiteDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem("rpvSiteDraft") || "null");
    return draft && typeof draft === "object" ? draft : {};
  } catch {
    localStorage.removeItem("rpvSiteDraft");
    return {};
  }
}

function mergedSiteDraft() {
  return {
    home: { ...siteDraftDefaults.home, ...(siteDraft.home || {}) },
    contact: { ...siteDraftDefaults.contact, ...(siteDraft.contact || {}) },
    appearance: { ...siteDraftDefaults.appearance, ...(siteDraft.appearance || {}) },
    pages: Array.isArray(siteDraft.pages) ? siteDraft.pages : siteDraftDefaults.pages
  };
}

function persistSiteDraft() {
  localStorage.setItem("rpvSiteDraft", JSON.stringify(siteDraft));
}

function pageDrafts() {
  return mergedSiteDraft().pages;
}

function defaultPageLayout(pageId) {
  if (pageId === "home") {
    return [
      {
        id: "hero",
        label: "Hero Banner",
        type: "banner",
        width: "full",
        visible: true,
        title: "RPV PRODUCT SEARCH",
        text: "Search machines, media, models, and product categories."
      },
      {
        id: "categories",
        label: "Quick Categories",
        type: "tools",
        width: "full",
        visible: true,
        title: "Choose product category",
        text: "Filter products directly from the home page."
      },
      {
        id: "featured",
        label: "Product Grid",
        type: "products",
        width: "full",
        visible: true,
        title: "Product list",
        text: "Show featured machines and finishing media."
      },
      {
        id: "contact",
        label: "Contact CTA",
        type: "contact",
        width: "full",
        visible: true,
        title: "Contact RPV",
        text: "Send your part photo or surface problem to our team."
      }
    ];
  }

  if (pageId === "products") {
    return [
      { id: "product-title", label: "Product Header", type: "text", width: "full", visible: true, title: "Products", text: "All RPV product categories." },
      { id: "filters", label: "Category Filters", type: "tools", width: "third", visible: true, title: "Filters", text: "Search and category tools." },
      { id: "grid", label: "Product Grid", type: "products", width: "two-third", visible: true, title: "Product Grid", text: "Product cards." }
    ];
  }

  return [
    { id: "page-title", label: "Page Header", type: "text", width: "full", visible: true, title: "Page Header", text: "Main page heading." },
    { id: "main-content", label: "Main Content", type: "text", width: "two-third", visible: true, title: "Main Content", text: "Page body content." },
    { id: "side-info", label: "Side Information", type: "contact", width: "third", visible: true, title: "Side Information", text: "Contact or supporting details." }
  ];
}

function pageLayout(page) {
  const defaults = defaultPageLayout(page?.id);
  if (!Array.isArray(page?.layout) || !page.layout.length) return defaults;

  const saved = page.layout.map((block) => {
    const matchingDefault = defaults.find((item) => item.id === block.id) || {};
    return { ...matchingDefault, ...block };
  });
  const missingDefaults = defaults.filter((block) => !saved.some((item) => item.id === block.id));
  return [...saved, ...missingDefaults];
}

function ensurePageManager() {
  if (!adminDashboard || document.querySelector("#page-manager")) return;

  const navTarget = document.querySelector('[data-admin-nav="home-page"]');
  if (navTarget) {
    const pageNav = document.createElement("a");
    pageNav.href = "#page-manager";
    pageNav.dataset.adminNav = "page-manager";
    pageNav.textContent = "จัดการหน้าเว็บ";
    navTarget.before(pageNav);
  }

  const stats = document.querySelector(".admin-stats");
  const section = document.createElement("section");
  section.className = "admin-panel";
  section.id = "page-manager";
  section.dataset.adminSection = "page-manager";
  section.hidden = true;
  section.innerHTML = `
    <div class="admin-panel-head">
      <div>
        <h2>จัดการหน้าเว็บ</h2>
        <p class="admin-panel-note">เลือกหน้าที่ต้องการแก้ แล้วปรับชื่อเมนู หัวข้อ ข้อความ และสถานะได้ทันที</p>
      </div>
      <button class="button secondary" type="button" id="savePageDraftButton">บันทึกหน้าเว็บ Draft</button>
    </div>
    <div class="admin-page-manager">
      <div class="admin-page-list" id="adminPageList" aria-label="รายการหน้าเว็บ"></div>
      <form class="admin-page-editor" id="adminPageEditor">
        <input type="hidden" id="pageEditorId">
        <label>ชื่อเมนู<input type="text" id="pageMenuLabel" required></label>
        <label>หัวข้อหน้า<input type="text" id="pageTitle" required></label>
        <label>คำอธิบายหน้า<textarea id="pageDescription" rows="4"></textarea></label>
        <label>ลิงก์หน้าเว็บ<input type="text" id="pagePath" readonly></label>
        <label>สถานะหน้า
          <select id="pageStatus">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <div class="admin-layout-builder">
          <div class="admin-layout-head">
            <strong>Layout Builder</strong>
            <small>เลือกบล็อก แล้วย้ายขึ้น ลง ซ้าย ขวา หรือซ่อนได้</small>
          </div>
          <div class="admin-layout-canvas" id="layoutCanvas" aria-label="Layout blocks"></div>
        </div>
        <div class="admin-block-editor" id="blockEditor" hidden>
          <strong>Edit selected UI block</strong>
          <label>Block name<input type="text" id="blockLabel"></label>
          <label>Block type
            <select id="blockType">
              <option value="banner">Hero / Banner</option>
              <option value="text">Text</option>
              <option value="tools">Search / Filter</option>
              <option value="products">Products</option>
              <option value="contact">Contact CTA</option>
            </select>
          </label>
          <label>Title<input type="text" id="blockTitle"></label>
          <label>Text<textarea id="blockText" rows="3"></textarea></label>
        </div>
        <div class="admin-page-canvas-wrap">
          <div class="admin-layout-head">
            <strong>Home UI preview</strong>
            <small>This is the main page UI inside admin. Changes update here.</small>
          </div>
          <div class="admin-page-canvas" id="pageCanvasPreview"></div>
        </div>
        <div class="admin-editor-actions compact">
          <a class="button secondary" id="previewPageLink" href="../index.html" target="_blank" rel="noopener">Preview</a>
          <button class="button primary" type="submit">บันทึก Draft</button>
        </div>
        <p class="admin-action-status" id="pageDraftStatus" role="status"></p>
      </form>
    </div>
  `;

  if (stats) {
    stats.after(section);
  } else {
    adminDashboard.prepend(section);
  }

  adminNavLinks = document.querySelectorAll("[data-admin-nav]");
  adminSections = document.querySelectorAll("[data-admin-section]");
  wirePageManager();
}

function fillPageEditor(pageId = pageDrafts()[0]?.id) {
  const page = pageDrafts().find((item) => item.id === pageId) || pageDrafts()[0];
  if (!page) return;

  setControlValue("#pageEditorId", page.id);
  setControlValue("#pageMenuLabel", page.menuLabel);
  setControlValue("#pageTitle", page.title);
  setControlValue("#pageDescription", page.description);
  setControlValue("#pagePath", page.path);
  setControlValue("#pageStatus", page.status);
  const preview = document.querySelector("#previewPageLink");
  if (preview) preview.href = page.path;
  renderPageList(page.id);
  renderLayoutCanvas(page);
  updateAdminSidePreview("page-manager");
}

function renderPageList(activeId = document.querySelector("#pageEditorId")?.value) {
  const list = document.querySelector("#adminPageList");
  if (!list) return;

  list.innerHTML = pageDrafts().map((page) => `
    <button class="admin-page-card${page.id === activeId ? " is-active" : ""}" type="button" data-edit-page="${escapeHtml(page.id)}">
      <span>${escapeHtml(page.menuLabel)}</span>
      <strong>${escapeHtml(page.title)}</strong>
      <small>${escapeHtml(page.status)} · ${escapeHtml(page.path.replace("../", ""))}</small>
    </button>
  `).join("");
}

function currentEditedPage() {
  const currentId = readControl("#pageEditorId", "home");
  return pageDrafts().find((page) => page.id === currentId) || pageDrafts()[0];
}

function renderLayoutCanvas(page = currentEditedPage()) {
  const canvas = document.querySelector("#layoutCanvas");
  if (!canvas || !page) return;

  canvas.innerHTML = pageLayout(page).map((block, index) => `
    <article class="admin-layout-block ${escapeHtml(block.width)}${block.visible === false ? " is-hidden" : ""}" data-layout-block="${escapeHtml(block.id)}">
      <div>
        <span>${escapeHtml(block.type)}</span>
        <strong>${escapeHtml(block.label)}</strong>
        <small>${escapeHtml(block.width)}${block.visible === false ? " · hidden" : ""}</small>
      </div>
      <div class="admin-layout-actions">
        <button type="button" title="Up" data-layout-action="up" data-layout-index="${index}">↑</button>
        <button type="button" title="Down" data-layout-action="down" data-layout-index="${index}">↓</button>
        <button type="button" title="Left / smaller" data-layout-action="left" data-layout-index="${index}">←</button>
        <button type="button" title="Right / wider" data-layout-action="right" data-layout-index="${index}">→</button>
        <button type="button" title="Hide / show" data-layout-action="toggle" data-layout-index="${index}">◐</button>
        <button type="button" title="Delete" data-layout-action="delete" data-layout-index="${index}">×</button>
      </div>
    </article>
  `).join("");
  canvas.querySelector(`[data-layout-block="${CSS.escape(selectedLayoutBlockId)}"]`)?.classList.add("is-selected");
  hydrateBlockEditor(page);
  renderPageCanvasPreview(page);
}

function currentSelectedBlock(page = currentEditedPage()) {
  const layout = pageLayout(page);
  return layout.find((block) => block.id === selectedLayoutBlockId) || layout[0];
}

function hydrateBlockEditor(page = currentEditedPage()) {
  const editor = document.querySelector("#blockEditor");
  const block = currentSelectedBlock(page);
  if (!editor || !block) return;

  editor.hidden = false;
  setControlValue("#blockLabel", block.label);
  setControlValue("#blockType", block.type);
  setControlValue("#blockTitle", block.title || block.label);
  setControlValue("#blockText", block.text || "");
}

function updateSelectedBlock(values) {
  const currentId = readControl("#pageEditorId", "home");
  const pages = pageDrafts().map((page) => {
    if (page.id !== currentId) return page;
    const layout = pageLayout(page).map((block) => (
      block.id === selectedLayoutBlockId ? { ...block, ...values } : block
    ));
    return { ...page, layout };
  });

  siteDraft = { ...siteDraft, pages };
  persistSiteDraft();
  const page = pages.find((item) => item.id === currentId);
  renderLayoutCanvas(page);
  updateAdminSidePreview("page-manager");
}

function renderPageCanvasPreview(page = currentEditedPage()) {
  const preview = document.querySelector("#pageCanvasPreview");
  if (!preview || !page) return;

  const blocks = pageLayout(page).filter((block) => block.visible !== false);
  preview.innerHTML = `
    <div class="admin-web-preview-header">
      <strong>RPV INDUSTRIAL SUPPLY</strong>
      <span>${escapeHtml(readControl("#pageMenuLabel", page.menuLabel || "HOME"))}</span>
    </div>
    <div class="admin-web-preview-grid">
      ${blocks.map(renderPreviewBlock).join("")}
    </div>
  `;
}

function renderPreviewBlock(block) {
  const title = escapeHtml(block.title || block.label);
  const text = escapeHtml(block.text || "");
  const selected = block.id === selectedLayoutBlockId ? " is-selected" : "";

  if (block.type === "banner") {
    return `
      <section class="admin-web-block admin-web-hero ${escapeHtml(block.width)}${selected}" data-select-block="${escapeHtml(block.id)}">
        <small>${escapeHtml(block.label)}</small>
        <h3>${title}</h3>
        <p>${text}</p>
        <div class="admin-web-search">Search products, model, category</div>
      </section>
    `;
  }

  if (block.type === "tools") {
    return `
      <section class="admin-web-block admin-web-tools ${escapeHtml(block.width)}${selected}" data-select-block="${escapeHtml(block.id)}">
        <h3>${title}</h3>
        <p>${text}</p>
        <div><span>Machines</span><span>Media</span><span>Parts</span></div>
      </section>
    `;
  }

  if (block.type === "products") {
    return `
      <section class="admin-web-block admin-web-products ${escapeHtml(block.width)}${selected}" data-select-block="${escapeHtml(block.id)}">
        <h3>${title}</h3>
        <p>${text}</p>
        <div class="admin-web-product-grid"><span></span><span></span><span></span><span></span></div>
      </section>
    `;
  }

  if (block.type === "contact") {
    return `
      <section class="admin-web-block admin-web-contact ${escapeHtml(block.width)}${selected}" data-select-block="${escapeHtml(block.id)}">
        <small>${escapeHtml(block.label)}</small>
        <h3>${title}</h3>
        <p>${text}</p>
        <div class="admin-web-buttons"><span>LINE</span><span>Call</span></div>
      </section>
    `;
  }

  return `
    <section class="admin-web-block ${escapeHtml(block.width)}${selected}" data-select-block="${escapeHtml(block.id)}">
      <small>${escapeHtml(block.label)}</small>
      <h3>${title}</h3>
      <p>${text}</p>
    </section>
  `;
}

function updateCurrentPageLayout(updater) {
  const currentId = readControl("#pageEditorId", "home");
  const pages = pageDrafts().map((page) => {
    if (page.id !== currentId) return page;
    return { ...page, layout: updater([...pageLayout(page)]) };
  });

  siteDraft = { ...siteDraft, pages };
  persistSiteDraft();
  const page = pages.find((item) => item.id === currentId);
  renderPageList(currentId);
  renderLayoutCanvas(page);
  updateAdminSidePreview("page-manager");
}

function resizeBlockWidth(width, direction) {
  const order = ["third", "half", "two-third", "full"];
  const current = Math.max(0, order.indexOf(width));
  const next = direction === "right"
    ? Math.min(order.length - 1, current + 1)
    : Math.max(0, current - 1);
  return order[next];
}

function handleLayoutAction(action, index) {
  updateCurrentPageLayout((layout) => {
    const block = layout[index];
    if (!block) return layout;

    if (action === "up" && index > 0) {
      [layout[index - 1], layout[index]] = [layout[index], layout[index - 1]];
    }
    if (action === "down" && index < layout.length - 1) {
      [layout[index + 1], layout[index]] = [layout[index], layout[index + 1]];
    }
    if (action === "left" || action === "right") {
      layout[index] = { ...block, width: resizeBlockWidth(block.width, action) };
    }
    if (action === "toggle") {
      layout[index] = { ...block, visible: block.visible === false };
    }
    if (action === "delete") {
      layout.splice(index, 1);
    }

    return layout;
  });
}

function saveCurrentPageDraft() {
  const currentId = readControl("#pageEditorId", "home");
  const currentPages = pageDrafts();
  const pages = currentPages.map((page) => {
    if (page.id !== currentId) return page;
    return {
      ...page,
      menuLabel: readControl("#pageMenuLabel", page.menuLabel),
      title: readControl("#pageTitle", page.title),
      description: readControl("#pageDescription", page.description),
      status: readControl("#pageStatus", page.status),
      layout: pageLayout(page)
    };
  });

  siteDraft = { ...siteDraft, pages };
  persistSiteDraft();
  renderPageList(currentId);
  setStatus(document.querySelector("#pageDraftStatus"), "บันทึกหน้าเว็บ Draft แล้ว");
  recordRevision(`Saved page draft: ${currentId}`);
  updateAdminSidePreview("page-manager");
}

function wirePageManager() {
  document.querySelector("#adminPageList")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-page]");
    if (button) fillPageEditor(button.dataset.editPage);
  });

  document.querySelector("#adminPageEditor")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCurrentPageDraft();
  });

  document.querySelector("#savePageDraftButton")?.addEventListener("click", saveCurrentPageDraft);
  document.querySelector("#layoutCanvas")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-layout-action]");
    if (button) {
      const block = button.closest("[data-layout-block]");
      if (block) selectedLayoutBlockId = block.dataset.layoutBlock;
      handleLayoutAction(button.dataset.layoutAction, Number(button.dataset.layoutIndex));
      return;
    }

    const block = event.target.closest("[data-layout-block]");
    if (!block) return;
    selectedLayoutBlockId = block.dataset.layoutBlock;
    renderLayoutCanvas(currentEditedPage());
    updateAdminSidePreview("page-manager");
  });

  document.querySelector("#pageCanvasPreview")?.addEventListener("click", (event) => {
    const block = event.target.closest("[data-select-block]");
    if (!block) return;
    selectedLayoutBlockId = block.dataset.selectBlock;
    renderLayoutCanvas(currentEditedPage());
    updateAdminSidePreview("page-manager");
  });

  ["#blockLabel", "#blockType", "#blockTitle", "#blockText"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("change", () => {
      updateSelectedBlock({
        label: readControl("#blockLabel", "Block"),
        type: readControl("#blockType", "text"),
        title: readControl("#blockTitle", ""),
        text: readControl("#blockText", "")
      });
    });
  });
  fillPageEditor();
}

function setControlValue(selector, value) {
  const control = document.querySelector(selector);
  if (control) control.value = value ?? "";
}

function readControl(selector, fallback = "") {
  const control = document.querySelector(selector);
  return control ? control.value.trim() || fallback : fallback;
}

function getControlValue(control, fallback = "") {
  return control ? control.value.trim() || fallback : fallback;
}

function sectionControls(sectionId) {
  const section = document.querySelector(`[data-admin-section="${sectionId}"]`);
  return section ? [...section.querySelectorAll("input, textarea, select")] : [];
}

function ensureAdminPreview() {
  if (adminSidePreview || !adminDashboard) return;
  adminSidePreview = document.createElement("aside");
  adminSidePreview.className = "admin-side-preview";
  adminSidePreview.setAttribute("aria-live", "polite");
  adminDashboard.appendChild(adminSidePreview);
}

function ensureEditorPreview() {
  if (editorLivePreview || !editorForm) return;
  editorLivePreview = document.createElement("aside");
  editorLivePreview.className = "admin-live-preview admin-product-preview";
  editorLivePreview.innerHTML = `
    <p class="admin-kicker">LIVE PREVIEW</p>
    <figure class="admin-preview-product-image">
      <img id="editorPreviewImage" alt="">
      <span id="editorPreviewPlaceholder">No image</span>
    </figure>
    <small id="editorPreviewCategory"></small>
    <h3 id="editorPreviewName"></h3>
    <p id="editorPreviewModel"></p>
    <p id="editorPreviewDesc"></p>
    <div class="admin-preview-actions"><span>ดูรายละเอียด</span><span>LINE</span></div>
  `;
  editorForm.insertBefore(editorLivePreview, editorForm.querySelector(".admin-editor-actions"));
}

function updateProductEditorPreview() {
  ensureEditorPreview();
  if (!editorLivePreview) return;

  const image = getControlValue(fields.image);
  const previewImage = editorLivePreview.querySelector("#editorPreviewImage");
  const placeholder = editorLivePreview.querySelector("#editorPreviewPlaceholder");

  previewImage.src = image;
  previewImage.hidden = !image;
  placeholder.hidden = Boolean(image);
  editorLivePreview.querySelector("#editorPreviewCategory").textContent = getControlValue(fields.category, "Category");
  editorLivePreview.querySelector("#editorPreviewName").textContent = getControlValue(fields.nameTh, getControlValue(fields.nameEn, "ชื่อสินค้า"));
  editorLivePreview.querySelector("#editorPreviewModel").textContent = getControlValue(fields.model, "Model / รุ่น");
  editorLivePreview.querySelector("#editorPreviewDesc").textContent = getControlValue(fields.descTh, getControlValue(fields.descEn, "คำอธิบายสั้นของสินค้า"));
}

function updateAdminSidePreview(sectionId = (window.location.hash || "#dashboard").slice(1)) {
  ensureAdminPreview();
  if (!adminSidePreview) return;

  const controls = sectionControls(sectionId);
  const values = controls.map((control) => getControlValue(control)).filter(Boolean);

  if (sectionId === "page-manager") {
    const page = pageDrafts().find((item) => item.id === readControl("#pageEditorId", "home")) || pageDrafts()[0];
    const blocks = pageLayout(page).filter((block) => block.visible !== false);
    adminSidePreview.innerHTML = `
      <p class="admin-kicker">PAGE PREVIEW</p>
      <div class="admin-page-preview">
        <small>${escapeHtml(readControl("#pageStatus", page?.status || "published"))}</small>
        <h3>${escapeHtml(readControl("#pageTitle", page?.title || "Page title"))}</h3>
        <p>${escapeHtml(readControl("#pageDescription", page?.description || "Page description"))}</p>
        <strong>${escapeHtml(readControl("#pageMenuLabel", page?.menuLabel || "MENU"))}</strong>
        <div class="admin-layout-mini">
          ${blocks.map((block) => `<span class="${escapeHtml(block.width)}">${escapeHtml(block.label)}</span>`).join("")}
        </div>
      </div>
    `;
    return;
  }

  if (sectionId === "home-page") {
    adminSidePreview.innerHTML = `
      <p class="admin-kicker">LIVE PREVIEW</p>
      <div class="admin-preview-hero">
        <small>RPV PRODUCT SEARCH</small>
        <h3>${escapeHtml(values[0] || "ค้นหาเครื่องจักรและวัสดุขัด")}</h3>
        <p>${escapeHtml(values[1] || "ค้นหาจากชื่อสินค้า รุ่น หรือหมวดสินค้า")}</p>
        <div class="admin-preview-search">ค้นหาชื่อสินค้า รุ่น หรือหมวดสินค้า</div>
      </div>
      <div class="admin-preview-cta"><strong>CONTACT RPV</strong><p>${escapeHtml(values[2] || "ส่งรูปชิ้นงานให้ทีมงานช่วยแนะนำ")}</p></div>
    `;
    return;
  }

  if (sectionId === "contact") {
    adminSidePreview.innerHTML = `
      <p class="admin-kicker">LIVE PREVIEW</p>
      <div class="admin-contact-preview">
        <h3>Contact</h3>
        <p>Office: ${escapeHtml(values[0] || "02-194-4346-7")}</p>
        <p>Mobile: ${escapeHtml(values[1] || "086-399-0785")}</p>
        <p>LINE: ${escapeHtml(values[2] || "@rpvofficial")}</p>
        <p>Email: ${escapeHtml(values[3] || "sales@rpv.co.th")}</p>
        <small>${escapeHtml(values[4] || "Address")}</small>
      </div>
    `;
    return;
  }

  if (sectionId === "appearance") {
    const columns = values[1]?.includes("3") ? 3 : 4;
    adminSidePreview.innerHTML = `
      <p class="admin-kicker">LIVE PREVIEW</p>
      <div class="admin-appearance-sample">
        <h3>${escapeHtml(values[2] || "Search Hero")}</h3>
        <div class="admin-preview-grid" style="grid-template-columns: repeat(${columns}, minmax(0, 1fr));">
          <span></span><span></span><span></span><span></span>
        </div>
        <small>${escapeHtml(values[0] || "RPV Green")} / ${columns} columns</small>
      </div>
    `;
    return;
  }

  if (sectionId === "products") {
    const first = filteredProducts()[0] || adminProducts[0];
    adminSidePreview.innerHTML = `
      <p class="admin-kicker">LIVE PREVIEW</p>
      <div class="admin-preview-product-mini">
        <strong>${escapeHtml(first?.name_th || first?.name_en || "เลือกสินค้าเพื่อดู Preview")}</strong>
        <p>${escapeHtml(first?.model || "Model")}</p>
        <small>${escapeHtml(first?.category || first?.categories?.name_th || "Category")}</small>
      </div>
    `;
    return;
  }

  adminSidePreview.innerHTML = `
    <p class="admin-kicker">LIVE PREVIEW</p>
    <div class="admin-preview-empty">
      <strong>${escapeHtml(sectionId || "Dashboard")}</strong>
      <p>เลือกเมนู Home Page, Contact, Appearance หรือ Products เพื่อดูตัวอย่างแบบ realtime</p>
    </div>
  `;
}

function showAdminSection(sectionId = "dashboard") {
  const target = sectionId || "dashboard";

  adminSections.forEach((section) => {
    section.hidden = section.dataset.adminSection !== target;
  });

  adminNavLinks.forEach((link) => {
    const isActive = link.dataset.adminNav === target;
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (window.location.hash !== `#${target}`) {
    history.replaceState(null, "", `#${target}`);
  }
  updateAdminSidePreview(target);
}

function recordRevision(message) {
  adminRevisions.unshift({
    message,
    time: new Date().toLocaleString("th-TH")
  });

  if (!revisionList) return;
  revisionList.innerHTML = adminRevisions.length
    ? adminRevisions.map((item) => `<li><strong>${escapeHtml(item.time)}</strong> ${escapeHtml(item.message)}</li>`).join("")
    : "<li>ยังไม่มี revision ในรอบนี้</li>";
}

function productToAdmin(product) {
  return {
    id: product.id,
    slug: product.slug || product.id,
    name_th: product.nameTh || "",
    name_en: product.nameEn || "",
    model: product.model || "",
    category: product.category || "",
    short_description_th: product.shortDescriptionTh || "",
    short_description_en: product.shortDescriptionEn || "",
    features: Array.isArray(product.features) ? product.features : [],
    image: product.image || "",
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    featured: Boolean(product.featured),
    status: product.status === "active" ? "published" : product.status || "draft",
    sort_order: product.sortOrder || 100,
    categories: {
      name_th: product.category || "",
      name_en: product.category || ""
    }
  };
}

function adminToProduct(product) {
  const status = product.status === "published" ? "active" : product.status;
  return {
    id: product.id,
    slug: product.slug,
    nameTh: product.name_th,
    nameEn: product.name_en,
    model: product.model || "",
    category: product.category || product.categories?.name_th || "",
    shortDescriptionTh: product.short_description_th || "",
    shortDescriptionEn: product.short_description_en || "",
    features: Array.isArray(product.features) ? product.features : [],
    specifications: product.specifications || {},
    image: product.image || "",
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    featured: Boolean(product.featured),
    status,
    sortOrder: Number(product.sort_order) || 100
  };
}

function staticProductsFallback() {
  try {
    const savedDraft = JSON.parse(localStorage.getItem("rpvProductsDraft") || "null");
    if (Array.isArray(savedDraft)) {
      return savedDraft.map(productToAdmin).sort((a, b) => (a.sort_order || 100) - (b.sort_order || 100));
    }
  } catch {
    localStorage.removeItem("rpvProductsDraft");
  }

  return (window.rpvProducts || [])
    .map(productToAdmin)
    .sort((a, b) => (a.sort_order || 100) - (b.sort_order || 100));
}

function persistStaticProducts() {
  const products = adminProducts.map(adminToProduct);
  localStorage.setItem("rpvProductsDraft", JSON.stringify(products));
}

function hydrateSiteDraftControls() {
  const draft = mergedSiteDraft();
  setControlValue("#homeHeroTitle", draft.home.heroTitle);
  setControlValue("#homeHeroText", draft.home.heroText);
  setControlValue("#homeCtaText", draft.home.ctaText);
  setControlValue("#homeSectionMode", draft.home.sectionMode);
  setControlValue("#contactOffice", draft.contact.office);
  setControlValue("#contactMobile", draft.contact.mobile);
  setControlValue("#contactLine", draft.contact.line);
  setControlValue("#contactEmail", draft.contact.email);
  setControlValue("#contactAddress", draft.contact.address);
  setControlValue("#appearanceTheme", draft.appearance.theme);
  setControlValue("#appearanceColumns", draft.appearance.columns);
  setControlValue("#appearanceHero", draft.appearance.hero);
}

function saveSiteSection(sectionName) {
  const draft = mergedSiteDraft();

  if (sectionName === "home") {
    siteDraft = {
      ...siteDraft,
      home: {
        heroTitle: readControl("#homeHeroTitle", draft.home.heroTitle),
        heroText: readControl("#homeHeroText", draft.home.heroText),
        ctaText: readControl("#homeCtaText", draft.home.ctaText),
        sectionMode: readControl("#homeSectionMode", draft.home.sectionMode)
      }
    };
    setStatus(document.querySelector("#homeDraftStatus"), "บันทึก Home draft แล้ว รีเฟรชหน้าเว็บหลักเพื่อดูผล");
    recordRevision("Saved Home Page draft");
  }

  if (sectionName === "contact") {
    siteDraft = {
      ...siteDraft,
      contact: {
        office: readControl("#contactOffice", draft.contact.office),
        mobile: readControl("#contactMobile", draft.contact.mobile),
        line: readControl("#contactLine", draft.contact.line),
        email: readControl("#contactEmail", draft.contact.email),
        address: readControl("#contactAddress", draft.contact.address)
      }
    };
    setStatus(document.querySelector("#contactDraftStatus"), "บันทึก Contact draft แล้ว รีเฟรชหน้าเว็บหลักเพื่อดูผล");
    recordRevision("Saved Contact draft");
  }

  if (sectionName === "appearance") {
    siteDraft = {
      ...siteDraft,
      appearance: {
        theme: readControl("#appearanceTheme", draft.appearance.theme),
        columns: readControl("#appearanceColumns", draft.appearance.columns),
        hero: readControl("#appearanceHero", draft.appearance.hero)
      }
    };
    setStatus(document.querySelector("#appearanceDraftStatus"), "บันทึก Appearance draft แล้ว รีเฟรชหน้าเว็บหลักเพื่อดูผล");
    recordRevision("Saved Appearance draft");
  }

  persistSiteDraft();
  setStatus(adminActionStatus, "บันทึก draft แล้ว หน้าเว็บหลักใน browser นี้จะเปลี่ยนหลัง refresh ถ้าต้องการให้ทุกคนเห็นต้องเชื่อม Supabase หรือแก้ไฟล์จริงแล้ว push");
  updateAdminSidePreview(sectionName === "home" ? "home-page" : sectionName);
}

function renameCategory(oldName) {
  const nextName = window.prompt(`เปลี่ยนชื่อหมวดหมู่ "${oldName}" เป็น`, oldName);
  if (!nextName || nextName.trim() === oldName) return;

  adminProducts = adminProducts.map((product) => {
    const current = product.category || product.categories?.name_th || "";
    if (current !== oldName) return product;
    return {
      ...product,
      category: nextName.trim(),
      categories: {
        name_th: nextName.trim(),
        name_en: nextName.trim()
      }
    };
  });
  persistStaticProducts();
  recordRevision(`Renamed category: ${oldName} -> ${nextName.trim()}`);
  refreshAdminView(`เปลี่ยนหมวด "${oldName}" เป็น "${nextName.trim()}" แล้ว`);
}

function hideCategory(categoryName) {
  const count = adminProducts.filter((product) => (product.category || product.categories?.name_th) === categoryName).length;
  const confirmed = window.confirm(`ซ่อนสินค้าทั้งหมดในหมวด "${categoryName}" จำนวน ${count} รายการใช่ไหม?`);
  if (!confirmed) return;

  adminProducts = adminProducts.map((product) => {
    const current = product.category || product.categories?.name_th || "";
    return current === categoryName ? { ...product, status: "hidden" } : product;
  });
  persistStaticProducts();
  recordRevision(`Hidden category products: ${categoryName}`);
  refreshAdminView(`ซ่อนสินค้าในหมวด "${categoryName}" แล้ว`);
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "") || `product-${Date.now()}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? "#b42318" : "";
}

function updateImagePreview(value) {
  if (!productImagePreview || !productImageCaption) return;
  const imageValue = String(value || "").trim();
  productImagePreview.src = imageValue;
  productImagePreview.alt = imageValue ? "ตัวอย่างรูปสินค้า" : "";
  productImageCaption.textContent = imageValue
    ? (imageValue.startsWith("data:") ? "รูปที่เลือกจากเครื่อง" : imageValue)
    : "ยังไม่มีรูปสินค้า";
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function isAllowedImageFile(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const lowerName = file.name.toLowerCase();
  return allowedTypes.includes(file.type)
    || allowedExtensions.some((extension) => lowerName.endsWith(extension));
}

function setAdminMode(mode) {
  adminDataMode = mode;
  if (settingDataMode) {
    settingDataMode.textContent = mode === "static"
      ? "Data mode: Static fallback"
      : "Data mode: Supabase database";
  }

  if (mode === "static") {
    if (adminModeText) {
      adminModeText.textContent = "กำลังแสดงข้อมูลจากไฟล์เว็บเดิม แก้แล้วหน้าเว็บใน browser นี้จะเปลี่ยนทันที ถ้าจะให้ทุกเครื่องเห็นต้อง Export/push หรือเชื่อม Supabase";
    }
    adminModeBanner?.classList.remove("is-live");
    return;
  }

  if (adminModeText) {
    adminModeText.textContent = "กำลังแสดงข้อมูลจาก Supabase สามารถจัดการข้อมูลตามสิทธิ์ผู้ใช้ได้";
  }
  adminModeBanner?.classList.add("is-live");
}

async function loadSupabase() {
  if (!isConfigured) return null;
  const module = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  return module.createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
}

async function getClient() {
  if (supabaseClient) return supabaseClient;
  supabaseClient = await loadSupabase();
  return supabaseClient;
}

async function getAdminProfile(client) {
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError || !sessionData.session) {
    return { session: null, profile: null, error: sessionError };
  }

  const { data: profile, error } = await client
    .from("admin_profiles")
    .select("user_id, display_name, role, status")
    .eq("user_id", sessionData.session.user.id)
    .eq("status", "active")
    .single();

  return { session: sessionData.session, profile, error };
}

function renderStats(products) {
  const published = products.filter((item) => item.status === "published").length;
  const draft = products.filter((item) => item.status === "draft").length;
  const hidden = products.filter((item) => item.status === "hidden").length;

  if (statProducts) statProducts.textContent = String(products.length);
  if (statPublished) statPublished.textContent = String(published);
  if (statDraft) statDraft.textContent = String(draft);
  if (statHidden) statHidden.textContent = String(hidden);
}

function filteredProducts() {
  const keyword = (productSearch?.value || "").trim().toLowerCase();
  const status = statusFilter?.value || "";

  return adminProducts.filter((product) => {
    const searchable = [
      product.name_th,
      product.name_en,
      product.model,
      product.category,
      product.categories?.name_th,
      product.categories?.name_en
    ].filter(Boolean).join(" ").toLowerCase();

    return (!keyword || searchable.includes(keyword))
      && (!status || product.status === status);
  });
}

function renderCategorySuggestions() {
  if (!categorySuggestions) return;
  const categories = [...new Set(adminProducts.map((product) => product.category || product.categories?.name_th).filter(Boolean))].sort();
  categorySuggestions.innerHTML = categories.map((category) => `<option value="${escapeHtml(category)}"></option>`).join("");
}

function renderCategories() {
  if (!adminCategoriesList) return;
  const categoryMap = new Map();

  adminProducts.forEach((product) => {
    const category = product.category || product.categories?.name_th || "Uncategorized";
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  const categories = [...categoryMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  adminCategoriesList.innerHTML = categories.length
    ? categories.map(([category, count]) => `
      <article>
        <strong>${escapeHtml(category)}</strong>
        <p>${count} รายการสินค้า</p>
        <div class="admin-row-actions">
          <button class="button secondary" type="button" data-rename-category="${escapeHtml(category)}">แก้ชื่อ</button>
          <button class="button danger" type="button" data-hide-category="${escapeHtml(category)}">ซ่อนหมวด</button>
          <a class="button secondary" href="../index.html#products" target="_blank" rel="noopener">Preview</a>
        </div>
      </article>
    `).join("")
    : "<article><strong>ยังไม่มีหมวดหมู่</strong><p>เพิ่มสินค้าแล้วหมวดหมู่จะแสดงที่นี่</p></article>";
}

function renderMediaLibrary() {
  if (!adminMediaGrid) return;
  const media = adminProducts
    .filter((product) => product.image)
    .map((product) => ({
      image: product.image,
      name: product.name_th || product.name_en || product.model || product.id
    }));

  adminMediaGrid.innerHTML = media.length
    ? media.map((item) => `
      <figure>
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
        <figcaption>${escapeHtml(item.name)}</figcaption>
      </figure>
    `).join("")
    : `<div class="admin-empty-state">
        <strong>ยังไม่มีรูปสินค้า</strong>
        <p>กด Products > แก้ไข แล้วเลือกรูปจากเครื่องเพื่อเพิ่มรูป</p>
      </div>`;
}

function renderProducts() {
  if (!productsBody) return;
  const visible = filteredProducts();

  if (visible.length === 0) {
    productsBody.innerHTML = '<tr><td colspan="6">ไม่พบสินค้า หรือยังไม่มีข้อมูลในฐานข้อมูล</td></tr>';
    return;
  }

  productsBody.innerHTML = visible.map((product) => `
    <tr>
      <td><strong>${escapeHtml(product.name_th || product.name_en)}</strong><br><small>${escapeHtml(product.name_en || "")}</small></td>
      <td>${escapeHtml(product.model || "-")}</td>
      <td>${escapeHtml(product.category || product.categories?.name_th || "-")}</td>
      <td><span class="admin-badge">${escapeHtml(product.status)}</span></td>
      <td>${escapeHtml(product.sort_order ?? "-")}</td>
      <td>
        <div class="admin-row-actions">
          <a class="button secondary" href="../index.html#products" target="_blank" rel="noopener">Preview</a>
          <button class="button danger" type="button" data-delete-product="${escapeHtml(product.id)}">ลบ</button>
          <button class="button primary" type="button" data-edit-product="${escapeHtml(product.id)}">แก้ไข</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function refreshAdminView(message = "") {
  adminProducts.sort((a, b) => (a.sort_order || 100) - (b.sort_order || 100));
  renderStats(adminProducts);
  renderCategorySuggestions();
  renderCategories();
  renderMediaLibrary();
  renderProducts();
  if (message) setStatus(adminActionStatus, message);
}

function showFallbackDashboard() {
  setAdminMode("static");
  adminProducts = staticProductsFallback();
  adminGuard.hidden = true;
  adminDashboard.hidden = false;
  refreshAdminView();
}

async function loadDashboard(client) {
  const { data, error } = await client
    .from("products")
    .select("id, slug, name_th, name_en, model, status, sort_order, featured, cover_image, short_description_th, short_description_en, categories(name_th, name_en)")
    .order("sort_order", { ascending: true });

  if (error) {
    setStatus(guardStatus, "อ่านข้อมูลไม่สำเร็จ ตรวจ RLS และสิทธิ์ Admin", true);
    return;
  }

  adminProducts = (data || []).map((product) => ({
    ...product,
    category: product.categories?.name_th || "",
    image: product.cover_image || ""
  }));
  setAdminMode("database");
  refreshAdminView();
}

function readEditorProduct() {
  const features = fields.features.value
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean);
  const category = fields.category.value.trim();

  return {
    id: fields.id.value || slugify(fields.slug.value || fields.nameEn.value || fields.nameTh.value),
    slug: slugify(fields.slug.value || fields.nameEn.value || fields.nameTh.value),
    name_th: fields.nameTh.value.trim(),
    name_en: fields.nameEn.value.trim(),
    model: fields.model.value.trim(),
    category,
    categories: {
      name_th: category,
      name_en: category
    },
    status: fields.status.value,
    sort_order: Number(fields.sortOrder.value) || adminProducts.length + 1,
    image: fields.image.value.trim(),
    short_description_th: fields.descTh.value.trim(),
    short_description_en: fields.descEn.value.trim(),
    features,
    featured: fields.featured.checked,
    gallery: []
  };
}

function fillEditor(product) {
  fields.id.value = product?.id || "";
  fields.nameTh.value = product?.name_th || "";
  fields.nameEn.value = product?.name_en || "";
  fields.slug.value = product?.slug || "";
  fields.model.value = product?.model || "";
  fields.category.value = product?.category || product?.categories?.name_th || "";
  fields.status.value = product?.status || "draft";
  fields.sortOrder.value = product?.sort_order || adminProducts.length + 1;
  fields.image.value = product?.image || product?.cover_image || "";
  fields.descTh.value = product?.short_description_th || "";
  fields.descEn.value = product?.short_description_en || "";
  fields.features.value = Array.isArray(product?.features) ? product.features.join(", ") : "";
  fields.featured.checked = Boolean(product?.featured);
  if (productImageFile) productImageFile.value = "";
  updateImagePreview(fields.image.value);
  updateProductEditorPreview();
}

function openEditor(product = null) {
  if (!editorDialog) return;
  editorTitle.textContent = product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่";
  fillEditor(product);
  setStatus(editorStatus, "");
  editorDialog.showModal();
  fields.nameTh.focus();
}

function closeEditor() {
  editorDialog?.close();
}

function saveStaticDraft(product) {
  const index = adminProducts.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    adminProducts[index] = product;
  } else {
    adminProducts.push(product);
  }
  persistStaticProducts();
  recordRevision(`Saved product draft: ${product.name_th || product.name_en || product.id}`);
  refreshAdminView("บันทึกแล้ว หน้าเว็บใน browser นี้จะเปลี่ยนทันที รีเฟรชหน้าเว็บเพื่อดูผล");
}

function deleteStaticProduct(productId) {
  const product = adminProducts.find((item) => item.id === productId);
  if (!product) return;

  const productName = product.name_th || product.name_en || product.model || product.id;
  const confirmed = window.confirm(`ลบสินค้า "${productName}" ออกจากไฟล์ Export ใช่ไหม?\n\nถ้ายังไม่ Export และ push เว็บจริงจะยังไม่เปลี่ยน`);
  if (!confirmed) return;

  adminProducts = adminProducts.filter((item) => item.id !== productId);
  persistStaticProducts();
  recordRevision(`Deleted product draft: ${productName}`);
  refreshAdminView("ลบแล้ว หน้าเว็บใน browser นี้จะเปลี่ยนทันที รีเฟรชหน้าเว็บเพื่อดูผล");
  closeEditor();
}

async function saveDatabaseProduct(product) {
  setStatus(editorStatus, "โหมด Supabase ยังต้องต่อฟอร์มกับตาราง products ในระยะถัดไป", true);
  return false;
}

function exportProductsData() {
  const products = adminProducts.map(adminToProduct);
  const fileText = `globalThis.rpvProducts = ${JSON.stringify(products, null, 2)};\n`;
  const blob = new Blob([fileText], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "rpv-products.js";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus(adminActionStatus, "Export แล้ว: เอาไฟล์ rpv-products.js ไปแทนที่ data/rpv-products.js แล้วค่อย push เว็บ");
}

async function bootAdminPage() {
  if (!guardStatus) return;

  if (!isConfigured) {
    if (isDemoAuthEnabled && sessionStorage.getItem("rpvAdminDemoAuth") !== "true") {
      window.location.href = "login.html";
      return;
    }

    showFallbackDashboard();
    hydrateSiteDraftControls();
    updateAdminSidePreview((window.location.hash || "#dashboard").slice(1));
    return;
  }

  const client = await getClient();
  const { session, profile, error } = await getAdminProfile(client);

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  if (error || !profile || !["super_admin", "editor", "viewer"].includes(profile.role)) {
    setStatus(guardStatus, "บัญชีนี้ไม่มีสิทธิ์เข้า Admin", true);
    return;
  }

  adminGuard.hidden = true;
  adminDashboard.hidden = false;
  await loadDashboard(client);
  hydrateSiteDraftControls();
  updateAdminSidePreview((window.location.hash || "#dashboard").slice(1));
}

async function bootLoginPage() {
  if (!loginForm) return;

  if (!isConfigured) {
    if (isDemoAuthEnabled) {
      setStatus(loginStatus, "ใช้บัญชี Demo สำหรับหลังบ้านตัวอย่าง");
    } else {
      setStatus(loginStatus, "ยังไม่ได้ตั้งค่า Supabase ใน admin/config.js", true);
    }
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isConfigured) {
      const email = document.querySelector("#adminEmail").value.trim();
      const password = document.querySelector("#adminPassword").value;

      if (
        isDemoAuthEnabled &&
        email.toLowerCase() === String(demoAuth.email).toLowerCase() &&
        password === demoAuth.password
      ) {
        sessionStorage.setItem("rpvAdminDemoAuth", "true");
        window.location.href = "index.html";
        return;
      }

      setStatus(loginStatus, "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง", true);
      return;
    }

    setStatus(loginStatus, "กำลังตรวจสอบ...");
    const client = await getClient();
    const email = document.querySelector("#adminEmail").value;
    const password = document.querySelector("#adminPassword").value;
    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus(loginStatus, "Email หรือ Password ไม่ถูกต้อง", true);
      return;
    }

    const { profile } = await getAdminProfile(client);
    if (!profile || !["super_admin", "editor", "viewer"].includes(profile.role)) {
      await client.auth.signOut();
      setStatus(loginStatus, "บัญชีนี้ไม่มีสิทธิ์เข้า Admin", true);
      return;
    }

    window.location.href = "./";
  });
}

logoutButton?.addEventListener("click", async () => {
  sessionStorage.removeItem("rpvAdminDemoAuth");
  const client = await getClient();
  if (client) await client.auth.signOut();
  window.location.href = "login.html";
});

productSearch?.addEventListener("input", () => {
  renderProducts();
  updateAdminSidePreview("products");
});
statusFilter?.addEventListener("change", () => {
  renderProducts();
  updateAdminSidePreview("products");
});
exportProductsButton?.addEventListener("click", exportProductsData);

clearDraftButton?.addEventListener("click", () => {
  const confirmed = window.confirm("ล้าง draft ใน browser นี้ แล้วกลับไปใช้ข้อมูลจากไฟล์ GitHub ใช่ไหม?");
  if (!confirmed) return;
  localStorage.removeItem("rpvProductsDraft");
  localStorage.removeItem("rpvSiteDraft");
  siteDraft = {};
  hydrateSiteDraftControls();
  adminProducts = (window.rpvProducts || []).map(productToAdmin).sort((a, b) => (a.sort_order || 100) - (b.sort_order || 100));
  refreshAdminView("ล้าง draft แล้ว รีเฟรชหน้าเว็บหลักเพื่อกลับไปใช้ข้อมูลเดิม");
  recordRevision("Cleared local product draft");
});

ensurePageManager();

adminNavLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showAdminSection(link.dataset.adminNav);
  });
});

document.addEventListener("click", (event) => {
  const staticButton = event.target.closest("[data-static-only]");
  if (!staticButton) return;

  const section = staticButton.closest("[data-admin-section]");
  const sectionName = section?.id || section?.dataset.adminSection || "section";
  setStatus(adminActionStatus, "ส่วนนี้เปิดให้กดได้แล้ว แต่ยังไม่บันทึกถาวรจนกว่าจะเชื่อม Supabase");
  recordRevision(`ทดลองใช้เมนู ${sectionName}`);
});

document.querySelector("#addCategoryButton")?.addEventListener("click", () => {
  const categoryName = window.prompt("ชื่อหมวดหมู่ใหม่");
  if (!categoryName?.trim()) return;
  setStatus(adminActionStatus, `สร้างหมวด "${categoryName.trim()}" ผ่านสินค้า draft รายการแรกในหมวดนี้`);
  showAdminSection("products");
  openEditor({
    id: "",
    slug: slugify(categoryName),
    name_th: "",
    name_en: "",
    category: categoryName.trim(),
    categories: { name_th: categoryName.trim(), name_en: categoryName.trim() },
    status: "draft",
    sort_order: adminProducts.length + 1
  });
});

adminCategoriesList?.addEventListener("click", (event) => {
  const renameButton = event.target.closest("[data-rename-category]");
  if (renameButton) {
    renameCategory(renameButton.dataset.renameCategory);
    return;
  }

  const hideButton = event.target.closest("[data-hide-category]");
  if (hideButton) {
    hideCategory(hideButton.dataset.hideCategory);
  }
});

openFirstProductEditor?.addEventListener("click", () => {
  showAdminSection("products");
  openEditor(adminProducts[0] || null);
});

productsBody?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-product]");
  if (deleteButton) {
    deleteStaticProduct(deleteButton.dataset.deleteProduct);
    return;
  }

  const editButton = event.target.closest("[data-edit-product]");
  if (!editButton) return;

  const product = adminProducts.find((item) => item.id === editButton.dataset.editProduct);
  if (product) openEditor(product);
});

addProductButton?.addEventListener("click", () => {
  openEditor();
});

addProductInlineButton?.addEventListener("click", () => {
  openEditor();
});

document.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save-section]");
  if (!saveButton) return;
  saveSiteSection(saveButton.dataset.saveSection);
});

closeProductEditor?.addEventListener("click", closeEditor);

editorDialog?.addEventListener("click", (event) => {
  if (event.target === editorDialog) closeEditor();
});

fields.nameEn?.addEventListener("input", () => {
  if (!fields.slug.value.trim()) fields.slug.value = slugify(fields.nameEn.value);
});

fields.nameTh?.addEventListener("input", () => {
  if (!fields.slug.value.trim() && !fields.nameEn.value.trim()) fields.slug.value = slugify(fields.nameTh.value);
});

fields.image?.addEventListener("input", () => {
  updateImagePreview(fields.image.value);
  updateProductEditorPreview();
});

Object.values(fields).forEach((field) => {
  field?.addEventListener("input", updateProductEditorPreview);
  field?.addEventListener("change", updateProductEditorPreview);
});

adminDashboard?.addEventListener("input", (event) => {
  const section = event.target.closest("[data-admin-section]");
  if (section) updateAdminSidePreview(section.dataset.adminSection);
});

adminDashboard?.addEventListener("change", (event) => {
  const section = event.target.closest("[data-admin-section]");
  if (section) updateAdminSidePreview(section.dataset.adminSection);
});

productImageFile?.addEventListener("change", async () => {
  const file = productImageFile.files?.[0];
  if (!file) return;

  setStatus(editorStatus, `กำลังอ่านรูป: ${file.name}`);

  if (!isAllowedImageFile(file)) {
    productImageFile.value = "";
    setStatus(editorStatus, "ไฟล์รูปต้องเป็น JPG, PNG หรือ WebP เท่านั้น", true);
    return;
  }

  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    productImageFile.value = "";
    setStatus(editorStatus, "รูปใหญ่เกินไป กรุณาย่อให้ไม่เกิน 5 MB ก่อน", true);
    return;
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    fields.image.value = dataUrl;
    updateImagePreview(dataUrl);
    updateProductEditorPreview();
    setStatus(editorStatus, `เลือกรูปแล้ว: ${file.name} กดบันทึก Draft แล้ว Export เพื่อใช้กับเว็บจริง`);
  } catch {
    setStatus(editorStatus, "อ่านไฟล์รูปไม่สำเร็จ ลองเลือกรูปใหม่อีกครั้ง", true);
  }
});

archiveProductButton?.addEventListener("click", () => {
  fields.status.value = "hidden";
  setStatus(editorStatus, "ตั้งสถานะเป็น Hidden แล้ว กดบันทึก Draft เพื่อยืนยัน");
});

deleteProductButton?.addEventListener("click", () => {
  if (!fields.id.value) {
    setStatus(editorStatus, "สินค้านี้ยังไม่ได้บันทึก ถ้าต้องการยกเลิกให้กดปิดหน้าต่างได้เลย", true);
    return;
  }

  deleteStaticProduct(fields.id.value);
});

duplicateProductButton?.addEventListener("click", () => {
  fields.id.value = "";
  fields.slug.value = `${slugify(fields.slug.value || fields.nameEn.value || fields.nameTh.value)}-copy`;
  fields.nameTh.value = `${fields.nameTh.value} Copy`;
  setStatus(editorStatus, "สร้างสำเนาแล้ว กดบันทึก Draft เพื่อเพิ่มเป็นสินค้าใหม่");
});

editorForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const product = readEditorProduct();

  if (!product.name_th && !product.name_en) {
    setStatus(editorStatus, "กรุณาใส่ชื่อสินค้าอย่างน้อย 1 ภาษา", true);
    return;
  }

  if (adminDataMode === "database") {
    const saved = await saveDatabaseProduct(product);
    if (!saved) return;
  } else {
    saveStaticDraft(product);
  }

  closeEditor();
});

bootLoginPage();
bootAdminPage();
showAdminSection((window.location.hash || "#dashboard").slice(1));
updateAdminSidePreview((window.location.hash || "#dashboard").slice(1));
