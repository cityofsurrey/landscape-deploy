import Activity from './models/activity'

class Activities {
  constructor(client) {
    this.client = client
  }

  async query() {
    const activities = await this.client.request('get-activities')

    return activities.map(x => this.parse(x))
  }

  /**
   * Gets information about all the child activities associated with the specified parent activity.
   *
   * Here is an example of a sample result:
   *
   *   [
   *     {
   *       "creator": {
   *         "id": 6,
   *         "name": "landscape-bot-api",
   *         "email": "ec4test02@surrey.ca" },
   *       "creation_time": "2016-05-04T22:20:32Z",
   *       "completion_time": null,
   *       "deliver_after_time": null,
   *       "id": 1051,
   *       "delivery_time": "2016-05-04T22:21:47Z",
   *       "computer_id": 30,
   *       "modification_time": "2016-05-04T22:21:47Z",
   *       "result_text": null,
   *       "activity_status": "delivered",
   *       "deliver_before_time": null,
   *       "summary": "Run script: COS-Deploy-MySurrey-Using-git-clone (Ply Servers)",
   *       "parent_id": 1048,
   *       "approval_time": null,
   *       "type": "ExecuteScriptRequest",
   *       "result_code": null
   *     },
   *     {...}
   *   ]
   *
   * @param {number} id - The Landscape activity ID associated with the parent activity.
   *
   * @returns {array} A list of child activities.
   */
  async queryChildren(parentId) {
    const activities = await this.client.request(`get-activities --query parent-id:${parentId}`)

    return activities.map(x => this.parse(x))
  }

  async find(id) {
    const activities = await this.client.request(`get-activities --query id:${id}`)

    return new Activity(activities[0])
  }

  async emitStatus(activity) {
    const updatedActivity = await this.find(activity.id)

    if (updatedActivity.activity_status === activity.activity_status) {
      setTimeout(() => this.emitStatus(activity), 5000)
    } else {
      activity.activity_status = updatedActivity.activity_status
      activity.emit('status', activity.activity_status)

      if (['canceled', 'failed', 'succeeded'].includes(activity.activity_status)) {
        activity.emit('done', activity)
      } else {
        setTimeout(() => this.emitStatus(activity), 5000)
      }
    }
  }

  parse(activity) {
    return {
      ...activity,
    }
  }
}

export default Activities
