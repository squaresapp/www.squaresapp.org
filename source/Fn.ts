
namespace Fn
{
	/**
	 * Returns the email address in a format that is invisible to spam bots.
	 */
	export function maskEmail(anchorId: string, email: string)
	{
		const emailParts = email.split("@");
		return raw.script(raw.text(`
			window.addEventListener("DOMContentLoaded", () =>
			{
				const a = document.getElementById("${anchorId}");
				const at = String.fromCharCode(64);
				a.href = "mailto:${emailParts[0]}" + at + "${emailParts[1]}";
				if (a.textContent === "")
					a.textContent = "${emailParts[0]}" + at + "${emailParts[1]}";
			});
		`));
	}
	
	/**
	 * 
	 */
	export function iPhone(...params: Raw.Param[])
	{
		return raw.div("iphone-wrapper", params);
	}
	
	css.push(
		".iphone-wrapper", {
			aspectRatio: "1/2",
			width: "fit-content",
			margin: "80px auto",
			padding: "20px",
			borderRadius: "70px",
			backgroundColor: "black",
			boxShadow: 
				`0 10px 50px rgba(0, 0, 0, 1),
				inset 0 0  0 1px hsl(60, 0%, 42%),
				inset 0 0 0 5px hsl(120, 0%, 17%)`
		},
		".iphone-wrapper:before", {
			content: `""`,
			position: "absolute",
			left: 0,
			right: 0,
			bottom: "25px",
			margin: "auto",
			width: "155px",
			height: "5px",
			borderRadius: "10px",
			backgroundColor: "hsl(180, 0%, 30%)",
		},
		".iphone-wrapper > :first-child", {
			borderRadius: "50px",
		}
	);
	
	/**
	 * 
	 */
	export function quoteBubble(tsa: TemplateStringsArray, ...items: (string | HTMLElement)[])
	{
		return raw.blockquote(
			"bubble",
			raw.text(tsa, ...items),
			raw.span("point")
		);
	}
	
	css.push(
		".bubble", {
			padding: "50px",
			borderRadius: "35px",
			lineHeight: "1.25",
			fontSize: "40px",
			fontWeight: "900",
			color: "white",
			backgroundColor: "#171E27",
		},
		".bubble::before, .bubble::after", {
			fontFamily: "Georgia, 'Times New Roman', Times, serif",
			position: "absolute"
		},
		".bubble:before", {
			content: `"\\201C"`,
			marginLeft: "-0.6em",
		},
		".bubble:after", {
			content: `"\\201D"`,
			marginLeft: "0.1em",
		},
		".bubble .point", {
			position: "absolute",
			marginTop: "40px",
			display: "block",
			width: "0",
			height: "0",
			borderStyle: "solid",
			borderWidth: "0 50px 50px 0",
			borderBottomWidth: "50px",
			borderColor: "transparent",
			borderRightColor: "#171E27",
		}
	);
	
	/**
	 * Renders HTML source code with syntax highlighting.
	 */
	export function colorHtml(sourceCode: string)
	{
		return raw.pre(
			"one-line",
			raw.text(sourceCode.replace(/</g, "&lt;"))
		);
	}
	
	css.push(
		"PRE.one-line", {
			margin: "1em",
			padding: "1em",
			borderRadius: "20px",
			backgroundColor: "hsl(360, 0%, 10%)",
			fontFamily: "Fira Code",
			textAlign: "left",
			overflowX: "scroll",
		}
	);
	
	/**
	 * Renders TypeScript source code with syntax highlighting.
	 */
	export function colorPlain(sourceCode: string)
	{
		return colorSyntax("plain", sourceCode);
	}
	
	/**
	 * Renders TypeScript source code with syntax highlighting.
	 */
	export function colorTypescript(sourceCode: string)
	{
		return colorSyntax("tsx", sourceCode);
	}
	
	/** */
	function colorSyntax(language: string, sourceCode:string)
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
				element.textContent = element.textContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		
		return preElement;
	}
	
	css.push(
		"PRE[class*=language-]", {
			margin: "50px auto",
			maxWidth: "800px",
		}
	);
	
	export const prism = require("../source/prism.js");
	
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