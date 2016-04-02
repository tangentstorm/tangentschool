import 'rxjs/add/operator/map';
import {Component} from 'angular2/core';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {Graph} from './graph';
import {Router, CanActivate} from "angular2/router";
import {tokenNotExpired} from "angular2-jwt";

@Component({
  providers: [HTTP_PROVIDERS],
  template: `
    <ul>
      <li *ngFor="#course of courses">{{course.name}}</li>
    </ul>
    <div>
      <button *ngFor="#lesson of lessons.nodes" (click)="goToLesson(lesson.n)"
        [disabled]="!lesson.open"> {{lesson.n}} </button>
    </div>
    <graph [data]="lessons"></graph>
  `,
  directives: [Graph]
})
@CanActivate(() => tokenNotExpired())
export class CoursesComponent {
  courses = [];
  lessons = {nodes:[], edges:[]};

  constructor(private http: Http, private router: Router) {
    this.withJson('/api/courses', data=> this.courses=data['courses']);
    this.withJson('/api/lessons', data=> this.lessons=data['lessons']);
  }

  withJson(path: string, cb:(any)=>void): void {
    this.http.get(path).map(res=>res.json()).subscribe(data=>cb(data), error=>console.error(error));
  }

  goToLesson(id: string) {
    this.router.navigate(["Lesson", {"id": id}])
  }

}
