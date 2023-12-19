
/** */
function footer()
{
	return [
		raw.p(
			{
				textAlign: "center",
				opacity: 0.2,
				fontWeight: 900,
				fontSize: "8vw",
				transform: "rotate(-10deg) translate(-10%) ",
				transformOrigin: "80% -500%"
			},
			raw.text("#digital1776")
		),
		raw.section(
			"footer",
			raw.div(
				"content",
				raw.img("office", { src: "res.office" }),
				raw.h2(raw.text("Contact")),
				raw.p(
					raw.a({ href: "mailto:hello@squaresapp.org" }, raw.text("hello@squaresapp.org")),
					raw.br(),
					raw.a({ href: "tel:1-289-455-8099" },raw.text("+1 (289) 455-8099")),
				),
				raw.br(),
				raw.br(),
				
				raw.h2(raw.text("Address")),
				raw.p(
					raw.text("795 Canboro Rd."),
					raw.br(),
					raw.text("Fenwick, ON L0S 1C0"),
					raw.br(),
					raw.text("Canada"),
					raw.br(),
					raw.a({ href: "https://www.google.com/maps/place/795+Canboro+Rd,+Fenwick,+ON+L0S+1C0/@43.0249732,-79.3605794,20z/data=!4m6!3m5!1s0x89d34adf0af95141:0xd77996d835fadb50!8m2!3d43.0250445!4d-79.3607899!16s%2Fg%2F11cncmvs03?entry=ttu" },
						raw.text("(map)")
					)
				),
				raw.div("bottom",
					raw.p("social",
						raw.a(
							{ href: "https://www.instagram.com/thesquaresapp" },
							raw.img({ src: "res.social-instagram", title: "Instagram" })
						),
						raw.a(
							{ href: "https://www.twitter.com/thesquaresapp" },
							raw.img({ src: "res.social-twitter", title: "Twitter" })
						),
						raw.a(
							{ href: "https://github.com/squaresapp/squares" },
							raw.img({ src: "res.social-github", title: "GitHub" })
						),
						raw.a(
							{ href: "https://www.linkedin.com/company/squaresapp/" },
							raw.img({ src: "res.social-linkedin", title: "LinkedIn" })
						),
					),
					raw.p("blessing",
						raw.text("Made with "),
						red`&#10084;`,
						raw.text(" in Canada"),
						raw.br(),
						raw.a({ href: "/privacy"}, raw.text("Privacy Policy"))
					),
				),
			)
		)
	]
}

	// Footer
	css.push(
		".footer", {
			overflow: "hidden",
			fontSize: "20px",
			lineHeight: 1.66,
		},
		".footer:before", {
			content: `""`,
			position: "absolute",
			zIndex: -1,
			top: 0,
			left: "-100%",
			bottom: 0,
			right: 0,
			backgroundColor: "hsl(0, 0%, 10%)",
			transform: "rotateZ(-10deg)",
			transformOrigin: "100% 0"
		},
		".footer *", {
			fontSize: "inherit",
		},
		".footer A", {
			color: "inherit",
		},
		".footer H2", {
			color: blueColor,
			textTransform: "uppercase",
			fontWeight: 700
		},
		".footer > DIV", {
			paddingTop: "25vw",
			margin: "auto",
			maxWidth: "800px",
		},
		".footer IMG.office", {
			maxWidth: "500px",
			float: "right",
			zIndex: 1,
			borderRadius: "6px",
			boxShadow: "0 5px 7px rgba(0, 0, 0, 0.4)",
		},
		".footer .bottom", {
			display: "flex",
			clear: "both",
			padding: "10px 0 50px",
		},
		".footer .bottom > *", {
			flex: "1 0",
		},
		".footer .blessing", {
			textAlign: "right",
		},
		".footer .social", {
			paddingTop: "100px",
		},
		".footer .social IMG", {
			width: "50px",
			marginRight: "20px",
		}
);
