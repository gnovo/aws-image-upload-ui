const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
const withOffline = require('next-offline')
const withPlugins = require('next-compose-plugins')
const withSourceMaps = require('@zeit/next-source-maps')()
const { PHASE_PRODUCTION_BUILD } = require('next/constants')
const globImporter = require('node-sass-glob-importer')

const packageJson = require('./package.json')
const dev = process.env.NODE_ENV !== 'production'
if (dev) {
  require('dotenv').config()
}

const ENV_VAR_FIELDS = [
  'BASE_URL',
  'API_BASE_URL',
  'SENTRY_DSN',
]
const nextConfig = {
  publicRuntimeConfig: ENV_VAR_FIELDS.reduce((conf, envVar) => {
    if (process.env[envVar]) {
      conf[envVar] = process.env[envVar]
    }
    return conf
  }, {
    RELEASE: packageJson.version
  }),
  distDir: '../.next'
}

console.log('CONFIG: ', nextConfig)

const sassConfig = {
  sassLoaderOptions: {
    importer: globImporter()
  }
}

const offlineConfig = {
  workboxOpts: {
    runtimeCaching: [
      {
        urlPattern: /.png$/,
        handler: 'CacheFirst'
      },
      {
        urlPattern: /api/,
        handler: 'NetworkFirst',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
            headers: {
              'x-test': 'true'
            }
          }
        }
      }
    ]
  }
}

module.exports = withPlugins([
  [withSass, sassConfig],
  [withCSS],
  [withOffline, offlineConfig, [PHASE_PRODUCTION_BUILD]],
  [withSourceMaps, {}, [PHASE_PRODUCTION_BUILD]],
], nextConfig)
