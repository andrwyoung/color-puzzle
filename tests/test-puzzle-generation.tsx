// TESTS FOR GENERATE PUZZLE
import { generateDailyPuzzle, printBoard } from '../src/lib/generate-puzzle';

interface TestResult {
    attempt: number;
    date: string;
    duration: string;
    success: boolean;
}

function testSinglePuzzle(testDate: Date, attemptNumber: number): TestResult {
    const startTime = performance.now();
  
    try {
        const puzzle = generateDailyPuzzle(testDate);
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
    
        console.log(`Puzzle ${attemptNumber}: ${duration}ms - ${testDate.toDateString()}`);
    
        return {
            attempt: attemptNumber,
            date: testDate.toDateString(),
            duration,
            success: true
        };
    } catch (error) {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
    
        console.log(`Puzzle ${attemptNumber}: FAILED after ${duration}ms - ${testDate.toDateString()}`);
    
        return {
            attempt: attemptNumber,
            date: testDate.toDateString(),
            duration,
            success: false
        };
    }
}

function calculateStats(results: TestResult[]): void {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log('Performance Summary:');
    console.log(`Successful: ${successful.length}/${results.length}`);
    console.log(`Failed: ${failed.length}/${results.length}`);
    
    if (successful.length > 0) {
        const times = successful.map(r => parseFloat(r.duration));
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        
        console.log(`Average time: ${avgTime.toFixed(2)}ms`);
        console.log(`Fastest: ${minTime.toFixed(2)}ms`);
        console.log(`Slowest: ${maxTime.toFixed(2)}ms`);
    }
}

function testPuzzleGeneration(count: number = 10): void {
    console.log(`Testing puzzle generation performance (${count} puzzles)...\n`);
    
    const results: TestResult[] = [];
    
    for (let i = 0; i < count; i++) {
        // Use different dates to get different puzzles
        const testDate = new Date(`2025-08-${String(4 + i).padStart(2, '0')}`);
        const result = testSinglePuzzle(testDate, i + 1);
        results.push(result);
    }
    
    calculateStats(results);
}

function testSinglePuzzleDetailed(): void {
    console.log('Single puzzle in detail...');
    
    const testDate = new Date('2025-08-04');
    try {
        const puzzle = generateDailyPuzzle(testDate);
        console.log('Generated puzzle:');
        printBoard(puzzle);
        console.log(`Completed cells: ${puzzle.flat().filter(c => c !== 0).length}/55`);
    } catch (error) {
        console.error('Failed to generate detailed puzzle:', error);
    }
}

// Run the tests
testPuzzleGeneration(10);
testSinglePuzzleDetailed();