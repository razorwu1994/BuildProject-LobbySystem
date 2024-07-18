import { useNavigate } from 'react-router-dom'

function RectPreview() {
  const navigate = useNavigate()
  const onJoinEvent = () => {
    navigate('/somethinggreat')
  }
  return (
    <div className="preview" onClick={onJoinEvent}>
      <div style={{ background: 'green', opacity: 0.9, color: 'white', borderRadius: '4px' }}>
        Tic Tac Toe
      </div>
      <user>R W</user>
      <user>Tester</user>
    </div>
  )
}
export default function EventPreview() {
  const mockupEvents = new Array(20).fill(0)
  return (
    <div className="preview-container">
      {mockupEvents.map((event, idx) => (
        <RectPreview key={`preview-${idx}`} />
      ))}
    </div>
  )
}
