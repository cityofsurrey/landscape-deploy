import { expect } from 'chai'
import { textify } from '../src/reporter'

describe('Reporter class', () => {
  describe('textify()', () => {
    it('should convert report to text', () => {
      const report = [
        { computer_name: 'host1', activity_status: 'failed' },
        { computer_name: 'host2', activity_status: 'succeeded' },
      ]

      expect(textify(report)).to.equal('host1: failed\nhost2: succeeded')
    })
  })
})
