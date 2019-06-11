import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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

  // componentDidUpdate(prevProps){
  //   if (prevProps.localMediaVideoElement !== this.props.localMediaVideoElement){
  //     console.log('refs: ', this.renderRef);
  //     //var test = "<div>XXX</div>"
  //     //ReactDOM.render(this.props.localMediaVideoElement, this.renderRef.current);
  //   }
  // }

  render () {
    const { allowStartLocalMedia, allowStopLocalMedia } = this.state
    const { startLocalMedia, stopLocalMedia, localMedia } = this.props

    return (
      <Stack horizontal verticalFill className='video-controls'>
        <Stack.Item grow>
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
          <div ref={nodeElement => (nodeElement && localMedia && nodeElement.appendChild(localMedia.getView()))}></div>
        </Stack.Item>
        {/* <Stack.Item>
          {localMediaVideoElement} // this would render a JSX.Element
        </Stack.Item> */}
      </Stack>
    )
    }
}

VideoControls.propTypes = {
  startLocalMedia: PropTypes.func,
  stopLocalMedia: PropTypes.func,
  localMedia: PropTypes.object,
  currentLocalMediaState: PropTypes.number,
  targetLocalMediaState: PropTypes.number
}

VideoControls.defaultProps = {
}

export default VideoControls
