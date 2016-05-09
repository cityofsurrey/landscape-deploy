import { execSync } from 'child_process'

class Slacker {
  constructor() {
    this.url = 'https://hooks.slack.com/services/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'
    this.username = 'Deployment Guru Bot'
    this.channel = '#bot-deployments'
    this.icon = ':octopus:'
  }

  post(text) {
    const payload = JSON.stringify({
      username: this.username,
      channel: this.channel,
      icon_emoji: this.icon,
      text,
    })

    const command = `curl -s -X POST --data-urlencode 'payload=${payload}' ${this.url}`

    execSync(command)
  }
}

export default Slacker
