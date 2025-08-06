// GENERATE A RANDOM PUZZLE USING THE DATE AS THE SEED

import { BOARD_ROWS, BOARD_COLS, type Board } from "../types/board.ts";

// Seeded number generator
const MODULUS = 2 ** 32;
const MULTIPLIER = 1664525;
const INCREMENT = 1013904223;

export function createSeededRandom(seed: number) {
  let currentSeed = seed;

  const next = () => {
    currentSeed = (currentSeed * MULTIPLIER + INCREMENT) % MODULUS;
    return currentSeed / MODULUS;
  };

  const nextInt = (min: number, max: number) => {
    return Math.floor(next() * (max - min)) + min;
  };

  return { next, nextInt };
}

// Initialize seeded random using today's date
export function initSeededRandomWithDate(date: Date) {
  const dateString = date.toISOString().split("T")[0];
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = seed * 31 + dateString.charCodeAt(i);
  }
  return createSeededRandom(seed);
}

// Create shuffled array using Fisher Yates, seeded random
export function shuffleArray<T>(
  array: T[],
  random: ReturnType<typeof createSeededRandom>
): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = random.nextInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create empty board (5x11)
export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0));
}

// TO-DO: VALID PIECE PLACEMENTS LOGIC
/*
1. Check valid piece placement.
(2. Place piece)
(3. Remove piece)
*/

// TO-DO: SHUFFLE VARIATIONS

// TO-DO: SOLVE BACKWARDS
/* 
Flow:
1. Shuffle the piece IDs -> this is the order in which pieces are placed.
2. For each piece:
    a. (First, shuffle the variations -> this is the order in which variations (aka flips, rotations) are tested)
    aa. Convert from relative to absolute coordinates. ??? (this may need to happen earlier)
    b. Place it on the board.
    c. Check if it's valid.
    d. If so, move on to the next piece.
    e. If not, try the next position. Return to step d.
    f. If the above don't work, then try next variation from the first valid position. Repeat b. - e.; try all positions for a variation.
    g. If all options are exhausted, remove the previous piece. Make the needed position/variation change, then continue.
    h. Mathematically, some arbitrary solution will be reached.
3. Check if the board is complete (automatically when final piece placed). If so, this is the solution.
*/

//TO-DO: WRAPPER
/* 
1. Generate a solved board.
2. Print it.
3. (Store it somewhere)
*/
