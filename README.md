# [Web] GoBaber
[![AppVeyor](https://img.shields.io/appveyor/build/diegovictor/gobarber-web?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/DiegoVictor/gobarber-web)
[![typescript](https://img.shields.io/badge/typescript-5.1.6-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![react](https://img.shields.io/badge/reactjs-18.2.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![styled-components](https://img.shields.io/badge/styled_components-6.0.2-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-8.44.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.6.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/gobarber-web?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/gobarber-web)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/gobarber-web/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

This web version allow providers to register yourself, change or reset password, update name and email, update avatar and see your schedules. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/gobarber-api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
  * [localStorage](#localstorage)
* [Running the tests](#running-the-tests)
  * [Coverage Report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-web/main/screenshots/login.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-web/main/screenshots/signup.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-web/main/screenshots/forgot.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-web/main/screenshots/reset.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-web/main/screenshots/dashboard.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/gobarber-web/main/screenshots/profile.png" width="49%"/>

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/gobarber-api) before to start this app.

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
REACT_APP_API_URL|API's url|`http://localhost:3333`

### API
Start the [API](https://github.com/DiegoVictor/gobarber-api) (see its README for more information). In case of any change in the API's `port` or `host` remember to update the [`.env`](#env) too.

# Usage
To start the app run:
```
$ yarn start
```
Or:
```
npm run start
```

## localStorage
The project saves users's data and token into [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) keys: `@GoBarber:user` and `@GoBarber:token`. Before use `@GoBarber:user` data you need parse the data to a JavaScript object with [JSON.parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) function. Below you can see fictitious data:

* `@GoBarber:user`
```json
{
  "id": "01931fee-32d4-4af7-b4e9-12159c5d703e",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "avatar": "52bde824dff12071c7df-20200219_214816.jpg",
  "created_at": "2020-06-07T21:16:15.754Z",
  "updated_at": "2020-11-20T04:06:15.975Z",
  "avatar_url": "http://127.0.0.1:3333/uploads/52bde824dff12071c7df-20200219_214816.jpg"
}
```

* `@GoBarber:token`
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDU4MzQ4MDcsImV4cCI6MTYwNTkyMTIwNywic3ViIjoiMDE5MzFmZWUtMzJkNC00YWY3LWI0ZTktMTIxNTljNWQ3MDNlIn0.uzMK3TufipdyIrKxqakOhJtNF3VH7zkHPAfjTUae2q8
```

# Running the tests
[Jest](https://jestjs.io) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage Report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
