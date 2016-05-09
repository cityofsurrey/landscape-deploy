import EventEmitter from 'events'

class Activity extends EventEmitter {
  constructor(activity) {
    super()

    Object.keys(activity).forEach(key => {
      Object.assign(this, { [key]: activity[key] })
    })
  }
}

export default Activity
