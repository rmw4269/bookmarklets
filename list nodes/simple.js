javascript:(function(){
	"use strict";
	console.dir([document, ...(function* walk(root) {
		switch (root.nodeType) {
			case Node.DOCUMENT_NODE:
			case Node.DOCUMENT_FRAGMENT_NODE:
			case Node.ELEMENT_NODE:
				for (let c of root.childNodes) {
					yield c;
					yield* walk(c);
				}
		}
	})(document)]);
})();
