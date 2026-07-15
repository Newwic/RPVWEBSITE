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

let supabaseClient = null;
let adminProducts = [];
let adminDataMode = "static";

function staticProductsFallback() {
  return (window.rpvProducts || []).map((product) => ({
    id: product.id,
    slug: product.slug,
    name_th: product.nameTh,
    name_en: product.nameEn,
    model: product.model,
    status: product.status === "active" ? "published" : product.status || "draft",
    sort_order: product.sortOrder,
    categories: {
      name_th: product.category,
      name_en: product.category
    }
  })).sort((a, b) => (a.sort_order || 100) - (b.sort_order || 100));
}

function setStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? "#b42318" : "";
}

function setAdminMode(mode) {
  adminDataMode = mode;

  if (mode === "static") {
    if (adminModeText) {
      adminModeText.textContent = "กำลังแสดงข้อมูลจากไฟล์เว็บเดิม ยังไม่สามารถแก้และบันทึกจริงได้จนกว่าจะเชื่อม Supabase";
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

  statProducts.textContent = String(products.length);
  statPublished.textContent = String(published);
  statDraft.textContent = String(draft);
  statHidden.textContent = String(hidden);
}

function filteredProducts() {
  const keyword = (productSearch?.value || "").trim().toLowerCase();
  const status = statusFilter?.value || "";

  return adminProducts.filter((product) => {
    const searchable = [
      product.name_th,
      product.name_en,
      product.model,
      product.categories?.name_th,
      product.categories?.name_en
    ].filter(Boolean).join(" ").toLowerCase();

    return (!keyword || searchable.includes(keyword))
      && (!status || product.status === status);
  });
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
      <td><strong>${product.name_th || product.name_en}</strong><br><small>${product.name_en || ""}</small></td>
      <td>${product.model || "-"}</td>
      <td>${product.categories?.name_th || "-"}</td>
      <td><span class="admin-badge">${product.status}</span></td>
      <td>${product.sort_order ?? "-"}</td>
      <td>
        <div class="admin-row-actions">
          <a class="button secondary" href="../index.html#products" target="_blank" rel="noopener">Preview</a>
          <button class="button primary" type="button" data-edit-product="${product.id}">
            แก้ไข
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function showFallbackDashboard() {
  setAdminMode("static");
  adminProducts = staticProductsFallback();
  adminGuard.hidden = true;
  adminDashboard.hidden = false;
  renderStats(adminProducts);
  renderProducts();
}

async function loadDashboard(client) {
  const { data, error } = await client
    .from("products")
    .select("id, slug, name_th, name_en, model, status, sort_order, categories(name_th, name_en)")
    .order("sort_order", { ascending: true });

  if (error) {
    setStatus(guardStatus, "อ่านข้อมูลไม่สำเร็จ ตรวจ RLS และสิทธิ์ Admin", true);
    return;
  }

  adminProducts = data || [];
  setAdminMode("database");
  renderStats(adminProducts);
  renderProducts();
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

productsBody?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-product]");
  if (!editButton) return;

  if (adminDataMode === "static") {
    setStatus(adminActionStatus, "ตอนนี้ยังแก้ไขไม่ได้ เพราะ Admin กำลังอ่านจากไฟล์เว็บเดิม ต้องเชื่อม Supabase ก่อนจึงจะบันทึกจริงได้", true);
    return;
  }

  setStatus(adminActionStatus, "หน้าฟอร์มแก้ไขจะเปิดในระยะถัดไป หลังเชื่อม Auth/RLS และ Database แล้ว", true);
});

addProductButton?.addEventListener("click", () => {
  if (adminDataMode === "static") {
    setStatus(adminActionStatus, "ยังเพิ่มสินค้าไม่ได้ ต้องเชื่อม Supabase ก่อน เพื่อให้ข้อมูลไม่หายหลัง Refresh", true);
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  setStatus(adminActionStatus, "หน้าฟอร์มเพิ่มสินค้าจะเปิดในระยะถัดไป", true);
});

bootLoginPage();
bootAdminPage();
