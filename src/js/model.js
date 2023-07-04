import { async } from "regenerator-runtime";
import { API_URL, RESULT_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

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

// *--------------------------loadRecipe--------------------------
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      cookingTime: recipe.cooking_time,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      imageUrl: recipe.image_url,
      ingredients: recipe.ingredients,
    };

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
        imageUrl: recipe.image_url,
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

// *--------------------------addBookmark--------------------------
export const addBookmark = function (recipe) {
  // Add Bookmark:
  state.bookmarks.push(recipe);

  // Mark current Recipe as Bookmark:
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

// *--------------------------deleteBookmark--------------------------
export const deleteBookmark = function (id) {
  // Delete Bookmark:
  const bookmarkIndex = state.bookmarks.findIndex((El) => El.id === id);
  state.bookmarks.splice(bookmarkIndex, 1);

  // Mark current Recipe as Not Bookmark:
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};
