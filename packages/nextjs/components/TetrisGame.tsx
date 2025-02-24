import React, { useEffect, useRef, useState } from "react";

type TetrominoShape = number[][];
type Position = { x: number; y: number };

const SHAPES: TetrominoShape[] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [1, 1, 1],
    [0, 1, 0],
  ], // T
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // L
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // J
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
];

const COLORS = [
  "#00FFFF", // Неоновый голубой (I)
  "#FFFF00", // Яркий желтый (O)
  "#FF00FF", // Неоновый розовый (T)
  "#FF6600", // Яркий оранжевый (L)
  "#00CCFF", // Светло-голубой (J)
  "#00FF00", // Неоновый зеленый (S)
  "#FF3333", // Яркий красный (Z)
];

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const TetrisGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<number[][]>(Array(ROWS).fill(Array(COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState<{
    shape: TetrominoShape;
    pos: Position;
    color: string;
  } | null>(null);
  const [nextPiece, setNextPiece] = useState<{
    shape: TetrominoShape;
    color: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Создание новой фигуры
  const spawnPiece = (currentBoard: number[][]) => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    const newPiece = {
      shape,
      pos: { x: Math.floor((COLS - shape[0].length) / 2), y: 0 },
      color: COLORS[shapeIndex],
    };
    if (collides(currentBoard, newPiece.shape, newPiece.pos)) {
      console.log("Cannot spawn new piece — Game Over!");
      return null;
    }
    return newPiece;
  };

  // Генерация следующей фигуры
  const generateNextPiece = () => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      color: COLORS[shapeIndex],
    };
  };

  // Проверка столкновений
  const collides = (board: number[][], shape: TetrominoShape, pos: Position) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Объединение фигуры с доской
  const mergePiece = (board: number[][], piece: { shape: TetrominoShape; pos: Position }) => {
    const newBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          newBoard[y + piece.pos.y][x + piece.pos.x] = 1;
        }
      });
    });
    return newBoard;
  };

  // Удаление заполненных строк
  const clearLines = (board: number[][]) => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell === 1)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    while (newBoard.length < ROWS) {
      newBoard.unshift(Array(COLS).fill(0));
    }
    setScore(prev => prev + linesCleared * 10);
    return newBoard;
  };

  // Поворот фигуры
  const rotatePiece = (shape: TetrominoShape) => {
    const newShape = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
    return newShape;
  };

  // Обработка движения
  const movePiece = (dx: number, dy: number, rotate = false) => {
    if (!currentPiece || gameOver) return;

    const newPos = { x: currentPiece.pos.x + dx, y: currentPiece.pos.y + dy };
    let newShape = currentPiece.shape;
    if (rotate) {
      newShape = rotatePiece(currentPiece.shape);
    }

    if (!collides(board, newShape, newPos)) {
      setCurrentPiece({ ...currentPiece, pos: newPos, shape: newShape });
    } else if (dy > 0) {
      const newBoard = mergePiece(board, currentPiece);
      const updatedBoard = clearLines(newBoard);
      setBoard(updatedBoard);

      // Используем nextPiece как следующую фигуру
      const newCurrentPiece = nextPiece
        ? {
            ...nextPiece,
            pos: { x: Math.floor((COLS - nextPiece.shape[0].length) / 2), y: 0 },
          }
        : spawnPiece(updatedBoard);

      if (!newCurrentPiece || collides(updatedBoard, newCurrentPiece.shape, newCurrentPiece.pos)) {
        setGameOver(true);
        setCurrentPiece(null); // Останавливаем игру
        console.log("Game Over!");
        return;
      }

      setCurrentPiece(newCurrentPiece);
      setNextPiece(generateNextPiece());
    }
  };

  // Автоматическое падение
  useEffect(() => {
    if (gameOver || !currentPiece) return;
    const interval = setInterval(() => movePiece(0, 1), 1000);
    return () => clearInterval(interval);
  }, [currentPiece, gameOver]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case "a":
          movePiece(-1, 0);
          break;
        case "d":
          movePiece(1, 0);
          break;
        case "s":
          movePiece(0, 1);
          break;
        case "w":
          movePiece(0, 0, true);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPiece, gameOver]);

  // Рендеринг основного canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1A1A2E";
    ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

    board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillStyle = "#6666FF";
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          ctx.strokeStyle = "#FF00FF";
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      });
    });

    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            ctx.fillRect(
              (currentPiece.pos.x + x) * BLOCK_SIZE,
              (currentPiece.pos.y + y) * BLOCK_SIZE,
              BLOCK_SIZE - 1,
              BLOCK_SIZE - 1,
            );
            ctx.strokeStyle = "#FFFFFF";
            ctx.strokeRect(
              (currentPiece.pos.x + x) * BLOCK_SIZE,
              (currentPiece.pos.y + y) * BLOCK_SIZE,
              BLOCK_SIZE - 1,
              BLOCK_SIZE - 1,
            );
          }
        });
      });
    }
  }, [board, currentPiece]);

  // Рендеринг preview canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !nextPiece) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1A1A2E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const previewWidth = nextPiece.shape[0].length * BLOCK_SIZE;
    const previewHeight = nextPiece.shape.length * BLOCK_SIZE;
    const offsetX = (canvas.width - previewWidth) / 2;
    const offsetY = (canvas.height - previewHeight) / 2;

    ctx.fillStyle = nextPiece.color;
    nextPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillRect(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          ctx.strokeStyle = "#FFFFFF";
          ctx.strokeRect(offsetX + x * BLOCK_SIZE, offsetY + y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      });
    });
  }, [nextPiece]);

  // Старт/рестарт игры
  const startGame = () => {
    const newBoard = Array(ROWS).fill(Array(COLS).fill(0));
    setBoard(newBoard);
    const initialPiece = spawnPiece(newBoard);
    if (!initialPiece) {
      setGameOver(true);
      return;
    }
    setCurrentPiece(initialPiece);
    setNextPiece(generateNextPiece());
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold text-primary neon-text">Tetris</h2>
      <p className="text-lg text-secondary">Score: {score}</p>
      {gameOver && <p className="text-xl text-error font-bold animate-pulse">Game Over!</p>}
      <div className="flex">
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK_SIZE}
          height={ROWS * BLOCK_SIZE}
          className="border border-primary shadow-neon"
        />
        <div className="ml-4 flex flex-col items-center">
          <h3 className="text-lg text-secondary mb-2">Next</h3>
          <canvas
            ref={previewCanvasRef}
            width={(COLS * BLOCK_SIZE) / 3}
            height={ROWS * BLOCK_SIZE}
            className="border border-primary shadow-neon"
          />
        </div>
      </div>
      <button onClick={startGame} className="mt-4 btn btn-primary btn-lg hover:animate-pulse">
        {gameOver ? "Restart" : "Start"}
      </button>
    </div>
  );
};

export default TetrisGame;
