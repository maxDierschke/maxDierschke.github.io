import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marked } from 'marked';
@Component({
    selector: 'app-post',
    imports: [],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})
export class PostComponent {
  html: any;
  data= {title:"", metadata: "", abstract: ""};
  private readonly router = inject(Router);
  goTo(element: string) {
    document?.getElementById(element)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }
constructor(private route: ActivatedRoute, private httpClient: HttpClient){
    const id = this.route.snapshot.paramMap.get('id')!;
  this.httpClient.get("assets/blogpost_index.json", {responseType: 'json'})
        .subscribe((data: any)=> {
          this.data = data[id];
        });
    const data_path = "assets/" + id; 
    this.httpClient.get(data_path + ".html", {responseType: 'text'})
        .subscribe(data => {
        if(!data.startsWith("<!doctype html>")){
          this.html = data;
        }
    });
    this.httpClient.get(data_path + ".md", {responseType: 'text'})
        .subscribe(data => {
        if(this.html!=undefined){return;}
        if(data.startsWith("<!doctype html>")){
          this.router.navigate(["page-not-found"]);
        }
          this.html = marked.parse(data);
    });


  }

}


