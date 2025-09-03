import { useState } from "react";

export default function App() {
  const [ingredient, setIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home"); // Track current tab

  // Fetch recipes by ingredient
  const fetchRecipes = async () => {
    if (!ingredient) return;
    setLoading(true);
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    const data = await res.json();
    setRecipes(data.meals || []);
    setSelected(null);
    setLoading(false);
  };

  // Fetch single recipe details
  const fetchDetails = async (id) => {
    setLoading(true);
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    setSelected(data.meals[0]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-10">
        <h1 className="text-lg md:text-xl font-bold tracking-wide">
          🍳 Taylor's Recipe Finder
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {["home", "recipes", "about", "contact"].map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer transition ${
                activeTab === tab
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden block focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col bg-green-600 text-white px-6 py-4 gap-3 text-sm shadow">
          {["home", "recipes", "about", "contact"].map((tab) => (
            <li
              key={tab}
              className={`cursor-pointer transition ${
                activeTab === tab
                  ? "text-yellow-300 font-bold"
                  : "hover:text-yellow-300"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setMenuOpen(false);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      )}

      {/* Content Sections */}
      <div className="flex-grow">
        {/* Home Section */}
        {activeTab === "home" && (
          <section className="text-center mt-10 px-4">
            <h2 className="text-3xl font-bold text-green-700 mb-3">
              Welcome, Taylor 👋
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Had a busy day? Don’t worry — we’ll help you cook something quick,
              tasty, and based on what’s already in your kitchen! Just type an
              ingredient and get recipe ideas instantly.
            </p>
          </section>
        )}

        {/* Recipes Section */}
        {activeTab === "recipes" && (
          <section className="mt-10 px-4">
            {/* Search Section */}
            <div className="flex gap-3 justify-center">
              <input
                type="text"
                placeholder="Enter ingredient (e.g., chicken)"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                className="border border-green-400 p-3 rounded-lg w-72 shadow focus:ring-2 focus:ring-green-500 outline-none"
              />
              <button
                onClick={fetchRecipes}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition"
              >
                Search
              </button>
            </div>

            {/* Loader */}
            {loading && (
              <div className="mt-10 text-green-600 text-lg font-medium animate-pulse text-center">
                Loading recipes...
              </div>
            )}

            {/* Recipe List */}
            {!selected && recipes.length > 0 && !loading && (
              <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-11/12 mx-auto">
                {recipes.map((meal) => (
                  <div
                    key={meal.idMeal}
                    onClick={() => fetchDetails(meal.idMeal)}
                    className="bg-white rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition cursor-pointer p-4 flex flex-col items-center"
                  >
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="rounded-lg mb-3 w-full h-40 object-cover"
                    />
                    <h2 className="font-semibold text-center text-gray-800">
                      {meal.strMeal}
                    </h2>
                  </div>
                ))}
              </div>
            )}

            {/* Recipe Details */}
            {selected && !loading && (
              <div className="mt-10 bg-white rounded-xl shadow-xl w-11/12 md:w-3/4 lg:w-2/3 p-8 relative mx-auto">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold mb-4 text-green-700">
                  {selected.strMeal}
                </h2>
                <img
                  src={selected.strMealThumb}
                  alt={selected.strMeal}
                  className="rounded-lg mb-6 w-full max-h-96 object-cover shadow"
                />
                <p className="mb-2">
                  <strong>Category:</strong> {selected.strCategory}
                </p>
                <p className="mb-2">
                  <strong>Area:</strong> {selected.strArea}
                </p>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-700">
                  <strong>Instructions:</strong> {selected.strInstructions}
                </p>
              </div>
            )}
          </section>
        )}

        {/* About Section */}
        {activeTab === "about" && (
          <section className="text-center mt-10 px-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-green-700 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">
              Taylor’s Recipe Finder is designed for busy professionals who
              don’t have time to plan meals. By just entering an ingredient, you
              can explore recipes from around the world and cook delicious meals
              without stress. Powered by TheMealDB API.
            </p>
          </section>
        )}

        {/* Contact Section */}
        {activeTab === "contact" && (
          <section className="text-center mt-10 px-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Contact</h2>
            <p className="text-gray-700 mb-2">
              📧 Email: support@recipefinder.com
            </p>
            <p className="text-gray-700">📍 Location: New York, USA</p>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 bg-green-700 text-white text-center text-sm shadow-inner">
        Made with ❤️ for Taylor | Powered by TheMealDB
      </footer>
    </div>
  );
}
