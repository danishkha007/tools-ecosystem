import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Seo } from '@core/models/seo-data.model';
import { DataService } from './data.service';
import { FAQ } from '@core/models/tool-data.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private isBrowser: boolean;
  private defaultImage = 'https://mytooltrove.com/mytooltrove-free-online-tools.png';

  constructor(@Inject(PLATFORM_ID) platformId: object, private dataService: DataService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setSeoDataById(id: string): void {
    const seoData = this.dataService.getSeoDataById(id);
    this.setSeoData(seoData);
    const toolData = this.dataService.getToolDataById(id);
    this.setFaqJsonLd(toolData?.faqSection?.faqs || []);
  }

  setSeoData(seoData: Seo | undefined): void {
    if (!this.isBrowser || !seoData) {
      return;
    }

    document.title = seoData.title;
    this.setMetaTag('description', seoData.metaDescription);
    this.setMetaTag('robots', "follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large");
    this.setCanonicalUrl(seoData.canonicalUrl);
    this.setMetaTag('og:locale', "en_US");
    this.setMetaTag('og:type', 'website');
    this.setMetaTag('og:title', seoData.title);
    this.setMetaTag('og:description', seoData.metaDescription);
    this.setMetaTag('og:url', seoData.canonicalUrl);
    this.setMetaTag('og:site_name', "MyToolTrove");
    this.setMetaTag('og:image', this.defaultImage);
    this.setMetaTag('og:image-secure_url', this.defaultImage);
    this.setMetaTag('og:image:width', "1024");
    this.setMetaTag('og:image:height', "683");
    this.setMetaTag('og:image:alt', "MyToolTrove");
    this.setMetaTag('og:image:type', "image/png");
    this.setMetaTag('og:locale', "en_US");
    // Set Twitter Card tags
    this.setMetaTag('twitter:card', 'summary_large_image');
    this.setMetaTag('twitter:title', seoData.title);
    this.setMetaTag('twitter:description', seoData.metaDescription);
    this.setMetaTag('twitter:image', this.defaultImage);
    this.setMetaTag('twitter:site', '@MyToolTrove');

    this.setldJsonLd(seoData);

    // Set meta keywords
    if (seoData.keywords && seoData.keywords.length > 0) {
      this.setMetaTag('keywords', seoData.keywords.join(', '));
    }
  }

  private setMetaTag(name: string, content: string): void {
    if (!content) return;
    let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', name);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  }

  private setCanonicalUrl(url: string): void {
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);
  }

  private setldJsonLd(seoData: Seo): void {
    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": seoData.title,
      "description": seoData.metaDescription,
      "url": seoData.canonicalUrl,
      "keywords": seoData.keywords,
      "image": this.defaultImage
    };
    scriptTag.textContent = JSON.stringify(jsonLd);
  }

  private setFaqJsonLd(faqs : FAQ[]): void {
    let doc = window.document as Document;
    let scriptTag = doc.querySelector('script[type="application/ld+json"][data-faq]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = doc.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-faq', 'true');
      document.head.appendChild(scriptTag);
    }
    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    scriptTag.textContent = JSON.stringify(faqJsonLd);
  }

  // /**
  //  * Remove SEO data (reset to defaults)
  //  */
  // clearSeoData(defaultTitle = 'MyToolTrove'): void {
  //   if (!this.isBrowser) {
  //     return;
  //   }

  //   document.title = defaultTitle;

  //   // Clear meta tags
  //   const metaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[name^="og:"], meta[name^="twitter:"]');
  //   metaTags.forEach(tag => tag.remove());

  //   // Remove canonical link
  //   const canonicalLink = document.querySelector('link[rel="canonical"]');
  //   if (canonicalLink) {
  //     canonicalLink.remove();
  //   }
  // }
}