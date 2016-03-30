/**
 * stage component for acting out a lesson
 */
import {Component} from "angular2/core";
import {Input} from "angular2/core";

@Component({
  selector: 'stage',
  template: `
    <ul><li *ngFor="#widget of widgets">{{widget}}</li></ul>
    <button (click)="nextScene()">next</button>
  `
})
export class StageComponent {
  @Input() script;
  widgets: Array<string> = [];

  constructor() {
    this.widgets = ["a", "b", "c"];
  }

  nextScene() {
    this.widgets = this.widgets.map((x:string)=> String.fromCharCode(x.charCodeAt(0) + 3));
  }

}
