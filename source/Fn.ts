
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
}