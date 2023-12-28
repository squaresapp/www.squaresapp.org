
page("/privacy", "Privacy Policy",
	raw.style(
		"SECTION:not(.footer)", {
			maxWidth: "1024px",
			margin: "auto",
			paddingLeft: "min(2vw, 50px)",
			paddingRight: "min(2vw, 50px)",
			paddingBottom: "2rem",
			display: "flex",
			lineHeight: 1.66,
		},
		"SECTION.last", {
			paddingBottom: "100px",
		},
		".header-section", {
			display: "block",
			marginBottom: "2rem",
			paddingTop: "3rem",
			paddingBottom: "3rem",
		},
		".header-section H1", {
			textAlign: "center",
			fontWeight: 700,
			fontSize: "min(10vw, 100px)",
		},
		".header-section HR", {
			marginTop: "5rem",
		},
		".policy-section > DIV:first-child", {
			width: "66%",
			paddingRight: "20px",
		},
		".policy-section > DIV:last-child", {
			width: "33%",
			paddingLeft: "20px",
		},
		/*
		@media screen and (min-width: 600px) {
			.policy-section > DIV:first-child {
				width: 66%;
				padding-right: 20px;
			}
			.policy-section > DIV:last-child {
				width: 33%;
				padding-left: 20px;
			}
		}
		@media screen and (max-width: 599.9px) {
			.policy-section {
				display: "block",
			}
		},
		*/
		".policy-section H3", {
			marginTop: "2rem",
			fontWeight: 700,
			fontSize: "1.5rem",
		},
		"OL", {
			paddingLeft: "1.5em",
		},
	),
	
	raw.section("header-section",
		raw.div(
			raw.h1(t`Privacy Policy`),
			raw.p(`
				This Privacy Policy explains how information is collected, used and disclosed by Scroll, Inc. When you access or use our websites, mobile applications, or other products or services (collectively, the "Services"), or when you otherwise interact with us. Our Services include the iOS app and Android app available at the relevant app stores, and any online storage services ("Storage Services") that enable users to store data ("Storage Materials").
			`),
			raw.hr()
		),
	),
	
	raw.section("policy-section",
		raw.div(
			raw.h2(t`Collection of Information`),
			raw.p(t`
				We collect information you provide when you create an account, subscribe to our updates, respond to a survey, fill out a form, request customer support or communicate with us.
			`),
			raw.p(t`
				The types of information we may collect include your email address, survey responses, and any other information you choose to provide. Additionally, when you use our Services, we automatically collect information from your devices. For example, we may collect:
			`),
			raw.ol(
				raw.li(t`${b`Log Information`}: We may collect log information when you use our Services, including access times, pages viewed, IP address, and the web page that referred you to our website.`),
				
				raw.li(t`${b`Device Information`} We may collect information about the computer or mobile device you use to access our Services, including the hardware model, operating system and version, your web browser, and device identifiers.`),
				
				raw.li(t`${b`Telemetry Information`} If you use our Storage Services, we may collect bandwidth upload and download speeds, and other statistics about your device and network connection.`),
				
				raw.li(t`${b`Usage Information`} If you use our Storage Services, may collect metadata about the files you upload for storage.`)
			)
		),
		raw.div(
			raw.h3(t`Which Means`),
			raw.b(t`We may collect data about how our service is used. (We don't use Google Analytics on our website. Instead we use a GDPR-friendly ${raw.a({ href: "https://www.counter.dev" }, t`web analytics tracker`)}.`)
		),
	),
	
	raw.section("policy-section",
		raw.div(
			raw.h2(t`Use of Information`),
			raw.p(t`
				Scroll, Inc uses the information we collect for the following general purposes: products and services provision, billing, identification and authentication, services improvement, contact, and research.
			`)
		),
		raw.div(),
	),
	
	raw.section("policy-section",
		raw.div(
			raw.h2(t`Data Ownership`),
			raw.p(t`
				Scroll, Inc owns the data storage, databases and all rights to the Scroll, Inc application however we make no claim to the rights of your data. You retain all rights to your data and we will never contact your clients directly, or use your data for our own business advantage or to compete with you or market to your clients.
			`)
		),
		raw.div(
			raw.h3(t`Which Means`),
			raw.p(raw.b(t`You own your data and we will respect that. We won't try and compete with you or write to your customers.`)),
		),
	),
	
	raw.section("policy-section",
		raw.div(
			raw.h2(t`Security`),
			raw.p(t`
				Scroll, Inc takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
			`),
			raw.p(t`
				When you enter sensitive information, such as credit card number on our registration form, we encrypt the transmission of that information using secure socket layer technology (SSL). Credit card details are stored encrypted using AES-256 encryption. As a level 1 PCI-DSS compliant service provider we follow all PCI-DSS requirements and implement additional generally accepted industry standards to protect the personal information submitted to us, both during transmission and once we receive it.
			`),
			raw.p(t`
				No method of transmission over the Internet, or method of electronic storage, is 100% secure, however. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. 
			`),
		),
		raw.div(
			raw.h3(t`Which Means`),
			raw.p(raw.b(t`
				We will safeguard your credit card and sensitive information with methods that meet or exceed industry standards.
			`)),
			raw.p(raw.b(t`
				But because stuff happens, it's impossible to guarantee 100% security of your data.
			`)),
		),
	),

	raw.section("policy-section",
		raw.div(
			raw.h2(t`Disclosure`),
			raw.ol(
				raw.li(t`Scroll, Inc may use third party service providers to provide certain services to you and we may share Personal Information with such service providers. We require any company with which we may share Personal Information to protect that data in a manner consistent with this policy and to limit the use of such Personal Information to the performance of services for Scroll, Inc.`),

				raw.li(t`Scroll, Inc may disclose Personal Information under special circumstances, such as to comply with court orders requiring us to do so or when your actions violate the Terms of Service.`),

				raw.li(t`We do not sell or otherwise provide Personal Information to other companies for the marketing of their own products or services.`),
			)
		),
		raw.div(
			raw.h3(t`Which Means`),
			raw.p(raw.b(t`In certain circumstances, we may disclose your personal information, like court orders.`))
		),
	),
	raw.section("policy-section last",
		raw.div(
			raw.h2(t`Changes to this Privacy Policy`),
			raw.p(t`
				We reserve the right to modify this privacy statement at any time, so please review it frequently. If we make material changes to this policy, we will notify you here or by means of a notice on our homepage so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we disclose it.
			`)
		),
		raw.div(
			raw.h3(t`Which Means`),
			raw.p(raw.b(t`We may change this Privacy Statement. If it's a big change, we will inform you, right here.`))
		),
	)
);
