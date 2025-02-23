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
  console.error("applyFilter", filter);
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.scripting.executeScript({
        target: {
          tabId: tabs[0].id,
        },
        files: [`filters/utils.js`, `filters/${filter}.js`], // si on ne passe pas par un script, le filtre ne s'applique que sur la popup
      });
    }
  );
}
