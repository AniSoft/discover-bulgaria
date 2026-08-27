/** Only allow same-origin relative paths as post-login destinations. */
export function safeRedirect(value: string | undefined, fallback = "/"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
