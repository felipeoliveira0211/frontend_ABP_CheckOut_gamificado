import React, { useState } from 'react';
import { useCheckout } from '../hooks/useCheckout.js';
import { Sparkles, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const OPCOES_DESCONTO = [
  { valor: 5, label: '5% OFF', cor: '#0e1d2f', text: '#22d3ee' },
  { valor: 10, label: '10% OFF', cor: '#1e1b4b', text: '#a78bfa' },
  { valor: 15, label: '15% OFF', cor: '#0e1d2f', text: '#22d3ee' },
  { valor: 20, label: '20% OFF', cor: '#1e1b4b', text: '#a78bfa' },
  { valor: 25, label: '25% CRÍTICO!', cor: '#111827', text: '#10b981' },
  { valor: 7, label: '7% OFF', cor: '#1e1d3e', text: '#ec4899' },
];

export const DiscountWheel = () => {
  const { descontoRoleta, roletaGiraJa, giraRoleta } = useCheckout();
  const [spinning, setSpinning] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);
  const [ganhador, setGanhador] = useState(null);

  const iniciarGiro = () => {
    if (roletaGiraJa || spinning) return;

    setSpinning(true);
    setGanhador(null);

    // Business rule: Probability weighting
    const rand = Math.random() * 100;
    let indexSorteado = 0;

    if (rand < 50) {
      indexSorteado = 0; // 5% OFF
    } else if (rand < 75) {
      indexSorteado = 5; // 7% OFF
    } else if (rand < 90) {
      indexSorteado = 1; // 10% OFF
    } else if (rand < 97) {
      indexSorteado = 2; // 15% OFF
    } else if (rand < 99) {
      indexSorteado = 3; // 20% OFF
    } else {
      indexSorteado = 4; // 25% CRÍTICO!
    }

    const itemSorteado = OPCOES_DESCONTO[indexSorteado];
    
    // Each sector is 60 degrees (360 / 6)
    const step = 360 / OPCOES_DESCONTO.length;
    const baseSpins = 1800 + (360 * 2); // 7 full spins
    const targetSectorCenter = indexSorteado * step + 60; // 30 is slice center + 30 is SVG's rotate-30
    const angleOffset = (270 - targetSectorCenter + 3600) % 360;
    const novaRotacao = baseSpins + angleOffset;

    setTargetRotation(novaRotacao);

    setTimeout(() => {
      setSpinning(false);
      setGanhador(itemSorteado.valor);
      giraRoleta(itemSorteado.valor);
    }, 4000);
  };

  return (
    <div id="gamer-roulette-container" className="rounded-xl p-5 border border-zinc-700 bg-[#12131b] flex flex-col items-center">
      
      {/* Title */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-1.5 text-cyan-400">
          <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-sans">
            Roleta de Desconto Extra
          </h2>
        </div>
        <p className="text-xs text-zinc-400 mt-1 px-4 leading-relaxed font-sans">
          Gire a roleta de desconto para conseguir um bônus especial direto em seu carrinho de compras!
        </p>
      </div>

      {/* Main Wheel Area */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-6">
        
        {/* Pointer */}
        <div className="absolute -top-1.5 z-20 flex flex-col items-center">
          <ArrowDown className="h-5 w-5 text-cyan-400 animate-bounce fill-cyan-400" />
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </div>

        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-700 bg-transparent flex items-center justify-center pointer-events-none z-10" />
        
        {/* Disk */}
        <div 
          id="roulette-wheel-plate"
          style={{
            transform: `rotate(${targetRotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none'
          }}
          className="relative w-56 h-56 rounded-full overflow-hidden border border-zinc-700 bg-[#0c0d14] flex items-center justify-center"
        >
          {/* SVG Sectors */}
          <svg className="absolute inset-0 w-full h-full transform rotate-30" viewBox="0 0 100 100">
            {OPCOES_DESCONTO.map((opcao, i) => {
              const totalOpcoes = OPCOES_DESCONTO.length;
              const angle = 360 / totalOpcoes;
              const startAngle = i * angle;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = ((startAngle + angle) * Math.PI) / 180;
              
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              
              const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              const textAngle = startAngle + (angle / 2);
              const textRad = (textAngle * Math.PI) / 180;
              const textX = 50 + 32 * Math.cos(textRad);
              const textY = 50 + 32 * Math.sin(textRad);

              return (
                <g key={i}>
                  <path d={d} fill={opcao.cor} stroke="#1e2238" strokeWidth="0.5" />
                  <text
                    x={textX}
                    y={textY}
                    fill={opcao.text}
                    fontSize="4"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                  >
                    {opcao.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Central Core */}
          <div className="absolute w-12 h-12 rounded-full bg-[#0c0d14] border border-zinc-700 flex items-center justify-center z-10">
            <div className={`w-7 h-7 rounded-full ${spinning ? 'bg-cyan-500 animate-pulse' : 'bg-cyan-500/10'} border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[9px] font-bold`}>
              GEEK
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons & automated status */}
      <div className="w-full text-center">
        {!roletaGiraJa ? (
          <button
            id="btn-spin-roulette"
            onClick={iniciarGiro}
            disabled={spinning}
            className={`w-full py-2.5 px-6 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              spinning
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400'
            }`}
          >
            {spinning ? 'Girando roleta...' : 'Girar Roleta!'}
          </button>
        ) : (
          <div className="rounded-xl bg-cyan-950/20 border border-cyan-500/10 p-3 flex flex-col items-center">
            <p className="text-xs font-semibold text-white">
              Bônus recebido: <strong className="text-cyan-400 font-bold text-sm">+{descontoRoleta}% de Desconto Extra</strong> aplicado sobre o subtotal!
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {spinning && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[11px] text-cyan-400 mt-3 animate-pulse"
            >
              Cruzando os dedos...
            </motion.p>
          )}

          {ganhador !== null && !spinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2"
            >
              <p className="text-[11px] text-emerald-400 font-medium">
                Parabéns! Você ganhou +<strong className="font-bold">{ganhador}%</strong> de desconto extra para as suas compras!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
