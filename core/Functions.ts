
namespace Fn
{
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
	export function colorTypescript(sourceCode: string)
	{
		return colorSyntax("typescript", sourceCode);
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
		
		sourceCode = lines.join("\n");
		const preElement = raw.pre("language-" + language);
		preElement.innerHTML = prism.highlight(sourceCode, prism.languages[language], "ts");
		return preElement;
	}
	
	export const prism = require("prismjs");
	const loadLanguages = require("prismjs/components/");
	loadLanguages(["typescript", "html"]);
	
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
		}
	);
}