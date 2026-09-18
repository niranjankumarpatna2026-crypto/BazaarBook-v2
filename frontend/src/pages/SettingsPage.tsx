import { useEffect, useState } from 'react';
import {
  Store, Receipt, Palette, Bell, Database, Shield, HelpCircle,
  Save, Download, Upload, MessageCircle, Phone, Mail, Lock,
  LogOut, Check, X, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/AuthContext';
import { inr } from '@/lib/format';
import { api } from '@/lib/api';

// ===================== TABS =====================
const TABS = [
  { k: 'profile', label: 'Dukaan', emoji: '🏪' },
  { k: 'bill', label: 'Bill', emoji: '🧾' },
  { k: 'preferences', label: 'Display', emoji: '🎨' },
  { k: 'notifications', label: 'Alerts', emoji: '🔔' },
  { k: 'data', label: 'Data', emoji: '💾' },
  { k: 'security', label: 'Security', emoji: '🔒' },
  { k: 'support', label: 'Help', emoji: '🆘' }
] as const;

type TabKey = typeof TABS[number]['k'];

const BUSINESS_TYPES = ['Kirana', 'Medical', 'General Store', 'Electronics', 'Hardware', 'Clothing', 'Restaurant', 'Other'];

// ===================== MAIN =====================
export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('profile');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const d = await api.get('/api/settings');
      setData(d);
    } catch (err: any) {
      toast.error(err.message || 'Settings load nahi hui');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-4 pb-4">
        <div className="h-8 w-40 animate-pulse rounded-full bg-stone-200" />
        <div className="card h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900">
          Settings
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Apni dukaan aur app customize karein
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[220px_1fr] lg:gap-4">
  {/* Tabs */}
  <div className="lg:sticky lg:top-20 lg:self-start">
    {/* Mobile: horizontal scroll */}
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
      {TABS.map((t) => (
        <button
          key={t.k}
          onClick={() => setTab(t.k)}
          className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-bold transition lg:w-full lg:justify-start lg:gap-2.5 lg:px-4 lg:py-2.5 ${
            tab === t.k
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-stone-200 bg-white text-slate-600 hover:border-stone-300'
          }`}
        >
          <span className="text-base">{t.emoji}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  </div>

  {/* Content */}
  <div className="card min-w-0 w-full overflow-hidden p-4 sm:p-5 lg:p-6">
    {tab === 'profile' && <ProfileTab profile={data.profile} onSaved={load} />}
    {tab === 'bill' && <BillTab bill={data.bill} onSaved={load} />}
    {tab === 'preferences' && <PreferencesTab prefs={data.preferences} onSaved={load} />}
    {tab === 'notifications' && <NotificationsTab notifs={data.notifications} onSaved={load} />}
    {tab === 'data' && <DataTab />}
    {tab === 'security' && <SecurityTab />}
    {tab === 'support' && <SupportTab />}
  </div>
</div>
    </div>
  );
}

// ===================== PROFILE TAB =====================
function ProfileTab({ profile, onSaved }: any) {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const update = (p: any) => setForm((f: any) => ({ ...f, ...p }));

  const validate = () => {
    const e: any = {};
    if (!form.shopName?.trim()) e.shopName = 'Naam zaroori';
    if (!form.ownerName?.trim()) e.ownerName = 'Naam zaroori';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = '10 digit mobile';
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = '6 digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Kuch fields galat hain');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/api/settings/profile', form);
      toast.success('Dukaan profile save ho gayi ✅');
      updateUser({ shopName: form.shopName, ownerName: form.ownerName });
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <SectionHeader
        title="Dukaan Profile"
        subtitle="Ye jaankari bill aur receipts par dikhegi"
      />

      <div className="flex flex-col gap-3 rounded-2xl bg-stone-50 p-4 sm:flex-row sm:items-center sm:gap-4">
  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-extrabold text-white shadow-md self-center sm:self-auto">
    {form.logoUrl ? (
      <img src={form.logoUrl} alt="Logo" className="h-full w-full rounded-2xl object-cover" />
    ) : (
      (form.shopName || 'Dukaan').charAt(0).toUpperCase()
    )}
  </div>
  <div className="min-w-0 flex-1 w-full">
    <p className="text-sm font-bold text-slate-900">Dukaan logo</p>
    <p className="text-xs text-slate-500">URL daalein ya skip karein</p>
    <input
      type="url"
      value={form.logoUrl || ''}
      onChange={(e) => update({ logoUrl: e.target.value })}
      placeholder="https://example.com/logo.png"
      className="input mt-2 text-xs w-full"
    />
  </div>
</div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Dukaan ka naam" required error={errors.shopName}>
          <input
            value={form.shopName}
            onChange={(e) => update({ shopName: e.target.value })}
            placeholder="Sharma Kirana Store"
            className={`input ${errors.shopName ? 'border-red-300' : ''}`}
          />
        </Field>
        <Field label="Malik ka naam" required error={errors.ownerName}>
          <input
            value={form.ownerName}
            onChange={(e) => update({ ownerName: e.target.value })}
            placeholder="Ramesh Sharma"
            className={`input ${errors.ownerName ? 'border-red-300' : ''}`}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile" required error={errors.mobile}>
          <input
            type="tel"
            value={form.mobile}
            onChange={(e) => update({ mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            placeholder="9876543210"
            className={`input font-mono ${errors.mobile ? 'border-red-300' : ''}`}
          />
        </Field>
        <Field label="Email (optional)">
          <input
            type="email"
            value={form.email || ''}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="dukan@example.com"
            className="input"
          />
        </Field>
      </div>

      <Field label="Address">
        <textarea
          value={form.address || ''}
          onChange={(e) => update({ address: e.target.value })}
          rows={2}
          placeholder="Ward 5, Main Road, near Bus Stand"
          className="input resize-none"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City">
          <input
            value={form.city || ''}
            onChange={(e) => update({ city: e.target.value })}
            placeholder="Ranchi"
            className="input"
          />
        </Field>
        <Field label="State">
          <input
            value={form.state || ''}
            onChange={(e) => update({ state: e.target.value })}
            placeholder="Jharkhand"
            className="input"
          />
        </Field>
        <Field label="Pincode" error={errors.pincode}>
          <input
            value={form.pincode || ''}
            onChange={(e) => update({ pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            placeholder="834001"
            className={`input font-mono ${errors.pincode ? 'border-red-300' : ''}`}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="GSTIN (agar hai)">
          <input
            value={form.gstin || ''}
            onChange={(e) => update({ gstin: e.target.value.toUpperCase() })}
            placeholder="20ABCDE1234F1Z5"
            className="input font-mono"
          />
        </Field>
        <Field label="Business type">
          <select
            value={form.businessType || 'Kirana'}
            onChange={(e) => update({ businessType: e.target.value })}
            className="input"
          >
            {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <div className="flex justify-end border-t border-stone-100 pt-4">
        <button type="submit" disabled={saving} className="btn-primary btn-md">
          <Save className="h-4 w-4" />
          {saving ? 'Save ho raha…' : 'Profile Save Karein'}
        </button>
      </div>
    </form>
  );
}

// ===================== BILL TAB =====================
function BillTab({ bill, onSaved }: any) {
  const [form, setForm] = useState({
    ...bill,
    printSize: bill.printSize || 'a4'
  });
  const [saving, setSaving] = useState(false);

  const update = (p: any) => setForm((f: any) => ({ ...f, ...p }));

  const save = async () => {
    setSaving(true);
    try {
      await api.patch('/api/settings/bill', form);
      toast.success('Bill settings save ho gayi ✅');
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const templates = [
    { k: 'classic', l: 'Classic', e: '📋', d: 'Traditional' },
    { k: 'modern', l: 'Modern', e: '🎨', d: 'Clean & bold' },
    { k: 'minimal', l: 'Minimal', e: '✨', d: 'Compact' }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Bill Settings"
        subtitle="Bill par kya-kya dikhega, kaise dikhega"
      />

      <Field label="Bill Template">
        <div className="grid grid-cols-3 gap-2">
          {templates.map((t) => (
            <button
              key={t.k}
              type="button"
              onClick={() => update({ template: t.k })}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center transition ${form.template === t.k
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
            >
              <span className="text-2xl">{t.e}</span>
              <span className="text-xs font-bold text-slate-900">{t.l}</span>
              <span className="text-[10px] text-slate-500">{t.d}</span>
            </button>
          ))}
        </div>
      </Field>

      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Bill Number Format
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prefix">
            <input
              value={form.prefix}
              onChange={(e) => update({ prefix: e.target.value.toUpperCase().slice(0, 5) })}
              placeholder="INV"
              className="input font-mono"
            />
          </Field>
          <Field label="Starting number">
            <input
              type="number"
              value={form.startingNumber || ''}
              onChange={(e) => update({ startingNumber: Number(e.target.value) || 1 })}
              className="input"
            />
          </Field>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Next bill:{' '}
          <span className="font-mono font-bold text-slate-900">
            {form.prefix}-{String(form.startingNumber).padStart(3, '0')}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Bill par kya dikhe
        </p>
        <ToggleRow
          label="Dukaan ka logo"
          hint="Bill ke upar logo dikhega"
          value={form.showLogo}
          onChange={(v) => update({ showLogo: v })}
        />
        <ToggleRow
          label="UPI QR Code"
          hint="Customer scan karke pay kar sakta hai"
          value={form.showQR}
          onChange={(v) => update({ showQR: v })}
        />
        {form.showQR && (
          <div className="animate-slide-down pl-1">
            <Field label="UPI ID" hint="jaise: dukan@paytm">
              <input
                value={form.upiId || ''}
                onChange={(e) => update({ upiId: e.target.value })}
                placeholder="9876543210@paytm"
                className="input"
              />
            </Field>
          </div>
        )}
        <ToggleRow
          label="Auto-print"
          hint="Bill bante hi print dialog khule"
          value={form.autoPrint}
          onChange={(v) => update({ autoPrint: v })}
        />
      </div>

      <Field label="Footer note" hint="Bill ke neeche ye message print hoga">
        <input
          value={form.footerNote || ''}
          onChange={(e) => update({ footerNote: e.target.value })}
          placeholder="Dhanyavaad! Phir aane ke liye shukriya"
          className="input"
        />
      </Field>

      <Field label="Terms & Conditions" hint="Chhota text jo bill par dikhe (optional)">
        <textarea
          value={form.termsAndConditions || ''}
          onChange={(e) => update({ termsAndConditions: e.target.value })}
          rows={3}
          placeholder="Maal ek baar bikne ke baad wapas nahi hoga…"
          className="input resize-none"
        />
      </Field>

      <div className="flex justify-end border-t border-stone-100 pt-4">
        <button onClick={save} disabled={saving} className="btn-primary btn-md">
          <Receipt className="h-4 w-4" />
          {saving ? 'Save ho raha…' : 'Bill Settings Save Karein'}
        </button>
      </div>
    </div>
  );
}

// ===================== PREFERENCES TAB =====================
function PreferencesTab({ prefs, onSaved }: any) {
  const [form, setForm] = useState({ ...prefs });
  const [saving, setSaving] = useState(false);

  const update = (p: any) => setForm((f: any) => ({ ...f, ...p }));

  const save = async () => {
    setSaving(true);
    try {
      await api.patch('/api/settings/preferences', form);
      toast.success('Preferences save ho gayi ✅');
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Preferences" subtitle="App kaise dikhe, kaise kaam kare" />

      <Field label="Bhasa (Language)">
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: 'hinglish', l: 'Hinglish', e: '🇮🇳', d: 'Hindi + English' },
            { k: 'hi', l: 'हिंदी', e: '🇮🇳', d: 'Fully Hindi' },
            { k: 'en', l: 'English', e: '🌍', d: 'Fully English' }
          ].map((l) => (
            <button
              key={l.k}
              type="button"
              onClick={() => update({ language: l.k })}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-center transition ${form.language === l.k
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
            >
              <span className="text-2xl">{l.e}</span>
              <span className="text-xs font-bold text-slate-900">{l.l}</span>
              <span className="text-[10px] text-slate-500">{l.d}</span>
            </button>
          ))}
        </div>
      </Field>

      <Field label="Theme">
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: 'light', l: 'Light', e: '☀️' },
            { k: 'dark', l: 'Dark', e: '🌙' },
            { k: 'system', l: 'Auto', e: '💻' }
          ].map((t) => (
            <button
              key={t.k}
              type="button"
              onClick={() => update({ theme: t.k })}
              className={`flex flex-col items-center gap-1 rounded-2xl border p-3 transition ${form.theme === t.k
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
            >
              <span className="text-xl">{t.e}</span>
              <span className="text-xs font-bold text-slate-900">{t.l}</span>
            </button>
          ))}
        </div>
      </Field>

      <Field label="Date Format">
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: 'dd/mm/yyyy', l: 'DD/MM/YYYY', ex: '14/09/2026' },
            { k: 'mm/dd/yyyy', l: 'MM/DD/YYYY', ex: '09/14/2026' },
            { k: 'dd-mmm-yy', l: 'DD-MMM-YY', ex: '14-Sep-26' }
          ].map((d) => (
            <button
              key={d.k}
              type="button"
              onClick={() => update({ dateFormat: d.k })}
              className={`flex flex-col items-center gap-0.5 rounded-2xl border p-3 transition ${form.dateFormat === d.k
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
            >
              <span className="text-xs font-bold text-slate-900">{d.l}</span>
              <span className="text-[10px] font-mono text-slate-500">{d.ex}</span>
            </button>
          ))}
        </div>
      </Field>

      <Field label="Number Format">
        <div className="grid grid-cols-2 gap-2">
          {[
            { k: 'indian', l: 'Indian', ex: '₹1,00,000' },
            { k: 'international', l: 'International', ex: '₹100,000' }
          ].map((n) => (
            <button
              key={n.k}
              type="button"
              onClick={() => update({ numberFormat: n.k })}
              className={`flex flex-col items-center gap-0.5 rounded-2xl border p-3 transition ${form.numberFormat === n.k
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
            >
              <span className="text-xs font-bold text-slate-900">{n.l}</span>
              <span className="text-[10px] font-mono text-slate-500">{n.ex}</span>
            </button>
          ))}
        </div>
      </Field>

      <div className="flex justify-end border-t border-stone-100 pt-4">
        <button onClick={save} disabled={saving} className="btn-primary btn-md">
          <Palette className="h-4 w-4" />
          {saving ? 'Save ho raha…' : 'Preferences Save Karein'}
        </button>
      </div>
    </div>
  );
}

// ===================== NOTIFICATIONS TAB =====================
function NotificationsTab({ notifs, onSaved }: any) {
  const [form, setForm] = useState({ ...notifs });
  const [saving, setSaving] = useState(false);

  const update = (p: any) => setForm((f: any) => ({ ...f, ...p }));

  const save = async () => {
    setSaving(true);
    try {
      await api.patch('/api/settings/notifications', form);
      toast.success('Notifications save ho gayi ✅');
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Notifications" subtitle="Kaun-kaun se alerts chahiye" />

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Alert Types
        </p>
        <ToggleRow
          label="🔴 Low Stock Alert"
          hint="Saman kam hone par turant batao"
          value={form.lowStockAlert}
          onChange={(v) => update({ lowStockAlert: v })}
        />
        <ToggleRow
          label="💰 Udhaar Reminder"
          hint="Grahak ka udhaar yaad dilao"
          value={form.udhaarReminder}
          onChange={(v) => update({ udhaarReminder: v })}
        />
        <ToggleRow
          label="📊 Daily Summary"
          hint="Roz raat ko aaj ki kamai ka summary"
          value={form.dailySummary}
          onChange={(v) => update({ dailySummary: v })}
        />
        <ToggleRow
          label="💎 Subscription Expiry"
          hint="Plan khatam hone se 7 din pehle alert"
          value={form.subscriptionExpiry}
          onChange={(v) => update({ subscriptionExpiry: v })}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Kaise bhejein
        </p>
        <ToggleRow
          label="💬 WhatsApp"
          hint="WhatsApp par message aayega"
          value={form.whatsappEnabled}
          onChange={(v) => update({ whatsappEnabled: v })}
        />
        <ToggleRow
          label="📱 SMS"
          hint="Mobile par SMS aayega"
          value={form.smsEnabled}
          onChange={(v) => update({ smsEnabled: v })}
        />
        <ToggleRow
          label="📧 Email"
          hint="Email par summary aayegi"
          value={form.emailEnabled}
          onChange={(v) => update({ emailEnabled: v })}
        />
      </div>

      {form.dailySummary && (
        <div className="animate-slide-down">
          <Field label="Daily Summary Time" hint="Roz is time par summary milega">
            <input
              type="time"
              value={form.summaryTime}
              onChange={(e) => update({ summaryTime: e.target.value })}
              className="input w-40"
            />
          </Field>
        </div>
      )}

      <div className="flex justify-end border-t border-stone-100 pt-4">
        <button onClick={save} disabled={saving} className="btn-primary btn-md">
          <Bell className="h-4 w-4" />
          {saving ? 'Save ho raha…' : 'Notifications Save Karein'}
        </button>
      </div>
    </div>
  );
}

function DataTab() {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportData = async (type: string) => {
    setExporting(type);
    try {
      await api.download(
        `/api/settings/export/${type}`,
        `${type}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      toast.success(`${type} export ho gaya ✅`);
    } catch (err: any) {
      toast.error(err.message || 'Export fail');
    } finally {
      setExporting(null);
    }
  };

  const items = [
    { k: 'products', l: 'Products CSV', hint: 'Saman ki poori list', e: '📦' },
    { k: 'customers', l: 'Customers CSV', hint: 'Grahak + udhaar balance', e: '👥' },
    { k: 'bills', l: 'Bills CSV', hint: 'Saari bills ki history', e: '🧾' }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Data Management" subtitle="Apna data download karein" />

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Export
        </p>
        <div className="space-y-2">
          {items.map((it) => {
            const loading = exporting === it.k;
            return (
              <div
                key={it.k}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-xl">
                  {it.e}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{it.l}</p>
                  <p className="text-[11px] text-slate-500">{it.hint}</p>
                </div>
                <button
                  onClick={() => exportData(it.k)}
                  disabled={loading}
                  className="btn-outline btn-sm shrink-0 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  {loading ? 'Wait…' : 'Export'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-brand-50 p-4 text-xs ring-1 ring-brand-100">
        <p className="font-bold text-brand-900">💡 Tip</p>
        <p className="mt-1 text-brand-700">
          Har mahine ek baar backup le lein. Data cloud mein safe hai,
          phir bhi apna copy rakhna samajhdari hai.
        </p>
      </div>
    </div>
  );
}

// ===================== SECURITY TAB =====================
function SecurityTab() {
  const { logout } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword.length < 6) return toast.error('Password kam se kam 6 chars');
    if (form.newPassword !== form.confirm) return toast.error('Password match nahi');

    setSaving(true);
    try {
      await api.post('/api/settings/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      toast.success('Password change ho gaya ✅');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Security" subtitle="Apna account safe rakhein" />

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-brand-600" />
          <p className="text-sm font-bold text-slate-900">Password badlein</p>
        </div>

        <Field label="Current password" required>
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            className="input"
            required
          />
        </Field>

        <Field label="Naya password" required hint="Kam se kam 6 characters">
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="input"
            required
            minLength={6}
          />
        </Field>

        <Field label="Confirm password" required>
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="input"
            required
          />
        </Field>

        <button type="submit" disabled={saving} className="btn-primary btn-md w-full">
          {saving ? 'Change ho raha…' : 'Password Change Karein'}
        </button>
      </form>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-bold text-red-900">🚪 Saare devices se logout</p>
        <p className="mt-1 text-xs text-red-700">
          Agar aapko shaq hai ki aapka account kisi aur ne access kiya,
          toh sabse logout kar dein.
        </p>
        <button
          onClick={() => {
            if (confirm('Saare devices se logout karein?')) logout();
          }}
          className="btn-danger btn-sm mt-3"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout from all devices
        </button>
      </div>
    </div>
  );
}

// ===================== SUPPORT TAB =====================
function SupportTab() {
  const SUPPORT_WA = '919876543210';
  const SUPPORT_EMAIL = 'help@bazaar-book.com';

  const items = [
    { icon: <MessageCircle className="h-5 w-5" />, label: 'WhatsApp Support', hint: 'Turant jawab • 9 AM – 9 PM', tone: 'lime', action: () => window.open(`https://wa.me/${SUPPORT_WA}`, '_blank') },
    { icon: <Phone className="h-5 w-5" />, label: 'Call karein', hint: '+91 98765 43210', tone: 'brand', action: () => (window.location.href = `tel:+91${SUPPORT_WA}`) },
    { icon: <Mail className="h-5 w-5" />, label: 'Email', hint: SUPPORT_EMAIL, tone: 'accent', action: () => (window.location.href = `mailto:${SUPPORT_EMAIL}`) }
  ];

  const tones: any = {
    lime: 'bg-lime-500 text-white',
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-50 text-accent-600'
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Madad / Support" subtitle="Hum yahan hain aapki help ke liye" />

      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-accent-500 p-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
          Priority Support
        </p>
        <p className="mt-1 font-display text-2xl font-extrabold">
          Kisi bhi mushkil mein? 🙋
        </p>
        <p className="mt-1 text-sm text-white/90">
          WhatsApp par turant jawab milega — 9 AM se 9 PM
        </p>
        <a
          href={`https://wa.me/${SUPPORT_WA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-md mt-4 bg-white text-brand-700 hover:bg-white/95"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp par chat karein
        </a>
      </div>

      <div className="space-y-2">
        {items.map((it: any) => (
          <button
            key={it.label}
            onClick={it.action}
            className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-stone-300"
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tones[it.tone]}`}>
              {it.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">{it.label}</p>
              <p className="text-xs text-slate-500">{it.hint}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-stone-50 p-4 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Version</span>
          <span className="font-mono font-bold">1.0.0</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span>Build</span>
          <span className="font-mono font-bold">{new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>
    </div>
  );
}

// ===================== SHARED =====================
function SectionHeader({ title, subtitle }: any) {
  return (
    <div className="mb-4">
      <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

function Field({ label, required, error, hint, children }: any) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>}
    </div>
  );
}

function ToggleRow({ label, hint, value, onChange }: any) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${value ? 'bg-lime-500' : 'bg-stone-300'
          }`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'
          }`} />
      </button>
    </div>
  );
}