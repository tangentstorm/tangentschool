/// <reference path="../typings/browser.d.ts" />

// draw a directed graph with d3
import {ElementRef} from "angular2/core";
import {SimpleChange} from "angular2/core";
import {Directive} from "angular2/core";
import {Inject} from "angular2/core";
import {Input} from "angular2/core";

@Directive({
  selector: 'graph',
})
export class Graph {

  @Input() width: number;
  @Input() height: number;
  @Input() data: any;

  private svg: any; force: any; // d3 force layout

  constructor(@Inject(ElementRef) elRef) {
    console.log('in the Graph constructor');
    this.svg = d3.select(elRef.nativeElement).append('svg').attr({width: '1200', height: '600'}).style({'background': "#eee"});
    // triangle marker based on https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
    this.svg.append('defs')
      .append('marker').attr({
        id: 'triangle',
        viewBox: '0 0 10 10',
        refX: '1',  refY:'5',
        markerWidth: '6',
        markerHeight: '6',
        orient: 'auto'})
      .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');
    this.force = d3.layout.force().charge(-500).linkDistance(100).size([800, 600]);
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['data']) this.redraw()
  }

  redraw() {

    var force = this.force;
    var svg = this.svg;

    var data = this.data;
    force.nodes(data.nodes).links(data.edges).start();

    var links = svg.selectAll("line.link").data(data.edges)
      .enter().append("line")
      .attr({"class": "link",
             "marker-end": "url(#triangle)"})
      .style({"stroke": "#000",
              "stroke-width": 2});

    var boxes = svg.selectAll("g.node").data(data.nodes).enter()
      .append("g")
        .attr({"class": "node"})
        .call(force.drag);

    boxes.append('rect').attr({
      x:-50,
      width: 100,
      height: 30,
      fill: 'white',
      stroke: '#333' });
    boxes.append('text')
      .attr({'x': -40,  'y': 20,})
      .text(function(d:any){ return d.n }); // n for name, from the json.

    this.force.on("tick", function() {
        links.attr({
          "x1": function(d:any){ return d.source.x; },
          "y1": function(d:any){ return d.source.y; },
          "x2": function(d:any){ return d.target.x; },
          "y2": function(d:any){ return d.target.y; }});
        boxes.attr({
          'transform': function(d:any){ return 'translate(' + d.x + ',' + d.y + ')'; }});
    });
  }

}
