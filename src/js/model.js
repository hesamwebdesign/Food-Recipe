import { async } from "regenerator-runtime";
import { API_URL, API_KEY, RESULT_PER_PAGE } from "./config.js";
import { getJSON, sendJSON } from "./helpers.js";

// *--------------------------state--------------------------
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

// *--------------------------createRecipeObject--------------------------
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// *--------------------------loadRecipe--------------------------
export const loadRecipe = async function (id) {
  try {
    // Get The Recipe:
    const data = await getJSON(`${API_URL}/${id}`);
    const { recipe } = data.data;

    // Change Recipe's Format:
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);

    // Check if this Recipe has been Bookmarked:
    state.bookmarks.some((bookmark) => bookmark.id === id)
      ? (state.recipe.bookmarked = true)
      : (state.recipe.bookmarked = false);
  } catch (err) {
    console.error(`${err} ❌`);
    throw err;
  }
};

// *--------------------------loadSearchResults--------------------------
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} ❌`);
    throw err;
  }
};

// *--------------------------getSearchResultPage--------------------------
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

// *--------------------------updateServings--------------------------
export const updateServings = function (newServing = state.recipe.servings) {
  state.recipe.ingredients.forEach((ing) => {
    if (ing.quantity !== null) {
      ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
    }
  });
  state.recipe.servings = newServing;
};

// *--------------------------persistBookmark--------------------------
const persistBookmark = function () {
  // Store Bookmark in Local Storage:
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

// *--------------------------addBookmark--------------------------
export const addBookmark = function (recipe) {
  // Add Bookmark:
  state.bookmarks.push(recipe);

  // Mark current Recipe as Bookmark:
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

// *--------------------------deleteBookmark--------------------------
export const deleteBookmark = function (id) {
  // Delete Bookmark:
  const bookmarkIndex = state.bookmarks.findIndex((El) => El.id === id);
  state.bookmarks.splice(bookmarkIndex, 1);

  // Mark current Recipe as Not Bookmark:
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

// *--------------------------uploadRecipe--------------------------
export const uploadRecipe = async function (newRecipe) {
  try {
    // Make Ingredients Part:
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArray = ing[1].replaceAll("", "").split(",");
        if (ingArray.length !== 3)
          throw new Error(
            "Wrong ingredient format. Please use the correct format!"
          );
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Make Whole New Recipe (True Format):
    const recipe = {
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      ingredients,
    };

    // Send Our Recipe:
    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

    // Change Recipe's Format
    state.recipe = createRecipeObject(data);

    // Add to Bookmarks:
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// *--------------------------init--------------------------
(function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
})();
