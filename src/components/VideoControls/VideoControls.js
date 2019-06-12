import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import fmLiveswitch from 'fm.liveswitch'

class VideoControls extends Component {
  constructor(props) {
    super(props)

    this.renderRef = React.createRef();

    this.state = {
      allowStartLocalMedia: false,
      allowStopLocalMedia: false
    }
  }

  static getDerivedStateFromProps (props, state) {
    var newState = { ...state }

    if (props.currentLocalMediaState === fmLiveswitch.LocalMediaState.Started) {
      newState.allowStartLocalMedia = false
      newState.allowStopLocalMedia = true
    }
    else if (props.currentLocalMediaState === fmLiveswitch.LocalMediaState.Stopped) {
      newState.allowStartLocalMedia = true
      newState.allowStopLocalMedia = false
    }
    else if (props.targetLocalMediaState) {
      newState.allowStartLocalMedia = false
      newState.allowStopLocalMedia = false
    } else {
      newState.allowStartLocalMedia = true
      newState.allowStopLocalMedia = false
    }

    return newState
  }

  render () {
    const { allowStartLocalMedia, allowStopLocalMedia } = this.state
    const { startLocalMedia, stopLocalMedia } = this.props

    return (
      <Stack horizontal className='video-controls'>
        <Stack.Item>
          <button
            disabled={allowStartLocalMedia ? '' : 'disabled'}
            onClick={() => startLocalMedia()}>
              Start Local Media
          </button>
          <button
            disabled={allowStopLocalMedia ? '' : 'disabled'}
            onClick={() => stopLocalMedia()}>
              Stop Local Media
          </button>
        </Stack.Item>
      </Stack>
    )
    }
}

VideoControls.propTypes = {
  startLocalMedia: PropTypes.func,
  stopLocalMedia: PropTypes.func,
  currentLocalMediaState: PropTypes.number,
  targetLocalMediaState: PropTypes.number
}

VideoControls.defaultProps = {
}

export default VideoControls
