import React, { useEffect, useState } from 'react'
export default function ThemeToggle(){
  const [dark, setDark] = useState(true)
  useEffect(()=>{ document.documentElement.style.colorScheme = dark ? 'dark' : 'light' }, [dark])
  return <button className="btn secondary" onClick={()=>setDark(d=>!d)}>{dark ? 'Dark' : 'Light'}</button>
}
