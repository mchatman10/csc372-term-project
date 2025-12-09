import { API } from "../util/api";
import styles from "./RecipeDetail.module.css";
import StarRating from "../components/StarRating";

export default function RecipeDetail(){
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [r, setR] = useState(null)
  useEffect(()=>{ (async()=> setR(await API.getRecipe(id)))() },[id])
  if(!r) return null
  const cover = r.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop'
  async function remove(){ if(!user) return alert('Login required'); await API.deleteRecipe(r.id); nav('/') }
  return (
    <div className="card">
      <img className="cover" src={cover} alt={r.title} />
      <h1>{r.title}</h1>
      <p style={{color:'#a7acb6'}}>{r.description}</p>
      <h3>Ingredients</h3><ul>{r.ingredients.map((x,i)=><li key={i}>{x}</li>)}</ul>
      <h3>Steps</h3><ol>{r.steps.map((x,i)=><li key={i}>{x}</li>)}</ol>
      <div className="row" style={{justifyContent:'space-between'}}><div/><button className="btn" onClick={remove}>Delete</button></div>
    </div>
  )
}
