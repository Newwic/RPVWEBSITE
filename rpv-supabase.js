(() => {
  const config = window.RPV_ADMIN_CONFIG || {};
  const hasConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase?.createClient);
  const client = hasConfig
    ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey)
    : null;

  const slugify = (value = "") => value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0E00-\u0E7F]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || crypto.randomUUID();

  const statusToDb = (status) => {
    if (status === "active" || status === "published") return "published";
    if (status === "hidden") return "hidden";
    if (status === "archived") return "archived";
    return "draft";
  };

  const statusFromDb = (status) => (status === "published" ? "active" : status || "draft");

  const categorySlug = (category = "") => slugify(category.replace(/^\d+(\.\d+)?\s*/, ""));

  const productToDb = (product, categoryId) => ({
    slug: product.slug || product.id || slugify(product.nameEn || product.name_en || product.nameTh || product.name_th),
    name_th: product.nameTh || product.name_th || product.name || "",
    name_en: product.nameEn || product.name_en || product.name || "",
    model: product.model || "",
    short_description_th: product.descTh || product.shortDescriptionTh || product.description_th || product.description || "",
    short_description_en: product.descEn || product.shortDescriptionEn || product.description_en || product.description || "",
    description_th: product.descTh || product.shortDescriptionTh || product.description_th || product.description || "",
    description_en: product.descEn || product.shortDescriptionEn || product.description_en || product.description || "",
    category_id: categoryId,
    cover_image: product.image || product.image_url || "",
    status: statusToDb(product.status),
    sort_order: Number(product.sortOrder || product.sort_order) || 100
  });

  const productFromDb = (row) => {
    const category = row.categories?.name_th || row.categories?.name_en || "";
    return {
      id: row.slug,
      slug: row.slug,
      nameTh: row.name_th || "",
      nameEn: row.name_en || "",
      name_th: row.name_th || "",
      name_en: row.name_en || "",
      model: row.model || "",
      category,
      categories: { name_th: category, name_en: row.categories?.name_en || category },
      status: statusFromDb(row.status),
      sortOrder: Number(row.sort_order) || 100,
      sort_order: Number(row.sort_order) || 100,
      image: row.cover_image || "",
      gallery: row.cover_image ? [row.cover_image] : [],
      shortDescriptionTh: row.short_description_th || row.description_th || "",
      shortDescriptionEn: row.short_description_en || row.description_en || "",
      description_th: row.description_th || row.short_description_th || "",
      description_en: row.description_en || row.short_description_en || "",
      features: []
    };
  };

  async function getSession() {
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function signIn(email, password) {
    if (!client) throw new Error("Supabase ยังไม่ได้ตั้งค่า");
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  }

  async function loadProducts({ includeHidden = false } = {}) {
    if (!client) return null;
    let query = client
      .from("products")
      .select(`
        slug,
        name_th,
        name_en,
        model,
        short_description_th,
        short_description_en,
        description_th,
        description_en,
        cover_image,
        status,
        sort_order,
        categories(name_th, name_en)
      `)
      .order("sort_order", { ascending: true });

    if (!includeHidden) query = query.eq("status", "published");

    const { data, error } = await query;
    if (error) throw error;
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map(productFromDb);
  }

  async function saveProducts(products) {
    if (!client) throw new Error("Supabase ยังไม่ได้ตั้งค่า");
    const session = await getSession();
    if (!session) throw new Error("กรุณา login Supabase ก่อนบันทึกออนไลน์");

    const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]
      .map((name, index) => ({
        slug: categorySlug(name),
        name_th: name,
        name_en: name,
        status: "published",
        sort_order: index + 1
      }));

    if (categories.length) {
      const { error } = await client.from("categories").upsert(categories, { onConflict: "slug" });
      if (error) throw error;
    }

    const { data: categoryRows, error: categoryError } = await client
      .from("categories")
      .select("id, slug");
    if (categoryError) throw categoryError;

    const categoryIds = new Map((categoryRows || []).map((category) => [category.slug, category.id]));
    const rows = products.map((product) => productToDb(product, categoryIds.get(categorySlug(product.category)) || null));
    const { error } = await client.from("products").upsert(rows, { onConflict: "slug" });
    if (error) throw error;
  }

  async function loadSiteDraft() {
    if (!client) return null;
    const { data, error } = await client
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "siteDraft")
      .maybeSingle();
    if (error) throw error;
    return data?.setting_value || null;
  }

  async function saveSiteDraft(siteDraft) {
    if (!client) throw new Error("Supabase ยังไม่ได้ตั้งค่า");
    const session = await getSession();
    if (!session) throw new Error("กรุณา login Supabase ก่อนบันทึกออนไลน์");

    const { error } = await client
      .from("site_settings")
      .upsert({
        setting_key: "siteDraft",
        setting_value: siteDraft || {}
      }, { onConflict: "setting_key" });
    if (error) throw error;
  }

  async function recordPageView(event = {}) {
    if (!client) return false;

    const page = event.page || location.pathname.split("/").pop() || "index.html";
    const referrer = event.referrer || "direct";
    const userAgent = event.userAgent || navigator.userAgent || "";
    const deviceType = event.deviceType || detectDevice(userAgent);
    const visitorId = event.visitorId || "";

    const { error } = await client
      .from("analytics_events")
      .insert({
        page,
        title: event.title || document.title || page,
        referrer,
        visitor_id: visitorId,
        device_type: deviceType,
        user_agent: userAgent
      });

    if (error) throw error;
    return true;
  }

  async function loadAnalytics({ limit = 500 } = {}) {
    if (!client) return null;

    const { data, error } = await client
      .from("analytics_events")
      .select("page,title,referrer,visitor_id,device_type,user_agent,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return buildAnalyticsStats(data || []);
  }

  async function resetAnalytics() {
    if (!client) throw new Error("Supabase ยังไม่ได้ตั้งค่า");
    const session = await getSession();
    if (!session) throw new Error("กรุณา login Supabase ก่อนล้างสถิติ");

    const { error } = await client
      .from("analytics_events")
      .delete()
      .not("id", "is", null);

    if (error) throw error;
  }

  function subscribeToAnalytics(onChange) {
    if (!client || typeof onChange !== "function") return null;

    let timer = 0;
    const notify = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(onChange, 350);
    };

    const channel = client
      .channel("rpv-analytics-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "analytics_events" }, notify)
      .subscribe();

    return () => {
      window.clearTimeout(timer);
      client.removeChannel(channel);
    };
  }

  function buildAnalyticsStats(rows) {
    const stats = { totalViews: 0, visitors: [], pages: {}, daily: {}, referrers: {}, recent: [], source: "Supabase" };
    const visitors = new Set();

    rows.forEach((row) => {
      const time = row.created_at || new Date().toISOString();
      const day = time.slice(0, 10);
      const page = row.page || "index.html";
      const referrer = row.referrer || "direct";
      const visitorId = row.visitor_id || "";

      stats.totalViews += 1;
      stats.pages[page] = (stats.pages[page] || 0) + 1;
      stats.daily[day] = (stats.daily[day] || 0) + 1;
      stats.referrers[referrer] = (stats.referrers[referrer] || 0) + 1;
      if (visitorId) visitors.add(visitorId);
      stats.recent.push({
        page,
        title: row.title || page,
        referrer,
        visitorId,
        time,
        userAgent: row.user_agent || "",
        deviceType: row.device_type || detectDevice(row.user_agent || "")
      });
    });

    stats.visitors = [...visitors];
    return stats;
  }

  function detectDevice(userAgent = "") {
    const agent = String(userAgent).toLowerCase();
    if (/ipad|tablet/.test(agent)) return "Tablet";
    if (/mobile|android|iphone/.test(agent)) return "Mobile";
    if (agent) return "Desktop";
    return "Other";
  }

  function subscribeToSiteDraft(onChange) {
    if (!client || typeof onChange !== "function") return null;

    const channel = client
      .channel("rpv-site-draft-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "setting_key=eq.siteDraft"
        },
        (payload) => {
          onChange(payload.new?.setting_value || null, payload);
        }
      )
      .subscribe();

    return () => client.removeChannel(channel);
  }

  function subscribeToProducts(onChange) {
    if (!client || typeof onChange !== "function") return null;

    let timer = 0;
    const notify = (payload) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => onChange(payload), 250);
    };

    const channel = client
      .channel("rpv-products-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, notify)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, notify)
      .subscribe();

    return () => {
      window.clearTimeout(timer);
      client.removeChannel(channel);
    };
  }

  window.rpvSupabase = {
    enabled: hasConfig,
    client,
    getSession,
    signIn,
    loadProducts,
    saveProducts,
    loadSiteDraft,
    saveSiteDraft,
    recordPageView,
    loadAnalytics,
    resetAnalytics,
    subscribeToSiteDraft,
    subscribeToProducts,
    subscribeToAnalytics
  };
})();
