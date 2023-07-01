import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

const recipeContainer = document.querySelector(".recipe");

const timeout = function (x) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error("Request took too long! Timeout after ${x} seconds"));
    }, x * 1000);
  });
};

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
    alert(err);
  }
};
["hashchange", "load"].forEach((ev) => {
  window.addEventListener(ev, controlRecipe);
});
