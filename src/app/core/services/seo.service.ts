import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Seo } from '@core/models/seo-data.model';
import { DataService } from './data.service';
import { FAQ, Tool } from '@core/models/tool-data.model';
import { AppData } from '@core/models/app-data.model';
import { BreadcrumbsService } from './breadcrumbs.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private isBrowser: boolean;
  private document: Document;
  private defaultImage = 'https://mytooltrove.com/mytooltrove%20free%20online%20tools.jpg';

  constructor(@Inject(PLATFORM_ID) platformId: object, private dataService: DataService, private breadcrumbsService: BreadcrumbsService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.document = this.isBrowser ? window.document : ({} as Document);
  }

  setSeoDataById(id: string): void {
    if (!this.isBrowser || !id) {
      return;
    }
    this.clearSeoData();
    const seoData = this.dataService.getSeoDataById(id);
    this.setSeoData(seoData);
    const toolData = this.dataService.getToolDataById(id);
    this.setFaqJsonLdSchema(toolData?.faqSection?.faqs || []);
    this.setWebApplicationJsonLdSchema(toolData);
    // this.setBreadcrumbsJsonLdSchema();
  }

  setSeoData(seoData: Seo | undefined): void {
    if (!this.isBrowser || !seoData) {
      return;
    }

    this.document.title = seoData.title;
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

    this.setWebPageJsonLdSchema(seoData);

    if (window.location.pathname === '/') {
      this.setOrganizationJsonLdSchema();
      this.setWebsiteJsonLdSchema();
    }

    // Set meta keywords
    if (seoData.keywords && seoData.keywords.length > 0) {
      this.setMetaTag('keywords', seoData.keywords.join(', '));
    }
  }

  private setMetaTag(name: string, content: string): void {
    if (!content) return;
    let metaTag = this.document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!metaTag) {
      metaTag = this.document.createElement('meta');
      metaTag.setAttribute('name', name);
      this.document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  }

  private setCanonicalUrl(url: string): void {
    let canonicalLink = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);
  }

  private setWebPageJsonLdSchema(seoData: Seo): void {
    let scriptTag = this.document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    this.document.head.appendChild(scriptTag);
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

  private setFaqJsonLdSchema(faqs: FAQ[]): void {

    let scriptTag = this.document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.setAttribute('data-faq', 'true');
    this.document.head.appendChild(scriptTag);
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

  private setWebApplicationJsonLdSchema(toolData: Tool | undefined): void {
    let scriptTag = this.document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.setAttribute('data-webapp', 'true');
    this.document.head.appendChild(scriptTag);
    const webAppJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": toolData?.name,
      "description": toolData?.longDescription,
      "url": new URL(window.location.href).origin + toolData?.route,
      "applicationCategory": "Utilities",
      "operatingSystem": "All",
      "screenshot": this.defaultImage,
      "genre": "Tools"
    };
    scriptTag.textContent = JSON.stringify(webAppJsonLd);
  }

  private setOrganizationJsonLdSchema(): void {
    let scriptTag = this.document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.setAttribute('data-organization', 'true');
    this.document.head.appendChild(scriptTag);
    const organizationJsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://mytooltrove.com/#organization",
      "name": "MyToolTrove",
      "url": "https://mytooltrove.com",
      "logo": "https://mytooltrove.com/favicon.svg"
    };
    scriptTag.textContent = JSON.stringify(organizationJsonLd);
  }

  private setWebsiteJsonLdSchema(): void {
    let scriptTag = this.document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.setAttribute('data-website', 'true');
    this.document.head.appendChild(scriptTag);
    const websiteJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://mytooltrove.com/#website",
      "url": "https://mytooltrove.com",
      "name": "MyToolTrove",
      "publisher": {
        "@id": "https://mytooltrove.com/#organization"
      }
    };
    scriptTag.textContent = JSON.stringify(websiteJsonLd);
  }
  setBreadcrumbsJsonLdSchema(): void {
    const breadcrumbs = this.breadcrumbsService.get();
    if (breadcrumbs.length === 0) {
      return;
    }
    let scriptTag = this.document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.setAttribute('data-website', 'true');
    this.document.head.appendChild(scriptTag);
    const websiteJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "name": crumb.label,
          "@id": new URL(crumb.url, "https://mytooltrove.com").href
        }
      }))
    };
    scriptTag.textContent = JSON.stringify(websiteJsonLd);
  }

  /**
 * Remove SEO data (reset to defaults)
 */
  clearSeoData(): void {
    if (!this.isBrowser) {
      return;
    }
    do {
      let scriptTag = this.document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (scriptTag) {
        scriptTag.remove();
      }
    } while (this.document.querySelector('script[type="application/ld+json"]') !== null);
  }
}