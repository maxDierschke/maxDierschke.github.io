import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
class post {
  url: string="";
  title: string="";
  metadata: string="";
  abstract: string="";
  order: number = 0;
  picture_path?: string;
}
export enum Property {
  TITLE="title",
  ORDER="order" 
}

export enum Order {
  ASC,
  DESC
}

export class OrderBy {
  property: Property = Property.ORDER;
  order: Order = Order.DESC;
}
@Component({
    selector: 'app-blogs',
    imports: [NgFor, RouterLink, CommonModule],
    templateUrl: './blogs.component.html',
    styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  private BLOG_POSTS: post[] = [];
  filtered_posts: post[] = [];
  private search_string_ = "";
  private order_by_ = new OrderBy();
  @Input()
  set searchString(value: string){
     this.filtered_posts = this.BLOG_POSTS.filter((post)=> post.title.toLowerCase().includes(value.toLowerCase()) || post.abstract.toLowerCase().includes(value.toLowerCase()))
    this.orderBy = this.order_by_;
  }

  @Input()
  set orderBy(value: OrderBy) {
    this.order_by_ = value;
    this.filtered_posts.sort((a,b)=> {
          let multiplicator = (value.order == Order.DESC)? -1: 1;
          return multiplicator * ((a as any)[value.property] - (b as any)[value.property]);
      });
  }

  constructor(private httpClient: HttpClient){
  this.httpClient.get("assets/blogpost_index.json", {responseType: 'json'})
        .subscribe((data: any)=> {
        Object.entries(data).forEach((value, element_index_) => {
          let object_name = value[0];
          let object : any = value[1];
          let picture_path = object.picture ? "assets/" + object_name + "/" + object.picture : undefined; 
          this.BLOG_POSTS.push({url: object_name, title: object.title, metadata: object.metadata, abstract: object.abstract, order: object.order?? 0, picture_path: picture_path });
        });
        this.filtered_posts = this.BLOG_POSTS;
        this.orderBy = new OrderBy();
        
      });
  }
}
