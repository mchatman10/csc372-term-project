import { useEffect, useState } from 'react';
import { API } from '../api';
import RecipeCard from '../components/RecipeCard';

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    useEffect(() => { API.get('/recipes').then(setRecipes); }, []);
    return (
        <div className="container">
            <div className="grid">
                {recipes.map(r => <RecipeCard key={r.id} r={r} />)}
            </div>
        </div>
    );
}
