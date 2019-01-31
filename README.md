[![CircleCI](https://circleci.com/gh/taylorjg/simple-app.svg?style=svg)](https://circleci.com/gh/taylorjg/simple-app)

# Description

The idea of this repo is to build a simple application complete with:

* a React front end
* a Node.js back end
* unit tests
* end to end tests
* continuous integration (via CircleCI)
* continuous deployment (to AWS)

## Technologies

* React
* Redux (TODO)
* Boostrap
* Node.js
* Express
* Use of a third-party REST API ([OpenWeatherMap](https://openweathermap.org/))
* CircleCI CI/CD
* AWS: ECR, ECS, Fargate, Route 53, CloudFormation
* End to end testing using [Protractor](https://www.protractortest.org/)

# Things already done

* [Scaffold app via create-react-app](#scaffold-app-via-create-react-app)
* [Add version information](#add-version-information)
* [Add server](#add-server)
* [Add start-dev and start-local scripts](#add-start-dev-and-start-local-scripts)
* [Add weather info view](#add-weather-info-view)
* [Add error handling](#add-error-handling)
* [Add preferences view](#add-preferences-view)
* [Add header and navigation links](#add-header-and-navigation-links)
* [Deploy to Heroku](#deploy-to-heroku)
* [Add CircleCI CI/CD](#add-circleci-cicd)
* [Deploy to AWS without ALB](#deploy-to-aws-without-alb)
* [Deploy to AWS with ALB](#deploy-to-aws-with-alb)
* [Add first end-to-end test](#add-first-end-to-end-test)

# Things still to do

* Remember preferences in local storage

# Notes on things already done

## Scaffold app via create-react-app

Use [create-react-app](https://facebook.github.io/create-react-app/) to create a basic React application.

```
npx create-react-app simple-app
```

I removed all the semi-colons from the generated code.

## Add version information

I like to display the app version in the UI by importing `package.json` into `src/App.js`:

```
import { version } from '../package.json'
```

We can then display `version` somewhere on the page:

```
<span className="version pull-right">version: {version}</span>
```

## Add server

Next, I added a basic server implementation using [Express](https://expressjs.com/). Eventually, this will serve the following:

* the static resources of the React single page application (SPA)
* the web service endpoints that the SPA will use to get weather information, etc.

During local development, we will probably want to serve the SPA via [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
by running `npm start` (this is all done for us by create-react-app). But we will need a separate server to serve our web service endpoints.
So we add the following line to `package.json` to tell `webpack-dev-server` to proxy web service calls to our node server:

```
  "proxy": "http://localhost:3001/"
```

For more details, see [Proxying API Requests in Development](https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development).

## Add start-dev and start-local scripts

So now we need to run two web servers whilst doing local development. To make this easier, I added a new `npm run` script:

```
npm run start-dev
```

This command launches both our node server and `webpack-dev-server`.

In addition, we will need to pass configuration information
to our node server via environment variables e.g. keys for third-party APIs. We don't want these keys to appear in our code repository.
So, I created a local `.env` file and listed this file in `.gitignore`. The contents of this file will be something like this:

```
OPEN_WEATHER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

This file is read by `npm run start-dev` to set the environment variables before launching our node server.

`npm run start-dev` makes use of another script called `start-node`. It is possible to start our node server separately using this command:

```
npm run start-node
```

## Add weather info view

TODO: add description

## Add error handling

TODO: add description

## Add preferences view

TODO: add description

## Add header and navigation links

TODO: add description

## Deploy to Heroku

TODO: add description

## Add CircleCI CI/CD

TODO: add description

## Deploy to AWS without ALB

TODO: add description

## Deploy to AWS with ALB

TODO: add description

## Add first end-to-end test

TODO: add description
