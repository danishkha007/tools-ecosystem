import { Component, OnInit } from '@angular/core';
import { FaqSectionComponent, FaqItem } from '../../components/faq-section/faq-section';
import { FAQSection } from '@core/models/tool-data.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FaqSectionComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent implements OnInit {
  // SEO data
  seoTitle = 'About MyToolTrove - Free Online Tools for Everyone';
  seoMetaDescription = 'Learn about MyToolTrove - your free destination for online PDF, image, calculator, and developer tools. No registration required, 100% free forever.';
  faqs: FAQSection = {
        title: "Frequently Asked Questions",
        subtitle: "Got questions? We've got answers.",
        accentColor: "#2f84ff",
        faqs: [
          {
            question: "What is the GANN Hexagonal Calculator?",
            answer: "The GANN Hexagonal Calculator is a tool based on W.D. GANN's mathematical trading theory. It calculates support and resistance levels using hexagonal geometry and vibration ratios to help traders identify potential price turning points."
          },
          {
            question: "How do I use the GANN Calculator?",
            answer: "Simply enter any price or number in the input field and click \"Calculate\". The tool will display multiple resistance levels (above your input) and support levels (below your input) based on GANN's mathematical ratios."
          },
          {
            question: "What are support and resistance levels?",
            answer: "Support levels are price points where buying pressure tends to exceed selling pressure, potentially stopping a decline. Resistance levels are price points where selling pressure tends to exceed buying pressure, potentially stopping an advance."
          },
          {
            question: "Is this calculator free to use?",
            answer: "Yes, our GANN Calculator is completely free to use. No registration or account required. All calculations happen locally in your browser."
          },
          {
            question: "Can I use this for any type of trading?",
            answer: "This calculator works with any numerical scale - stocks, forex, commodities, cryptocurrencies, or any numerical analysis. It's particularly popular among technical analysts and swing traders."
          }
        ]
      } as FAQSection;
  // faqs: FaqItem[] = [
  //   {
  //     question: 'Is MyToolTrove really free?',
  //     answer: 'Yes! All tools on MyToolTrove are 100% free to use. There are no hidden fees, premium tiers, or watermarks on your files.'
  //   },
  //   {
  //     question: 'Is my data safe?',
  //     answer: 'Absolutely. All file processing happens in your browser using JavaScript. Your files are never uploaded to our servers—they stay on your device.'
  //   },
  //   {
  //     question: 'Do I need to create an account?',
  //     answer: 'No sign-up or registration is required. Simply visit the tool you need and start using it immediately.'
  //   },
  //   {
  //     question: 'What file formats are supported?',
  //     answer: 'We support a wide range of formats including PDF, JPG, PNG, GIF, DOCX, XLSX, and more. Check each tool for specific supported formats.'
  //   },
  //   {
  //     question: 'Can I use MyToolTrove on my phone?',
  //     answer: 'Yes! MyToolTrove is fully responsive and works great on smartphones, tablets, and desktop computers.'
  //   },
  //   {
  //     question: 'How fast are the tools?',
  //     answer: 'Our tools are incredibly fast because all processing happens locally. Most operations complete in just a few seconds.'
  //   }
  // ];

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
