/**
 * stage component for acting out a lesson
 */
import {Component, OnChanges, SimpleChange} from "angular2/core";
import {Input} from "angular2/core";

export type Step = {id: number, op: number, arg: string};
enum Ops { BRK=1, SAY, ASK, CHK }

@Component({
  selector: 'stage',
  template: `
    <ul><li *ngFor="#widget of widgets" [innerHTML]="widget"></li></ul>
    <button (click)="nextScene()">next</button>
  `
})
export class StageComponent  implements OnChanges {
  @Input() script: Array<Step> = [];
  widgets: Array<string> = [];
  private
    _cursor: number;
    _scenes: Array<Array<string>>;

  constructor() {}

  ngOnChanges(changes:{[propertyName: string]: SimpleChange}) {
    if (changes['script']) this.rebuild();
  }

  rebuild() {
    var scenes = [[]], scene = scenes[0];
    this.script.forEach((step:Step)=> {
      switch (step.op) {

        case Ops.BRK:
          scene = [];
          scenes.push(scene);
          break;

        case Ops.SAY:
          scene.push(`<h1>${step.arg}</h1>`);
          break;

        case Ops.ASK:
          scene.push(`<h1>${step.arg}</h1>`);
          break;

        case Ops.CHK:
          scene.push(`<h1>(check your work)</h1>`);
          break;

        default:
          console.error(['unknown opcode:', step]);
      }
    });

    this._cursor = -1;
    this._scenes = scenes;
    this.nextScene();
  }

  nextScene() {
    // TODO: upgrade lodash types to get _.clamp (on github but not in release yet as of 3/30/2016)
    function _clamp(x,lo,hi) { return Math.max(lo, Math.min(hi, x))}
    this._cursor = _clamp(this._cursor+1, 0, this._scenes.length-1);
    this.widgets = this._scenes[this._cursor];
  }

}
