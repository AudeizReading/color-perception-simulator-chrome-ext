// Apply the filter when the user clicks on the filter button
filters.forEach((filter) => {
  document.getElementById(filter).addEventListener("click", () => {
    let rangeValue = "1.0";

    if (filter !== "reset") {
      rangeValue = document.getElementById(`range-${filter}`).value;
    }
    applyFilter(filter, rangeValue);
  });
  if (filter !== "reset") {
    document
      .getElementById(`range-${filter}`)
      .addEventListener("input", (event) => {
        const value = event.target.value;

        applyFilter(filter, value);
      });
  }
});

/**
 * The filter is applied by injecting a CSS filter into the head of the document.
 *
 *
 * The matrix is stored in the matrixFilters object.
 *
 * @author alellouc
 *
 * @param {*} filter
 */
const filtersStack = [];

function applyFilter(filter, severity = "1.0") {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      const cssFilter = getMatrixFilter(filter, severity);
      const last = filtersStack.pop();
      let perceptionFilter;

      if (last) {
        removeCSSFilter(last, tabs[0].id);
      }
      if (filter === "reset" && filtersStack.length === 0) {
        perceptionFilter = `html { filter: none; }`;
      } else if (filter === "blur") {
        perceptionFilter = createBlurFilter(cssFilter);
      } else {
        perceptionFilter = createfeColorMatrixFilter(filter, cssFilter);
      }

      if (perceptionFilter) {
        filtersStack.push(perceptionFilter);
        insertCSSFilter(perceptionFilter, tabs[0].id);
      }
    }
  );
}

