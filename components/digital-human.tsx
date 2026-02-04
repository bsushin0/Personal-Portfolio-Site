'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Mic, MicOff } from 'lucide-react'

export default function DigitalHuman() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Simulate 'Alive' behavior (random speaking states)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsSpeaking(true)
        setTimeout(() => setIsSpeaking(false), 2000)
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-3xl shadow-2xl border border-white/10">
      {/* 1. BACKGROUND: Cyber-Physical Environment */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="absolute top-0 inset-x-0 h-64 bg-indigo-500/10 blur-[100px]" />
      </div>

      {/* 2. THE AVATAR: Simulated Live Portrait */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div className={cn(
          'relative w-[90%] h-[90%] transition-all duration-700 ease-in-out origin-bottom',
          'animate-breathe',
          isSpeaking && 'scale-[1.02]'
        )}>
          {/* IMAGE: Expects 'avatar-portrait.png' in public folder */}
          <img 
            src="/avatar-portrait.png" 
            alt="Sushin Bandha AI" 
            className="w-full h-full object-cover object-top drop-shadow-2xl"
            style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
          />
          
          {/* Cyber Eye Glow */}
          <div className="absolute top-[35%] left-[32%] w-1 h-1 bg-cyan-400 rounded-full blur-[1px] opacity-40 animate-blink" />
          <div className="absolute top-[35%] right-[32%] w-1 h-1 bg-cyan-400 rounded-full blur-[1px] opacity-40 animate-blink" />
        </div>
      </div>

      {/* 3. INTERFACE OVERLAY */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 z-20">
        {/* Header Status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-full px-4 py-2">
            <div className={cn('w-2 h-2 rounded-full animate-pulse', isSpeaking ? 'bg-cyan-400' : 'bg-green-500')} />
            <span className="text-xs font-medium text-white/90">
              {isSpeaking ? 'AI Speaking...' : 'System Online'}
            </span>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="space-y-4">
          {isSpeaking && (
            <div className="mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-4">
              <p className="text-sm text-center text-white/90 font-light">
                &apos;I am Sushin&apos;s digital twin. Analyzing product requirements...&apos;
              </p>
            </div>
          )}
          <div className="flex items-center justify-center space-x-6">
            <button 
              onClick={() => setIsListening(!isListening)}
              className={cn(
                'flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300',
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_30px_rgba(99,102,241,0.4)]'
              )}
            >
              {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
