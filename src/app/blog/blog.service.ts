import { Injectable } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from './../../environments/environment';

const cache = {};
let cachedBlogs = [];

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private catchErrorPipe = null

  constructor(private nzMessage: NzMessageService) {
    this.catchErrorPipe = catchError(e => {
      this.nzMessage.error(e.response.message, { nzDuration: 10000 });
      return of(e);
    });
  }

  getDefaultOwnerAndRepo() {
    let owner = environment.github.owner || document.location.host.split('.')[0];
    let repo = environment.github.repo || `${owner}.github.io`;
    return {owner, repo};
  }

  getBlogs$(owner, repo) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=blog&page=1&per_page=30&state=open`;
    if (cache[url]) {
      return of(cache[url]);
    } else {
      return ajax.getJSON(url).pipe(
        this.catchErrorPipe,
        map((data: any) => data.map(blog => this.decorateBlog(blog))),
        map(d => {
          cache[url] = d;
          cachedBlogs = d;
          return d;
        })
      );
    }
  }

  getBlog$(owner, repo, blogId) {
    let blog = cachedBlogs.find(b => b.number == blogId);
    if (blog) {
      return of(blog);
    } else {
      const url = `https://api.github.com/repos/${owner}/${repo}/issues/${blogId}`;
      return ajax.getJSON(url).pipe(
        this.catchErrorPipe,
        map(blog => this.decorateBlog(blog)),
      );
    }
  }

  getBlogComments$(blog) {
    if (blog.comments == 0) {
      return of([]);
    } else {
      return ajax.getJSON(blog.comments_url).pipe(
        this.catchErrorPipe
      );
    }
  }

  decorateBlog(blog) {
    if (!blog.body) return blog;

    let commentIndex = blog.body.indexOf('-->');
    let metaStr = blog.body.substring(0, commentIndex);

    metaStr = metaStr.replace(/\n|\r|<!-{2,}/gm, ' ')

    try {
      blog.meta = JSON.parse(metaStr);
      blog.body = blog.body.substring(commentIndex + 3);
    } catch (e) {
      console.error(e);
    }

    return blog;
  }

  renderMarkdown$(text) {
    return ajax({
      url: "https://api.github.com/markdown",
      method: 'POST',
      responseType: 'text',
      body: {
        text,
        mode: 'gfm'
      },
      headers: {
        'Accept': 'text/html',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).pipe(
      this.catchErrorPipe,
      map(({response}) => response)
    );
  }
}
