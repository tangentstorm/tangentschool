import {bootstrap} from "angular2/platform/browser";
import {CoursesComponent} from "./courses";
import {LessonComponent} from "./lesson";
import {Component, provide} from "angular2/core";
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from "angular2/router";
import {AuthHttp, tokenNotExpired, AuthConfig} from 'angular2-jwt';
import {Http} from "angular2/http";

@Component({
  selector: 'school',
  template: `
    <div style="text-align:right; padding-left:20px;">
      <span *ngIf="loggedIn()">logged in as: {{username}}</span>
      <button *ngIf="!loggedIn()" (click)="login()">Login</button>
      <button *ngIf="loggedIn()" (click)="logout()">Logout</button>
    </div>
    <router-outlet></router-outlet>
    `,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: '/courses', name: "Courses", component: CoursesComponent, useAsDefault: true },
  {path: '/lesson/:id', name: "Lesson", component: LessonComponent },
])
class SchoolComponent {
  lock = new Auth0Lock('EE3NW5dhZPOiv12MRp2FXE7Wt6caUbv3', 'tangentschool.auth0.com');
  username: string="";

  ngOnInit() {
    if (this.loggedIn()) this.username = JSON.parse(localStorage.getItem("profile"))['name'];
  }

  login() {
    this.lock.show({
      },
      function(err, profile, id_token) {

        console.log('in login() callback.');
        console.log(['profile:', profile]);

        if(err) {
          throw new Error(err);
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('id_token', id_token);
        this.username = profile['name'];

    });
  }

  logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    this.username = "";
  }

  loggedIn() {
    return tokenNotExpired();
  }

}

bootstrap(SchoolComponent, [
  ROUTER_PROVIDERS,
  provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({
          tokenName: 'jwt'
        }), http);
      },
      deps: [Http]
    })]);
