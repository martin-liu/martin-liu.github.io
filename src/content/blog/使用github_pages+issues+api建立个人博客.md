---
author: Martin Liu
pubDatetime: 2014-11-15T19:32:44.737Z
title: 使用github pages + issues + api建立个人博客
postSlug: 使用github_pages+issues+api建立个人博客
featured: false
ogImage: ""
tags:
  - chinese
  - blog
description: 简单易行不要钱。 `不需要数据库，不需要服务器，不需要域名`， 完全自定义的纯HTML/JS/CSS代码，不需要学各种static site generator的玩法，又能实现独一无二的个人博客。
---

[2018-09-27] 此文已经 outdated，我使用 angular 6 重写了这个 blog system. 现在只需 fork 并简单操作即可使用。see [instructions](https://github.com/martin-liu/martin-liu.github.io#how-to-use-it).
不过原理仍是类似的，此文可作为参考.

## Table of contents

## 以下为旧文

## 前言

最近写了一个[简单的博客](http://martin-liu.github.io/)并放在[github](https://github.com)上，在此详述一下细节，以为分享。

方法并不高端，但是：

1. 简单易行不要钱。
   `不需要数据库，不需要服务器，不需要域名`，因为 github 都帮我们做了，**壮哉我大 github**！
2. 完全自定义的纯 HTML/JS/CSS 代码。不需要学各种 static site generator 的玩法，又能实现独一无二的个人博客
   

好了，废话稍止，进入正文。

## 原理就一句话

写`前端代码`并 host 在[github pages](https://pages.github.com/), 利用[github issues](https://guides.github.com/features/issues/)做为后台, 通过[github API](https://developer.github.com/v3/)完成前后端交互

## 基本介绍

- [github pages](https://pages.github.com/)

  > - Github 提供的托管`静态网页`的服务，基本使用方法是建立一个名为`YOUR_USER_NAME.github.io`的 repo, 并把代码 push 到`master` branch。
  > - 注意其只支持`静态内容`。
  > - 另外，如果你有自己的域名，也可以[将域名指向 github pages](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/)

- [github issues](https://guides.github.com/features/issues/)

  > 每个 github repo 自带的 tracking 系统，支持[markdown](https://guides.github.com/features/mastering-markdown/), 代码高亮，图片，表格，emoji 表情

- [github API](https://developer.github.com/v3/)

  > Github 提供的 API, 可以拿到你的[issues 内容](https://developer.github.com/v3/issues/#list-issues)，可以[render markdown](https://developer.github.com/v3/markdown/)... 更多请看文档

## 为何不直接使用 issues 作为博客

事实上，直接使用 issues 作为博客也是可行的，从这个角度，就是把 github issues 当成博客平台。  
这个方案的缺陷是：

- Github issues 并不是为作为博客而设计的，博客平台的很多功能，比如推荐、SEO 等都是没有的
- 你将受限于 github 的 UI 和用户（需要注册才能评论），无法自由的定义你想要的 UI 和交互

而使用 github API 来构建 no backend app, 即可以合理利用 github 提供的强大功能，又能随心所欲的定义自己的网站，还能集成任意的第三方服务（评论、分享等），十分潇洒

## 我的玩法

本博客基于[m-angular-boilerplate](https://github.com/martin-liu/m-angular-boilerplate)开发，这是我写的一个`前端快速开发框架`，主要技术为`angularJS + bootstrap + grunt + coffeeScript`，有兴趣的朋友可以看看。😀

这个框架的 scope 不同于博客系统，在此先不多说。本文会主讲博客涉及到的内容。

## 上酸菜和代码

首先要在 Github 上建立 repo，名字为`YOUR_USER_NAME.github.io`, 比如我的`martin-liu.github.io`。
拉到本地后开始 coding。 以下为 coffee 编译出来的 js 代码，主要使用 angularJS，如用其它框架实现，按同样的原理来就是

1. 注册 routing。就是把 url 和页面逻辑对应，比如`http://martin-liu.github.io/#!/`这个 url 就找`partials/home.html`这个 html，并执行`HomeCtrl`这个 function。如果找不到，就去 404 页面

   ```javascript
   angular.forEach(Config.routes, function (route) {
     if (route.params && !route.params.controller) {
       route.params.controller = "BaseCtrl";
     }
     $routeProvider.when(route.url, route.params);
   });
   $routeProvider.otherwise({
     templateUrl: "partials/404.html",
   });
   ```

   Config.routes 内容为:

   ```javascript
   [
     {
       url: "/",
       params: {
         name: "home",
         label: "Home",
         templateUrl: "partials/home.html",
         controller: "HomeCtrl",
       },
     },
     {
       url: "/article/:id",
       params: {
         name: "article",
         hide: true,
         templateUrl: "partials/article.html",
         controller: "ArticleCtrl",
       },
     },
     {
       url: "/about",
       params: {
         name: "about",
         label: "About",
         templateUrl: "partials/about.html",
       },
     },
   ];
   ```

2. Home 页面的实现

   - 拿[issues 内容](https://developer.github.com/v3/issues/#list-issues)

     我的 api link 为
     https://api.github.com/repos/martin-liu/martin-liu.github.io/issues?labels=blog&page=1&per_page=10&state=open

   code 如下，`BlogRemoteService.getBlogs()`就是 ajax call 刚刚那个 url，拿 issues 数据

   ```javascript
   BlogRemoteService.getBlogs().then(
     (function (_this) {
       return function (blogs) {
         return (_this.data.blogs = _this.processBlogs(blogs));
       };
     })(this)
   );

   processBlogs = function (blogs) {
     return _.map(blogs, BlogService.decorateBlog);
   };
   ```

   BlogService.decorateBlog 就是下面的取 summary

   - 文章 summary
     ![image](https://cloud.githubusercontent.com/assets/1459760/5057351/82a753b2-6cf5-11e4-89f9-99ca6b8f7cea.png)

   可以看到，文章内容有一段注释，里面是 json 代码。注释不会显示，但可被获取，做为 metadata

   ```javascript
   <!--
   {
   "summary":"渺小如我们，是风吹动水面，是蝴蝶一次振翅。在正确的位置，也能掀起远方的风暴；找到那个支点，也能撬动地球。"
   }
   -->
   ```

   BlogService.decorateBlog 的内容如下，用来解析注释内容，赋值给`blog.meta`

   ```javascript
       decorateBlog: function(blog) {
         var e, meta, metaStr;
         if (!blog.body) {
           return blog;
         }
         metaStr = blog.body.substring(0, blog.body.indexOf('-->'));
         metaStr = metaStr.replace(/\n|\r|<!-{2,}/gm, ' ');
         try {
           meta = JSON.parse(metaStr);
         } catch (_error) {
           e = _error;
           console.log(e);
         }
         blog.meta = meta;
         if (blog.meta.summary) {
           BlogRemoteService.renderMarkdown(blog.meta.summary).then(function(data) {
             return blog.meta.summary = data;
           });
         }
         return blog;
       }
   ```

   - html 页面, 展示 blog list, 带 summary。如果不用 angularJS, 用[handlebars](http://handlebarsjs.com/)或[mustache](http://mustache.github.io/)也可轻松实现

   ```html
   <m-loading ng-if="!vm.data.blogs"></m-loading>
   <div ng-if="vm.data.blogs" ng-repeat="blog in vm.data.blogs">
   <div style="cursor:pointer"
        ng-click="Util.redirect('/article/' + blog.number)">
     <h3 ng-bind="blog.title"></h3>
     <p class="summary" ng-bind-html="blog.meta.summary"></p>
     <span ng-bind="blog.created_at | date:'yyyy-MM-dd'"</span>>
   </div>
   <hr/>
   </div>
   ```

3. 文章页面的实现

   - [拿文章内容](https://developer.github.com/v3/issues/#get-a-single-issue)

     我的 api link 为https://api.github.com/repos/martin-liu/martin-liu.github.io/issues/3?labels=blog&page=1&per_page=10&state=open

     ```javascript
     BlogRemoteService.getBlog(id).then(
       (function (_this) {
         return function (blog) {
           if (blog.body) {
             _this.data.blog = BlogService.decorateBlog(blog);
             BlogRemoteService.renderMarkdown(blog.body).then(function (ret) {
               return (_this.data.content = ret);
             });
             return ($rootScope.blog = _this.data.blog);
           }
         };
       })(this)
     );
     ```

   - [render markdown](https://developer.github.com/v3/markdown/)

     `post` blog.content 到[https://api.github.com/markdown](https://api.github.com/markdown)

   - html

   ```html
   <m-loading ng-if="!vm.data.content"></m-loading>
   <div ng-if="vm.data.content">
     <h2 class="align-center" ng-bind="vm.data.blog.title"></h2>
     <p
       ng-bind="vm.data.blog.created_at | date:'yyyy-MM-dd hh:mm:ss'"
       class="created-at"
     ></p>
     <br />
     <div ng-bind-html="vm.data.content"></div>
   </div>

   <br />
   <br />
   <hr />
   <p>欢迎扫码订阅公众号:</p>
   <img width="120" src="/image/qrcode_wechat.jpg" />
   <div
     ng-if="vm.data.blog.number"
     duoshuo
     data-thread-key="{{vm.data.blog.number}}"
   ></div>
   ```

4. 关于 css

   css 主要是用的 bootstrap, 但是代码高亮是 copy from github, 代码在[这里](https://github.com/martin-liu/martin-liu.github.io/blob/staging/app/css/less/markdown.less)

5. 使用[多说评论](http://duoshuo.com/)，[百度统计](http://tongji.baidu.com/web/welcome/login)，[jiathis 社会化分享](http://www.jiathis.com/)

   需要到各自的网站上注册，得到相应代码

   以下为异步加载多说和百度统计的代码

   ```javascript
   function addScript(src) {
     var el = document.createElement("script");
     el.src = src;
     var s = document.getElementsByTagName("script")[0];
     s.parentNode.insertBefore(el, s);
   }

   // duoshuo
   var duoshuoQuery = {
     short_name: "martin-liu",
   };

   // baidu statistics
   var _hmt = _hmt || [];
   _hmt.push(["_setAutoPageview", false]);

   var scriptSrcs = [
     "http://static.duoshuo.com/embed.unstable.js", // duoshuo
     "//hm.baidu.com/hm.js?a67e974dea316e70836c07c3e3576a29", // baidu statistics
   ];

   for (var i = 0; i < scriptSrcs.length; i++) {
     addScript(scriptSrcs[i]);
   }
   ```

   另外，对于多说使用[angular-duoshuo](https://github.com/duoshuo/angular-duoshuo)来支持 angularJS

   ```html
   <div
     ng-if="vm.data.blog.number"
     duoshuo
     data-thread-key="{{vm.data.blog.number}}"
   ></div>
   ```

   百度统计, url 变化时触发

   ```javascript
   $rootScope.$on("$routeChangeSuccess", function ($event, current) {
     if (_hmt) {
       return _hmt.push(["_trackPageview", $location.url()]);
     }
   });
   ```

6. fork me on github

   见https://github.com/blog/273-github-ribbons

7. 使用[locache](http://locachejs.org/)做本地 cache, 减少 request 数量，提高用户体验。我设置为 5 分钟失效

   ```javascript
   this.getWithCache = function (key, isSession, getFunc, timeout) {
     var cache, data, defer, promise;
     cache = Cache;
     if (isSession) {
       cache = Cache.session;
     }
     defer = $q.defer();
     data = cache.get(key);
     if (data) {
       defer.resolve(data);
       return defer.promise;
     } else {
       promise = getFunc();
       promise.then(function (data) {
         return cache.set(key, data, timeout);
       });
       return promise;
     }
   };
   ```

8. push 到 github，等几分钟，一个新鲜的热乎乎的博客就出现了!

   以下是我的部署 script，因为有 build 过程(concat, uglify 之类)

   ```bash
   #!/bin/bash
   grunt build
   ( cd dist
   git init
   git add .
   git commit -m "Deployed to Github Pages"
   git push --force --quiet "https://github.com/martin-liu/martin-liu.github.io.git" master
   )
   ```

## Next

还有一些问题没有解决，如

- [ ] RSS
- [ ] SEO

## 最后

可以看到，这是个非常简单的 blog，并不完善，但是 workable，可以在此基础上迭代开发。这一点相当重要，因为

> Done is better than perfect.(完成更胜完美)  
> -- facebook 标语
