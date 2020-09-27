# svc-bootstrap

<!-- toc -->

- [Getting started](#getting-started)
- [Launch](#launch)
- [CI/CD](#cicd)
- [Scripts](#scripts)
    
<!-- tocstop -->
(build with [markdown-toc](https://github.com/jonschlinkert/markdown-toc))
  
# Getting started

In order to launch app you need to have `project.env`. You can use example content below:

```bash

SVC_POSTGRES_PASSWORD=<pwd>
SVC_SECRET_KEY=...(32 byte long)

SVC_MAILER_HOST=smtp.mailtrap.io
SVC_MAILER_ACCOUNT_USER=<user>
SVC_MAILER_ACCOUNT_PASSWORD=<pwd>

```
 
# Launch
Since this service is part of dashboard app it should NOT be started from svc-dashboard folder.

The best way is to use root level npm scripts:

```bash
cd ../
npm run svc:launch:loc
#or start platform - it will start both svc & web-app
npm run start
```

Default urls: 

- [http://localhost:9000/api/version](http://localhost:9000/api/version)
- [http://localhost:9000/docs](http://localhost:9000/docs)
- [http://localhost:9000/swagger-editor](http://localhost:9000/swagger-editor)

# CI/CD

There is 5 basic environment expected: 

- LOCAL - source-maps, debugger, and docs available
- DEVELOPMENT - source-maps, debugger, and docs available
- QA - source-maps, debugger, and docs available
- STAGE - **NO** `/docs` & `/swagger-editor` routes starting from this env.
- PRODUCTION - error log level

Environment variable `ENV_NAME` used to specify for executed apps in which env it runs.

Check `./configs/envs` for details.

# Scripts
There is a set of scripts defined in package.json to help with day-to-day jobs:

- `start`: launch nodemon watch with ts & debug mode
- `build`: build prod via webpack
- `build:analyze`: prod bundle analyze
- `build:loc`: build local via webpack
- `build:loc:analyze`: local bundle analyze
- `check:all`: check ts types & eslint
- `launch` -> `launch:dev`: dev launch
- `launch:loc`: local launch with watchers 
- `launch:dev`: dev mode launch from `./dist` folder for bundled app 
- `lint` & `lint:fix`: eslint & fix
- `test:*`: all test stuff
- `types:*`: type checking stuff