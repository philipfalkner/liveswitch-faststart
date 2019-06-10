import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fmLiveswitch from 'fm.liveswitch'
import * as guidHelpers from '../../helpers/guidHelpers'
import './VideoComponent.scss'

class VideoComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      client: null,
      channel: null,
      localMedia: null,
      layoutManager: null,
      mic: true,
      mute: false,
      video: true,
      preview: true,
      startingCall: false,
      endingCall: false,
      callInProgress: false,
      currentAudioSourceId: null,
      audioSourceList: null,
      currentVideoSourceId: null,
      videoSourceList: null
    }
  }

  componentDidMount () {
    const { isVideoCall } = this.props
    fmLiveswitch.Log.setLogLevel(fmLiveswitch.LogLevel.Debug)
    fmLiveswitch.Log.registerProvider(new fmLiveswitch.ConsoleLogProvider(fmLiveswitch.LogLevel.Debug))
    fmLiveswitch.HttpWebRequestTransfer.setDisableCors(true)

    var localMedia = new fmLiveswitch.LocalMedia(this.state.mic, isVideoCall)
    // Screen sharing
    // var localMedia = new fmLiveswitch.LocalMedia(this.state.mic, isVideoCall, true)
    var layoutManager = new fmLiveswitch.DomLayoutManager(this.refs['video-container'])

    this.setState({
      localMedia: localMedia,
      layoutManager: layoutManager,
      video: isVideoCall
    })
  }

  componentWillUnmount () {
    this.state.localMedia.destroy()

    this.state.client.unregister().then((result) => {
      console.log('unregistration succeeded')
    }).fail(function (ex) {
      console.log('unregistration failed', ex)
    })
  }

  startCall () {
    const { userInfo, channelId, frozenMountainVideoConfiguration } = this.props
    const { localMedia, layoutManager } = this.state

    var applicationId = 'my-app-id'
    var userId = userInfo.userId
    var deviceId = guidHelpers.generateGuid()
    var client = new fmLiveswitch.Client(frozenMountainVideoConfiguration.FrozenMountainVideoBaseUrl, applicationId, userId, deviceId, null, null)
    var token = fmLiveswitch.Token.generateClientRegisterToken(
      applicationId,
      client.getUserId(),
      client.getDeviceId(),
      client.getId(),
      client.getRoles(),
      [new fmLiveswitch.ChannelClaim(channelId)],
      'fe3340734348437a844ce11c99766bcd6dc8ce6686834fefae7e8c1e70651152' // TODO replace this with an auth server
    )
    var iceServers = [
      new fmLiveswitch.IceServer('stun:turn.frozenmountain.com:3478'),
      new fmLiveswitch.IceServer('turn:turn.frozenmountain.com:80', 'test', 'pa55w0rd!'),
      new fmLiveswitch.IceServer('turns:turn.frozenmountain.com:443', 'test', 'pa55w0rd!')
    ]

    this.setState({ startingCall: true })

    var channel = null
    layoutManager.setLocalView(localMedia.getView())

    client.register(token).then((channels) => {
      console.log('connected to channel: ' + channels[0].getId())
      channel = channels[0]

      this.setState({ channel: channel, client: client })

      channel.addOnRemoteClientJoin((remoteClientInfo) => {
        var remoteMedia = new fmLiveswitch.RemoteMedia()
        var audioStream = new fmLiveswitch.AudioStream(localMedia, remoteMedia)
        var videoStream = new fmLiveswitch.VideoStream(localMedia, remoteMedia)
        var connection = channel.createPeerConnection(remoteClientInfo, audioStream, videoStream)
        layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView())
        connection.addOnStateChange((c) => {
          if (c.getState() === fmLiveswitch.ConnectionState.Failing ||
          c.getState() === fmLiveswitch.ConnectionState.Closing) {
            layoutManager.removeRemoteView(remoteMedia.getId())
          }
        })
        connection.setIceServers(iceServers)
        connection.open().then((result) => {
          console.log('connection established 2')
        }).fail(function (ex) {
          console.log('connection failed 2', ex)
        })
      })

      channel.addOnPeerConnectionOffer((peerConnectionOffer) => {
        var remoteMedia = new fmLiveswitch.RemoteMedia()
        var audioStream = new fmLiveswitch.AudioStream(localMedia, remoteMedia)
        var videoStream = new fmLiveswitch.VideoStream(localMedia, remoteMedia)
        var connection = channel.createPeerConnection(peerConnectionOffer, audioStream, videoStream)
        layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView())
        connection.addOnStateChange((c) => {
          if (c.getState() === fmLiveswitch.ConnectionState.Failing ||
          c.getState() === fmLiveswitch.ConnectionState.Closing) {
            layoutManager.removeRemoteView(remoteMedia.getId())
          }
        })
        connection.setIceServers(iceServers)
        connection.open().then((result) => {
          console.log('connection established 3')
        }).fail(function (ex) {
          console.log('connection failed 3', ex)
        })
      })

      channel.addOnMessage((remoteClientInfo, message) => {
        console.log(message)
      })

      channel.getRemoteClientInfos().forEach((remoteClientInfo) => {
        var remoteMedia = new fmLiveswitch.RemoteMedia()
        var audioStream = new fmLiveswitch.AudioStream(localMedia, remoteMedia)
        var videoStream = new fmLiveswitch.VideoStream(localMedia, remoteMedia)
        var connection = channel.createPeerConnection(remoteClientInfo, audioStream, videoStream)
        layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView())
        connection.addOnStateChange((c) => {
          if (connection.getState() === fmLiveswitch.ConnectionState.Failing ||
          connection.getState() === fmLiveswitch.ConnectionState.Closing) {
            layoutManager.removeRemoteView(remoteMedia.getId())
          }
        })
        connection.setIceServers(iceServers)
        connection.open().then((result) => {
          console.log('connection established 2')
        }).fail(function (ex) {
          console.log('connection failed 2', ex)
        })
      })
    }).fail((ex) => {
      console.log('registration failed', ex)
    })

    localMedia.start().then((lm) => {
      console.log('media capture started')
      this.setState({ startingCall: false, callInProgress: true })
      this.setState({ currentAudioSourceId: localMedia.getAudioSourceInput().getId() })
      localMedia.getAudioSourceInputs().then((results) => {
        this.setState({ audioSourceList: results })
      })
      this.setState({ currentVideoSourceId: localMedia.getVideoSourceInput().getId() })
      localMedia.getVideoSourceInputs().then((results) => {
        this.setState({ videoSourceList: results })
      })
    }).fail(function (ex) {
      console.log('media capture start failed', ex)
    })
  }

  stopCall () {
    const { channelId } = this.props
    this.setState({ endingCall: true })
    this.state.localMedia.stop().then((lm) => {
      console.log('media capture stopped')
    }).fail(function (ex) {
      console.log('media capture stop failed', ex)
    })
    this.state.client.leave(channelId).then((channel) => {
      console.log('left the channel')
      this.setState({ endingCall: false, callInProgress: false })
    }).fail(function (ex) {
      console.log('leave channel failed', ex)
    })
    this.state.layoutManager.unsetLocalView()
  }

  toggleMic () {
    let audioTrack = this.state.localMedia.getAudioTrack()
    if (audioTrack) {
      audioTrack.setMuted(!audioTrack.getMuted())
      this.setState({ mic: !audioTrack.getMuted() })
    }
  }

  muteAudio () {
    this.state.remoteMediaList.forEach((media) => {
      media.AudioTrack.Volume = this.state.mute ? 1 : 0
    })
    this.setState({ mute: !this.state.mute })
  }

  toggleCamera () {
    let videoTrack = this.state.localMedia.getVideoTrack()
    if (videoTrack) {
      videoTrack.setMuted(!videoTrack.getMuted())
      this.setState({ video: !videoTrack.getMuted() })
    }
  }

  togglePreview () {
    var lm = this.state.layoutManager
    if (lm != null) {
      var videoPreview = lm.getLocalView()
      if (videoPreview && videoPreview.style.display === 'none') {
        videoPreview.style.display = ''
        this.setState({ preview: true })
      } else {
        videoPreview.style.display = 'none'
        this.setState({ preview: false })
      }
    }
  }

  toggleFullscreen () {
    var video = document.getElementById('video-container')
    if (window.innerHeight === screen.height) { // eslint-disable-line no-restricted-globals
      video.exitFullscreen()
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen()
      }
    }
  }

  changeAudioDevice (id, name) {
    this.state.localMedia.changeAudioSourceInput(new fmLiveswitch.SourceInput(id, name))
    this.setState({ currentAudioSourceId: id })
  }

  changeVideoDevice (id, name) {
    this.state.localMedia.changeVideoSourceInput(new fmLiveswitch.SourceInput(id, name))
    this.setState({ currentVideoSourceId: id })
  }

  render () {
    return (
      <div>
        <div className='video-actions'>
          <span>
            {this.state.callInProgress &&
              <button onClick={() => this.toggleCamera()}>
                {this.state.video
                  ? 'Disable Camera'
                  : 'Enable Camera'
                }
              </button>
            }
            {this.state.callInProgress &&
              <button onClick={() => this.toggleMic()}>
                {this.state.mic
                  ? 'Disable Mic'
                  : 'Enable Mic'
                }
              </button>
            }
            {this.state.callInProgress &&
              <button onClick={() => this.togglePreview()}>
                {this.state.preview
                  ? 'Disable Preview'
                  : 'Enable Preview'
                }
              </button>
            }
            {this.state.callInProgress &&
              <button onClick={() => this.toggleFullscreen()}>
                Enable FullScreen
              </button>
            }
            {false &&
              <button onClick={() => this.muteAudio()}>
                {this.state.mute
                  ? 'Unmute'
                  : 'Mute'
                }
              </button>
            }
            <button onClick={!this.state.startingCall && !this.state.callInProgress
                ? () => this.startCall()
                : null
              }
              className={`start-call-action ${this.state.startingCall || this.state.callInProgress ? 'inactive' : ''}`}
              title='video.startVideo'>
              StartCall
            </button>
            <button onClick={!this.state.endingCall && this.state.callInProgress
                ? () => this.stopCall()
                : null
              }
              className={`end-call-action ${!this.state.endingCall && this.state.callInProgress ? '' : 'inactive'}`}
              title='video.endVideo'>
              EndCall
            </button>
            {this.state.audioSourceList && this.state.callInProgress &&
              <select className='camera-select'
                value={this.state.currentAudioSourceId}
                onChange={(e) => { this.changeAudioDevice(e.target.value, e.target.name) }}>
                {this.state.audioSourceList.map((device, i) => {
                  return <option key={i} value={device.getId()} name={device.getName()}>{device.getName()}</option>
                })}
              </select>
            }
            {this.state.videoSourceList && this.state.callInProgress &&
              <select className='camera-select'
                value={this.state.currentVideoSourceId}
                onChange={(e) => { this.changeVideoDevice(e.target.value, e.target.name) }}>
                {this.state.videoSourceList.map((device, i) => {
                  return <option key={i} value={device.getId()} name={device.getName()}>{device.getName()}</option>
                })}
              </select>
            }
          </span>
        </div>
        <div className='video-container' id='video-container' ref='video-container' />
      </div>
    )
  }
}

VideoComponent.propTypes = {
  t: PropTypes.func,
  isVideoCall: PropTypes.bool,
  channelId: PropTypes.string,
  userInfo: PropTypes.object,
  frozenMountainVideoConfiguration: PropTypes.object
}

VideoComponent.defaultProps = {
}

export default VideoComponent
