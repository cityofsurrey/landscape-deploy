import print from 'node-print'

export function textify(report) {
  return report.map(x => `${x.computer_name}: ${x.activity_status}`).join('\n')
}

class Reporter {
  constructor(landscape) {
    this.landscape = landscape
    this.init()
  }

  async init() {
    this.computers = await this.landscape.computers.query()
  }

  async print(activity) {
    const report = await this.create(activity)
    print.pt(report)
  }

  async text(activity) {
    const report = await this.create(activity)

    return textify(report)
  }

  /**
   * Generates an activity report for the parent activity that includes
   * the status of the child activities as well.
   *
   * @param {string} parentActivityId - The Landscape activity (command) on
   *   we want to report on.
   *
   * @returns {object}  An associative array, keyed on computer id, containing
   *   information about each server in the specified activity group.
   */
  async create(activity) {
    const activities = await this.landscape.activities.queryChildren(activity.id)

    const report = activities.map((a) => {
      return {
        computer_name: this.computers.find(x => x.id === a.computer_id).hostname,
        computer_id: a.computer_id,
        activity_id: a.id,
        activity_status: a.activity_status,
      }
    })

    // Sort the report by computer name.
    report.sort(
      (a, b) => (a.computer_name.toLowerCase() > b.computer_name.toLowerCase()) -
                (a.computer_name.toLowerCase() < b.computer_name.toLowerCase())
    )

    // Summarize the parent activity and add the summary to the end of the reports array.
    report.push({
      computer_name: '** ALL (Summary) **',
      computer_id: '-',
      activity_id: activity.id,
      activity_status: activity.activity_status,
    })

    return report
  }
}

export default Reporter
