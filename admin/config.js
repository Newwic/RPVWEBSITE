// Public Supabase config for the browser admin.
// The anon publishable key is allowed in frontend only when RLS is correct.
// Never put service role keys, database passwords, GitHub tokens, or secrets here.
window.RPV_ADMIN_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",

  // Demo login for the static GitHub Pages admin preview only.
  // This is not real production security because frontend code is public.
  demoAuth: {
    enabled: true,
    email: "admin@rpv.co.th",
    password: "rpvadmin123"
  }
};
