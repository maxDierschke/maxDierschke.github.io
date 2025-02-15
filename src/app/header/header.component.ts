import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

function scroll(){
    let navbar = document.getElementById("navbar");
    let dropdown = document.getElementById("dropdown");
    if(navbar == null){return;}
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      navbar.style.height = "2rem";
     if(dropdown !=null){
      dropdown.style.top = "2rem";
     }
    } else {
      navbar.style.height = "5rem";
     if(dropdown !=null){
       dropdown.style.top = "5rem";
     }
  }
  if (dropdown !=null){
    dropdown.style.display = "none";
  }

}
@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  ngOnInit(){
    window.onscroll = function(){ scroll()};
  }

  public toggleMenu() {
   let dropdown = document.getElementById("dropdown");
   if(dropdown == null){return;}
   if (dropdown.style.display === "block") {
     dropdown.style.display = "none";
   } else {
     dropdown.style.display = "block";
   }
  }
}
