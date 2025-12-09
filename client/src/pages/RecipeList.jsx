import { API } from "../util/api";
import RecipeCard from "../components/RecipeCard";

export default function RecipeList(){
  const [items, setItems] = useState([])
  useEffect(()=>{ (async()=> setItems(await API.listRecipes()))() },[])
  return <div className="grid">{items.map(r=> <RecipeCard key={r.id} r={r} />)}</div>
}
