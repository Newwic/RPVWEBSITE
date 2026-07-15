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
const exportProductsButton = document.querySelector("#exportProductsButton");

const editorDialog = document.querySelector("#productEditorDialog");
const editorForm = document.querySelector("#productEditorForm");
const editorTitle = document.querySelector("#productEditorTitle");
const editorStatus = document.querySelector("#editorStatus");
const closeProductEditor = document.querySelector("#closeProductEditor");
const archiveProductButton = document.querySelector("#archiveProductButton");
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
  return (window.rpvProducts || [])
    .map(productToAdmin)
    .sort((a, b) => (a.sort_order || 100) - (b.sort_order || 100));
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

function setAdminMode(mode) {
  adminDataMode = mode;

  if (mode === "static") {
    if (adminModeText) {
      adminModeText.textContent = "กำลังแสดงข้อมูลจากไฟล์เว็บเดิม สามารถแก้เป็น draft และ Export ไฟล์ได้ แต่ยังไม่บันทึกขึ้นเว็บอัตโนมัติจนกว่าจะเชื่อม Supabase";
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
  refreshAdminView("บันทึก draft ในหน้า Admin แล้ว ถ้าต้องการให้เว็บจริงเปลี่ยน ให้กด Export data file แล้วอัปเดต data/rpv-products.js");
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

productSearch?.addEventListener("input", renderProducts);
statusFilter?.addEventListener("change", renderProducts);
exportProductsButton?.addEventListener("click", exportProductsData);

productsBody?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-product]");
  if (!editButton) return;

  const product = adminProducts.find((item) => item.id === editButton.dataset.editProduct);
  if (product) openEditor(product);
});

addProductButton?.addEventListener("click", () => {
  openEditor();
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
});

productImageFile?.addEventListener("change", async () => {
  const file = productImageFile.files?.[0];
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    productImageFile.value = "";
    setStatus(editorStatus, "ไฟล์รูปต้องเป็น JPG, PNG หรือ WebP เท่านั้น", true);
    return;
  }

  const maxBytes = 1.5 * 1024 * 1024;
  if (file.size > maxBytes) {
    productImageFile.value = "";
    setStatus(editorStatus, "รูปใหญ่เกินไป กรุณาย่อให้ไม่เกิน 1.5 MB ก่อน", true);
    return;
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    fields.image.value = dataUrl;
    updateImagePreview(dataUrl);
    setStatus(editorStatus, `เลือกรูปแล้ว: ${file.name} กดบันทึก Draft แล้ว Export เพื่อใช้กับเว็บจริง`);
  } catch {
    setStatus(editorStatus, "อ่านไฟล์รูปไม่สำเร็จ ลองเลือกรูปใหม่อีกครั้ง", true);
  }
});

archiveProductButton?.addEventListener("click", () => {
  fields.status.value = "hidden";
  setStatus(editorStatus, "ตั้งสถานะเป็น Hidden แล้ว กดบันทึก Draft เพื่อยืนยัน");
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
