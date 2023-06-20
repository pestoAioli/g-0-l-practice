import { useCallback, useRef, useState } from "react";
import produce from "immer";


const boardSize = 50;

export default function Home() {
  const [board, setBoard] = useState(() => {
    const rows = [];
    for (let i = 0; i < boardSize; i++) {
      rows.push(Array.from(Array(boardSize), () => 0));
    }
    return rows;
  })
  const [running, setRunning] = useState(false);
  const runningRef = useRef();
  runningRef.current = running;

  const runFullSim = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    getNextGeneration();
    setTimeout(runFullSim, 300);
  }, []);
  const getNextGeneration = () => {
    setBoard(bored => {
      return produce(bored, boredCopy => {
        for (let x = 0; x < boardSize; x++) {
          for (let y = 0; y < boardSize; y++) {
            let neighbors = 0;
            if (x - 1 >= 0 && y - 1 >= 0) {
              if (bored[x - 1][y - 1] === 1) {
                neighbors += 1;
              }
            }
            if (x - 1 >= 0) {
              if (bored[x - 1][y] === 1) {
                neighbors += 1;
              }
            }
            if (y - 1 >= 0) {
              if (bored[x][y - 1] === 1) {
                neighbors += 1;
              }
            }
            if (y + 1 < bored[x].length) {
              if (bored[x][y + 1] === 1) {
                neighbors += 1;
              }
            }
            if (x - 1 >= 0 && y + 1 < bored[x].length) {
              if (bored[x - 1][y + 1] === 1) {
                neighbors += 1;
              }
            }
            if (x + 1 < bored.length && y - 1 >= 0) {
              if (bored[x + 1][y - 1] === 1) {
                neighbors += 1;
              }
            }
            if (x + 1 < bored.length && y + 1 < bored[x].length) {
              if (bored[x + 1][y + 1] === 1) {
                neighbors += 1;
              }
            }
            if (x + 1 < bored.length) {
              if (bored[x + 1][y] === 1) {
                neighbors += 1;
              }
            }
            //if alive
            if (bored[x][y] === 1) {
              if (neighbors < 2) {
                boredCopy[x][y] = 0;
              } else if (neighbors === 2 || neighbors === 3) {
                boredCopy[x][y] = 1;
              } else {
                boredCopy[x][y] = 0;
              }
              //if dead
            } else if (bored[x][y] === 0) {
              if (neighbors === 3) {
                boredCopy[x][y] = 1;
              } else {
                boredCopy[x][y] = 0;
              }
            }
          }
        }
        // return boredCopy;
      })
    })
  };


  return (
    <>
      <button style={{ fontSize: 36, margin: 6 }} onClick={() => {
        getNextGeneration();
      }}>Next generation    </button>
      <button style={{ fontSize: 36, margin: 6 }} onClick={() => {
        setRunning(!running);
        if (!running) {
          runningRef.current = true;
          runFullSim();
        }
      }}>{running ? `Stop simulation` : `Run simulation`}</button>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${boardSize}, 20px)`
      }} >
        {board.map((rows, x) =>
          rows.map((cols, y) => (
            <div
              key={`(${x}, ${y})`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: board[x][y] ? 'green' : undefined,
                border: '1px solid black'
              }}
              onClick={() => {
                const nextBoardState = produce(board, newBoard => {
                  newBoard[x][y] = board[x][y] ? 0 : 1;
                })
                setBoard(nextBoardState);
              }}
            />
          ))
        )}
      </div >
    </>
  )
}
