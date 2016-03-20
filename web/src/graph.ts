// draw a directed graph with d3
import {ElementRef} from "angular2/core";
import {Directive} from "angular2/core";
import {Inject} from "angular2/core";
import {Input} from "angular2/core";
//import * as d3 from "d3";

@Directive({
  selector: 'graph',
  properties: ['nodes', 'edges']
})
export class Graph {

  @Input() width: number;
  @Input() height: number;

  constructor(@Inject(ElementRef) elRef) {
    var svg = d3.select(elRef.nativeElement).append('svg').attr({width: '100%', height:'100%'});

    var graph = {
      nodes: [
        { id:0, name: '>', group: 0, x:0, y:0 },
        { id:1, name: 'b', group: 0, x:0, y:0 },
        { id:2, name: 'c', group: 0, x:0, y:0 },
        { id:3, name: 'i', group: 0, x:0, y:0 },
        { id:4, name: 'j', group: 0, x:0, y:0 },
        { id:5, name: '^', group: 0, x:0, y:0 },
        { id:6, name: 'x', group: 1, x:0, y:0 },
        { id:7, name: 'y', group: 1, x:0, y:0 },
        { id:8, name: 'z', group: 1, x:0, y:0 },
        { id:9, name: '!', group: 1, x:0, y:0 }],
      edges: [
        { source: 0, target: 9 },
        { source: 9, target: 1 },
        { source: 1, target: 6 },
        { source: 6, target: 2 },
        { source: 6, target: 3 },
        { source: 2, target: 8 },
        { source: 3, target: 7 },
        { source: 7, target: 4 },
        { source: 4, target: 8 },
        { source: 8, target: 5 }]
    };

    var force = d3.layout.force().charge(-250).linkDistance(45).size([640, 480]);
    force.nodes(graph.nodes).links(graph.edges).start();

    var links = svg.selectAll("line.link").data(graph.edges)
      .enter().append("line")
      .attr("class", "link")
      .style({"stroke": "#000",
              "stroke-width": 2 });

    var circs = svg.selectAll("circle.node").data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 15)
      .call(force.drag);

    force.on("tick", function() {
        links.attr({
          "x1": function(d:any){ return d.source.x; },
          "y1": function(d:any){ return d.source.y; },
          "x2": function(d:any){ return d.target.x; },
          "y2": function(d:any){ return d.target.y; }});
        circs.attr({
          "cx": function(d:any){ return d.x; },
          "cy": function(d:any){ return d.y; }});
    });
  }
}
