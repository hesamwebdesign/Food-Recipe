import View from "./view.js";
import icons from "url:../../images/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkupPreviousButton(currentPage) {
    return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        `;
  }

  _generateMarkupNextButton(currentPage) {
    return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
        `;
  }

  _generateMarkup() {
    // Prevent some Errors:
    // -resultPerPage equals to 0
    if (this._data.resultsPerPage === 0) {
      return "";
    }

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;

    // Prevent some Errors:
    // -There is No recipe for that query
    // --currentPage is higher than numPages
    if (numPages === 0 || currentPage > numPages) {
      return "";
    }

    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupNextButton(currentPage);
    }

    // Page 1, and there are No other pages
    if (currentPage === 1 && numPages === 1) {
      return "";
    }

    // Middle of pages
    if (currentPage > 1 && currentPage < numPages) {
      return (
        this._generateMarkupPreviousButton(currentPage) +
        this._generateMarkupNextButton(currentPage)
      );
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupPreviousButton(currentPage);
    }
  }
}

export default new PaginationView();
