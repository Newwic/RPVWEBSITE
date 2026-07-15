const config = window.RPV_ADMIN_CONFIG || {};
const isConfigured = Boolean(config.supabaseUrl && config.supabaseAnonKey);

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
const adminNavLinks = document.querySelectorAll("[data-admin-nav]");
const adminSections = document.querySelectorAll("[data-admin-section]");
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
  }
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
    appearance: { ...siteDraftDefaults.appearance, ...(siteDraft.appearance || {}) }
  };
}

function persistSiteDraft() {
  localStorage.setItem("rpvSiteDraft", JSON.stringify(siteDraft));
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
    setStatus(loginStatus, "ยังไม่ได้ตั้งค่า Supabase ใน admin/config.js", true);
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isConfigured) {
      setStatus(loginStatus, "ยัง Login ไม่ได้จนกว่าจะตั้งค่า Supabase และ RLS", true);
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
