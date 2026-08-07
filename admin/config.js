// Public Supabase config for the browser admin.
// The anon publishable key is allowed in frontend only when RLS is correct.
// Never put service role keys, database passwords, GitHub tokens, or secrets here.
window.RPV_ADMIN_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",

  // Keep demo login disabled for production GitHub Pages.
  // Frontend code is public, so real access must use Supabase Auth + RLS.
  demoAuth: {
    enabled: false,
    email: "",
    password: ""
  }
};
