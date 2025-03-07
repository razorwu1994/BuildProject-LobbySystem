/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'
import { socket } from '../main'
import useAuth from '../Auth/useAuth'
import { EVENT_PLAYER_JOIN } from '../constants/socket'

function RectPreview({ event }) {
  const userName = useAuth()
  const navigate = useNavigate()
  const onJoinEvent = () => {
    socket.emit(EVENT_PLAYER_JOIN, { userName, eventId: event.id })
    navigate(`/${event.id}`)
  }
  return (
    <div className="preview" onClick={onJoinEvent}>
      <div
        style={{
          background: 'green',
          opacity: 0.75,
          color: 'white',
          borderRadius: '4px',
        }}
      >
        {event.type}
      </div>
      {event.players.map((player, pi) => (
        <div key={player} style={{ textDecoration: 'none' }}>
          Player_{pi + 1}:{' '}
          <span
            style={{
              background: ['purple', 'orange', 'blue', 'green', 'red'][pi % 5],
              opacity: 0.75,
              color: 'white',
              borderRadius: '1rem',
            }}
          >
            {player}
          </span>
        </div>
      ))}
    </div>
  )
}
export default function EventPreview({ events }) {
  return (
    <div className="preview-container">
      {events.map((event, idx) => (
        <RectPreview key={`preview-${idx}`} event={event} />
      ))}
    </div>
  )
}
