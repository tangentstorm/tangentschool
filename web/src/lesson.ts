/**
 * smart component to communicate with server about
 * a single lesson.
 */
import {Component} from "angular2/core";
import {RouteParams} from "angular2/router";
import {StageComponent} from "./stage";
import {Http} from "angular2/http";
import {HTTP_PROVIDERS} from "angular2/http";

@Component({
  template: `
    <h2>{{id}}</h2>
    <stage [script]="script"></stage>`,
  directives: [StageComponent],
  providers: [HTTP_PROVIDERS]
})

export class LessonComponent {
  public id: string;

  constructor(
    private _routeParams:RouteParams,
    private _http: Http){}

  ngOnInit() {
    this.id = this._routeParams.get('id');
  }
}
