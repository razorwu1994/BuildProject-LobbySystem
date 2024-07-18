import { useMemo, useState } from 'react'
import './styles.css'
import { TIC_TAC_TOE } from './constants'
import Board from './Board'
import { calculateWinner } from './utils'

function Game() {
  const [boardState, setBoardState] = useState(TIC_TAC_TOE)
  const [isXNext, setIsXNext] = useState(true)
  const displayWinner = useMemo(() => {
    const xRows = [],
      oRows = []
    boardState.map((row, i) => {
      //i: 0,1,2
      row.map((cell, j) => {
        //j:0,1,2
        if (cell === 'X') {
          xRows.push(i * 3 + j)
        } else if (cell === 'O') {
          oRows.push(i * 3 + j)
        }
      })
    })
    //in order to use calculateWinner function, so we convert to React tutorial example data structure
    //one dimensional array
    const dataset = new Array(9).fill(null).map((_, idx) => {
      //Array.includes : can help detect whether an element is inside of array, this only works when array and element are prime type (exception applied)
      if (xRows.includes(idx)) {
        return 'X'
      } else if (oRows.includes(idx)) {
        return 'O'
      }
    })
    //above should give us the correct one to apply for below function
    return calculateWinner(dataset)
  }, [boardState])

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <h3>Winner is {displayWinner}</h3>
      <Board
        setBoardState={setBoardState}
        isXNext={isXNext}
        setIsXNext={setIsXNext}
        boardState={boardState}
      />
    </div>
  )
}

export default Game
