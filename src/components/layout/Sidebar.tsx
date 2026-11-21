import React, { useState } from 'react';
import { FileText, LogOut, Menu, X } from 'lucide-react';
import { UserProfile } from '../../types/auth.types';

interface SidebarProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const displayName = user?.name || 'Dra. Mariana Gomes';
  const displayEmail = user?.email || 'mariana@silvagomes.com';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full w-[235px] bg-[#2E9E5B] text-white select-none">
      {/* Top Workspace Header */}
      <div>
        <div className="px-5 pt-6 pb-4 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-white leading-tight tracking-tight">
              Escritório
            </h2>
            <p
              className="text-[12px] text-white/80 mt-0.5 font-normal truncate"
              title={displayName}
            >
              {displayName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-white/80 hover:text-white p-1"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 mt-2" aria-label="Menu principal">
          <div className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/20 text-white text-[14px] font-medium shadow-sm">
            <FileText className="w-4 h-4 text-white shrink-0" />
            <span>Documentos</span>
          </div>
        </nav>
      </div>

      {/* Bottom User Profile from Google OAuth */}
      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          {user?.picture && !imgError ? (
            <img
              src={user.picture}
              alt={displayName}
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-full object-cover border border-white/25 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials || 'MG'}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p
              className="text-[13px] font-semibold text-white truncate leading-tight"
              data-testid="sidebar-user-name"
            >
              {displayName}
            </p>
            <p
              className="text-[11px] text-white/80 truncate mt-0.5"
              data-testid="sidebar-user-email"
            >
              {displayEmail}
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Sair da conta"
            aria-label="Sair da conta"
            className="p-1.5 rounded-lg text-white/75 hover:text-white hover:bg-white/15 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-[#2E9E5B] text-white px-4 py-3 shrink-0">
        <div className="min-w-0 flex items-center truncate">
          <span className="text-sm font-bold shrink-0">Escritório</span>
          <span className="text-xs text-white/80 ml-2 truncate">{displayName}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg hover:bg-white/15"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block shrink-0 min-h-screen">{sidebarContent}</aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <button
            type="button"
            aria-label="Fechar menu lateral"
            className="fixed inset-0 w-full h-full bg-black/40 border-0 p-0 cursor-default transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
