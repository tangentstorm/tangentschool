import {Component} from "angular2/core";
import {RouteParams} from "angular2/router";

@Component({
  template: '<h2>lesson {{id}} goes here</h2>'
})
export class LessonComponent {
  public id: string;

  constructor(private _routeParams:RouteParams){}

  ngOnInit() {
    this.id = this._routeParams.get('id');
  }
}
