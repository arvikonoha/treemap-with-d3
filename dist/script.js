document.addEventListener("DOMContentLoaded", async event => {
  let data = await fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json");

  let info = await data.json();

  let w = 1080;
  let h = 600;

  let root = d3.hierarchy(info);

  let treemap = d3.treemap().size([w, h]).padding(2);

  let nodes = treemap(
  root.sum(d => d.value).sort((a, b) => b.value - a.value));


  let categories = [];

  const colors = d3.scaleOrdinal(d3.schemeAccent);

  const svg = d3.
  select("#svgc").
  append("svg").
  attr("class", "util").
  attr("width", w).
  attr("height", h);

  let cells = svg.
  selectAll("g").
  data(nodes.leaves()).
  enter().
  append("g").
  attr("transform", d => `translate(${d.x0},${d.y0})`);

  let tooltip = d3.select("#tooltip");
  let name = d3.select("#tooltip .name");
  let category = d3.select("#tooltip .category");
  let value = d3.select("#tooltip .value");

  cells.
  append("rect").
  attr("data-category", d => d.data.category).
  attr("data-value", d => d.data.value).
  attr("data-name", d => d.data.name).
  attr("class", "tile").
  attr("width", d => d.x1 - d.x0).
  attr("height", d => d.y1 - d.y0).
  attr("fill", d => {
    if (!categories.includes(d.data.category))
    categories.push(d.data.category);
    return colors(d.data.category);
  }).
  on("mousemove", d => {
    console.log(d3.event);
    tooltip.transition().
    duration(100).
    style("opacity", 1);

    tooltip.style("top", d3.event.pageY - 32 + "px").
    style("left", d3.event.pageX + 16 + "px").
    attr("data-value", d.data.value);

    name.html(d.data.name);
    category.html(d.data.category);
    value.html((d.data.value / 10000000).toFixed(2) + "M");

  }).on("mouseout", d => {
    tooltip.transition().
    style("opacity", 0).
    duration(0);

    tooltip.style("top", 0 + "px").
    style("left", 0 + "px");

  });

  cells.
  append("text").
  selectAll("tspan").
  data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)).
  enter().
  append("tspan").
  text(d => d).
  attr("font-size", ".6rem").
  attr("y", (d, i) => (i + 1) * 12).
  attr("x", "4");

  let legend = d3.
  select("#legend").
  attr("width", 108).
  attr("height", 28 * categories.length);

  let legIcons = legend.
  selectAll("g").
  data(categories).
  enter().
  append("g").
  attr("transform", (d, i) => `translate(${0},${i * 28})`);

  legIcons.
  append("rect").
  attr("class", "legend-item").
  attr("width", 20).
  attr("height", 20).
  attr("x", 2).
  attr("fill", d => colors(d));

  legIcons.
  append("text").
  text(d => d).
  attr("font-size", ".6rem").
  attr("x", 28).
  attr("y", 12);
});