/*
	Versao orientada por JSON.

	Este arquivo mostra uma separacao comum em projetos reais:
	- dados editaveis ficam no JSON;
	- estrutura fica no HTML;
	- montagem dinamica fica no JavaScript.
*/

const DATA_URL = "assets/data/carreira.json";

const createElement = (tagName, className, textContent) => {
	const element = document.createElement(tagName);

	if (className) {
		element.className = className;
	}

	if (textContent) {
		element.textContent = textContent;
	}

	return element;
};

const createBadgeList = (items, ariaLabel) => {
	const list = createElement("ul", "list-inline");
	list.setAttribute("aria-label", ariaLabel);

	items.forEach((item) => {
		const listItem = createElement("li", "list-inline-item");
		const badge = createElement("span", "badge bg-secondary badge-pill", item);

		listItem.appendChild(badge);
		list.appendChild(listItem);
	});

	return list;
};

const renderHeadMetadata = ({ seo, profile }) => {
	document.title = seo.title;
	document.querySelector('meta[name="description"]').setAttribute("content", seo.description);

	const author = document.createElement("meta");
	author.name = "author";
	author.content = seo.author;
	document.head.appendChild(author);

	const canonical = document.createElement("link");
	canonical.rel = "canonical";
	canonical.href = seo.canonicalUrl;
	document.head.appendChild(canonical);

	const openGraphTitle = document.createElement("meta");
	openGraphTitle.setAttribute("property", "og:title");
	openGraphTitle.content = seo.title;
	document.head.appendChild(openGraphTitle);

	const openGraphDescription = document.createElement("meta");
	openGraphDescription.setAttribute("property", "og:description");
	openGraphDescription.content = seo.description;
	document.head.appendChild(openGraphDescription);

	const openGraphImage = document.createElement("meta");
	openGraphImage.setAttribute("property", "og:image");
	openGraphImage.content = profile.photo;
	document.head.appendChild(openGraphImage);
};

const renderProfile = ({ profile, contacts }) => {
	document.getElementById("profile-name").textContent = profile.name;
	document.getElementById("profile-headline").textContent = profile.headline;
	document.getElementById("profile-summary").textContent = profile.summary;

	const photo = document.getElementById("profile-photo");
	photo.src = profile.photo;
	photo.alt = profile.photoAlt;

	const cvLink = document.getElementById("cv-link");
	cvLink.href = profile.cvUrl;
	cvLink.setAttribute("aria-label", `Baixar curriculo de ${profile.name} em PDF`);

	const contactList = document.getElementById("contact-list");
	contactList.innerHTML = "";

contacts.forEach((contact) => {
  const listItem = createElement("li", "mb-2");
  const link = createElement("a", "text-link");
  link.href = contact.url;
  link.setAttribute("aria-label", contact.label);

  if (contact.url.startsWith("mailto:")) {
    link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878-5.64-3.384 5.64-3.384v6.768zm-7.04.142L8 9.271l-5.64 3.384 5.64 3.384zm-5.64-7.04A1 1 0 0 0 2 6.882v5.731l4.36-2.617z"/></svg>';
  } else if (contact.url.includes("linkedin.com")) {
    link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16"><path d="M0 1.146V15h4.776V9.969h-1.316V8.568h1.316V7.074c0-1.296.55-2.118 2.02-2.118h1.077V13.75h2.054V9.969h-2.054V8.908c0-.545.048-.925.925-.925h.978V6.288s-.877-.156-1.704-.156c-1.697 0-2.835 1.019-2.835 2.87v1.632h-1.316V15H16V1.146H0z"/></svg>';
  } else if (contact.url.includes("github.com")) {
    link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';
  } else {
    link.textContent = contact.label;
  }

  if (contact.url.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noopener";
  }

  listItem.appendChild(link);
  contactList.appendChild(listItem);
});
};

const renderCareerTimeline = (careerSteps) => {
	const timeline = document.getElementById("career-timeline");
	timeline.innerHTML = "";

	careerSteps.forEach((step, index) => {
		const article = createElement("article", "resume-timeline-item position-relative pb-5");
		const titleId = `career-step-${index + 1}`;
		article.setAttribute("aria-labelledby", titleId);

		const header = createElement("div", "resume-timeline-item-header mb-2");
		const title = createElement("h3", "resume-position-title font-weight-bold mb-1", step.title);
		title.id = titleId;
		header.appendChild(title);

		const description = createElement("div", "resume-timeline-item-desc");
		description.appendChild(createElement("p", "", step.description));

		description.appendChild(createElement("h4", "resume-timeline-item-desc-heading font-weight-bold", "Soft skills exigidas para essa etapa"));

		const softSkillList = createElement("ul");
		step.softSkills.forEach((skill) => {
			softSkillList.appendChild(createElement("li", "", skill));
		});
		description.appendChild(softSkillList);

		description.appendChild(createElement("h4", "resume-timeline-item-desc-heading font-weight-bold", "Roadmap de aprendizado"));
		description.appendChild(createBadgeList(step.roadmap, `Tecnologias da etapa ${step.title}`));

		article.appendChild(header);
		article.appendChild(description);
		timeline.appendChild(article);
	});
};

const renderSkills = ({ skillGroups, otherSkills }) => {
	const skillGroupsContainer = document.getElementById("skill-groups");
	skillGroupsContainer.innerHTML = "";

	skillGroups.forEach((group) => {
		const groupElement = createElement("div", "resume-skill-item");
		groupElement.appendChild(createElement("h3", "resume-skills-cat font-weight-bold h5", group.title));

		const list = createElement("ul", "list-unstyled mb-4");

		group.skills.forEach((skill) => {
			const item = createElement("li", "mb-2");
			item.appendChild(createElement("div", "resume-skill-name", skill.name));

			const progress = createElement("div", "progress resume-progress");
			progress.setAttribute("aria-label", `${skill.name}: ${skill.level}%`);

			const bar = createElement("div", "progress-bar theme-progress-bar-dark");
			bar.setAttribute("role", "progressbar");
			bar.setAttribute("aria-valuemin", "0");
			bar.setAttribute("aria-valuemax", "100");
			bar.setAttribute("aria-valuenow", String(skill.level));
			bar.style.width = `${skill.level}%`;

			progress.appendChild(bar);
			item.appendChild(progress);
			list.appendChild(item);
		});

		groupElement.appendChild(list);
		skillGroupsContainer.appendChild(groupElement);
	});

	const otherSkillsList = document.getElementById("other-skills");
	otherSkillsList.innerHTML = "";

	otherSkills.forEach((skill) => {
		const item = createElement("li", "list-inline-item");
		item.appendChild(createElement("span", "badge badge-light", skill));
		otherSkillsList.appendChild(item);
	});
};

const renderLanguages = (languages) => {
	const languageList = document.getElementById("language-list");
	languageList.innerHTML = "";

	languages.forEach((language) => {
		const item = createElement("li", "mb-2");
		item.appendChild(createElement("strong", "", language.name));
		item.append(" ");
		item.appendChild(createElement("span", "text-muted", `(${language.level})`));
		languageList.appendChild(item);
	});
};

const renderPage = (data) => {
	renderHeadMetadata(data);
	renderProfile(data);
	renderCareerTimeline(data.careerSteps);
	renderSkills(data);
	renderLanguages(data.languages);
};

fetch(DATA_URL)
	.then((response) => {
		if (!response.ok) {
			throw new Error("Nao foi possivel carregar o JSON.");
		}

		return response.json();
	})
	.then(renderPage)
	.catch((error) => {
		const main = document.getElementById("conteudo-principal");
		const warning = createElement("p", "alert alert-warning m-5", "Nao foi possivel carregar os dados do JSON. Execute a pagina em um servidor local ou publique no GitHub Pages.");
		main.prepend(warning);
		console.error(error);
	});
