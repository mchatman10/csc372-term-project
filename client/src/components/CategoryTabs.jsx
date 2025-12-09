import { useEffect, useState } from 'react'
import styles from './CategoryTabs.module.css'
import { API } from '../util/api'
export default function CategoryTabs({ category, onChange }) { const [items, setItems] = useState(['All']); useEffect(() => { (async () => { try { const cats = await API.listCategories(); setItems(['All', ...cats.map(c => c.name)]) } catch { } })() }, []); return (<div className={styles.tabs}>{items.map(c => (<button key={c} className={`${styles.tab} ${c === (category || 'All') ? styles.active : ''}`} onClick={() => onChange(c === 'All' ? null : c)}>{c}</button>))}</div>) }
