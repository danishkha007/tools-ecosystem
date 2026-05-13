import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Tool, ToolData } from '../../core/models/tool-data.model';
import { BreadcrumbsService } from '@core/services/breadcrumbs.service';

export interface Breadcrumb {
    label: string | undefined;
    url: string;
}

@Component({
    selector: 'app-breadcrumbs',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './breadcrumbs.html',
    styleUrl: './breadcrumbs.scss',
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
    @Input() tool!: Tool | undefined;
    breadcrumbs: Breadcrumb[] = [];
    private subscription: any;

    constructor(private breadcrumbService: BreadcrumbsService, private router: Router) { }

    ngOnInit() {
        this.subscription = (crumbs: Breadcrumb[]) => {
            this.breadcrumbs = crumbs;
        };
        this.breadcrumbService.subscribe(this.subscription);

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.breadcrumbService.generateFromUrl(event.url);
            });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.breadcrumbService.unsubscribe(this.subscription);
        }
    }

    private setCustomBreadcrumbs() {
        const breadcrumbs: Breadcrumb[] = [
            { label: 'Home', url: '/' },
            { label: 'Tools', url: '/tools' },
        ];

        if (this.tool?.category) {
            breadcrumbs.push({ label: this.tool.category, url: '/tools' });
        }

        breadcrumbs.push({ label: this.tool?.seoData?.h1, url: this.router.url });

        this.breadcrumbService.set(breadcrumbs);
    }
}
