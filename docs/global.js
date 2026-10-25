
console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/docs/"
    : "/portfolio/";

const pages = [
    { url: "", title: "Home" },
    { url: "contact/", title: "Contact" },
    { url: "projects/", title: "Projects" },
    { url: "resume/", title: "Resume" },
    { url: "https://github.com/nineinchnailed", title: "GitHub" }
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith("http")) {
        url = BASE_PATH + url;
    }

    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current");
    }

    if (a.host !== location.host) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    }

    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
    `
);

let themeSelect = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    themeSelect.value = colorScheme;
}

if ('colorScheme' in localStorage) {
    setColorScheme(localStorage.colorScheme);
}

themeSelect.addEventListener('input', function (event) {
    setColorScheme(event.target.value);
    localStorage.colorScheme = event.target.value;
});

//projects asynch. 

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}



export function renderProjects(project, containerElement, headingLevel = 'h2') {
    const article = document.createElement('article');

    let imagePath = project.image;

    if (!imagePath.startsWith('http')) {
        imagePath = BASE_PATH + imagePath;
    }

    article.innerHTML = `
        <${headingLevel}>${project.title}</${headingLevel}>
        <img src="${imagePath}" alt="${project.title}">
        <p>${project.description}</p>
    `;

    containerElement.appendChild(article);
}



export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}