<script setup>
// refs https://observablehq.com/@d3/occlusion
// refs https://observablehq.com/@d3/force-directed-graph/2

// node {id: 1, group: 1}
// link {source: 1, target: 2, value: 1}

import { useClipsStore } from '../stores/clips'
import * as d3 from 'd3'
import { useTemplateRef, onMounted } from 'vue'

const clips = useClipsStore()
const graphRef = useTemplateRef('graph')

const makeD3Graph = (data) => {
  console.log('making d3 force directed graph')
  // Specify the dimensions of the chart.
  const width = document.body.clientWidth
  const height = document.body.clientHeight

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10)

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.links.map((d) => ({ ...d }))
  const nodes = data.nodes.map((d) => ({ ...d }))

  // Create a simulation with several forces.
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(300)
      // .strength(0.01)
    )
    .force(
      'x',
      d3.forceX((d) => Math.random() * width).strength((d) => Math.random() + 0.1)
    )
    .force(
      'y',
      d3.forceY((d) => Math.random() * height).strength((d) => Math.random() + 0.1)
    )
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .on('tick', ticked)

  // Create the SVG container.
  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;')

  // Add a line for each link, and a circle for each node.
  const link = svg
    .append('g')
    .attr('stroke', '#666')
    .attr('stroke-opacity', 0.6)
    .selectAll()
    .data(links)
    .join('line')
    .attr('stroke-width', (d) => Math.sqrt(d.value))

  const node = svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1)
    .selectAll('g')
    .data(nodes)
    .join('g')

  node.append('circle').attr('r', 5).attr('fill', 'transparent').attr('stroke', 'none')

  // node.append('title').text((d) => d.id)

  node
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .text((d) => d.query)
    .lower()
    .attr('fill', 'white')
    .attr('stroke', 'white')
    .attr('font-size', 48)
    .attr('opacity', 1)

  // Add a drag behavior.
  node.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))

  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    node.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0)
    event.subject.fx = null
    event.subject.fy = null
  }

  // When this cell is re-run, stop the previous simulation. (This doesn’t
  // really matter since the target alpha is zero and the simulation will
  // stop naturally, but it’s a good practice.)
  // invalidation.then(() => simulation.stop());
  return svg.node()
}

clips.$subscribe((_, state) => {
  const data = state.graphData
  console.log(data)
  console.log('connections graph data changed')
  if (graphRef.value == null) {
    return
  }

  const svg = makeD3Graph(data)
  graphRef.value.innerHTML = ''
  graphRef.value.append(svg)
})

onMounted(() => {
  console.log('mounted')
  console.log(graphRef.value)
})
</script>

<template>
  <div ref="graph" class="w-full h-full"></div>
</template>
