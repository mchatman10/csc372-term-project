
import { useState } from 'react'
import styles from './StarRating.module.css'

export default function StarRating({ value = 0, onRate }) {
  const [hover, setHover] = useState(null)
  const v = hover ?? value
  return (
    <div className={styles.row}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n}
          className={n <= v ? styles.full : styles.empty}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)}
          onClick={() => onRate && onRate(n)}
        >★</span>
      ))}
    </div>
  )
}
