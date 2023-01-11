import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BlogService } from './blog.service';
import { switchMap } from 'rxjs/operators';

const delimeter = '----------!!##!!----------';

@Component({
  selector: 'm-blog-article',
  templateUrl: './blog.article.component.html',
  styleUrls: ['./blog.article.component.css'],
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
      this.processBlog(this.article);
    });
  }

  processBlog(blog) {
    if (!blog.markdownRendered) {
      this.blogService.renderMarkdown$(blog.body)
        .subscribe(d => {
          blog.body = d;
          blog.markdownRendered = true;
        });
    }

    if (!blog.allComments || !blog.allComments.length) {
      this.blogService.getBlogComments$(blog)
        .subscribe((comments: Array<any>) => {
          blog.allComments = comments.map(c => {
            const createTime = new Date(c.created_at);
            const updateTime = new Date(c.updated_at);

            c.title = ` commented on ${formatDate(createTime, 'yyyy-MM-dd', 'en-US')}`;
            if (updateTime.getTime() > createTime.getTime()) {
              c.title += `, edited on ${formatDate(updateTime, 'yyyy-MM-dd', 'en-US')}`;
            }
            return c;
          });

          let markdown = blog.allComments.map(c => c.body).join(delimeter);
          this.blogService.renderMarkdown$(markdown)
            .subscribe(d => {
              let htmls = d.split(delimeter);
              blog.allComments.forEach((c, i) => {
                c.body = htmls[i];
              })
            });
        });
    }
  }

  addGithubComment(blog) {
    window.open(blog.html_url);
  }

}
