import { Injectable } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const cache = {};
let cachedBlogs = [];

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  getDefaultOwnerAndRepo() {
    let owner = document.location.host.split('.')[0];
    let repo = `${owner}.github.io`;
    return {owner, repo};
    //return {owner: 'martin-liu', repo: 'martin-liu.github.io'};
  }

  getBlogs$(owner, repo) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?creator=${owner}&labels=blog&page=1&per_page=20&state=open`;
    if (cache[url]) {
      return of(cache[url]);
    } else {
      return ajax.getJSON(url).pipe(
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
        map(blog => this.decorateBlog(blog)),
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
    });
  }
}
