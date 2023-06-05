javascript: (function () {
	"use strict";
	let varName = navigator.userAgent.match(/\bGecko\/\S/) ? 0 : 1;
	while (Object.hasOwn(globalThis, `temp${varName}`) && varName++);
	varName = prompt("name of global variable for live node list", `temp${varName}`);
	if (!varName) { return; }

	Object.defineProperty(globalThis, varName, {
		enumerable: true,
		configurable: true,
		get() { return [document, ...walk(document)]; },
		set(value) {
			Object.defineProperty(globalThis, varName, {
				enumerable: true,
				configurable: true,
				writable: true,
				value
			});
		}
	});

	function* walk(root) {
		switch (root.nodeType) {
			case Node.DOCUMENT_NODE:
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.ELEMENT_NODE:
				for (let c of root.childNodes) {
					yield c;
					yield* walk(c);
				}
		}
	}
})();
