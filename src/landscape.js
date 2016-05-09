import Client from './client'
import Computers from './computers'
import Scripts from './scripts'
import Activities from './activities'

const LANDSCAPE_API_KEY = process.env.LANDSCAPE_API_KEY
const LANDSCAPE_API_SECRET = process.env.LANDSCAPE_API_SECRET
const LANDSCAPE_API_URI = process.env.LANDSCAPE_API_URI || 'https://landscape.canonical.com/api/'
const LANDSCAPE_API_CERTIFICATE = process.env.LANDSCAPE_API_CERTIFICATE

/**
 * A class encapsulating access to the Landscape API via a Docker container.
 */
class Landscape {
  /**
   * Creates a Landscape API access point.
   * @param {string} uri - The Landscape API endpoint.
   * @param {string} key - The key required to access the Landscape API
   *   endpoint.
   * @param {string} token - The security token to access the Landscape API
   *   endpoint.
   * @param {string} certificate - The security certificate required to access
   *   the Landscape server (optional).
   */
  constructor(key = LANDSCAPE_API_KEY,
              secret = LANDSCAPE_API_SECRET,
              uri = LANDSCAPE_API_URI,
              certificate = LANDSCAPE_API_CERTIFICATE) {
    this.client = new Client(key, secret, uri, certificate)
    this.computers = new Computers(this.client)
    this.scripts = new Scripts(this.client)
    this.activities = new Activities(this.client)
  }
}

export default Landscape
