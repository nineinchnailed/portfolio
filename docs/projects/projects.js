
import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsTitle = document.querySelector('.projects-title');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1;
let selectedYear = null;

const years = [...new Set(projects.map((project) => project.year))].sort(
    (a, b) => a - b
);

const colors = d3.scaleOrdinal()
    .domain(years)
    .range(d3.schemeTableau10);

function getSearchFilteredProjects() {
    return projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
}

function getVisibleProjects() {
    let filteredProjects = getSearchFilteredProjects();

    if (selectedYear !== null) {
        filteredProjects = filteredProjects.filter(
            (project) => String(project.year) === String(selectedYear)
        );
    }

    return filteredProjects;
}

function renderProjectList() {
    let visibleProjects = getVisibleProjects();

    projectsContainer.innerHTML = '';

    for (const project of visibleProjects) {
        renderProjects(project, projectsContainer, 'h2');
    }

    projectsTitle.textContent = `Projects (${visibleProjects.length})`;
}

function renderPieChart(projectsGiven) {
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(50);

    let sliceGenerator = d3.pie()
        .value((d) => d.value);

    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));

    let svg = d3.select('#projects-pie-plot');
    let legend = d3.select('.legend');

    svg.selectAll('*').remove();
    legend.selectAll('*').remove();

    selectedIndex = data.findIndex(
        (d) => String(d.label) === String(selectedYear)
    );

    arcs.forEach((arc, i) => {
        svg.append('path')
            .attr('d', arc)
            .attr('fill', colors(data[i].label))
            .classed('selected', selectedIndex === i)
            .on('click', () => {
                selectedYear = selectedYear === data[i].label
                    ? null
                    : data[i].label;

                updatePage();
            });
    });

    data.forEach((d, i) => {
        legend.append('li')
            .attr('style', `--color:${colors(d.label)}`)
            .attr('class', 'legend-item')
            .classed('selected', selectedIndex === i)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .on('click', () => {
                selectedYear = selectedYear === d.label
                    ? null
                    : d.label;

                updatePage();
            });
    });
}

function updatePage() {
    renderProjectList();
    renderPieChart(getSearchFilteredProjects());
}

if (projects && projectsTitle && projectsContainer) {
    updatePage();
}

if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        query = event.target.value;
        updatePage();
    });
}

