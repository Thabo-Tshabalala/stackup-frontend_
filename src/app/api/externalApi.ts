const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export async function externalApiFetch(path: string, options: RequestInit = {}) {
  if (!API_BASE_URL || !API_TOKEN) {
    throw new Error("API base URL or token missing in environment");
  }
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`External API error: ${response.status} - ${errorText}`);
  }
  return response.json();
}