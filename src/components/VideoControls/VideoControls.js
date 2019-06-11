import React from 'react'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import fmLiveswitch from 'fm.liveswitch'

function VideoControls (props) {
  return (
    <Stack horizontal verticalFill className='video-controls'>
      <Stack.Item grow>
        <button
          disabled={props.currentLocalMediaState === fmLiveswitch.LocalMediaState.Started ? 'disabled' : ''}
          onClick={() => props.startLocalMedia()}
        >Start Local Media</button>
        <button
          disabled={props.currentLocalMediaState === fmLiveswitch.LocalMediaState.Stopped ? 'disabled' : ''}
          onClick={() => props.stopLocalMedia()}
        >Stop Local Media</button>
      </Stack.Item>
    </Stack>
  )
}

VideoControls.propTypes = {
}

VideoControls.defaultProps = {
}

export default VideoControls
