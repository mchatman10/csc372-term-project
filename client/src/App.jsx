import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import CreateRecipe from "./pages/CreateRecipe.jsx";
import EditRecipe from "./pages/EditRecipe.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/recipe/:id" element={<RecipeDetail />} />

                <Route path="/add" element={<CreateRecipe />} />

                { }
                <Route path="/recipe/:id/edit" element={<EditRecipe />} />
            </Routes>
        </BrowserRouter>
    );
}