import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import { FileText, Sparkles, LogOut, LayoutDashboard, MessageSquareText, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border/80 bg-dark-bg/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-[1px] shadow-glow-sm transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-dark-bg rounded-[11px] flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-brand-400 transition-colors">
                DocuMind
              </span>
            </div>
            <p className="text-[11px] text-dark-muted hidden sm:block">Document Intelligence Platform</p>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-surface/50 border border-dark-border/60 rounded-full px-3 py-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive('/dashboard')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Documents
          </Link>

          <Link
            to="/chat"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive('/chat')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            AI Chat
          </Link>

          <a
            href="/#architecture"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Architecture
          </a>

          <a
            href="/#security"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Security
          </a>
        </nav>

        {/* User / Auth Action */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-medium text-white">{user?.name || 'User'}</span>
                <span className="text-[10px] text-dark-muted">{user?.email || 'Authenticated'}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 font-semibold text-xs">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-1.5 rounded-lg text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-brand-500 hover:bg-brand-600 text-white shadow-glow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
