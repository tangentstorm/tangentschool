import {bootstrap} from 'angular2/platform/browser';
import {CoursesComponent} from './courses';
import {LessonComponent} from './lesson';
import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {ROUTER_PROVIDERS} from 'angular2/router';
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
  selector: 'school',
  template: `<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/courses', name: "Courses", component: CoursesComponent, useAsDefault: true },
  {path: '/lesson/:id', name: "Lesson", component: LessonComponent },
])
class SchoolComponent {}

bootstrap(SchoolComponent, [ROUTER_PROVIDERS]);
