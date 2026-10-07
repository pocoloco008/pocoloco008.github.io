document.addEventListener('DOMContentLoaded', () => {
	const languageToggle = document.querySelector('#language-toggle');
	if (!languageToggle) return;

	const storageKey = 'portfolio-language';
	const englishToDutch = new Map([
		['Home', 'Startpagina'],
		['Projects', 'Projecten'],
		['Contacts', 'Contact'],
		['Latest Projects', 'Nieuwste projecten'],
		['This is my solo project from year 3.', 'Dit is mijn soloproject uit jaar 3.'],
		['About Me', 'Over mij'],
		['Hi I\'m Paco van der Aar. im 18 years old, enjoy playing video games, drawing and walking alot. I am quite introverted but i still love talking alot with people. i am learning game development i work with C# and Unity. ive worked on several small projects and mostly focused on UI in unity and now im focusing more on gameplay, i would love to learn more coding languages so i have more knowledge on more than one aspect. i had a part time job as a waiter and have learned to work efficiently under pressure and comunicate not only with my co-workers in a positive way but also being able to communicate with customers so they are pleased with the service.', 'Hoi, ik ben Paco van der Aar. Ik ben 18 jaar en houd van videogames spelen, tekenen en veel wandelen. Ik ben vrij introvert, maar praat toch graag met mensen. Ik leer gameontwikkeling en werk met C# en Unity. Ik heb aan verschillende kleine projecten gewerkt, waarbij ik me vooral richtte op de gebruikersinterface in Unity. Nu richt ik me meer op gameplay. Ik wil graag meer programmeertalen leren, zodat ik kennis heb van meerdere onderdelen. Ik heb een bijbaan gehad als ober en heb geleerd efficient onder druk te werken en op een positieve manier te communiceren met zowel mijn collega\'s als klanten, zodat zij tevreden zijn over de service.'],
		['Projects Showcase', 'Projectoverzicht'],
		['my current projects', 'Mijn huidige projecten'],
		['project 1', 'Project 1'],
		['project 2', 'Project 2'],
		['project 3', 'Project 3'],
		['Open details for Project 1', 'Details van project 1 openen'],
		['Open details for Project 2', 'Details van project 2 openen'],
		['Open details for Project 3', 'Details van project 3 openen'],
		['View details', 'Bekijk details'],
		['A small Unity prototype focused on core gameplay systems, level flow, and polished player feedback.', 'Een kleine Unity-prototype gericht op de belangrijkste gameplay-systemen, levelverloop en duidelijke feedback voor de speler.'],
		['A puzzle-based concept with a strong visual identity, UI feedback, and a clean progression loop.', 'Een puzzelconcept met een sterke visuele stijl, feedback in de interface en een duidelijke voortgang.'],
		['An atmospheric project aimed at storytelling, polish, and improving gameplay readability through visual cues.', 'Een sfeervol project gericht op verhaal, afwerking en duidelijke gameplay met behulp van visuele aanwijzingen.'],
		['Close project details', 'Projectdetails sluiten'],
		['Project preview', 'Projectvoorbeeld'],
		['Contact Me', 'Contact'],
		['Contact Info', 'Contactgegevens'],
		['Email:', 'E-mail:'],
		['Location', 'Locatie'],
		['Netherlands', 'Nederland']
	]);
	const dutchToEnglish = new Map(
		[...englishToDutch].map(([english, dutch]) => [dutch, english])
	);

	function translateValue(value, isDutch) {
		const trimmedValue = value.trim();
		const translatedValue = (isDutch ? englishToDutch : dutchToEnglish).get(trimmedValue);
		return translatedValue ? value.replace(trimmedValue, translatedValue) : value;
	}

	function translateNode(node, isDutch) {
		if (node.nodeType === Node.TEXT_NODE) {
			const translatedValue = translateValue(node.nodeValue, isDutch);
			if (translatedValue !== node.nodeValue) node.nodeValue = translatedValue;
			return;
		}
		if (node.nodeType !== Node.ELEMENT_NODE) return;

		['aria-label', 'alt'].forEach((attribute) => {
			const value = node.getAttribute(attribute);
			if (!value) return;
			const translatedValue = translateValue(value, isDutch);
			if (translatedValue !== value) node.setAttribute(attribute, translatedValue);
		});
		node.childNodes.forEach((child) => translateNode(child, isDutch));
	}

	function applyLanguage(isDutch) {
		translateNode(document.body, isDutch);
		document.title = translateValue(document.title, isDutch);
		document.documentElement.lang = isDutch ? 'nl' : 'en';
		languageToggle.textContent = 'Translate';
		languageToggle.setAttribute('aria-pressed', String(isDutch));
	}

	function storeLanguage(isDutch) {
		try {
			window.localStorage.setItem(storageKey, isDutch ? 'nl' : 'en');
		} catch {
			// The page can still be translated when storage is unavailable.
		}
	}

	let isDutch = false;
	try {
		isDutch = window.localStorage.getItem(storageKey) === 'nl';
	} catch {
		// Default to English when storage is unavailable.
	}

	applyLanguage(isDutch);
	languageToggle.addEventListener('click', () => {
		isDutch = !isDutch;
		storeLanguage(isDutch);
		applyLanguage(isDutch);
	});

	window.addEventListener('storage', (event) => {
		if (event.key !== storageKey) return;
		isDutch = event.newValue === 'nl';
		applyLanguage(isDutch);
	});

	const observer = new MutationObserver((records) => {
		records.forEach((record) => {
			if (record.type === 'characterData') {
				translateNode(record.target, isDutch);
				return;
			}
			record.addedNodes.forEach((node) => translateNode(node, isDutch));
			if (record.type === 'attributes') translateNode(record.target, isDutch);
		});
	});
	observer.observe(document.body, {
		attributes: true,
		attributeFilter: ['aria-label', 'alt'],
		characterData: true,
		childList: true,
		subtree: true
	});
});
