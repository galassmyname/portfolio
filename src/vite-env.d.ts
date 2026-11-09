/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key (public by design; it only lets the form deliver to the inbox it was created for). */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  /** Public origin of the deployed site, e.g. https://www.example.com (no trailing slash). */
  readonly VITE_SITE_URL?: string;
  /** Sub-path the site is served from, e.g. /portfolio/ (default: /). */
  readonly VITE_BASE_PATH?: string;
  /** Content of Google Search Console's HTML-tag verification (optional). */
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
