
/** */
function page(path: string, title: string, ...params: Straw.PageParam[])
{
	straw.page(path,
		raw.title(title),
		raw.meta({ charset: "UTF-8" }),
		raw.link({ rel: "preconnect", href: "https://fonts.googleapis.com" }),
		raw.link({ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true }),
		raw.link({ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap" }),
		raw.link({ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@400;900&display=swap" }),
		raw.link({ rel: "stylesheet", type: "text/css", href: "prism.css" }),
		raw.div(
			"width",
			...params
		),
		
		// This will get hoisted to the top,
		// but it must be at the bottom so
		// that any params can execute any
		// on-demand generation.
		raw.style(...css),
	);
}
