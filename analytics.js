(function () {
  const STORAGE_KEY = "rpvAnalyticsStats";
  const VISITOR_KEY = "rpvVisitorId";
  const MAX_RECENT = 40;
  const MAX_QUEUED_EVENTS = 20;
  const GA4_ID_PATTERN = /^G-[A-Z0-9]+$/i;
  const SAFE_EVENT_PARAMS = new Set(["page_path", "page_title", "page_location", "contact_method"]);

  if (location.pathname.includes("/admin")) return;

  const config = window.RPV_ADMIN_CONFIG || {};
  const measurementId = String(config.ga4MeasurementId || "").trim();
  const hasGa4Config = GA4_ID_PATTERN.test(measurementId);
  const pendingEvents = [];
  const ga4State = {
    ready: false,
    isInternal: false
  };

  const today = new Date().toISOString().slice(0, 10);
  const page = location.pathname.split("/").pop() || "index.html";
  const visitorId = getVisitorId();
  const stats = loadStats();
  const isNewVisitor = !stats.visitors.includes(visitorId);

  stats.totalViews += 1;
  stats.visitors = isNewVisitor ? [...stats.visitors, visitorId] : stats.visitors;
  stats.pages[page] = (stats.pages[page] || 0) + 1;
  stats.daily[today] = (stats.daily[today] || 0) + 1;

  const referrer = document.referrer ? getSafeUrl(document.referrer) || "direct" : "direct";
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
  window.rpvAnalytics = {
    storageKey: STORAGE_KEY,
    stats,
    measurementId: hasGa4Config ? measurementId : "",
    ga4Ready: false,
    isInternal: false,
    track: trackEvent
  };

  if (window.rpvSupabase?.enabled) {
    window.rpvSupabase.recordPageView({
      page,
      title: document.title,
      referrer,
      visitorId,
      userAgent: navigator.userAgent,
      deviceType
    }).catch(() => console.warn("RPV analytics sync failed."));
  }

  installContactTracking();
  initializeGoogleAnalytics();

  async function initializeGoogleAnalytics() {
    if (!hasGa4Config) return;

    // The existing Supabase Auth session is the only source of internal status.
    // Missing config, missing session, disabled profile, and network errors all
    // resolve to a normal visitor.
    ga4State.isInternal = Boolean(
      await window.rpvSupabase?.getInternalStatus?.()
    );

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);

    window.gtag("js", new Date());

    // Google documents set-scoped parameters as applying to every subsequent
    // event. This is what lets automatic and custom events carry traffic_type.
    if (ga4State.isInternal) {
      window.gtag("set", { traffic_type: "internal" });
    }

    const safeLocation = getSafeUrl(location.href) || location.origin + location.pathname;
    const safeReferrer = getSafeUrl(document.referrer);
    window.gtag("config", measurementId, {
      send_page_view: false,
      page_location: safeLocation,
      ...(safeReferrer ? { page_referrer: safeReferrer } : {})
    });

    ga4State.ready = true;
    syncPublicAnalyticsState();

    // Send the first page_view only after internal status is known.
    sendGa4Event("page_view", {
      page_path: location.pathname,
      page_title: document.title,
      page_location: safeLocation
    });

    while (pendingEvents.length) {
      const queued = pendingEvents.shift();
      sendGa4Event(queued.name, queued.params);
    }
  }

  function installContactTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { contact_method: "phone" });
      } else if (/^https:\/\/line\.me\//i.test(href)) {
        trackEvent("line_click", { contact_method: "line" });
      } else if (href.startsWith("mailto:")) {
        trackEvent("email_click", { contact_method: "email" });
      }
    }, { capture: true });
  }

  function trackEvent(name, params = {}) {
    if (!hasGa4Config) return false;

    if (!ga4State.ready) {
      if (pendingEvents.length < MAX_QUEUED_EVENTS) {
        pendingEvents.push({ name, params });
      }
      return false;
    }

    return sendGa4Event(name, params);
  }

  function sendGa4Event(name, params = {}) {
    if (!ga4State.ready || typeof window.gtag !== "function") return false;

    const eventName = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name) ? name : "rpv_event";
    const safeParams = {};
    SAFE_EVENT_PARAMS.forEach((key) => {
      if (params[key] === undefined || params[key] === null) return;
      safeParams[key] = String(params[key]).slice(0, 500);
    });
    if (ga4State.isInternal) safeParams.traffic_type = "internal";

    window.gtag("event", eventName, safeParams);
    return true;
  }

  function syncPublicAnalyticsState() {
    window.rpvAnalytics = {
      ...window.rpvAnalytics,
      ga4Ready: ga4State.ready,
      isInternal: ga4State.isInternal,
      track: trackEvent
    };
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

  function getSafeUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value, location.href);
      return `${url.origin}${url.pathname}`;
    } catch {
      return "";
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
