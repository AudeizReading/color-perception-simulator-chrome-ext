(() => {
  let styleT = document.querySelector("head > #daltonism-simulator");
  if (!styleT) {
    styleT = document.createElement("style");
    styleT.id = "daltonism-simulator";
    styleT.textContent = `
	html {
		filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="deuteranope"><feColorMatrix type="matrix" values="1.256 -0.077 -0.179 0 0 -0.079 0.931 0.148 0 0 0.005 0.691 0.304 0 0 0 0 0 1 0"></feColorMatrix></filter></svg>#deuteranope');
	}
`;
    document.head.appendChild(styleT);
  } else {
    styleT.textContent = `
	html {
		filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="deuteranope"><feColorMatrix type="matrix" values="1.256 -0.077 -0.179 0 0 -0.079 0.931 0.148 0 0 0.005 0.691 0.304 0 0 0 0 0 1 0"></feColorMatrix></filter></svg>#deuteranope');
	}
`;
  }
})();
