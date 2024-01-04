
/** */
function footer()
{
	return [
		raw.section(
			"footer",
			
			raw.div(
				{
					display: "flex",
					justifyContent: "space-between",
				},
				raw.div(
					raw.h2(raw.text("Contact")),
					
					raw.a({ id: "footer-email-link", href: "#" }),
					Fn.maskEmail("footer-email-link", "hello@squaresapp.org"),
					
					raw.br(),
					
					raw.a({ href: "https://www.x.com/heropaulg" }),
				),
				raw.div(
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
				),
				raw.div(
					raw.h2(raw.text("Projects")),
					a("Squares", "/"),
					raw.br(),
					a("Webfeeds", "/webfeeds"),
					raw.br(),
					a("StrawJS", "/strawjs"),
					raw.br(),
					a("RawJS", "/rawjs"),
				),
			),
			
			raw.div(
				{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "50px 0",
				},
				raw.p("social",
					raw.a(
						{ href: "https://www.x.com/heropaulg" },
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
					raw.a(
						{ href: "https://www.instagram.com/thesquaresapp" },
						raw.img({ src: "res.social-instagram", title: "Instagram" })
					),
				),
				raw.p(
					{
						textAlign: "center",
					},
					t`This website is ${b`MIT licensed`}.${br()}
					It was generated with ${a("StrawJS", "/strawjs")}.${br()}
					This website repository is ${a("here", "https://github.com/squaresapp/www.squaresapp.org")}.
				`),
			),
			raw.div(
				{
					textAlign: "right",
					opacity: 0.5
				},
				a("Privacy Policy", "/privacy/")
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
		paddingTop: "20vw",
		paddingBottom: "100px",
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
		fontWeight: 700,
		paddingBottom: "10px",
	},
	".footer > DIV", {
		margin: "auto",
		maxWidth: "800px",
	},
	".footer .bottom > *", {
		flex: "1 0",
	},
	".footer .social A", {
		width: "50px",
		display: "inline-block",
	},
	".footer .social IMG", {
		width: "100%"
	},
	".footer .social A + A", {
		marginLeft: "25px",
	}
);
