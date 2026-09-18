// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useAuth } from '@/context/AuthContext';
// import { ROUTES } from '@/lib/constants';

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [identifier, setIdentifier] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(''); setLoading(true);
//     try {
//       const r = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ identifier, password })
//       });
//       const d = await r.json();
//       if (!r.ok) throw new Error(d.error);
//       login(d.token, d.user);
//       toast.success('Wapas swagat!');
//       navigate(ROUTES.dashboard);
//     } catch (e: any) { setError(e.message); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
//       <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-8">
//         <div className="text-center">
//           <h1 className="text-2xl font-extrabold">Wapas swagat 👋</h1>
//         </div>
//         {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
//         <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Mobile ya email" className="input" required autoFocus />
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input" required />
//         <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
//           {loading ? 'Login…' : 'Login Karein'}
//         </button>
//         <p className="text-center text-sm text-slate-500">
//           Naye? <Link to={ROUTES.register} className="font-bold text-brand-600">Account banayein</Link>
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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login fail');
      login(data.token, data.user);
      toast.success('Wapas swagat! 👋');
      navigate(ROUTES.dashboard, { replace: true });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-8">
        <div className="text-center">
  <div className="flex justify-center">
    <BrandLogo size="lg" />
  </div>
  <h1 className="mt-6 font-display text-2xl font-extrabold">Wapas swagat 👋</h1>
  <p className="mt-1 text-sm text-slate-500">Apni dukaan sambhalne ke liye login karein</p>
</div>

        {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Mobile ya Email</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="9876543210"
            className="input"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="input"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
          {loading ? 'Login ho raha…' : 'Secure Login'}
        </button>

        <p className="text-center text-sm text-slate-500">
          Naye hain?{' '}
          <Link to={ROUTES.register} className="font-bold text-brand-600 hover:underline">
            Free account banayein
          </Link>
        </p>
      </form>
    </div>
  );
}