javascript: {
[...(document.querySelector(window.prompt("Enter the selector of the element whose children you want to inspect. The default is the document’s body.", "") || ":root > body") ?? document.body).children]
	.map(elm => Object.assign(Object.create(null), {element: elm, "z-index": elm.computedStyleMap().get("z-index")}))
	.filter(entry => entry["z-index"] instanceof CSSUnitValue)
	.sort(
		window.confirm("Would you like to sort the elements by z-index?")
			? (({"z-index": {value: indexA}}, {"z-index": {value: indexB}}) => (indexA === indexB) ? 0 : (indexA < indexB) ? -1 : +1)
			: () => 0
	)
	.reduce(
		console.table
			? (output, {element, "z-index": {value: zIndex}}, index, original) => {output.push(Object.assign(Object.create(null), {element, "z-index": zIndex})); if (index === original.length - 1) { console.table(output); } return output; }
			: (map, {element, "z-index": {value: zIndex}}, index, original) => { map.set(element, zIndex); if (index === original.length - 1) { console.dir(map); } return map; },
		console.table ? [] : new Map()
	)
}
