import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../util/api'
import styles from './RecipeDetail.module.css'
export default function RecipeDetail() { const { id } = useParams(); const [r, setR] = useState(null); useEffect(() => { (async () => setR(await API.getRecipe(id)))() }, [id]); if (!r) return null; return (<div className='container'><div className={`card ${styles.wrap}`}><img className={styles.cover} src={r.image_url} alt={r.title} /><h2>{r.title}</h2><p>{r.description}</p><h3>Ingredients</h3><ul className={styles.list}>{r.ingredients?.map((x, i) => <li key={i}>{x}</li>)}</ul><h3>Steps</h3><ol className={styles.list}>{r.steps?.map((x, i) => <li key={i}>{x}</li>)}</ol></div></div>) }