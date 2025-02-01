import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-blogs',
    imports: [NgFor, RouterLink, CommonModule],
    templateUrl: './blogs.component.html',
    styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  BLOG_POSTS: Map<string,any> = new Map<string, any>;

  constructor(private httpClient: HttpClient){
  this.httpClient.get("assets/blogpost_index.json", {responseType: 'json'})
        .subscribe((data: any)=> {
        this.BLOG_POSTS = data;
        });
      }
}
