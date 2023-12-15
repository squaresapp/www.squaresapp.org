
/**
 * Renders TypeScript source code with syntax highlighting.
 */
function typescript(sourceCode: string)
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
	preElement.innerHTML = typescript.prism.highlight(sourceCode, typescript.prism.languages.typescript, "ts");
	return preElement;
}

namespace typescript
{
	export const prism = require("prismjs");
	const loadLanguages = require("prismjs/components/");
	loadLanguages(["typescript"]);
}
