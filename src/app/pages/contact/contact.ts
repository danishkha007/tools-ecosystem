import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '@core/services/data.service';
import { SeoService } from '@core/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent implements OnInit {

  constructor(private seoService: SeoService, private dataService: DataService) {}
  // SEO data
  seoTitle = 'Contact MyToolTrove - Get in Touch';
  seoMetaDescription = 'Contact MyToolTrove for questions, feedback, or support. We\'re here to help with our free online tools.';
  
  ngOnInit() {
    this.seoService.setSeoDataById('contact');
  }
}
