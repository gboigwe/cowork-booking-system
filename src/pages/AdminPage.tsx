import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { formatNaira, formatDate } from '../utils/helpers';
import Logo from '../components/Logo';
import type { AdminOverview, InterestSignup } from '../types';

const TOKEN_KEY = 'zonein_admin_token';

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function AdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [interest, setInterest] = useState<InterestSignup[] | null>(null);

  const loadOverview = async (t: string) => {
    try {
      const data = await api.adminOverview(t);
      setOverview(data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    }
  };

  const loadInterest = async (t: string) => {
    try {
      const data = await api.adminInterestSignups(t);
      setInterest(data);
    } catch {
      // overview's own failure already handles logging out on an invalid token
    }
  };

  useEffect(() => {
    if (token) {
      loadOverview(token);
      loadInterest(token);
    }
  }, [token]);

  const handleExportInterest = () => {
    if (!interest || interest.length === 0) return;
    downloadCsv(
      `zonein-interest-${new Date().toISOString().slice(0, 10)}.csv`,
      [['Name', 'Email', 'Signed up'], ...interest.map(s => [s.name, s.email, formatDate(s.createdAt)])],
    );
  };

  const handleLogin = async () => {
    setLoginError(false);
    try {
      const { token: newToken } = await api.adminLogin(password);
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    } catch {
      setLoginError(true);
    }
  };

  const handleToggleBlock = async (deskId: string) => {
    if (!token) return;
    await api.adminToggleBlock(deskId, token);
    loadOverview(token);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    if (!token) return;
    await api.adminConfirmBooking(bookingId, token);
    loadOverview(token);
  };

  return (
    <div className="min-h-screen bg-zonein-cream-alt px-5 sm:px-8 py-8">
      <title>Staff | ZoneIn Hub</title>
      <meta name="robots" content="noindex, nofollow" />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Logo />
          <span className="font-display font-bold text-lg text-zonein-ink">Staff</span>
        </div>

        {!token ? (
          <div className="bg-zonein-cream border border-zonein-border rounded-xl p-8 max-w-sm">
            <label className="block text-[13px] font-semibold text-zonein-gray mb-2">Staff password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full px-3 py-3 border border-zonein-border rounded-lg text-[15px] outline-none focus:border-zonein-green transition-colors mb-4"
            />
            {loginError && <p className="text-sm text-red-600 mb-3">Incorrect password.</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-zonein-ink text-zonein-cream font-display font-semibold rounded-lg py-3 text-sm hover:opacity-90 transition-opacity"
            >
              Log in
            </button>
          </div>
        ) : overview && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="bg-zonein-cream border border-zonein-border rounded-xl p-4">
                <p className="text-xs text-zonein-gray mb-1">Total bookings</p>
                <p className="font-display font-bold text-xl text-zonein-ink">{overview.totalBookings}</p>
              </div>
              <div className="bg-zonein-cream border border-zonein-border rounded-xl p-4">
                <p className="text-xs text-zonein-gray mb-1">Total revenue</p>
                <p className="font-display font-bold text-xl text-zonein-ink">{formatNaira(overview.totalRevenue)}</p>
              </div>
            </div>

            <p className="font-display font-semibold text-base text-zonein-ink mb-4">Today's desk grid</p>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {overview.desks.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleToggleBlock(d.id)}
                  className={`w-[70px] h-14 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                    d.isAvailable ? 'bg-white text-zonein-ink border border-zonein-border' : 'bg-zonein-ink text-zonein-cream'
                  }`}
                >
                  {d.id}
                </button>
              ))}
            </div>

            <p className="font-display font-semibold text-base text-zonein-ink mb-4">
              Today's bookings ({overview.todaysBookings.length})
            </p>
            <div className="bg-zonein-cream border border-zonein-border rounded-xl overflow-hidden">
              {overview.todaysBookings.length === 0 ? (
                <p className="px-5 py-6 text-sm text-zonein-gray">No bookings today.</p>
              ) : (
                overview.todaysBookings.map(b => (
                  <div key={b.id} className="px-5 py-3.5 border-b border-zonein-border last:border-b-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-semibold text-zonein-ink shrink-0">{b.deskName}</span>
                      <span className="text-sm text-zonein-gray truncate">{b.holderName} · {b.holderPhone}</span>
                    </div>
                    {b.status === 'confirmed' ? (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.04em] px-2.5 py-1 rounded-md bg-zonein-green/15 text-zonein-green-dark shrink-0">
                        Confirmed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConfirmBooking(b.id)}
                        className="text-[13px] font-display font-semibold text-zonein-cream bg-zonein-green hover:bg-zonein-green-dark rounded-lg px-3.5 py-1.5 shrink-0 transition-colors"
                      >
                        Confirm
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between mb-4 mt-8">
              <p className="font-display font-semibold text-base text-zonein-ink">
                Interest signups ({interest?.length ?? 0})
              </p>
              <button
                onClick={handleExportInterest}
                disabled={!interest || interest.length === 0}
                className="text-[13px] font-display font-semibold text-zonein-green-dark border border-zonein-green rounded-lg px-3.5 py-1.5 hover:bg-zonein-green/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Download CSV
              </button>
            </div>
            <div className="bg-zonein-cream border border-zonein-border rounded-xl overflow-y-auto max-h-80">
              {!interest || interest.length === 0 ? (
                <p className="px-5 py-6 text-sm text-zonein-gray">No signups yet.</p>
              ) : (
                interest.map(s => (
                  <div key={s.id} className="px-5 py-3.5 border-b border-zonein-border last:border-b-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-semibold text-zonein-ink shrink-0">{s.name}</span>
                      <span className="text-sm text-zonein-gray truncate">{s.email}</span>
                    </div>
                    <span className="text-xs text-zonein-gray shrink-0">{formatDate(s.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
