import { useEffect, useMemo, useState } from 'react'
import './styles.css'
import { TIC_TAC_TOE } from './constants'
import Board from './Board'
import { calculateWinner } from './utils'
import { socket } from '../../main'
import { EVENT_SUBSCRIBE, EVENT_UPDATE_EVENT } from '../../constants/socket'
import { useLocation, useNavigate } from 'react-router-dom'
import { GAME_STAGE } from '../../constants/game'
import useAuth from '../../Auth/useAuth'

function Game() {
  const navigate = useNavigate()
  const userName = useAuth()
  const location = useLocation()
  const [gameMetadata, setGameMeta] = useState({})
  const [boardState, setBoardState] = useState(TIC_TAC_TOE)
  const [isXNext, setIsXNext] = useState(true)
  const eventId = useMemo(() => location.pathname.slice(1), [location.pathname]) // strip off the first character '/'

  useEffect(() => {
    try {
      fetch(`http://localhost:3000/events/${eventId}`).then(async res => {
        const data = await res.json()
        if (!data) {
          navigate('/')
        }
        setGameMeta(data)
        const currentBoardState = data.history[data.currentMove]
        setBoardState(currentBoardState)
      })
    } catch (err) {
      navigate('/')
    }
  }, [location.pathname, eventId, navigate])
  useEffect(() => {
    const eventSubscriber = data => {
      setGameMeta(data)
      const currentBoardState = data.history[data.currentMove]
      setIsXNext(data.currentMove % 2 === 0)
      setBoardState(currentBoardState)
    }
    const sub = socket.on(EVENT_SUBSCRIBE, eventSubscriber)
    return () => {
      socket.off(EVENT_SUBSCRIBE, sub)
    }
  }, [])

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

  const onPlayerReady = () => {
    socket.emit(EVENT_UPDATE_EVENT, { eventId, type: 'playerReady' }, { userName })
  }

  useEffect(() => {
    const beforeUnloadListener = () => {
      if (eventId) {
        socket.emit(EVENT_UPDATE_EVENT, { eventId, type: 'playerLeave' }, { userName })
      }
    }

    window.addEventListener('beforeunload', beforeUnloadListener)
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener)
    }
  }, [eventId, navigate, userName])

  const onPlayerMove = async (row, col) => {
    const bs = boardState
    const symbolToPut = isXNext ? 'X' : 'O'
    const gameState = [
      ...bs.slice(0, row),
      [...bs[row].slice(0, col), symbolToPut, ...bs[row].slice(col + 1)],
      ...bs.slice(row + 1),
    ]
    socket.emit(
      EVENT_UPDATE_EVENT,
      { eventId, type: 'gameMove' },
      {
        gameState,
      },
    )
  }
  const disablePlayerMove = useMemo(() => {
    if (gameMetadata.symbolMap) return (isXNext ? 'X' : 'O') !== gameMetadata.symbolMap[userName]
  }, [gameMetadata, isXNext, userName])
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Tic Tac Toe</h1>
      {gameMetadata.stage === GAME_STAGE.INIT && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10%' }}>
            {(gameMetadata.players || []).map((player, idx) => (
              <div key={player}>
                <h1
                  style={{
                    background: ['red', 'green'][idx % 2],
                    opacity: 0.9,
                    borderRadius: '2rem',
                    padding: '1rem',
                    color: 'white',
                  }}
                >
                  {player}
                </h1>
                <h2 style={{ textDecoration: 'underline' }}>
                  {gameMetadata.playerReady.includes(player) ? 'Ready' : 'Not Ready'}
                </h2>
              </div>
            ))}
          </div>
          {!gameMetadata.playerReady.includes(userName) && eventId && (
            <div>
              <button
                style={{ fontSize: '1.5rem', background: 'blue', opacity: 0.5, color: 'white' }}
                onClick={onPlayerReady}
              >
                Ready
              </button>
            </div>
          )}
        </>
      )}

      {(gameMetadata.stage === GAME_STAGE.START || gameMetadata.stage === GAME_STAGE.END) && (
        <>
          <h3>Winner is {displayWinner}</h3>
          <Board
            isXNext={isXNext}
            boardState={boardState}
            onPlayerMove={onPlayerMove}
            disablePlayerMove={disablePlayerMove || gameMetadata.stage === GAME_STAGE.END}
            playerSymbol={gameMetadata.symbolMap[userName]}
          />
        </>
      )}
    </div>
  )
}

export default Game
