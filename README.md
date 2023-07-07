<p  align="center">

<a  href="http://nestjs.com/"  target="blank"><img  src="https://nestjs.com/img/logo-small.svg"  width="200"  alt="Nest Logo"  /></a>

</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p  align="center">A progressive <a  href="http://nodejs.org"  target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

# Freelancer Hub

Connecting talented freelancers with clients in need of their services.

## Table of contents (optional)

- [Project Description](#project-description)

- [Requirements](#requirements)

- [Installation](#installation)

- [What's Inside](#whats-inside)

- [Configuration](#)

## Project Description

### Stack Used In The Project

This project has been made using

- [NestJS](https://nestjs.com//).

- [Prisma](https://www.prisma.io/). - for ORM

- [PlanetScale](https://planetscale.com/) - to create database

For the authentication, we are using JWT to create access token and also refresh token for the api validation. Access token will expired in 30 minutes, while the refresh token will expired in 7 days.

### Features

some methods that are being used to showcase the implementation of the api:

#### Auth

@POST /auth/admin/signin

```javascript
{
  username: string;

  password: string;
}
```

@POST /auth/admin/signup

```javascript
{
  name: string;

  username: string;

  password: string;

  email: string;
}
```

@POST /auth/admin/logout

```

using header to logout

'Authorization' : 'Bearer [token]'

```

---

#### freelancer

@POST /freelancer - create a freelancer

```javascript
{
  name: string;

  username: string;

  hobby: string;

  email: string;

  phoneNum: string;

  skillSets: [{ title: string }];
}
```

@GET /freelancer - to get all list of freelancers

@GET /freelancer/:id - to get specific freelancer

@PATCH /freelancer/:id - to update specific freelancer

```javascript
{
  name: string;

  username: string;

  hobby: string;

  email: string;

  phoneNum: string;

  skillSets: [{ title: string }];
}
```

@DELETE /freelancer/:id - to delete specific freelancer

## Requirements (required) <a id="requirements">

- Installed a source-code editor (etc, visual studio code)

- You must have node and npm installed (via brew install node or NodeJS.org);

- You must have yarn installed ( optional )

## Installation

```bash

$  cd [folder_name]

$  git  clone  https://github.com/nazrighazi/freelancer-nestjs.git

$  yarn  or  npm  i

$  npm  run  start:dev

```

## What's inside? <a id="whats-inside">

A quick look at the top-level files and directories in this project.

```bash

├──  prisma
├──  src
├──  .eslintrc.js
├──  .gitignore
├──  .prettierrc
├──  nestcli.json
├──  package.json
├──  README.md
├──  tsconfig.build.json
├──  tsconfig.json
├──  yarn.lock

```

## What's inside src ?

A quick look at the top-level files and directories in this project.

```shell
├──  auth
      ├──  auth.controller.ts
      ├──  auth.service.ts
├──  common
├──  freelancer
├──  prisma
├──  app.controller.spec.ts
├──  app.controller.ts
├──  app.module.ts
├──  app.service.ts
├──  main.ts
```

1.  **`./auth`** : folder for specific flow. There's tho flow in this project, which is auth and freelancer.

2.  **`./auth.controller.ts`** : handling incoming **requests** and returning **responses** to the client.

3.  **`./auth.service.ts`**: responsible for data storage and retrieval, called from controller

4.  **`./common`**: for decorators and guard

5.  **`./prisma`**: instantiate `PrismaClient` and Prisma Clinet API to connect to database.
