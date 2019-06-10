import React from 'react'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import './VisitHeader.scss'

function VisitHeader () {
  return (
    <Stack horizontal verticalFill className='visit-header'>
      <Stack.Item grow className='participants'>
        Participants Component
      </Stack.Item>
      <Stack.Item grow disableShrink className='call-actions'>
        Video Icons Component
      </Stack.Item>
      <Stack.Item grow className='actions'>
        Actions Component
      </Stack.Item>
    </Stack>
  )
}

VisitHeader.propTypes = {
}

VisitHeader.defaultProps = {
}

export default VisitHeader
