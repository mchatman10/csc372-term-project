import React, { useState } from 'react'
export default function StarRating({ value=0, onRate=()=>{} }){
  const [hover, setHover] = useState(null)
  return (
    <div className="row">
      {[1,2,3,4,5].map(star => {
        const filled = hover ? star <= hover : star <= value
        return (
          <span key={star}
            onMouseEnter={()=>setHover(star)}
            onMouseLeave={()=>setHover(null)}
            onClick={()=>onRate(star)}
            style={{cursor:'pointer', fontSize:'22px', color: filled ? '#f4b400' : '#666'}}>
            ★
          </span>
        )
      })}
    </div>
  )
}
