
namespace Fn
{
	/**
	 * Renders TypeScript source code with syntax highlighting.
	 */
	export function typescript(sourceCode: string)
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
		const preElement = raw.pre("language-typescript");
		preElement.innerHTML = prism.highlight(sourceCode, prism.languages.typescript, "ts");
		return preElement;
	}

	export const prism = require("prismjs");
	const loadLanguages = require("prismjs/components/");
	loadLanguages(["typescript"]);
	
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
}