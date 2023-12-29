
namespace syntax
{
	/**
	 * Renders TypeScript source code with syntax highlighting.
	 */
	export function plain(sourceCode: TemplateStringsArray)
	{
		return highlight("plain", sourceCode[0]);
	}
	
	/**
	 * Renders TypeScript source code with syntax highlighting.
	 */
	export function typescript(sourceCode: TemplateStringsArray)
	{
		return highlight("tsx", sourceCode[0]);
	}
	
	/** */
	function highlight(language: string, sourceCode:string)
	{
		const lines = sourceCode.split("\n");
		
		// Remove leading empty lines
		while (lines[0].trim() === "")
			lines.shift();
		
		// Remove trailing empty lines
		while (lines[lines.length - 1].trim() === "")
			lines.pop();
		
		// Find tab size
		let min = 999999;
		for (const line of lines)
			min = Math.min(min, line.length - line.trimStart().length);
		
		// Remove leading tabs
		for (let i = -1; ++i < lines.length;)
			lines[i] = lines[i].slice(min);
		
		sourceCode = lines.join("\n").trim();
		
		const preElement = raw.pre("language-" + language);
		preElement.innerHTML = prism.highlight(sourceCode, prism.languages[language], "tsx");
		
		for (const element of walkElementTree(preElement))
			if (element.children.length === 0 && element.textContent)
				element.textContent = escape(element.textContent);
		
		return preElement;
	}
	
	css.push(
		"PRE[class*=language-]", {
			margin: "50px auto",
			maxWidth: "800px",
		}
	);
	
	/** */
	export function escape(htmlCode: string)
	{
		return htmlCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")
	}
	
	const prism = require("../source/prism.js");
	
	/**
	 * Enumerates through the decendents of the specified container element.
	 */
	function * walkElementTree(container: HTMLElement)
	{
		yield container;
		const doc = container.ownerDocument;
		const walker = doc.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
		while (walker.nextNode())
			if (walker.currentNode instanceof HTMLElement)
				yield walker.currentNode;
	}
}
