import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SEOData } from '../models/tool-data.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Set SEO data for the page - updates title, meta tags, and canonical URL
   */
  setSeoData(seoData: SEOData): void {
    if (!this.isBrowser || !seoData) {
      return;
    }

    // Set page title
    if (seoData.title) {
      document.title = seoData.title;
    }

    // Set meta description
    this.setMetaTag('description', seoData.metaDescription);

    // Set meta keywords
    if (seoData.keywords && seoData.keywords.length > 0) {
      this.setMetaTag('keywords', seoData.keywords.join(', '));
    }

    // Set canonical URL
    if (seoData.canonicalUrl) {
      this.setCanonicalUrl(seoData.canonicalUrl);
    }

    // Set Open Graph tags for social sharing
    this.setMetaTag('og:title', seoData.title);
    this.setMetaTag('og:description', seoData.metaDescription);
    this.setMetaTag('og:type', 'website');

    // Set Twitter Card tags
    this.setMetaTag('twitter:title', seoData.title);
    this.setMetaTag('twitter:description', seoData.metaDescription);
    this.setMetaTag('twitter:card', 'summary_large_image');
  }

  /**
   * Set or update a meta tag
   */
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

  /**
   * Set canonical URL
   */
  private setCanonicalUrl(url: string): void {
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.setAttribute('href', url);
  }

  /**
   * Remove SEO data (reset to defaults)
   */
  clearSeoData(defaultTitle = 'MyToolTrove'): void {
    if (!this.isBrowser) {
      return;
    }

    document.title = defaultTitle;

    // Clear meta tags
    const metaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[name^="og:"], meta[name^="twitter:"]');
    metaTags.forEach(tag => tag.remove());

    // Remove canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.remove();
    }
  }

  /**
   * Update only the H1 and H2 content in the page
   * This is useful for components that need to display SEO content
   */
  getSeoHeadings(seoData: SEOData): { h1: string; h2: string } {
    return {
      h1: seoData.h1 || '',
      h2: seoData.h2 || ''
    };
  }
}