/**
 * stage component for acting out a lesson
 */
import {Component, OnChanges, SimpleChange, EventEmitter} from "angular2/core";
import {Input} from "angular2/core";

export type Step = {id: number, op: number, arg: string};
enum Ops { BRK=1, SAY, ASK, CHK }

type Scene = {cards: string[], asking:boolean, checking: boolean, stepId: number}
function newScene() { return {cards:[], asking:false, checking: false, stepId: 0}; }

export type AnswerEvent = {answer:string, stepId: number};
export type Result = {correct:boolean, message:string};


// TODO: upgrade lodash typings to get _.clamp (on github but not in release yet as of 3/30/2016)
var _clamp = function (x,lo,hi) { return Math.max(lo, Math.min(hi, x))};


@Component({
  selector: 'stage',
  events: ['checkWork'],
  template: `
    <ul>
      <li *ngFor="#card of scene.cards" [innerHTML]="card"></li>
      <li *ngIf="reporting">
        <div style="background:#eee">
          {{result.message}}
        </div>
      </li>
      <li *ngIf="scene.asking">
        <form style="background:#999">
          <label for="answer">answer:</label>
          <input type="text" [(ngModel)]="answer" placeholder="type your answer here">
        </form>
      </li>
      <nav style="display:block; text-align:right; background:#999">
        <button style="margin-right: 20px;"
          [disabled]="waiting" (click)="nextScene()">next</button>
      </nav>
    </ul>
  `
})
export class StageComponent  implements OnChanges {
  @Input() script: Step[] = [];
  @Input() result: Result;
  scene: Scene = newScene();
  answer: string;
  waiting: boolean = false;
  reporting: boolean=false;
  checkWork = new EventEmitter<AnswerEvent>();
  private
    _cursor: number;
    _scenes: Scene[] = [];

  constructor() {}

  ngOnChanges(changes:{[propertyName: string]: SimpleChange}) {
    if (changes['script']) this.rebuild();
    if (changes['result']) {
      this.reporting = true;
      this.waiting = false;
    }
  }

  rebuild() {
    var scene = newScene(), scenes=[scene];

    this.script.forEach((step:Step)=> {
      switch (step.op) {

        case Ops.BRK:
          scenes.push(scene = newScene());
          break;

        case Ops.SAY:
          scene.cards.push(`<h1>${step.arg}</h1>`);
          break;

        case Ops.ASK:
          scene.cards.push(`<h1>${step.arg}</h1>`);
          scene.asking = true;
          break;

        case Ops.CHK:
          scene = newScene();
          scene.cards.push("checking your work...");
          scene.stepId = step.id;
          scene.checking = true;
          scenes.push(scene);
          scenes.push(scene = newScene());
          break;

        default:
          console.error(['unknown opcode:', step]);
      }
    });

    // add extra card if there's already final text.
    if (scene.cards.length > 0) scenes.push(scene=newScene());
    scene.cards.push("(lesson complete!)");

    this._cursor = -1; // so the next scene is scene 0
    this._scenes = scenes;
    this.nextScene();
  }

  nextScene() {
    // step backward if the answer was wrong.
    var d=(this.reporting && !this.result.correct) ? -1 : 1;
    this.reporting = false;
    this._cursor = _clamp(this._cursor+d, 0, this._scenes.length-1);
    this.scene = this._scenes[this._cursor];
    if (this.scene.checking) this.checkAnswer();
  }

  checkAnswer() {
    this.waiting = true;
    this.result = {correct:null, message:"...waiting..."};
    this.checkWork.emit({answer:this.answer, stepId: this.scene.stepId});
  }

}
