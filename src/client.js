import path from 'path'
import { exec } from 'child_process'

class Client {
  constructor(key, secret, uri, certificate) {
    if (certificate) {
      const certificatePath = path.dirname(certificate)
      const certificateFile = path.basename(certificate)

      this.command =
        `docker run --rm -e LANDSCAPE_API_URI=${uri} ` +
        `-e LANDSCAPE_API_KEY=${key} ` +
        `-e LANDSCAPE_API_SECRET=${secret} ` +
        `-e LANDSCAPE_API_SSL_CA_FILE=/certificates/${certificateFile} ` +
        `-v ${certificatePath}:/certificates cityofsurrey/landscape-api`
    } else {
      this.command =
        `docker run --rm -e LANDSCAPE_API_URI=${uri} ` +
        `-e LANDSCAPE_API_KEY=${key} ` +
        `-e LANDSCAPE_API_SECRET=${secret} cityofsurrey/landscape-api`
    }
  }

  request(query) {
    return new Promise((resolve, reject) => {
      exec(`${this.command} ${query} --json`, (err, stdout) => {
        if (err) {
          reject(err)
        }

        resolve(JSON.parse(stdout))
      })
    })
  }
}

export default Client
