
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

if (projects && projectsContainer) {
    if (projectsTitle) {
        projectsTitle.textContent = `Projects (${projects.length})`;
    }

    for (const project of projects) {
        renderProjects(project, projectsContainer, 'h2');
    }
}
