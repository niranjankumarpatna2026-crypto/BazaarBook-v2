import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">Namaste, {user?.ownerName?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-slate-500">Aaj ka haal ek nazar mein</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Aaj Ki Kamai', 'Bills', 'Naye Grahak', 'Baki Udhaar'].map((l) => (
          <div key={l} className="card p-5">
            <p className="text-xs font-bold uppercase text-slate-500">{l}</p>
            <p className="mt-2 text-2xl font-extrabold">₹0</p>
          </div>
        ))}
      </div>

      <div className="card p-8 text-center">
        <p className="text-4xl">🚀</p>
        <h3 className="mt-3 text-lg font-bold">Welcome!</h3>
        <p className="text-sm text-slate-500">Setup complete — ab billing shuru karein</p>
      </div>
    </div>
  );
}
