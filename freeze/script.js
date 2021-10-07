javascript: {
	let delay = window.prompt("seconds until freeze", 8);
	if (delay !== null && delay !== undefined && typeof (delay = Number.parseFloat(delay, 10)) === "number") {
		let doDupe = () => {
			let replacement = document.documentElement.cloneNode(Infinity);
			/* remove (or at least disable) all scripts */
			for (let script of replacement.getElementsByTagName("script")) {
				script.parentElement?.removeChild(script);
				if (script.parentElement) {
					script.replaceChildren();
					for (let attr of script.getAttributeNames()) {
						script.removeAttribute(attr);
					}
				}
			}
			if (window.confirm("Open in a new tab?")) {
				for (let attr of ["href", "src"]) {
					for (let elm of replacement.querySelectorAll(`[${attr}]`)) {
						/* expand relative URLs to absolute */
						elm.getAttribute(attr).startsWith("#") || (elm[attr] = elm[attr]);
					}
				}
				/* There is no easy way to get the textual representation of a DocumentType, so this is the best that I can do. */
				let doctypeIDs = [document.doctype.publicId, document.doctype.systemId].filter(id => id);
				doctypeIDs = doctypeIDs.length === 0 ? "" : ` PUBLIC ${doctypeIDs.map(id => `"${id}"`).join(" ")}`;
				let objURL = URL.createObjectURL(new Blob([
					`<!doctype ${document.doctype.name}${doctypeIDs}><html>${replacement.innerHTML}</html>`
				], {type: "text/html"}));
				/* open the object URL and immediately revoke the URL (to save RAM) */
				window.open(objURL)?.addEventListener("DOMContentLoaded", () => URL.revokeObjectURL(objURL), {passive: true, once: true});
			} else {
				document.documentElement.replaceChildren(...replacement.childNodes);
			}
		};
		delay > 0 ? window.setTimeout(doDupe, Math.round(delay * 1000)) : doDupe();
	}
}
