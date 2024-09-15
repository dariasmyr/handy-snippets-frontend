/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './../routes/__root'
import { Route as ViewImport } from './../routes/view'
import { Route as EditImport } from './../routes/edit'

// Create Virtual Routes

const HelpLazyImport = createFileRoute('/help')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const HelpLazyRoute = HelpLazyImport.update({
  path: '/help',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./../routes/help.lazy').then((d) => d.Route))

const ViewRoute = ViewImport.update({
  path: '/view',
  getParentRoute: () => rootRoute,
} as any)

const EditRoute = EditImport.update({
  path: '/edit',
  getParentRoute: () => rootRoute,
} as any)

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
    '/edit': {
      id: '/edit'
      path: '/edit'
      fullPath: '/edit'
      preLoaderRoute: typeof EditImport
      parentRoute: typeof rootRoute
    }
    '/view': {
      id: '/view'
      path: '/view'
      fullPath: '/view'
      preLoaderRoute: typeof ViewImport
      parentRoute: typeof rootRoute
    }
    '/help': {
      id: '/help'
      path: '/help'
      fullPath: '/help'
      preLoaderRoute: typeof HelpLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/edit': typeof EditRoute
  '/view': typeof ViewRoute
  '/help': typeof HelpLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/edit': typeof EditRoute
  '/view': typeof ViewRoute
  '/help': typeof HelpLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/edit': typeof EditRoute
  '/view': typeof ViewRoute
  '/help': typeof HelpLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/edit' | '/view' | '/help'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/edit' | '/view' | '/help'
  id: '__root__' | '/' | '/edit' | '/view' | '/help'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  EditRoute: typeof EditRoute
  ViewRoute: typeof ViewRoute
  HelpLazyRoute: typeof HelpLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  EditRoute: EditRoute,
  ViewRoute: ViewRoute,
  HelpLazyRoute: HelpLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/edit",
        "/view",
        "/help"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/edit": {
      "filePath": "edit.tsx"
    },
    "/view": {
      "filePath": "view.tsx"
    },
    "/help": {
      "filePath": "help.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
