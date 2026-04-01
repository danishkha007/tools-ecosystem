import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { DecorativeBackgroundComponent } from '../decorative-background/decorative-background';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, DecorativeBackgroundComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  showDecorativeBackground = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showDecorativeBackground = event.url === '/' || event.url === '';
    });
    
    // Set initial value
    this.showDecorativeBackground = this.router.url === '/' || this.router.url === '';
  }
}
