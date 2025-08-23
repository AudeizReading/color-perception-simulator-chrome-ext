/**
 * @file utils.js
 * @description This file contains utility functions to apply and remove filters.
 * @author alellouc
 */

function isBlockedUrl(url) {
  try {
    const u = new URL(url);
    forbiddenProtocols = [
      "chrome:",
      "chrome-extension:",
      "edge:",
      "view-source:",
    ];
    if (forbiddenProtocols.includes(u.protocol)) {
      return true;
    }
    forbiddenHostnames = [
      "chrome.google.com",
      "developer.chrome.com",
      "chromewebstore.google.com",
    ];
    if (forbiddenHostnames.includes(u.hostname)) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

const filters = Object.freeze([
  "protanope",
  "deuteranope",
  "tritanope",
  "achromatope",
  "blur",
  "reset",
]);

function buildSeverityScale() {
  const scale = [];
  for (let i = 0; i <= 10; i++) {
    scale.push((i / 10).toFixed(1));
  }
  return scale;
}

function createEmptyMatrixFiltersRegistry(
  troubles = filters,
  scale = buildSeverityScale()
) {
  const registry = Object.create(null);
  troubles.forEach((trouble) => {
    const bucket = Object.create(null);

    scale.forEach((severity) => {
      bucket[severity] = null;
    });
    registry[trouble] = bucket;
  });
  return registry;
}

const matrixFilters = createEmptyMatrixFiltersRegistry();

function normaliseSeverity(severity) {
  const v = typeof severity === "string" ? parseFloat(severity) : severity;
  const clamped = Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
  return clamped.toFixed(1);
}

function setMatrixFilter(
  filterName,
  severity,
  value,
  registry = matrixFilters
) {
  if (!registry[filterName]) {
    throw new Error(`Filter ${filterName} does not exist in the registry`);
  }

  const normSeverity = normaliseSeverity(severity);
  if (!(normSeverity in registry[filterName])) {
    throw new Error(
      `Severity ${normSeverity} does not exist for filter ${filterName}`
    );
  }
  registry[filterName][normSeverity] = value;
}

function getMatrixFilter(filterName, severity, registry = matrixFilters) {
  if (!registry[filterName]) {
    throw new Error(`Filter ${filterName} does not exist in the registry`);
  }

  const normSeverity = normaliseSeverity(severity);
  if (registry[filterName][normSeverity] === null) {
    throw new Error(
      `Severity ${normSeverity} does not exist for filter ${filterName}`
    );
  }
  return registry[filterName][normSeverity];
}

function createfeColorMatrixFilter(filterName, matrixFilter) {
  return (htmlStyleText = `html {
		filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="${filterName}"><feColorMatrix type="matrix" values="${matrixFilter}"></feColorMatrix></filter></svg>#${filterName}');
	}`);
}

function createBlurFilter(radius) {
  return `html {
		filter: blur(${radius}px);
	}`;
}

function removeCSSFilter(oldFilter, tab) {
  chrome.scripting.removeCSS({
    target: {
      tabId: tab,
    },
    css: oldFilter,
  });
}

function insertCSSFilter(filter, tab) {
  chrome.scripting.insertCSS({
    target: {
      tabId: tab,
    },
    css: filter,
  });
}

const scale = buildSeverityScale();
const blurValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const protanopeValues = [
  "1.000 0.000 -0.000 0 0 0.000 1.000 0.000 0 0 -0.000 -0.000 1.000 0 0 0 0 0 1 0",
  "0.856 0.182 -0.038 0 0 0.029 0.955 0.016 0 0 -0.003 -0.002 1.004 0 0 0 0 0 1 0",
  "0.735 0.335 -0.070 0 0 0.052 0.919 0.029 0 0 -0.005 -0.004 1.009 0 0 0 0 0 1 0",
  "0.630 0.466 -0.096 0 0 0.069 0.890 0.041 0 0 -0.006 -0.008 1.014 0 0 0 0 0 1 0",
  "0.539 0.579 -0.118 0 0 0.083 0.866 0.051 0 0 -0.007 -0.012 1.019 0 0 0 0 0 1 0",
  "0.458 0.680 -0.138 0 0 0.093 0.846 0.061 0 0 -0.007 -0.017 1.024 0 0 0 0 0 1 0",
  "0.385 0.769 -0.154 0 0 0.101 0.830 0.070 0 0 -0.007 -0.022 1.029 0 0 0 0 0 1 0",
  "0.320 0.850 -0.170 0 0 0.106 0.816 0.078 0 0 -0.007 -0.028 1.035 0 0 0 0 0 1 0",
  "0.260 0.923 -0.182 0 0 0.110 0.804 0.085 0 0 -0.006 -0.034 1.041 0 0 0 0 0 1 0",
  "0.204 0.990 -0.194 0 0 0.113 0.794 0.092 0 0 -0.005 -0.041 1.046 0 0 0 0 0 1 0",
  "0.152 1.053 -0.205 0 0 0.115 0.786 0.099 0 0 -0.004 -0.048 1.052 0 0 0 0 0 1 0",
];

const deuteranopeValues = [
  "1.000 0.000 -0.000 0 0 0.000 1.000 0.000 0 0 -0.000 -0.000 1.000 0 0 0 0 0 1 0",
  "0.866 0.178 -0.044 0 0 0.050 0.939 0.011 0 0 -0.003 0.007 0.997 0 0 0 0 0 1 0",
  "0.761 0.319 -0.080 0 0 0.091 0.889 0.020 0 0 -0.006 0.013 0.992 0 0 0 0 0 1 0",
  "0.675 0.434 -0.109 0 0 0.125 0.848 0.027 0 0 -0.008 0.019 0.989 0 0 0 0 0 1 0",
  "0.606 0.529 -0.134 0 0 0.155 0.812 0.032 0 0 -0.009 0.023 0.986 0 0 0 0 0 1 0",
  "0.547 0.608 -0.155 0 0 0.182 0.782 0.037 0 0 -0.010 0.027 0.983 0 0 0 0 0 1 0",
  "0.499 0.675 -0.174 0 0 0.205 0.755 0.040 0 0 -0.011 0.031 0.980 0 0 0 0 0 1 0",
  "0.458 0.732 -0.190 0 0 0.226 0.731 0.043 0 0 -0.012 0.034 0.977 0 0 0 0 0 1 0",
  "0.422 0.781 -0.204 0 0 0.246 0.710 0.045 0 0 -0.012 0.037 0.974 0 0 0 0 0 1 0",
  "0.392 0.824 -0.217 0 0 0.264 0.690 0.046 0 0 -0.012 0.041 0.971 0 0 0 0 0 1 0",
  "0.367 0.861 -0.228 0 0 0.28 0.673 0.047 0 0 -0.012 0.043 0.969 0 0 0 0 0 1 0",
];
const tritanopeValues = [
  "1.000 0.000 -0.000 0 0 0.000 1.000 0.000 0 0 -0.000 -0.000 1.000 0 0 0 0 0 1 0",
  "0.927 0.093 -0.019 0 0 0.021 0.965 0.014 0 0 0.008 0.055 0.937 0 0 0 0 0 1 0",
  "0.896 0.133 -0.029 0 0 0.030 0.945 0.025 0 0 0.013 0.105 0.882 0 0 0 0 0 1 0",
  "0.906 0.128 -0.034 0 0 0.027 0.941 0.032 0 0 0.013 0.148 0.838 0 0 0 0 0 1 0",
  "0.948 0.089 -0.038 0 0 0.014 0.947 0.039 0 0 0.011 0.194 0.795 0 0 0 0 0 1 0",
  "1.017 0.027 -0.044 0 0 0.006 0.958 0.048 0 0 0.006 0.249 0.745 0 0 0 0 0 1 0",
  "1.105 -0.047 -0.058 0 0 -0.032 0.972 0.061 0 0 0.001 0.318 0.681 0 0 0 0 0 1 0",
  "1.193 -0.110 -0.083 0 0 -0.058 0.979 0.079 0 0 -0.002 0.403 0.599 0 0 0 0 0 1 0",
  "1.258 -0.140 -0.118 0 0 -0.078 0.975 0.103 0 0 -0.003 0.501 0.502 0 0 0 0 0 1 0",
  "1.279 -0.125 -0.153 0 0 -0.085 0.958 0.127 0 0 -0.001 0.601 0.400 0 0 0 0 0 1 0",
  "1.256 -0.077 -0.179 0 0 -0.079 0.931 0.148 0 0 0.005 0.691 0.304 0 0 0 0 0 1 0",
];
const achromatopeValues = [
  "1.000 0.000 -0.000 0 0 0.000 1.000 0.000 0 0 -0.000 -0.000 1.000 0 0 0 0 0 1 0",
  "0.921 0.071 0.007 0 0 0.021 0.972 0.007 0 0 0.021 0.071 0.907 0 0 0 0 0 1 0",
  "0.843 0.143 0.014 0 0 0.043 0.943 0.014 0 0 0.043 0.143 0.814 0 0 0 0 0 1 0",
  "0.764 0.214 0.022 0 0 0.064 0.914 0.022 0 0 0.064 0.214 0.722 0 0 0 0 0 1 0",
  "0.685 0.286 0.029 0 0 0.085 0.886 0.029 0 0 0.085 0.286 0.629 0 0 0 0 0 1 0",
  "0.607 0.357 0.036 0 0 0.106 0.858 0.036 0 0 0.106 0.357 0.536 0 0 0 0 0 1 0",
  "0.528 0.429 0.043 0 0 0.128 0.829 0.043 0 0 0.128 0.429 0.443 0 0 0 0 0 1 0",
  "0.449 0.500 0.050 0 0 0.149 0.800 0.050 0 0 0.149 0.500 0.350 0 0 0 0 0 1 0",
  "0.370 0.572 0.058 0 0 0.170 0.772 0.058 0 0 0.170 0.572 0.258 0 0 0 0 0 1 0",
  "0.292 0.643 0.065 0 0 0.192 0.744 0.065 0 0 0.192 0.643 0.165 0 0 0 0 0 1 0",
  "0.213 0.715 0.072 0 0 0.213 0.715 0.072 0 0 0.213 0.715 0.072 0 0 0 0 0 1 0",
];

scale.forEach((severity, index) => {
  setMatrixFilter("blur", severity, blurValues[index]);
  setMatrixFilter("protanope", severity, protanopeValues[index]);
  setMatrixFilter("deuteranope", severity, deuteranopeValues[index]);
  setMatrixFilter("tritanope", severity, tritanopeValues[index]);
  setMatrixFilter("achromatope", severity, achromatopeValues[index]);
});

setMatrixFilter(
  "reset",
  "1.0",
  "1.000 0.000 -0.000 0 0 0.000 1.000 0.000 0 0 -0.000 -0.000 1.000 0 0 0 0 0 1 0"
);
