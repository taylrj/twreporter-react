import superAgent from 'superagent'
import config from '../config'

export default function loadArticles(req, params = []) {
  return new Promise((resolve, reject) => {
    const query = req.query
    const { API_PROTOCOL, API_PORT, API_HOST } = config
    let url = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/posts`
    let slug = typeof params[0] === 'string' ? params[0] : null
    url = slug ? `${url}/${slug}` : url
    superAgent['get'](url).timeout(500)
    .query(query)
    .end(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res.body)
      }
    })
  })
}