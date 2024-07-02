/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './../routes/__root'

// Create Virtual Routes

const ViewLazyImport = createFileRoute('/view')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const ViewLazyRoute = ViewLazyImport.update({
  path: '/view',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./../routes/view.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./../routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/view': {
      id: '/view'
      path: '/view'
      fullPath: '/view'
      preLoaderRoute: typeof ViewLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  ViewLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/view"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/view": {
      "filePath": "view.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
