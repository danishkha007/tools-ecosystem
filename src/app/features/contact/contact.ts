import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent implements OnInit {
  // SEO data
  seoTitle = 'Contact ToolTrove - Get in Touch';
  seoMetaDescription = 'Contact ToolTrove for questions, feedback, or support. We\'re here to help with our free online tools.';
  
  ngOnInit() {
    // Set document title and meta description
    document.title = this.seoTitle;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', this.seoMetaDescription);
    }
  }
}
