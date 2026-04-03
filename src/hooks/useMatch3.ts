import { useState, useEffect, useCallback } from 'react';
import { Gem, GemType, GEM_TYPES, Position, LevelConfig } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useMatch3 = (config: LevelConfig) => {
  const [grid, setGrid] = useState<(Gem | null)[][]>([]);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(config.moves);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGem, setSelectedGem] = useState<Position | null>(null);

  // Initialize grid
  const initGrid = useCallback(() => {
    const newGrid: (Gem | null)[][] = [];
    for (let r = 0; r < config.rows; r++) {
      newGrid[r] = [];
      for (let c = 0; c < config.cols; c++) {
        let type: GemType;
        // Ensure no initial matches
        do {
          type = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
        } while (
          (r >= 2 && newGrid[r - 1][c]?.type === type && newGrid[r - 2][c]?.type === type) ||
          (c >= 2 && newGrid[r][c - 1]?.type === type && newGrid[r][c - 2]?.type === type)
        );
        newGrid[r][c] = { id: generateId(), type };
      }
    }
    setGrid(newGrid);
    setScore(0);
    setMovesLeft(config.moves);
    setIsProcessing(false);
    setSelectedGem(null);
  }, [config]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const findMatches = (currentGrid: (Gem | null)[][]) => {
    const matches: Position[] = [];
    const rows = currentGrid.length;
    const cols = currentGrid[0].length;

    // Horizontal
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 2; c++) {
        const type = currentGrid[r][c]?.type;
        if (type && currentGrid[r][c + 1]?.type === type && currentGrid[r][c + 2]?.type === type) {
          matches.push({ row: r, col: c }, { row: r, col: c + 1 }, { row: r, col: c + 2 });
        }
      }
    }

    // Vertical
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 2; r++) {
        const type = currentGrid[r][c]?.type;
        if (type && currentGrid[r + 1][c]?.type === type && currentGrid[r + 2][c]?.type === type) {
          matches.push({ row: r, col: c }, { row: r + 1, col: c }, { row: r + 2, col: c });
        }
      }
    }

    return Array.from(new Set(matches.map(p => `${p.row},${p.col}`))).map(s => {
      const [row, col] = s.split(',').map(Number);
      return { row, col };
    });
  };

  const processBoard = async (currentGrid: (Gem | null)[][]) => {
    let board = JSON.parse(JSON.stringify(currentGrid));
    let totalMatchesFound = 0;

    while (true) {
      const matches = findMatches(board);
      if (matches.length === 0) break;

      totalMatchesFound += matches.length;
      
      // Clear matches
      matches.forEach(({ row, col }) => {
        board[row][col] = null;
      });
      setGrid([...board]);
      await new Promise(r => setTimeout(r, 300));

      // Drop gems
      for (let c = 0; c < config.cols; c++) {
        let emptyRow = config.rows - 1;
        for (let r = config.rows - 1; r >= 0; r--) {
          if (board[r][c] !== null) {
            const temp = board[r][c];
            board[r][c] = null;
            board[emptyRow][c] = temp;
            emptyRow--;
          }
        }
      }
      setGrid([...board]);
      await new Promise(r => setTimeout(r, 200));

      // Refill
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          if (board[r][c] === null) {
            board[r][c] = {
              id: generateId(),
              type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)]
            };
          }
        }
      }
      setGrid([...board]);
      await new Promise(r => setTimeout(r, 200));
    }

    if (totalMatchesFound > 0) {
      setScore(prev => prev + totalMatchesFound * 10);
    }
    setIsProcessing(false);
  };

  const swapGems = async (p1: Position, p2: Position) => {
    if (isProcessing || movesLeft <= 0) return;

    setIsProcessing(true);
    const newGrid = JSON.parse(JSON.stringify(grid));
    const temp = newGrid[p1.row][p1.col];
    newGrid[p1.row][p1.col] = newGrid[p2.row][p2.col];
    newGrid[p2.row][p2.col] = temp;

    setGrid([...newGrid]);
    await new Promise(r => setTimeout(r, 300));

    const matches = findMatches(newGrid);
    if (matches.length > 0) {
      setMovesLeft(prev => prev - 1);
      await processBoard(newGrid);
    } else {
      // Swap back if no match
      const revertedGrid = JSON.parse(JSON.stringify(grid));
      setGrid([...revertedGrid]);
      setIsProcessing(false);
    }
  };

  const handleGemClick = (row: number, col: number) => {
    if (isProcessing || movesLeft <= 0) return;

    if (!selectedGem) {
      setSelectedGem({ row, col });
    } else {
      const distance = Math.abs(selectedGem.row - row) + Math.abs(selectedGem.col - col);
      if (distance === 1) {
        swapGems(selectedGem, { row, col });
        setSelectedGem(null);
      } else {
        setSelectedGem({ row, col });
      }
    }
  };

  return {
    grid,
    score,
    movesLeft,
    isProcessing,
    selectedGem,
    handleGemClick,
    resetGame: initGrid
  };
};
