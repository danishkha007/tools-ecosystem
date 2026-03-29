import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { DecorativeBackgroundComponent } from '../decorative-background/decorative-background';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DecorativeBackgroundComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
