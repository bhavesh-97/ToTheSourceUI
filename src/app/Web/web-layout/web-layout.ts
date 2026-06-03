import { Component } from '@angular/core';
import { TemplatePlaceholder } from '../../shared/template-placeholder/template-placeholder';
import { RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../pages/header/header';

@Component({
  selector: 'app-web-layout',
  imports: [TemplatePlaceholder, RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './web-layout.html',
  styleUrl: './web-layout.css'
})
export class WebLayout {
  currentYear = new Date().getFullYear();
}
