import bunyan from 'bunyan'
import program from 'commander'
import Landscape from './landscape'
import Slacker from './slacker'
import Reporter from './reporter'

const log = bunyan.createLogger({ name: 'landscape-node' })
const landscape = new Landscape()
const slacker = new Slacker()
const reporter = new Reporter(landscape)

function processCommandLineArgs() {
  program
    .version('0.0.1')
    .usage('--script <id> --tag <name> [--dev]')
    .description('Executes the specified script in Landscape, on a specified group of servers.')
    .option('-s, --script <id>',
            'the ID of the Landscape script to execute (required)',
            parseInt)
    .option('-t, --tag <name>',
            'the group of servers on which to execute the script (required)')

  program.on('--help', () => {
    /*eslint-disable*/
    console.log('  Examples:') // eslint-no-console
    console.log('')
    console.log('    $ landscape-deploy --script 28 --tag ply-servers --dev')
    console.log('    $ landscape-deploy --help')
    console.log('')
    /*eslint-enable*/
  })

  program.parse(process.argv)

  if (!program.script || !program.tag) {
    program.help()
  }

  return {
    script: program.script,
    tag: program.tag,
  }
}

(async () => {
  try {
    const { script, tag } = processCommandLineArgs()

    slacker.post(`I am deploying using script '${script}' for servers *${tag}*...`)

    const activity = await landscape.scripts.execute(script, tag)
    log.info('The deployment\'s current status is:')
    await reporter.print(activity)

    activity.on('status', async () => await reporter.print(activity))
    activity.on('done', async (status) => {
      slacker.post(
        `I have finished deploying using script '${script}' for servers *${tag}*. ` +
        'Here are the details for each server:')

      slacker.post(await reporter.text(activity))

      const message = `Deployment completed with status ${status}`
      if (['succeeded', 'canceled'].includes(status)) {
        log.info(message)
      } else {
        log.error(message)
      }
    })
  } catch (err) {
    log.error(err)
  }
})()
