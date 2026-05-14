import { Injectable } from "@angular/core";
import { Breadcrumb } from "@components/breadcrumbs/breadcrumbs";

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbsService {
    private crumbs: Breadcrumb[] = [];
    private listeners = new Set<(breadcrumbs: Breadcrumb[]) => void>();

    constructor() { }

    get(): Breadcrumb[] {
        return [...this.crumbs];
    }

    set(breadcrumbs: Breadcrumb[]): void {
        this.crumbs = breadcrumbs.map((crumb) => ({ ...crumb }));
        this.notify();
    }

    add(label: string, url: string): void {
        this.crumbs.push({ label, url });
        this.notify();
    }

    replaceLast(label: string, url: string): void {
        if (this.crumbs.length === 0) {
            this.add(label, url);
            return;
        }

        this.crumbs[this.crumbs.length - 1] = { label, url };
        this.notify();
    }

    clear(): void {
        this.crumbs = [];
        this.notify();
    }

    generateFromUrl(url: string): void {
        const urlObj = new URL(url, "https://mytooltrove.com");
        const segments = urlObj.pathname
            .split('/')
            .filter(Boolean)
            .map((segment) => segment.replace(/[-_]/g, ' '));

        const breadcrumbs: Breadcrumb[] = [];
        let currentUrl = '';

        breadcrumbs.push({ label: 'Home', url: '/' });

        segments.forEach((segment) => {
            currentUrl += `/${segment}`;
            breadcrumbs.push({
                label: BreadcrumbsService.formatLabel(segment),
                url: currentUrl,
            });
        });

        this.set(breadcrumbs);
    }

    subscribe(listener: (breadcrumbs: Breadcrumb[]) => void): void {
        this.listeners.add(listener);
        listener(this.get());
    }

    unsubscribe(listener: (breadcrumbs: Breadcrumb[]) => void): void {
        this.listeners.delete(listener);
    }

    private notify(): void {
        const snapshot = this.get();
        this.listeners.forEach((listener) => listener(snapshot));
    }

    private static formatLabel(segment: string): string {
        return segment
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }
}