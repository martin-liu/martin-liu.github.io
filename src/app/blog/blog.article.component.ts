import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BlogService } from './blog.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'm-blog-article',
  templateUrl: './blog.article.component.html',
  providers: [BlogService]
})
export class BlogArticleComponent {
  article = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {
    const {owner, repo} = this.blogService.getDefaultOwnerAndRepo();

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.blogService.getBlog$(owner, repo, params.get('id')))
    ).subscribe(blog => {
      this.article = blog;
      if (!blog.markdownRendered) {
        this.blogService.renderMarkdown$(blog.body)
          .subscribe(({response}) => {
            this.article.body = response;
            this.article.markdownRendered = true;
          })
      }
    });
  }

}
