/**
 * @file A wrapper class around the Landscape API.
 * @author Alazhar Shamshuddin
 */
import { execSync } from 'child_process'
import path from 'path'

/**
 * A class encapsulating access to the Landscape API via a Docker container.
 */
export default class Landscape {

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
  constructor(uri, key, token, certificate) {
    this.landscapeCmd = null

    if (certificate) {
      const certificatePath = path.dirname(certificate)
      const certificateFile = path.basename(certificate)

      this.landscapeCmd =
        `docker run --rm -e LANDSCAPE_API_URI=${uri} ` +
        `-e LANDSCAPE_API_KEY=${key} ` +
        `-e LANDSCAPE_API_SECRET=${token} ` +
        `-e LANDSCAPE_API_SSL_CA_FILE=/certificates/${certificateFile} ` +
        `-v ${certificatePath}:/certificates cityofsurrey/landscape-api `
    }
    else {
      this.landscapeCmd =
        `docker run --rm -e LANDSCAPE_API_URI=${uri} ` +
        `-e LANDSCAPE_API_KEY=${key} ` +
        `-e LANDSCAPE_API_SECRET=${token} cityofsurrey/landscape-api`
    }
  }

  /**
   * Executes the Landscape script specified by id on all computers that belong
   * to a group specified by tag.
   *
   * @param {string} tag - The group of severs on which the script should be
   *   executed.
   * @param {number} id - The id of the script stored on the Landscape server.
   *
   * @returns {object} A JSON object containing information about this activity
   *   like the one shown below.
   *   {
   *     "creator": {
   *       "id": 6,
   *       "name": "landscape-bot-api",
   *       "email": "ec4test02@surrey.ca" },
   *     "result_text": null,
   *     "activity_status": "undelivered",
   *     "creation_time": "2016-05-04T22:12:11Z",
   *     "summary": "Run script: COS-Deploy-MySurrey-Using-git-clone (Ply Servers)",
   *     "parent_id": null,
   *     "completion_time": null,
   *     "deliver_delay_window": 0,
   *     "type": "ActivityGroup",
   *     "id": 1044,
   *     "result_code": null
   *   }
   */
  executeScript(tag, id) {
    const data =
        execSync(`${this.landscapeCmd} execute-script tag:${tag} ${id} --json`)

    return JSON.parse(data)
  }

  /**
   * Gets information about the specified activity.
   *
   * Here is an example of a sample result:
   *
   *   [
   *     {
   *       "creator": {
   *         "id": 6,
   *         "name": "landscape-bot-api",
   *         "email": "ec4test02@surrey.ca" },
   *         "creation_time": "2016-05-04T22:20:32Z",
   *       "completion_time": null,
   *       "deliver_after_time": null,
   *       "id": 1049,
   *       "delivery_time": "2016-05-04T22:21:40Z",
   *       "computer_id": 32,
   *       "modification_time": "2016-05-04T22:21:40Z",
   *       "result_text": null,
   *       "activity_status": "delivered",
   *       "deliver_before_time": null,
   *       "summary": "Run script: COS-Deploy-MySurrey-Using-git-clone (Ply Servers)",
   *       "parent_id": 1048,
   *       "approval_time": null,
   *       "type": "ExecuteScriptRequest",
   *       "result_code": null
   *     }
   *   ]
   *
   * @param {number} id - The Landscape activity ID.
   *
   * @returns {object} A JSON object containing information about this activity
   *   like the one shown above.
   */
  getActivities(id) {
    const activities =
      execSync(`${this.landscapeCmd} get-activities --query id:${id} --json`)

    return JSON.parse(activities)
  }

  /**
   * Gets information about all the child activities associated with the
   * specified parent activity.
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
   * @param {number} id - The Landscape activity ID associated with the parent
   *   activity.
   *
   * @returns {object} A JSON object containing information about all the
   *   children activities associated with the specified parent.
   */
  getChildActivities(parentId) {
    const childActivities =
      execSync(`${this.landscapeCmd} get-activities ` +
               `--query parent-id:${parentId} --json`)

    return JSON.parse(childActivities)
  }

  /**
   * Gets information on all computers associated with the specified activity
   * group or tag.
   *
   * Here is an example of a sample result:
   *
   *   [
   *     {
   *       "comment": "",
   *       "total_swap": 3811,
   *       "total_memory": 3952,
   *       "title": "PlyDocker01.surrey.ca",
   *       "last_ping_time": "2016-05-04T22:36:52Z",
   *       "hostname": "PlyDocker01.surrey.ca",
   *       "container_info": "",
   *       "last_exchange_time": "2016-05-04T22:22:46Z",
   *       "update_manager_prompt": "lts",
   *       "tags": ["ply-servers"],
   *       "cloud_instance_metadata": {},
   *       "access_group": "ply-servers",
   *       "distribution": "14.04",
   *       "id": 32,
   *       "reboot_required_flag": false,
   *       "vm_info": "vmware"
   *     },
   *     {...},
   *   ]
   *
   * @param {string} activityGroup - The activity group or tag of the servers
   *   we want.
   *
   * @returns {object} A JSON object containing information about all the
   *   computers in the specified activityGroup or tag.
   */
  getComputers(activityGroup) {
    const computers =
      execSync(`${this.landscapeCmd} get-computers ` +
               `--query tag:${activityGroup} --json`)

    return JSON.parse(computers)
  }
}
