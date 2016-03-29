// draw a directed graph with d3
import {ElementRef} from "angular2/core";
import {SimpleChange} from "angular2/core";
import {Directive} from "angular2/core";
import {Inject} from "angular2/core";
import {Input} from "angular2/core";
//import * as d3 from "d3";

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
    this.svg = d3.select(elRef.nativeElement).append('svg').attr({width: '100%', height: '100%'});
    this.force = d3.layout.force().charge(-250).linkDistance(45).size([640, 480]);
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
      .attr("class", "link")
      .style({"stroke": "#000",
              "stroke-width": 2 });

    var circs = svg.selectAll("circle.node").data(data.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 15)
      .call(force.drag);

    this.force.on("tick", function() {
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
