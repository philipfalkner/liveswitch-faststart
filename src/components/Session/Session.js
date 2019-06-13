import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Channel from '../Channel'
import { SessionType, ChannelType, ParticipantRole } from '../../helpers/sessionHelper'

class Session extends Component {
  constructor(props) {
    super(props)

    this.state = {
      channels: [],
      remoteMedias: {}
    }
  }

  componentDidMount() {
    const { client, sessionId, sessionType, participantRole } = this.props

    console.log('mountSession', client)
    let newChannels = []
    switch (sessionType) {
      case SessionType.private:
        newChannels = [
          <Channel
            client={client}
            channelId={`${sessionId}-private`}
            channelType={ChannelType.private}
            participantRole={participantRole}
            addRemoteMedia={this.addRemoteMedia.bind(this)}
            removeRemoteMedia={this.removeRemoteMedia.bind(this)} />
        ]
        break
      case SessionType.public:
        newChannels = [
          <Channel
            client={client}
            channelId={`${sessionId}-public`}
            channelType={ChannelType.public}
            participantRole={participantRole}
            addRemoteMedia={this.addRemoteMedia.bind(this)}
            removeRemoteMedia={this.removeRemoteMedia.bind(this)} />
        ]
        break
      case SessionType.presentation:
        newChannels = [
          <Channel
            client={client}
            channelId={`${sessionId}-presenter`}
            channelType={ChannelType.presenter}
            participantRole={participantRole}
            addRemoteMedia={this.addRemoteMedia.bind(this)}
            removeRemoteMedia={this.removeRemoteMedia.bind(this)} />,
          <Channel
            client={client}
            channelId={`${sessionId}-audience`}
            channelType={ChannelType.audience}
            participantRole={participantRole}
            addRemoteMedia={this.addRemoteMedia.bind(this)}
            removeRemoteMedia={this.removeRemoteMedia.bind(this)} />
        ]
        break
      default:
        console.error('Invalid session type', sessionType)
        break
    }

    this.setState({ channels: newChannels })
  }

  componentDidUpdate(prevProps) {
    const { client } = this.props
    const { channels } = this.state

    if (prevProps.client !== client) {
      let newChannels = [...channels]

      for (let ctr = 0; ctr < newChannels.length; ++ctr) {
        newChannels[ctr] = React.cloneElement(newChannels[ctr], { client: client })
      }

      this.setState({ channels: newChannels })
    }
  }

  render() {
    const { layout } = this.props
    const { channels, remoteMedias } = this.state

    console.log('renderSession', channels)

    return React.cloneElement(layout, {
      channels: channels,
      remoteMedias: remoteMedias,
      startSession: this.startSession.bind(this),
      stopSession: this.stopSession.bind(this),
      sendMessage: this.sendMessage.bind(this)
    })
  }

  startSession() {
    const { channels } = this.state

    let newChannels = [...channels]

    for (let ctr = 0; ctr < newChannels.length; ++ctr) {
      newChannels[ctr] = React.cloneElement(newChannels[ctr], { shouldStart: true })
    }

    this.setState({ channels: newChannels })
  }

  stopSession() {
    const { channels } = this.state

    let newChannels = [...channels]

    for (let ctr = 0; ctr < newChannels.length; ++ctr) {
      newChannels[ctr] = React.cloneElement(newChannels[ctr], { shouldStart: false })
    }

    this.setState({ channels: newChannels })
  }

  addRemoteMedia(remoteMedia) {
    const { remoteMedias } = this.state

    let newRemoteMedias = { ...remoteMedias }
    newRemoteMedias[remoteMedia.getId()] = {
      mediaObject: remoteMedia
    }

    this.setState({ remoteMedias: newRemoteMedias })
  }

  removeRemoteMedia(remoteMedia) {
    const { remoteMedias } = this.state

    let newRemoteMedias = { ...remoteMedias }
    delete newRemoteMedias[remoteMedia.getId()]

    this.setState({ remoteMedias: newRemoteMedias })
  }

  sendMessage(messageText, userId) {
    const { channels } = this.state

    let newChannels = [...channels]

    // TODO decide which channels to send messages to, e.g. based on participantRole
    for (let ctr = 0; ctr < newChannels.length; ++ctr) {
      newChannels[ctr] = React.cloneElement(newChannels[ctr], {
        message: {
          messageText: messageText,
          userId: userId
      }})
    }

    this.setState({ channels: newChannels })
  }
}

Session.propTypes = {
  client: PropTypes.object,
  sessionId: PropTypes.string,
  sessionType: PropTypes.string
}

Session.defaultProps = {
}

export default Session
