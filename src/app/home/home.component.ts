import { Component } from '@angular/core';
import { BlogsComponent } from '../blogs/blogs.component';

@Component({
    selector: 'app-home',
    imports: [BlogsComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

}
