import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { StartComponent } from './app/pages/start/start.component';

const routes: Routes = [
 { path: 'start', component: StartComponent, title: 'TBD' },
 { path: '**', redirectTo: '/start'},
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
  ]
});