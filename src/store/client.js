import superagent from 'superagent'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const methods = ['get', 'post', 'put', 'patch', 'delete']

const formatUrl = (path) => (
  path.search(/^https?:\/\/(.*)/) === -1
    ? { url: `${publicRuntimeConfig.API_BASE_URL}/${path}`, external: false }
    : { url: path, external: true }
)

export default class client {
  constructor(req) {
    methods.forEach(method => {
      this[method] = (path, { params, data, headers = {'Content-Type': 'application/ld+json', 'Accept': 'application/ld+json'}, files, fields, withTWLPCredentials = true } = {}) => new Promise((resolve, reject) => {
        const urlData = formatUrl(path)

        const request = superagent[method](urlData.url)

        if (params) request.query(params)

        if (headers) request.set(headers)

        if (files) files.forEach(file => request.attach(file.key, file.value))

        if (fields) fields.forEach(item => request.field(item.key, item.value))

        if (withAIUCredentials) request.withCredentials()

        if (data) request.send(data)

        request.end((err, res = {}) => (err ? reject(res.body || err) : resolve(res.body)))
      })
    }
  )}
}
