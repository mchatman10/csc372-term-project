import { useEffect, useState } from 'react'
import { API } from '../util/api'
import RecipeCard from '../components/RecipeCard'
import CategoryTabs from '../components/CategoryTabs'
import styles from './RecipeList.module.css'
export default function RecipeList() { const [recipes, setRecipes] = useState([]); const [category, setCategory] = useState(null); async function load() { setRecipes(await API.listRecipes(category)) } useEffect(() => { load() }, [category]); return (<div className='container'><div className={styles.header}><h2>Discover recipes</h2></div><CategoryTabs category={category} onChange={setCategory} /><div className='grid'>{recipes.map(r => <RecipeCard key={r.id} r={r} />)}</div></div>) }