javascript: {
	let parent;
	try { parent = document.querySelector(window.prompt("Enter the selector of the element whose children you want to inspect. The default is the document’s body. Only the first result is used.", "") || ":root > body"); }
	catch (e) { if (e instanceof DOMException) {
		window.alert("Sorry, that is not a valid selector.");
	} else { throw e; }}

	if (parent) {
		let zIndexIndex = [...parent.children]
			.map(elm => Object.assign(Object.create(null), {element: elm, "z-index": elm.computedStyleMap().get("z-index")}))
			.filter(
				(typeof CSSUnitValue === "undefined")
					/* test for a fully numeric string */
					? entry => entry["z-index"].toString().trim().match(/[0-9]+/)
					/* test for a CSS unit, rather than a keyword */
					: entry => entry["z-index"] instanceof CSSUnitValue
			);

		zIndexIndex.forEach(
			(typeof CSSUnitValue === "undefined")
				/* parse the number strings into integers */
				? entry => Object.assign(entry, {"z-index": Number.parseInt(entry["z-index"].trim())})
				/* replace CSSUnitValue objects with their value */
				: entry => Object.assign(entry, {"z-index": entry["z-index"].value})
		);

		/* optionally sort the elements by z-index */
		if (window.confirm("Sort the elements by z-index?")) {
			zIndexIndex.sort(({"z-index": indexA}, {"z-index": indexB}) => (indexA === indexB) ? 0 : (indexA < indexB) ? -1 : +1)
		}

		/* find some way to print out the results */
		if (console.table) {
			console.table(zIndexIndex);
		} else if (console.dir) {
			console.dir(new Map(zIndexIndex.map(({element, "z-index": zIndex}) => [element, zIndex])));
		} else {
			console.group ? console?.group("z-indices") : console.log("z-indices:")
			for (let entry of zIndexIndex) {
				console.log(entry.element + ": \t" + entry["z-index"]);
			}
			console.group && console.groupEnd();
		}
	} else { console.error("[z-indexer]\tNo elements were found, or the selector was invalid."); }
}
