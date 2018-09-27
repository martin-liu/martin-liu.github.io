# Blog based on Github issues
This is a simple blog system based on github issues.

## How to use it
1. `fork` this project
2. Go to `settings`, rename project to `YOUR_LOGIN.github.io`, for example, your github login is `abc`, then `abc.github.io`.
3. In `settings` page, ensure `Issues` checkbox is checked under `Features` block.
4. Create an issue and fill title and body, then add a label named `blog` to it. You can also add code like `<!-- {"summary": "this is a test summary"} -->` in your issue body, this will be used as summary of this blog article.
5. Your blog website should be `https://YOUR_LOGIN.github.io`.
6. [Note] When you fork the project, it may take a while for github to generate pages.
7. [Note] To customize the blog system, or update to latest version of system, please refer Advanced info.

# Advanced
## Update to latest version
1. `git clone https://github.com/YOUR_LOGIN/YOUR_LOGIN.github.io`
2. `cd YOUR_LOGIN.github.io`
3. `git remote add upstream https://github.com/martin-liu/martin-liu.github.io`
4. `git pull upstream master`
5. `git push origin master`

## Development server
You need to install `nodeJS`, then run `npm install` to install dependencies.

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build & deploy
Run `npm run build` to build the project.

Run `./bin/deploy.sh` to build & deploy the project to github pages.
