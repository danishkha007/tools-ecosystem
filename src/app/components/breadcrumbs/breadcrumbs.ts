import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationEnd, RouterLink, NavigationStart } from '@angular/router';
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
    breadcrumbs: Breadcrumb[] = [];
    private subscription: any;

    constructor(private breadcrumbService: BreadcrumbsService, private router: Router) { }

    ngOnInit() {
        this.subscription = (crumbs: Breadcrumb[]) => {
            this.breadcrumbs = crumbs;
        };
        this.breadcrumbService.subscribe(this.subscription);
        this.breadcrumbService.generateFromUrl(this.router.url);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.breadcrumbService.unsubscribe(this.subscription);
        }
    }
}
