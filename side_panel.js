function applyI18n() {
	for (const el of document.querySelectorAll("[data-i18n]")) {
		el.prepend(
			document.createTextNode(chrome.i18n.getMessage(el.dataset.i18n))
		);
	}
	for (const el of document.querySelectorAll("[data-i18n-aria-label]")) {
		el.setAttribute(
			"aria-label",
			chrome.i18n.getMessage(el.dataset.i18nAriaLabel)
		);
	}
	for (const el of document.querySelectorAll("[data-i18n-placeholder]")) {
		el.setAttribute(
			"placeholder",
			chrome.i18n.getMessage(el.dataset.i18nPlaceholder)
		);
	}
}

function onClickSimulateButton(filter) {
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
}

function onClickTroubleDefinitionChevron(el, event) {
	const rect = el.getBoundingClientRect();
	const styles = getComputedStyle(el);

	const em = parseFloat(styles.fontSize) || 16;
	const rem =
		parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

	const chevronWidth = 0.6 * em;
	const rightOffset = 0.25 * rem;

	// petite tolérance pour faciliter le clic
	const tolerance = 8; // px

	// distance du clic au bord droit du h2
	const fromRight = rect.right - event.clientX;

	const hotspot = chevronWidth + rightOffset + tolerance;

	if (fromRight <= hotspot) {
		el.parentElement.classList.toggle("is-open");
	}
}

function createAlertError() {
	const alert = document.createElement("div");
	const alertTitle = document.createElement("h2");
	alertTitle.prepend(
		document.createTextNode(
			chrome.i18n.getMessage("error_extension_usage_title")
		)
	);

	const alertMessageBody = document.createElement("p");
	alertMessageBody.prepend(
		document.createTextNode(
			chrome.i18n.getMessage("error_extension_usage_message")
		)
	);

	alert.appendChild(alertTitle);
	alert.appendChild(alertMessageBody);
	alert.classList.add("alert-error");

	document.body.prepend(alert);
	setTimeout(() => {
		alert.remove();
	}, 8000);
}

function updateRangeValue(filter, value) {
	const spanValue = document.getElementById(`range-${filter}-value`);
	if (spanValue) {
		if (filter === "blur") {
			spanValue.textContent = parseInt(value * 10) + " px";
		} else {
			spanValue.textContent = parseInt(value * 100) + " %";
		}
	}
}

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
			currentWindow: true
		},
		(tabs) => {
			const url = tabs[0]?.url || "";
			if (isBlockedUrl(url)) {
				createAlertError();
			} else {
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
		}
	);
}

/* Debut actions du script */

// Apply the filter when the user clicks on the filter button
function toggleActiveSections(filter, el) {
	const oldActives = document.querySelectorAll("section.card.active");
	oldActives?.forEach((el) => {
		el?.classList.toggle("active");
	});
	if (filter !== "reset") {
		el?.parentElement?.parentElement?.classList.toggle("active");
	}
}

// and when the user changes the range input
filters.forEach((filter) => {
	const el = document.getElementById(filter);
	el.addEventListener("click", () => {
		toggleActiveSections(filter, el);
		onClickSimulateButton(filter);
	});

	if (filter !== "reset") {
		const rangeInputElt = document
			.getElementById(`range-${filter}`)

		rangeInputElt.addEventListener("input", (event) => {
			const value = event.target.value;

			updateRangeValue(filter, value);
			toggleActiveSections(filter, el);
			applyFilter(filter, value);
		});
		const value = rangeInputElt.value
		updateRangeValue(filter, value);
	}
});

// Apply auto translation to the side panel
applyI18n();

// Event listener sur accordeon pour ouvrir/fermer les sections
document.querySelectorAll(".card > h2").forEach((h2) => {
	h2.addEventListener("click", (e) => {
		onClickTroubleDefinitionChevron(h2, e);
	});
});
