import { Component, OnInit } from '@angular/core';
import { FaqSectionComponent, FaqItem } from '../../components/faq-section/faq-section';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FaqSectionComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent implements OnInit {
  // SEO data
  seoTitle = 'About ToolTrove - Free Online Tools for Everyone';
  seoMetaDescription = 'Learn about ToolTrove - your free destination for online PDF, image, calculator, and developer tools. No registration required, 100% free forever.';
  
  faqs: FaqItem[] = [
    {
      question: 'Is ToolTrove really free?',
      answer: 'Yes! All tools on ToolTrove are 100% free to use. There are no hidden fees, premium tiers, or watermarks on your files.'
    },
    {
      question: 'Is my data safe?',
      answer: 'Absolutely. All file processing happens in your browser using JavaScript. Your files are never uploaded to our servers—they stay on your device.'
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No sign-up or registration is required. Simply visit the tool you need and start using it immediately.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We support a wide range of formats including PDF, JPG, PNG, GIF, DOCX, XLSX, and more. Check each tool for specific supported formats.'
    },
    {
      question: 'Can I use ToolTrove on my phone?',
      answer: 'Yes! ToolTrove is fully responsive and works great on smartphones, tablets, and desktop computers.'
    },
    {
      question: 'How fast are the tools?',
      answer: 'Our tools are incredibly fast because all processing happens locally. Most operations complete in just a few seconds.'
    }
  ];

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
