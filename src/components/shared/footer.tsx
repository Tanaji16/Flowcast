import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <div className="container mx-auto px-4">
        Flowcast © {new Date().getFullYear()} — Intelligent Event Flow & Crowd Dynamics Optimization.
      </div>
    </footer>
  );
}
