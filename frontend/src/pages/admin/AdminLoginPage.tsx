import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { api, setToken } from '@/lib/api';

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.post<{ token: string; admin: any }>(
        '/api/admin/auth/login',
        { email, password }
      );

      // Token save karo (admin-specific keys)
      localStorage.setItem('bb_admin_token', data.token);
      localStorage.setItem('bb_admin_user', JSON.stringify(data.admin));

      toast.success('Welcome admin');
      nav('/admin');
    } catch (e: any) {
      setError(e.message || 'Login fail ho gaya');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-brand-900 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-white">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">Admin Login</h1>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@bazaar-book.com"
          className="input"
          required
          autoFocus
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn w-full bg-slate-900 text-white hover:bg-slate-800 btn-lg"
        >
          {loading ? 'Login…' : 'Login Karein'}
        </button>

        <p className="rounded-xl bg-amber-50 p-2 text-center text-[11px] text-amber-800">
          admin@bazaar-book.com / Admin@123456
        </p>
      </form>
    </div>
  );
}