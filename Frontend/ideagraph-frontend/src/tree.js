import * as d3 from "d3";

const graph = {
  nodes: [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Chen" },
    { name: "Dawg" },
    { name: "Ethan" },
    { name: "George" },
    { name: "Frank" },
    { name: "Hanes" },
  ],
  links: [
    { source: "Alice", target: "Bob" },
    { source: "Chen", target: "Bob" },
    { source: "Dawg", target: "Chen" },
    { source: "Hanes", target: "Frank" },
    { source: "Hanes", target: "George" },
    { source: "Dawg", target: "Ethan" },
  ],
};

const simulation = d3
  .forceSimulation(graph.nodes)
  .force(
    "link",
    d3
      .forceLink(graph.links)
      .id(function (d) {
        return d.name;
      })
      .distance(200)
  )
  .force("charge", d3.forceManyBody().strength(-400))
  .force("center", d3.forceCenter(0, 0));

export { graph, simulation };
