// Public Supabase config for the browser admin.
// The anon publishable key is allowed in frontend only when RLS is correct.
// Never put service role keys, database passwords, GitHub tokens, or secrets here.
window.RPV_ADMIN_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",

  // Public Google tag identifiers used by the live RPV site.
  // These identifiers are not secrets.
  ga4MeasurementId: "G-Y63LFN3KPY",
  googleAdsId: "AW-929735425",
  googleAdsConversionLabel: "V4j4CMS08-IcEIHGqrsD",

  // These are the existing Supabase admin roles that count as internal staff.
  // Authorization is still enforced by Supabase Auth + RLS; this list is not
  // a replacement for server-side authorization.
  internalRoles: ["super_admin", "editor", "viewer"],

  // Keep demo login disabled for production GitHub Pages.
  // Frontend code is public, so real access must use Supabase Auth + RLS.
  demoAuth: {
    enabled: false,
    email: "",
    password: ""
  }
};
