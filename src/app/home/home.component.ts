import { Component } from '@angular/core';
import { BlogsComponent, OrderBy, Order, Property } from '../blogs/blogs.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-home',
    imports: [BlogsComponent, FormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
 searchString = "";
}
