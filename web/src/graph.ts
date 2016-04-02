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
        viewBox: '0 0 15 10',
        refX: '0',  refY:'5',
        markerWidth: '9',
        markerHeight: '6',
        orient: 'auto'})
      .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');
    this.force = d3.layout.force().charge(-750).linkDistance(100).size([800, 600]);
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
      .style({"stroke": "#ccc",
              "stroke-width": 2});

    var boxes = svg.selectAll("g.node").data(data.nodes).enter()
      .append("g")
        .attr({"class": "node"})
        .call(force.drag);

    function bgColor(d: any){ return d.done ? '#ccc' : '#fff'}
    function fgColor(d: any){ return d.open ? '#333' : '#ccc'}

    boxes.append('rect').attr({
      x:-50,
      width: 100,
      height: 30,
      fill: bgColor,
      stroke: fgColor });
    boxes.append('text')
      .attr({'x': -40,  'y': 20, fill: fgColor })
      .text(function(d:any){ return d.n }); // n for name, from the json.

    this.force.on("tick", function() {
        // the line comes out of the center of the source, but we need to
        // find the point where it intersects the target so that we can
        // actually see the arrowhead marker.
        links.each(function(d:any){
          var boxw=100, boxh=30;
          var x1=d.source.x, y1=d.source.y+boxh/2,
              x2=d.target.x, y2=d.target.y+boxh/2,
              dx=x2-x1,  dy=y2-y1;

          // imagine we translate everything so the source is the origin.
          // the target will be at (dx,dy), and we know the box goes from
          // dx-50,dy to dx+50,dy+30.  find the nearest sides (top/bottom) and (left/right):
          var nx = Math.abs(dx-boxw/2) < Math.abs(dx+boxw/2) ? dx-boxw/2 : dx+boxw/2;
          var ny = Math.abs(dy-boxh/2) < Math.abs(dy+boxh/2) ? dy-boxh/2 : dy+boxh/2;

          // now find the nearer of those two:
          if (Math.abs(ny) < Math.abs(nx)) {
            // vertical side is closer, so solve for y
            // y=(dy/dx)x+b; b=0  (because we run through the origin)
            var rx = nx, ry =((dx == 0) ? dy : (dy/dx)*nx);
          } else {
            // horizontal side is closer, so solve for x
            // x=(dx/dy)y-b; b=0
            var ry = ny, rx = ((dy == 0) ? dx : (dx/dy)*ny);
          }


          var len = Math.sqrt(rx*rx + ry*ry);
          var arh = 9; // arrow head size (markerWidth?)
          if (len > arh) {
            var scale = (len-arh)/len;
            rx *= scale; ry *= scale;
          }

          d3.select(this).attr({
            "x1": x1, "y1": y1,
            "x2": x1+rx, "y2": y1+ry});
        });
        boxes.attr({
          'transform': function(d:any){ return 'translate(' + d.x + ',' + d.y + ')'; }});
    });
  }

}
