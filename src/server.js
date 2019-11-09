const express = require('express')
const next = require('next')
const { parse } = require('url')
const { join } = require('path')
const compression = require('compression')
const sslRedirect = require('heroku-ssl-redirect')

const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev, dir: './src' })
const handle = app.getRequestHandler()

const rootStaticFiles = ['/robots.txt', '/sitemap.xml', '/favicon.ico', '/manifest.json']

const serviceWorkerFile = '/service-worker.js'
const oauthRedirectPath = '/oauthredirect'

app.prepare()
    .then(() => {
      const server = express()

      server.use(compression())
      if (!dev) {
        server.use(sslRedirect())
      }

      server.use((req, res, next) => {
        if (process.env.HOST_NAME &&
            req.headers.host !== process.env.HOST_NAME) {
          return res.redirect(301, `https://${process.env.HOST_NAME}${req.originalUrl}`)
        }
        if (req.path === oauthRedirectPath) {
          return res.redirect(301, `https://${process.env.HOST_NAME}`)
        }
        return next()
      })

      server.get(rootStaticFiles, (req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname } = parsedUrl
        const path = join(__dirname, 'public', pathname)

        app.serveStatic(req, res, path)
      })

      server.get(serviceWorkerFile, (req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname } = parsedUrl
        const path = join(__dirname, '../.next', pathname)
        app.serveStatic(req, res, path)
      })

      server.get('*', (req, res) => {
        return handle(req, res)
      })

      server.listen(process.env.PORT || 7777, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:7777')
      })
    })
    .catch((ex) => {
      console.error(ex.stack)
      process.exit(1)
    })
