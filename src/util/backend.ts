const backendOrigin = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

export function backendUrl(path: string): string {
  return `${backendOrigin}${path}`;
}