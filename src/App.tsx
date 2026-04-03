import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Star, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMatch3 } from './hooks/useMatch3';
import { GEM_CONFIG, LevelConfig } from './types';

const LEVEL_CONFIG: LevelConfig = {
  rows: 8,
  cols: 8,
  targetScore: 1000,
  moves: 25,
};

export default function App() {
  const {
    grid,
    score,
    movesLeft,
    isProcessing,
    selectedGem,
    handleGemClick,
    resetGame
  } = useMatch3(LEVEL_CONFIG);

  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');

  useEffect(() => {
    if (gameState === 'playing') {
      if (score >= LEVEL_CONFIG.targetScore) {
        setGameState('won');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF69B4', '#7FFFD4', '#9370DB', '#FFA07A']
        });
      } else if (movesLeft <= 0 && !isProcessing) {
        setGameState('lost');
      }
    }
  }, [score, movesLeft, isProcessing, gameState]);

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-100 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      {/* Header HUD */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50">
        <div className="flex flex-col items-center px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Target</span>
          <span className="text-xl font-black text-indigo-600">{LEVEL_CONFIG.targetScore}</span>
        </div>
        <div className="flex flex-col items-center px-6 border-x border-gray-100">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Score</span>
          <motion.span 
            key={score}
            initial={{ scale: 1.2, color: '#4F46E5' }}
            animate={{ scale: 1, color: '#1F2937' }}
            className="text-3xl font-black"
          >
            {score}
          </motion.span>
        </div>
        <div className="flex flex-col items-center px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Moves</span>
          <span className={`text-xl font-black ${movesLeft < 5 ? 'text-red-500 animate-pulse' : 'text-pink-500'}`}>
            {movesLeft}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative p-3 bg-white/40 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border-4 border-white/60">
        <div 
          className="grid gap-2 bg-indigo-900/5 p-2 rounded-[2rem]"
          style={{ 
            gridTemplateColumns: `repeat(${LEVEL_CONFIG.cols}, minmax(0, 1fr))`,
            width: 'min(90vw, 450px)',
            aspectRatio: '1/1'
          }}
        >
          {grid.map((row, r) => 
            row.map((gem, c) => (
              <div 
                key={`${r}-${c}`}
                className="relative aspect-square"
              >
                <AnimatePresence mode="popLayout">
                  {gem && (
                    <motion.button
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: selectedGem?.row === r && selectedGem?.col === c ? 0.9 : 1,
                        opacity: 1,
                        y: 0
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGemClick(r, c)}
                      className={`w-full h-full rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 ${
                        GEM_CONFIG[gem.type].color
                      } ${
                        selectedGem?.row === r && selectedGem?.col === c 
                          ? 'ring-4 ring-white ring-offset-2 scale-90 z-10' 
                          : 'hover:brightness-110'
                      }`}
                    >
                      {(() => {
                        const Icon = GEM_CONFIG[gem.type].icon;
                        // Check if it's a Lucide icon (function with a name) or a custom component
                        if (typeof Icon === 'function' && Icon.name) {
                          return <Icon className="w-2/3 h-2/3 text-white drop-shadow-md" strokeWidth={3} />;
                        }
                        // Otherwise render as a custom component (like our <img> wrapper)
                        return <Icon />;
                      })()}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {gameState !== 'playing' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-900/40 backdrop-blur-md rounded-[2.5rem]"
            >
              <motion.div 
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white p-8 rounded-[3rem] shadow-2xl text-center max-w-[80%]"
              >
                {gameState === 'start' && (
                  <>
                    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-10 h-10 text-pink-500 fill-pink-500 ml-1" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 mb-2">Gem Match</h1>
                    <p className="text-gray-500 mb-6 font-medium">Match 3 or more gems to score points! Reach {LEVEL_CONFIG.targetScore} to win.</p>
                    <button 
                      onClick={startGame}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95"
                    >
                      Start Adventure
                    </button>
                  </>
                )}

                {gameState === 'won' && (
                  <>
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">Amazing!</h2>
                    <p className="text-gray-500 mb-2 font-medium">You reached the target!</p>
                    <div className="text-4xl font-black text-indigo-600 mb-6">{score} pts</div>
                    <button 
                      onClick={startGame}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" /> Play Again
                    </button>
                  </>
                )}

                {gameState === 'lost' && (
                  <>
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10 text-red-500 fill-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-2">Out of Moves!</h2>
                    <p className="text-gray-500 mb-6 font-medium">Don't give up, try again!</p>
                    <button 
                      onClick={startGame}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" /> Try Again
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex gap-4">
        <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full text-sm font-bold text-gray-500 border border-white">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          Level 1
        </div>
        <button 
          onClick={resetGame}
          className="p-2 bg-white/50 hover:bg-white rounded-full text-gray-500 border border-white transition-all active:rotate-180 duration-500"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
