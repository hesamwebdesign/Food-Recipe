import { async } from "regenerator-runtime";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// if (module.hot) {
//   module.hot.accept();
// }

// * get API from "https://forkify-api.herokuapp.com/v2"

// *--------------------------controlRecipe--------------------------
const controlRecipe = async function () {
  try {
    // Check ID from Recipe:
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Loading Recipe:
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    // Rendering Recipe:
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// *--------------------------controlSearchResults--------------------------
const controlSearchResults = async function () {
  try {
    // Check Query from Search bar:
    const query = searchView.getQuery();
    if (!query) return;

    // Loading Search Results:
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    // Rendering Search Results:
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

// *--------------------------init--------------------------
(() => recipeView.addHandlerRender(controlRecipe))();
(() => searchView.addHandlerSearch(controlSearchResults))();
