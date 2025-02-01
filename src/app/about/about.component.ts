import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';

@Component({
    selector: 'app-about',
    imports: [ProfileComponent],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css'
})
export class AboutComponent {

}
