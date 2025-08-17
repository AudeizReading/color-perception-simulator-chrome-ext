// Apply the filter when the user clicks on the filter button
// and when the user changes the range input
filters.forEach((filter) => {
  document.getElementById(filter).addEventListener("click", () => {
    let rangeValue = "1.0";

    if (filter !== "reset") {
      rangeValue = document.getElementById(`range-${filter}`).value;
    } else {
      let blurDefaultValue = "0.3";
      ["protanope", "deuteranope", "tritanope", "achromatope", "blur"].forEach(
        (f) => {
          if (f === "blur") {
            document.getElementById(`range-${f}`).value = blurDefaultValue;
          } else {
            document.getElementById(`range-${f}`).value = rangeValue;
          }
        }
      );
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

document.querySelectorAll(".card > h2").forEach((h2) => {
  h2.addEventListener("click", (e) => {
    const rect = h2.getBoundingClientRect();
    const styles = getComputedStyle(h2);

    const em = parseFloat(styles.fontSize) || 16;
    const rem =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

    const chevronWidth = 0.6 * em;
    const rightOffset = 0.25 * rem;

    // petite tolérance pour faciliter le clic
    const tolerance = 8; // px

    // distance du clic au bord droit du h2
    const fromRight = rect.right - e.clientX;

    const hotspot = chevronWidth + rightOffset + tolerance;

    if (fromRight <= hotspot) {
      h2.parentElement.classList.toggle("is-open");
    }
  });
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
