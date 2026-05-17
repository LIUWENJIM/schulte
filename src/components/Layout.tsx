import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {!isHome && (
        <header
          className="flex items-center justify-between px-4 py-3 sticky top-0 z-10"
          style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-hairline)' }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-base font-semibold"
            style={{ color: 'var(--color-ink)' }}
          >
            <span className="text-lg">🎯</span>
            舒尔特方格
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
            style={{ background: 'var(--color-canvas)', color: 'var(--color-muted)', border: '1px solid var(--color-hairline)' }}
          >
            首页
          </button>
        </header>
      )}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
