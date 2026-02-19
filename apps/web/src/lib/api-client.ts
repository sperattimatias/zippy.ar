'use client';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestConfig = {
  url: string;
  method?: HttpMethod;
  data?: unknown;
  headers?: Record<string, string>;
};

type RequestInterceptor = (config: RequestConfig) => RequestConfig;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const AUTH_STORAGE_KEY = 'zippy_web_auth';

class ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  async request<T>(initialConfig: RequestConfig): Promise<T> {
    const config = this.requestInterceptors.reduce<RequestConfig>((acc, interceptor) => interceptor(acc), {
      method: 'GET',
      headers: {},
      ...initialConfig
    });

    const response = await fetch(`${API_BASE_URL}${config.url}`, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers ?? {})
      },
      body: config.data ? JSON.stringify(config.data) : undefined
    });

    const payloadText = await response.text();
    const payload = payloadText ? (JSON.parse(payloadText) as { message?: string } & T) : ({} as { message?: string } & T);

    if (!response.ok) {
      throw new Error(payload.message ?? 'Error de autenticación');
    }

    return payload;
  }

  post<T>(url: string, data: unknown, headers?: Record<string, string>) {
    return this.request<T>({ url, method: 'POST', data, headers });
  }
}

export type StoredAuth = {
  accessToken: string;
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
};

export const getStoredAuth = (): StoredAuth | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
};

export const setStoredAuth = (auth: StoredAuth) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const apiClient = new ApiClient();

apiClient.addRequestInterceptor((config) => {
  const auth = getStoredAuth();
  if (!auth?.accessToken) {
    return config;
  }

  return {
    ...config,
    headers: {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${auth.accessToken}`
    }
  };
});
