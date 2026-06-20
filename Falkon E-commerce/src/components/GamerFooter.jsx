import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const GamerFooter = () => {
  return (
    <footer className="mt-16 border-t border-zinc-800 bg-[#07080d] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <Gamepad2 className="h-5 w-5 text-cyan-400" />
          <span className="text-white font-bold tracking-wider uppercase font-sans text-sm">
            Falkon Geek
          </span>
        </div>

        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed mb-6">
          "Que a força esteja com você em cada fase e que seus itens lendários vençam qualquer chefe final!"
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-zinc-500">
          <span>Criciúma, SC</span>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span>Contato: contato@falkongeek.com.br</span>
        </div>

        <p className="mt-8 text-[11px] text-zinc-650">
          &copy; {new Date().getFullYear()} Falkon Geek. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};
