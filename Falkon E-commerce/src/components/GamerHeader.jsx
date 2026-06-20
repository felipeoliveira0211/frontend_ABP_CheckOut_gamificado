import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GamerHeader = () => {
  return (
    <header className="border-b border-zinc-800 bg-[#0c0d14] py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link 
          to="/" 
          id="falkon-logo-link"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500 text-[#090a0f]">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white uppercase font-sans">
                Falkon
              </span>
              <span className="rounded bg-cyan-900/50 border border-cyan-500/30 px-2 py-0.5 text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                Geek
              </span>
            </div>
          </div>
        </Link>

      </div>
    </header>
  );
};
