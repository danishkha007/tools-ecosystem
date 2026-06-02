import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, OnDestroy, ViewEncapsulation, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Post } from "@core/models/post-data";
import { Tool } from "@core/models/tool-data.model";
import { DataService } from "@core/services/data.service";
import { SeoService } from "@core/services/seo.service";
import { BreadcrumbsComponent } from "@components/breadcrumbs/breadcrumbs";
import { PostContentComponent } from "@sections/post-content/post-content";
import { PostHeaderComponent } from "@sections/post-header/post-header";

@Component({
    selector: 'app-post-page-template',
    templateUrl: './post.html',
    styleUrl: './post.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, RouterLink, BreadcrumbsComponent, PostContentComponent, PostHeaderComponent]
})
export class PostPageTemplateComponent implements OnDestroy {
    postData?: Post;
    recommendedPosts: Post[] = [];
    recommendedTools: Tool[] = [];

    private route = inject(ActivatedRoute);
    private seoService = inject(SeoService);
    private dataService = inject(DataService);
    private document = inject(DOCUMENT);
    private postStyleElement?: HTMLStyleElement;

    async ngOnInit(): Promise<void> {
        const postId = this.route.snapshot.data['postId'] as string | undefined;

        if (!postId) {
            return;
        }

        this.postData = this.dataService.getPostDataById(postId);
        this.recommendedPosts = this.dataService.getRecommendedPosts(this.postData);
        this.recommendedTools = this.dataService.getRecommendedToolsForPost(this.postData);
        this.seoService.setSeoData(this.dataService.getSeoDataById(this.postData.id));
        this.addPostStyle(this.postData.style);
    }

    ngOnDestroy(): void {
        this.postStyleElement?.remove();
    }

    getCategoryName(categoryId: string): string {
        return this.dataService.getCategoryNameById(categoryId);
    }

    private addPostStyle(style: string): void {
        this.postStyleElement?.remove();
        this.postStyleElement = this.document.createElement('style');
        this.postStyleElement.setAttribute('data-post-style', this.postData?.id || '');
        this.postStyleElement.textContent = style;
        this.document.head.appendChild(this.postStyleElement);
    }

    getRoute(route?: string): string {
        return route ? `/${route}` : '';
    }
}
