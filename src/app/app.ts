import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from "./components/layout/layout";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout],
  template: '<app-layout><router-outlet></router-outlet></app-layout>',
  styles: []
})
export class App {
  protected readonly title = signal('tools-ecosystem');
}
