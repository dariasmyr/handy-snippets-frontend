![](./.github/logo.png)

# Handy Snippets Frontend
[**Handy Snippets**](https://handy.uxna.me/) - [Vite](https://vitejs.dev) + Typescript app for storing and sharing end-to-end encrypted notes online. This app uses [**GraphQL**](https://graphql.org/) API to interact with [**Handy Snippets Backend**](https://github.com/dariasmyr/handy-snippets-backend)

## Get started

**One-liner:**

- `npx degit dariasmyr/handy-snippets-frontend my-app && cd my-app && git init && git add . && git commit -m "Initial commit" && npm install && cp .env.example .env && npm run gen && npm run start:dev`

**Step by step:**

- `npx degit dariasmyr/handy-snippets-frontend my-app`
- `cd my-app`
- `git init && git add . && git commit -m "Initial commit"`
- `npm install`
- `cp .env.example .env`
- Edit `.env`
- `npm run gen`
- `npm run start:dev`

**Production build:**

- `npm run build`
- `npm start:prod`

## Types generation

Run `npm run gen` after every GraphQL API Schema changed or after `./graphql/*.graphql` files are modified
