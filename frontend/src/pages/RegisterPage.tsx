// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useAuth } from '@/context/AuthContext';
// import { ROUTES } from '@/lib/constants';

// export default function RegisterPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ ownerName: '', shopName: '', mobile: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); setLoading(true);
//     try {
//       const r = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...form, acceptTerms: true })
//       });
//       const d = await r.json();
//       if (!r.ok) throw new Error(d.error);
//       login(d.token, d.user);
//       toast.success('Swagat! 🎉');
//       navigate(ROUTES.dashboard);
//     } catch (e: any) { setError(e.message); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
//       <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-8">
//         <h1 className="text-center text-2xl font-extrabold">Dukaan shuru karein 🚀</h1>
//         {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
//         <input value={form.ownerName} onChange={(e) => setForm({...form, ownerName: e.target.value})} placeholder="Aapka naam" className="input" required />
//         <input value={form.shopName} onChange={(e) => setForm({...form, shopName: e.target.value})} placeholder="Dukaan ka naam" className="input" required />
//         <input type="tel" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value.replace(/\D/g,'').slice(0,10)})} placeholder="Mobile (10 digit)" className="input" required />
//         <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email (optional)" className="input" />
//         <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Password (min 6)" className="input" required />
//         <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
//           {loading ? 'Ban raha…' : 'Account Banayein'}
//         </button>
//         <p className="text-center text-sm text-slate-500">
//           Pehle se? <Link to={ROUTES.login} className="font-bold text-brand-600">Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// }


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';
import { BrandLogo } from '@/components/BrandLogo';

const API_URL = import.meta.env.VITE_API_URL || 'https://bazaar-book-api.onrender.com';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    ownerName: '',
    shopName: '',
    mobile: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, acceptTerms: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Register fail');
      login(data.token, data.user);
      toast.success('Swagat hai! 🎉');
      navigate(ROUTES.dashboard, { replace: true });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-8">
        {/* <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold">Dukaan shuru karein 🚀</h1>
          <p className="mt-1 text-sm text-slate-500">Free account — 2 minute mein ready</p>
        </div> */}
        <div className="text-center">
  <div className="flex justify-center">
    <BrandLogo size="lg" />
  </div>
  {/* <h1 className="mt-6 font-display text-2xl font-extrabold">Dukaan shuru karein 🚀</h1> */}
  <p className="mt-1 text-sm text-slate-500">Free account — 2 minute mein ready🚀</p>
</div>

        {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Aapka naam</label>
          <input
            type="text"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            placeholder="Ramesh Kumar"
            className="input"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Dukaan ka naam</label>
          <input
            type="text"
            value={form.shopName}
            onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            placeholder="Sharma Kirana Store"
            className="input"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Mobile number</label>
          <input
            type="tel"
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })
            }
            placeholder="9876543210"
            className="input font-mono"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Email (optional)</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="dukan@example.com"
            className="input"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Kam se kam 6 characters"
            className="input"
            required
            minLength={6}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
          {loading ? 'Account ban raha…' : 'Free Account Banayein'}
        </button>

        <p className="text-center text-sm text-slate-500">
          Pehle se account?{' '}
          <Link to={ROUTES.login} className="font-bold text-brand-600 hover:underline">
            Login karein
          </Link>
        </p>
      </form>
    </div>
  );
}