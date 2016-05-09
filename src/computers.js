class Computers {
  constructor(client) {
    this.client = client
  }

  /**
   * Gets information on all computers associated with the tag activity or activity group.
   *
   * Here is an example of a sample result:
   *
   * [
   *   {
   *     "comment": "",
   *     "total_swap": 3811,
   *     "total_memory": 3952,
   *     "title": "PlyDocker01.surrey.ca",
   *     "last_ping_time": "2016-05-04T22:36:52Z",
   *     "hostname": "plydocker01.surrey.ca",
   *     "container_info": "",
   *     "last_exchange_time": "2016-05-04T22:22:46Z",
   *     "update_manager_prompt": "lts",
   *     "tags": ["ply-servers"],
   *     "cloud_instance_metadata": {},
   *     "access_group": "ply-servers",
   *     "distribution": "14.04",
   *     "id": 32,
   *     "reboot_required_flag": false,
   *     "vm_info": "vmware"
   *   },
   *   {...},
   * ]
   *
   * @param {string} tag - (optional) The tag or activity group of the servers.
   *
   * @returns {array} A list of computers.
   */
  async query(tag) {
    let computers = []
    if (tag) {
      computers = await this.client.request(`get-computers --query tag:${tag}`)
    } else {
      computers = await this.client.request('get-computers')
    }

    return computers.map(x => this.parse(x))
  }

  parse(computer) {
    return {
      ...computer,
      hostname: computer.hostname.toLowerCase(),
    }
  }
}

export default Computers
