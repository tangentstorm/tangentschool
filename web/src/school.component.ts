import 'rxjs/add/operator/map';
import {Component} from 'angular2/core';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {Inject} from "angular2/core";
import {Graph} from './graph';

@Component({
  selector: 'school',
  providers: [HTTP_PROVIDERS],
  template: `
    <ul>
      <li *ngFor="#course of courses">{{course.name}}</li>
    </ul>

    <graph [data]="lessons"></graph>
  `,
  directives: [Graph]
})
export class SchoolComponent {
  courses = [];
  lessons = {nodes:[], edges:[]};

  constructor(private http: Http) {
    this.withJson('/api/courses', data=> this.courses=data['courses']);
    this.withJson('/api/lessons', data=> this.lessons=data['lessons']);
  }

  withJson(path: string, cb:(any)=>void): void {
    this.http.get(path).map(res=>res.json()).subscribe(data=>cb(data), error=>console.error(error));
  }

}
