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

    <graph></graph>
  `,
  directives: [Graph]
})
export class SchoolComponent {
  courses = [];
  constructor(private http: Http) {
    http.get('/api/courses')
      .map(res => res.json())
      .subscribe(
        data => this.courses = data['courses'],
        error => console.error(error)
      );
  }
}
