(function () {
  const STORAGE_KEY = "rpvAnalyticsStats";
  const VISITOR_KEY = "rpvVisitorId";
  const MAX_RECENT = 40;

  if (location.pathname.includes("/admin")) return;

  const today = new Date().toISOString().slice(0, 10);
  const page = location.pathname.split("/").pop() || "index.html";
  const visitorId = getVisitorId();
  const stats = loadStats();
  const isNewVisitor = !stats.visitors.includes(visitorId);

  stats.totalViews += 1;
  stats.visitors = isNewVisitor ? [...stats.visitors, visitorId] : stats.visitors;
  stats.pages[page] = (stats.pages[page] || 0) + 1;
  stats.daily[today] = (stats.daily[today] || 0) + 1;

  const referrer = document.referrer ? new URL(document.referrer).hostname || "direct" : "direct";
  const deviceType = detectDevice(navigator.userAgent);
  stats.referrers[referrer] = (stats.referrers[referrer] || 0) + 1;
  stats.recent.unshift({
    page,
    title: document.title,
    referrer,
    visitorId,
    time: new Date().toISOString(),
    userAgent: navigator.userAgent,
    deviceType
  });
  stats.recent = stats.recent.slice(0, MAX_RECENT);
  stats.updatedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  window.rpvAnalytics = { storageKey: STORAGE_KEY, stats };

  if (window.rpvSupabase?.enabled) {
    window.rpvSupabase.recordPageView({
      page,
      title: document.title,
      referrer,
      visitorId,
      userAgent: navigator.userAgent,
      deviceType
    }).catch((error) => console.warn("RPV analytics sync failed.", error));
  }

  function getVisitorId() {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  }

  function loadStats() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        totalViews: Number(saved.totalViews) || 0,
        visitors: Array.isArray(saved.visitors) ? saved.visitors : [],
        pages: saved.pages && typeof saved.pages === "object" ? saved.pages : {},
        daily: saved.daily && typeof saved.daily === "object" ? saved.daily : {},
        referrers: saved.referrers && typeof saved.referrers === "object" ? saved.referrers : {},
        recent: Array.isArray(saved.recent) ? saved.recent : [],
        updatedAt: saved.updatedAt || ""
      };
    } catch {
      return { totalViews: 0, visitors: [], pages: {}, daily: {}, referrers: {}, recent: [], updatedAt: "" };
    }
  }

  function detectDevice(userAgent = "") {
    const agent = String(userAgent).toLowerCase();
    if (/ipad|tablet/.test(agent)) return "Tablet";
    if (/mobile|android|iphone/.test(agent)) return "Mobile";
    if (agent) return "Desktop";
    return "Other";
  }
})();
