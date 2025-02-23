let matrixFilters;
const baseFilters = {
  protanope: { level: 1, type: "protanope-1" },
  deuteranope: { level: 1, type: "deuteranope-1" },
  tritanope: { level: 1, type: "tritanope-1" },
  achromatope: { level: 1, type: "achromatope-1" },
};

const filters = [...Array.from(Object.keys(baseFilters)), "reset"];

// Apply the filter when the user clicks on the filter button
filters.forEach((filter) => {
  document.getElementById(filter).addEventListener("click", () => {
    applyFilter(filter);
  });
});

/**
 * The filter is applied by executing the script associated in the current tab.
 * We need a script because if we apply filter in the popup context, the filter is applied only on the popup. We need to apply the filter on the current tab.
 *
 * The script is composed of two parts:
 * - utils.js: contains the matrixFilters object and the createFilter function.
 * - `${filter}`.js: contains the filter to apply.
 * The filter is applied by calling the createFilter function with the matrix to apply.
 *
 * The matrix is stored in the matrixFilters object.
 *
 * @author alellouc
 *
 * @param {*} filter
 */
function applyFilter(filter) {
  browser.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      browser.scripting.executeScript({
        target: {
          tabId: tabs[0].id,
        },
        files: [`filters/utils.js`, `filters/${filter}.js`], // si on ne passe pas par un script, le filtre ne s'applique que sur la popup
      });
    }
  );
}

function createSVGFilter(type, matrix) {
	let existingSvg = document.getElementById("color-filter-overlay");

  if (!existingSvg) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "color-filter-overlay");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "100vw");
    svg.setAttribute("height", "100vh");
    svg.setAttribute(
      "style",
      "position: fixed; top: 0; left: 0; mix-blend-mode: multiply; pointer-events: none; z-index: 9999;"
    );

    let filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
	);
	const filterName = `${type}-filter`;
	filter.setAttribute("id", filterName);

    let feColorMatrix = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix"
    );
    feColorMatrix.setAttribute("type", "matrix");
    feColorMatrix.setAttribute("values", filterMatrix);

    filter.appendChild(feColorMatrix);
    svg.appendChild(filter);

    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("filter", "url(#colorblind-filter)");
    rect.setAttribute("fill", "white");

    svg.appendChild(rect);
    document.body.appendChild(svg);
  }
}
