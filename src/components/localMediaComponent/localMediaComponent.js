import { Component } from 'react'
import PropTypes from 'prop-types'
import fmLiveswitch from 'fm.liveswitch'

class LocalMediaComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      localMedia: null
    }
  }

  componentDidMount() {
    const { captureAudio, captureVideo } = this.props

    var localMedia = new fmLiveswitch.LocalMedia(captureAudio, captureVideo)
    this.setState({ localMedia: localMedia })
  }

  componentDidUpdate (prevProps) {
    if (this.props.targetLocalMediaState !== prevProps.targetLocalMediaState) {
      switch (this.props.targetLocalMediaState) {
        case fmLiveswitch.LocalMediaState.Started:
          this.start()
          break
        case fmLiveswitch.LocalMediaState.Stopped:
          this.stop()
          break
        default:
          fmLiveswitch.Log.error('Unknown target local media state', this.props.targetLocalMediaState)
      }
    }
  }

  start() {
    const { localMedia } = this.state

    fmLiveswitch.Log.info("Starting LocalMedia...")
    if (localMedia !== null) {
      localMedia.start().then((o) => {
        fmLiveswitch.Log.info("LocalMedia started")

        //var layoutManager = new fmLiveswitch.DomLayoutManager(videoContainer)

        this.props.startedLocalMedia()
      },
      (ex) => {
        fmLiveswitch.Log.error("Failed to start localMedia.", ex)
      })
    }
  }

  stop() {
    const { localMedia } = this.state

    if (localMedia !== null) {
      localMedia.stop().then((o) => {
        fmLiveswitch.Log.info("LocalMedia stopped")

        //var layoutManager = new fmLiveswitch.DomLayoutManager(videoContainer)

        this.props.stoppedLocalMedia()
      },
      (ex) => {
        fmLiveswitch.Log.error("Failed to stop localMedia.", ex)
      })
    }
  }

  render() {
    return null
  }
}

LocalMediaComponent.propTypes = {
  targetLocalMediaState: PropTypes.number
}

LocalMediaComponent.defaultProps = {
  captureAudio: true,
  captureVideo: true
}

export default LocalMediaComponent
