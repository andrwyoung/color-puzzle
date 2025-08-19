import { useEffect, useState } from 'react';
import { BASE_CELL_SIZE, MIN_CELL_SIZE, PADDING_ALLOWANCE } from "../lib/constants/ui-constants";
import { BOARD_ROWS, BOARD_COLS } from "../lib/constants/board-constants";

export function useResponsiveCellSize() {
    const [cellSize, setCellSize] = useState(BASE_CELL_SIZE);
    const [scaleContainer, setScaleContainer] = useState('scale(1)');

    useEffect(() => {
        const calculateResponsiveSize = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate available space for the board
        const availableWidth = windowWidth - PADDING_ALLOWANCE;
        const availableHeight = windowHeight - 300; // Reserve space for header, pieces, etc.
        
        // Calculate what cell size would fit based on board dimensions
        const maxCellSizeByWidth = Math.floor(availableWidth / BOARD_COLS);
        const maxCellSizeByHeight = Math.floor(availableHeight / BOARD_ROWS);
        
        // Use the smaller constraint
        let newCellSize = Math.min(maxCellSizeByWidth, maxCellSizeByHeight, BASE_CELL_SIZE);
        
        // If the calculated cell size is too small, use minimum and scale the container
        if (newCellSize < MIN_CELL_SIZE) {
            const scaleFactor = newCellSize / MIN_CELL_SIZE;
            setCellSize(MIN_CELL_SIZE);
            setScaleContainer(`scale(${Math.max(scaleFactor, 0.5)})`); // Don't scale below 0.5
        } else {
            setCellSize(newCellSize);
            setScaleContainer('scale(1)');
        }
        };

        calculateResponsiveSize();
        
        const handleResize = () => {
        calculateResponsiveSize();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        cellSize,
        scaleContainer
    };
}