import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
   {path: 'home', component: HomeComponent},
   {path: 'about', component: AboutComponent},
   {path: 'page-not-found', component: PageNotFoundComponent},
{ path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/page-not-found'}
];

