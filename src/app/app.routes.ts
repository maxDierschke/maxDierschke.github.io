import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';

export const routes: Routes = [
  { path: "posts", component: HomeComponent },
  { path: "", redirectTo: "/posts", pathMatch: "full" },
  { path: "about", component: AboutComponent },
  { path: "post/:id", component: PostComponent },
  { path: "page-not-found", component: PageNotFoundComponent },
  {path: "**", component: PageNotFoundComponent}
  // { path: "**", redirectTo: "/page-not-found" },
];

