import React from 'react'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import VisitHeader from '../VisitHeader'
import VideoComponent from '../videoComponent'
import './Visit.scss'

function Visit (props) {
  const { params } = props.match
  return (
    <Stack verticalFill className='visit'>
      <VisitHeader />
      <Stack horizontal verticalFill>
        <Stack.Item grow>
          <VideoComponent
            isVideoCall
            channelId={params.visitId} />
        </Stack.Item>
      </Stack>
    </Stack>
  )
}

Visit.propTypes = {
}

Visit.defaultProps = {
}

export default Visit
