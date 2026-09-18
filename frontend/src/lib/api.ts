// /**
//  * BazaarBook API Client
//  * 
//  * Central API helper — saare requests isse hoke jayenge.
//  * - Automatic token injection
//  * - Automatic JSON parsing
//  * - 401 handling (auto logout)
//  * - Error normalization
//  */

// const API_URL =
//   (import.meta.env.VITE_API_URL as string) ||
//   'https://bazaar-book-api.onrender.com';

// // ============ ERROR CLASS ============
// export class ApiError extends Error {
//   status: number;
//   code?: string;
//   field?: string;

//   constructor(message: string, status: number, code?: string, field?: string) {
//     super(message);
//     this.name = 'ApiError';
//     this.status = status;
//     this.code = code;
//     this.field = field;
//   }
// }

// // ============ TOKEN MANAGEMENT ============
// const TOKEN_KEY = 'bb_token';
// const USER_KEY = 'bb_user';

// export function getToken(): string | null {
//   return localStorage.getItem(TOKEN_KEY);
// }

// export function setToken(token: string): void {
//   localStorage.setItem(TOKEN_KEY, token);
// }

// export function clearToken(): void {
//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(USER_KEY);
// }

// // ============ CORE FETCH ============
// type ApiOptions = RequestInit & {
//   /** Skip auth header for public endpoints */
//   skipAuth?: boolean;
//   /** Skip auto-logout on 401 */
//   skipLogout?: boolean;
// };

// export async function apiFetch<T = any>(
//   path: string,
//   options: ApiOptions = {}
// ): Promise<T> {
//   const { skipAuth, skipLogout, ...fetchOptions } = options;

//   // Build full URL
//   const url = path.startsWith('http') ? path : `${API_URL}${path}`;

//   // Build headers
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     ...((fetchOptions.headers as Record<string, string>) || {})
//   };

//   // Inject auth token
//   if (!skipAuth) {
//     const token = getToken();
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
//   }

//   // Make request
//   let response: Response;
//   try {
//     response = await fetch(url, {
//       ...fetchOptions,
//       headers
//     });
//   } catch (err: any) {
//     // Network error
//     throw new ApiError(
//       'Internet connection issue — please check and try again',
//       0,
//       'NETWORK_ERROR'
//     );
//   }

//   // Handle 401 — auto logout (except for auth endpoints)
//   if (response.status === 401 && !skipLogout) {
//     clearToken();
//     // Only redirect if we're not already on login/register
//     const currentPath = window.location.pathname;
//     if (
//       !currentPath.includes('/login') &&
//       !currentPath.includes('/register')
//     ) {
//       window.location.href = '/login';
//     }
//     throw new ApiError('Session expire ho gaya — dobara login karein', 401, 'UNAUTHORIZED');
//   }

//   // Handle 204 No Content
//   if (response.status === 204) {
//     return null as T;
//   }

//   // Parse body safely
//   let data: any = null;
//   const text = await response.text();
//   if (text) {
//     try {
//       data = JSON.parse(text);
//     } catch {
//       // Server returned non-JSON (HTML error page, etc.)
//       if (!response.ok) {
//         throw new ApiError(
//           `Server error (${response.status})`,
//           response.status,
//           'INVALID_RESPONSE'
//         );
//       }
//       return text as unknown as T;
//     }
//   }

//   // Handle error responses
//   if (!response.ok) {
//     throw new ApiError(
//       data?.error || `Request failed (${response.status})`,
//       response.status,
//       data?.code,
//       data?.field
//     );
//   }

//   return data as T;
// }

// // ============ CONVENIENCE METHODS ============
// export const api = {
//   get: <T = any>(path: string, opts?: ApiOptions) =>
//     apiFetch<T>(path, { ...opts, method: 'GET' }),

//   post: <T = any>(path: string, body?: any, opts?: ApiOptions) =>
//     apiFetch<T>(path, {
//       ...opts,
//       method: 'POST',
//       body: body ? JSON.stringify(body) : undefined
//     }),

//   patch: <T = any>(path: string, body?: any, opts?: ApiOptions) =>
//     apiFetch<T>(path, {
//       ...opts,
//       method: 'PATCH',
//       body: body ? JSON.stringify(body) : undefined
//     }),

//   put: <T = any>(path: string, body?: any, opts?: ApiOptions) =>
//     apiFetch<T>(path, {
//       ...opts,
//       method: 'PUT',
//       body: body ? JSON.stringify(body) : undefined
//     }),

//   delete: <T = any>(path: string, opts?: ApiOptions) =>
//     apiFetch<T>(path, { ...opts, method: 'DELETE' })
// };

// // ============ EXPORT API_URL ============
// export { API_URL };


/**
 * BazaarBook API Client — Production
 * Central API helper — saare requests isse hoke jayenge.
 */

const API_URL =
  (import.meta.env.VITE_API_URL as string) ||
  'https://bazaar-book-api.onrender.com';

// ============ ERROR CLASS ============
export class ApiError extends Error {
  status: number;
  code?: string;
  field?: string;

  constructor(message: string, status: number, code?: string, field?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

// ============ TOKEN MANAGEMENT ============
const TOKEN_KEY = 'bb_token';
const USER_KEY = 'bb_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ============ CORE FETCH ============
type ApiOptions = RequestInit & {
  skipAuth?: boolean;
  skipLogout?: boolean;
  /** Set to true to return raw Response (for blob downloads) */
  raw?: boolean;
};

export async function apiFetch(
  path: string,
  options: ApiOptions = {}
): Promise<Response> {
  const { skipAuth, skipLogout, raw: _raw, ...fetchOptions } = options;

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;

  const headers: Record<string, string> = {
    ...((fetchOptions.headers as Record<string, string>) || {})
  };

  // Don't set Content-Type for FormData (browser will set with boundary)
  if (!(fetchOptions.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers
    });
  } catch (err: any) {
    throw new ApiError(
      'Internet connection issue — please check and try again',
      0,
      'NETWORK_ERROR'
    );
  }

  // Auto logout on 401
  if (response.status === 401 && !skipLogout) {
    clearToken();
    const currentPath = window.location.pathname;
    if (
      !currentPath.includes('/login') &&
      !currentPath.includes('/register')
    ) {
      window.location.href = '/login';
    }
    throw new ApiError('Session expire ho gaya — dobara login karein', 401, 'UNAUTHORIZED');
  }

  return response;
}

// ============ JSON FETCH ============
async function jsonRequest<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const response = await apiFetch(path, options);

  if (response.status === 204) {
    return null as T;
  }

  let data: any = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      if (!response.ok) {
        throw new ApiError(
          `Server error (${response.status})`,
          response.status,
          'INVALID_RESPONSE'
        );
      }
      return text as unknown as T;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data?.error || `Request failed (${response.status})`,
      response.status,
      data?.code,
      data?.field
    );
  }

  return data as T;
}

// ============ CONVENIENCE METHODS ============
export const api = {
  get: <T = any>(path: string, opts?: ApiOptions) =>
    jsonRequest<T>(path, { ...opts, method: 'GET' }),

  post: <T = any>(path: string, body?: any, opts?: ApiOptions) =>
    jsonRequest<T>(path, {
      ...opts,
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    }),

  patch: <T = any>(path: string, body?: any, opts?: ApiOptions) =>
    jsonRequest<T>(path, {
      ...opts,
      method: 'PATCH',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    }),

  put: <T = any>(path: string, body?: any, opts?: ApiOptions) =>
    jsonRequest<T>(path, {
      ...opts,
      method: 'PUT',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    }),

  delete: <T = any>(path: string, opts?: ApiOptions) =>
    jsonRequest<T>(path, { ...opts, method: 'DELETE' }),

  /** Download a file (CSV, PDF, etc.) */
  download: async (path: string, filename?: string, opts?: ApiOptions) => {
    const response = await apiFetch(path, { ...opts, method: 'GET' });

    if (!response.ok) {
      throw new ApiError(`Download failed (${response.status})`, response.status);
    }

    const blob = await response.blob();

    // Get filename from Content-Disposition if available
    if (!filename) {
      const disposition = response.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="?([^"]+)"?/);
      filename = match?.[1] || `download-${Date.now()}`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
  }
};

export { API_URL };