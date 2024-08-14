/* eslint-disable react/prop-types */
import { EVENT_UPDATE_EVENT } from '../../constants/socket'
import { socket } from '../../main'
import Cell from './Cell'
import { TIC_TAC_TOE } from './constants'

export default function Board({
  disablePlayerMove,
  boardState,
  onPlayerMove,
  isXNext,
  playerSymbol,
  ...props
}) {
  const styleObj = {
    display: 'flex',
    flexFlow: 'row wrap',
    width: 'calc(var(--cellSize) * 3)',
    height: 'calc(var(--cellSize) * 3)',
    margin: 'auto',
  }

  return (
    <>
      <div>Next Player: {isXNext ? 'X' : 'O'}</div>
      <div>You are {playerSymbol}</div>
      <div style={styleObj}>
        {TIC_TAC_TOE.map((row, i) => {
          return row.map((cell, j) => {
            return (
              <Cell
                key={`${i}-${j}`}
                onClick={!disablePlayerMove ? () => onPlayerMove(i, j) : null}
                symbol={boardState[i][j]}
                disabled={disablePlayerMove}
              />
            )
          })
        })}
      </div>
    </>
  )
}
