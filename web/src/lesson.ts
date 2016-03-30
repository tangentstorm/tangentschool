/**
 * smart component to communicate with server about
 * a single lesson.
 */
import {Component} from "angular2/core";
import {RouteParams} from "angular2/router";
import {StageComponent, Step} from "./stage";
import {Http, HTTP_PROVIDERS} from "angular2/http";

@Component({
  template: `
    <h2>{{id}}</h2>
    <stage [script]="steps"></stage>`,
  directives: [StageComponent],
  providers: [HTTP_PROVIDERS]
})
export class LessonComponent {
  id: string;
  steps: Array<Step>=[];

  constructor(
    private _routeParams:RouteParams,
    private _http: Http){}

  ngOnInit() {
    this.id = this._routeParams.get('id');
    // TODO: extract a json service, since this is duplicated in courses
    this._http.get('/api/steps/' + encodeURI(this.id))
      .map(res=>res.json())
      .subscribe(
        data=>this.steps = data.steps,
        error=>console.error(error));
  }

}
