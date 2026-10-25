
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsTitle = document.querySelector('.projects-title');
const projectsContainer = document.querySelector('.projects');

if (projects && projectsTitle && projectsContainer) {
    projectsTitle.textContent = `Projects (${projects.length})`;

    projectsContainer.innerHTML = '';

    for (const project of projects) {
        renderProjects(project, projectsContainer, 'h2');
    }
}
