(() => {
  let styleD = document.querySelector("head > #daltonism-simulator");
  if (!styleD) {
    styleD = document.createElement("style");
    styleD.id = "daltonism-simulator";
    styleD.textContent = `
	html {
		filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="deuteranope"><feColorMatrix type="matrix" values="0.213 0.715 0.072 0 0 0.213 0.715 0.072 0 0 0.213 0.715 0.072 0 0 0 0 0 1 0"></feColorMatrix></filter></svg>#deuteranope');
	}
`;
    document.head.appendChild(styleD);
  } else {
    styleD.textContent = `
	html {
		filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="deuteranope"><feColorMatrix type="matrix" values="0.213 0.715 0.072 0 0 0.213 0.715 0.072 0 0 0.213 0.715 0.072 0 0 0 0 0 1 0"></feColorMatrix></filter></svg>#deuteranope');
	}
`;
  }
})();