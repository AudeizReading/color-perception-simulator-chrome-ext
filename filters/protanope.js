(() => {
  let styleP = document.querySelector("head > #daltonism-simulator");
  if (!styleP) {
    styleP = document.createElement("style");
    styleP.id = "daltonism-simulator";
    styleP.textContent = `
	html {
		filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="protanope"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"></feColorMatrix></filter></svg>#protanope');
	}
`;
    document.head.appendChild(styleP);
  } else {
    styleP.textContent = `
	html {
		filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="protanope"><feColorMatrix type="matrix" values="0.152 1.053 -0.205 0 0 0.115 0.786 0.099 0 0 -0.004 -0.048 1.052 0 0 0 0 0 1 0"></feColorMatrix></filter></svg>#protanope');
	}
`;
  }
})();
