/* eslint-disable react/prop-types */
export default function Init({ gameMetadata, userName, eventId, onPlayerReady }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10%' }}>
        {(gameMetadata.players || []).map((player, idx) => (
          <div key={player} className="player">
            <span
              style={{
                background: ['red', 'green'][idx % 2],
                borderRadius: '2rem',
                padding: '1rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              {player}
            </span>
            <h2
              style={{
                background: gameMetadata.playerReady.includes(player) ? 'green' : 'grey',
                opacity: 0.9,
                color: 'white',
                fontStyle: 'italic',
                borderRadius: '1rem',
                padding: '0 1rem',
                textAlign: 'center',
              }}
            >
              {gameMetadata.playerReady.includes(player) ? 'Ready!' : 'Waiting'}
            </h2>
          </div>
        ))}
      </div>
      {!gameMetadata.playerReady.includes(userName) && eventId && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            style={{ fontSize: '1.5rem', background: 'blue', opacity: 0.5, color: 'white' }}
            onClick={onPlayerReady}
          >
            Ready
          </button>
        </div>
      )}
    </div>
  )
}
