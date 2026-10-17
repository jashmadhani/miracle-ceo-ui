import { useEffect } from 'react'
import { useStore } from '../state/store'
import { Leaf } from '../art/ActivityArt'

export function Toast() {
  const { toastMsg, toast } = useStore()
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => toast(null), 3300)
    return () => clearTimeout(t)
  }, [toastMsg, toast])
  if (!toastMsg) return null
  return (
    <div className="toast" key={toastMsg.key} role="status">
      <span className="leafdot">
        <Leaf size={20} color="#2a2233" />
      </span>
      <span>
        <b style={{ display: 'block' }}>{toastMsg.title}</b>
        <span style={{ fontSize: 14, opacity: 0.8 }}>{toastMsg.body}</span>
      </span>
    </div>
  )
}
