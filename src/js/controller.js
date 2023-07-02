import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// * get API from "https://forkify-api.herokuapp.com/v2"
const controlRecipe = async function () {
  try {
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

// init function
(() => recipeView.addHandlerRender(controlRecipe))();
