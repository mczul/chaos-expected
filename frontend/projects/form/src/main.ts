import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, Routes} from '@angular/router';
import {AppComponent} from './app/app.component';
import {StartComponent} from './app/pages/start/start.component';
import {ProjectComponent} from "./app/pages/project/project.component";
import {provideHttpClient} from "@angular/common/http";
import {ProjectNotFoundComponent} from "./app/errors/project-not-found.component";
import {LOCALE_ID} from "@angular/core";
import '@angular/common/locales/global/de';

const routes: Routes = [
  {path: 'projects/not-found', component: ProjectNotFoundComponent, title: 'TBD'},
  {path: 'projects/:projectId', component: ProjectComponent, title: 'TBD'},
  {path: 'start', component: StartComponent, title: 'TBD'},
  {path: '**', redirectTo: '/start'},
];

bootstrapApplication(AppComponent, {
  providers: [
    {provide: LOCALE_ID, useValue: 'de-DE' },
    provideHttpClient(),
    provideRouter(routes),
  ]
});
