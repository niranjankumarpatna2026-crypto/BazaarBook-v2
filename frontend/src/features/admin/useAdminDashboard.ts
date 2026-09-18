import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://bazaar-book-api.onrender.com';

function adminGet<T>(path: string): Promise<T> {
  const token = localStorage.getItem('bb_admin_token');
  return fetch(`${API_URL}${path}`, {
    headers: { Authorization: 'Bearer ' + token }
  }).then(async (r) => {
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Request fail');
    return r.json();
  });
}

export function useAdminStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGet('/api/admin/dashboard/stats')
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useAdminRevenue(days = 30) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<{ points: any[] }>(`/api/admin/dashboard/revenue?days=${days}`)
      .then((r) => setData(r.points || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  return { data, loading };
}

export function useAdminRecentUsers() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<{ users: any[] }>('/api/admin/dashboard/recent-users')
      .then((r) => setData(r.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useAdminRecentPayments() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<{ payments: any[] }>('/api/admin/dashboard/recent-payments')
      .then((r) => setData(r.payments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useAdminTopShops() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<{ shops: any[] }>('/api/admin/dashboard/top-shops')
      .then((r) => setData(r.shops || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}