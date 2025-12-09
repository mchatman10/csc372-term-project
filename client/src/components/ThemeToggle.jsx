import React, { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'
export default function ThemeToggle(){
  const [mode,setMode] = useState('dark')
  useEffect(()=>{ document.documentElement.setAttribute('data-theme', mode) },[mode])
  return <button className={`btn ${styles.fab}`} onClick={()=> setMode(m=> m==='dark'?'light':'dark')}>{mode==='dark'?'Light':'Dark'}</button>
}
