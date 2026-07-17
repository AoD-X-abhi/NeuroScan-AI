const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface RequestOptions extends RequestInit {
  json?: any;
  formData?: FormData;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  let body = options.body;
  
  if (options.json) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  } else if (options.formData) {
    body = options.formData;
  }
  
  const res = await fetch(url, {
    ...options,
    headers,
    body,
  });
  
  if (!res.ok) {
    let errorDetail = "An error occurred";
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = res.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }
  
  if (res.status === 204) {
    return {} as T;
  }
  
  return res.json();
}

export function getStaticUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}
