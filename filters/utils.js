/**
 * @file utils.js
 * @description This file contains utility functions to apply and remove filters.
 * @author alellouc
 */

// The matrix filters object.
matrixFilters = {
  ...fabricateMatrixFilterDatasObject(
    "protanope",
    "severity1",
    "0.152 1.053 -0.205 0 0 0.115 0.786 0.099 0 0 -0.004 -0.048 1.052 0 0 0 0 0 1 0"
  ),
  ...fabricateMatrixFilterDatasObject(
    "deuteranope",
    "severity1",
    "0.367 0.861 -0.228 0 0 0.28 0.673 0.047 0 0 -0.012 0.043 0.969 0 0 0 0 0 1 0"
  ),
  ...fabricateMatrixFilterDatasObject(
    "tritanope",
    "severity1",
    "1.256 -0.077 -0.179 0 0 -0.079 0.931 0.148 0 0 0.005 0.691 0.304 0 0 0 0 0 1 0"
  ),
  ...fabricateMatrixFilterDatasObject(
    "achromatope",
    "severity1",
    "0.213 0.715 0.072 0 0 0.213 0.715 0.072 0 0 0.213 0.715 0.072 0 0 0 0 0 1 0"
  ),
};

/**
 * Create an object with the given filter name, severity and matrix.
 * The object is formatted as follows:
 * {
 *   filterName: {
 *     severity: severity,
 *     matrix: matrixFilter
 *   }
 * }
 * @author alellouc
 *
 * @param {*} filterName
 * @param {*} severity
 * @param {*} matrixFilter
 * @returns {*}
 */
function fabricateMatrixFilterDatasObject(filterName, severity, matrixFilter) {
  const newObj = Object.create(null);
  newObj[filterName] = {
    severity,
    matrix: matrixFilter,
  };

  return newObj;
}

/**
 * Create a filter in the head of the document
 * (into a style element), with the given name and matrix.
 * @author alellouc
 *
 * @param {*} filterName
 * @param {*} matrixFilter
 */
function createFilter(filterName, matrixFilter) {
  let styleElt = document.querySelector("head > #daltonism-simulator");
  let htmlStyleText = `
	html {
		filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="${filterName}"><feColorMatrix type="matrix" values="${matrixFilter}"></feColorMatrix></filter></svg>#${filterName}');
	}
`;

  if (!styleElt) {
    styleElt = document.createElement("style");
    styleElt.id = "daltonism-simulator";
    styleElt.textContent = htmlStyleText;
    document.head.appendChild(styleElt);
  } else {
    styleElt.textContent = htmlStyleText;
  }
}

/**
 * Remove the filter from the head of the
 * document (into a style element).
 * @author alellouc
 */
function removeFilter() {
  const styleElt = document.querySelector("head > #daltonism-simulator");
  if (styleElt) {
    styleElt.remove();
  }
}
