import { Component } from '@angular/core';
import { BlogService } from './blog.service';

const delimeter = '----------!!##!!----------';
const delimeter2 = '==========!!##!!==========';

@Component({
  selector: 'm-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  providers: [BlogService]
})
export class BlogComponent {
  blogs = null;

  constructor(private blogService: BlogService) {
    const {owner, repo} = this.blogService.getDefaultOwnerAndRepo();
    this.blogService.getBlogs$(owner, repo)
      .subscribe(blogs => {
        this.blogs = blogs;

        const validBlogs = this.blogs.filter(d => !d.markdownRendered);
        const markdownText = validBlogs.map(d => {
          if (d.meta && d.meta.summary) {
            return [d.meta.summary, d.body].join(delimeter);
          } else {
            return d.body;
          }
        }).join(delimeter2);

        if (markdownText) {
          // render summaries markdown asynchronously
          this.blogService.renderMarkdown$(markdownText)
            .subscribe(d => {
              const summaries = d.split(delimeter2);
              validBlogs.forEach((blog, i) => {
                let [html1, html2] = summaries[i].split(delimeter);
                if (html1 && html2) {
                  blog.meta.summary = html1;
                  blog.body = html2;
                } else if (html1){
                  blog.body = html1;
                }

                blog.markdownRendered = true;
              });
            });
        }
      });
  }
}
