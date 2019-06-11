import { Component } from 'react'
import PropTypes from 'prop-types'
import fmLiveswitch from 'fm.liveswitch'

class Channel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      channel: null
    }
  }

  componentDidMount () {
    const { client, channelId } = this.props

    if (client !== null && channelId !== null) {
      this.joinChannel(client, channelId)
    }
  }

  componentDidUpdate (prevProps) {
    const { client, channelId } = this.props

    if (prevProps.client !== client || prevProps.channelId !== channelId) {
      if (prevProps.client !== null) {
        this.leaveChannel(prevProps.client, prevProps.channelId)
      }
      if (client !== null) {
        this.joinChannel(client, channelId)
      }
    }
  }

  componentWillUnmount () {
    const { client, channelId } = this.props

    if (client !== null && channelId !== null) {
      this.leaveChannel(client, channelId)
    }
  }

  render() {
    return null
  }

  joinChannel (client, channelId) {
    var token = fmLiveswitch.Token.generateClientJoinToken(
      client.getApplicationId(),
      client.getUserId(),
      client.getDeviceId(),
      client.getId(),
      new fmLiveswitch.ChannelClaim(channelId),
      '--replaceThisWithYourOwnSharedSecret--' // TODO replace this with an auth server
    )

    client.join(channelId, token).then((channel) => {
      this.setState({ channel: channel })
      
      // Set up event handlers
      channel.addOnMessage(this.onMessage)
      channel.addOnRemoteClientJoin(this.onRemoteClientJoin)
      channel.addOnRemoteUpstreamConnectionOpen(this.onRemoteUpstreamConnectionOpen)
      channel.addOnRemoteUpstreamConnectionClose(this.onRemoteUpstreamConnectionClose)
      channel.addOnPeerConnectionOffer(this.onPeerConnectionOffer)

      // Query existing channel details
      channel.getRemoteClientInfos().forEach((remoteClientInfo) => {
        console.log('getRemoteClientInfos', remoteClientInfo)
      })

      fmLiveswitch.Log.info(`Joined channel ${channelId}`)
    },
    (ex) => {
      fmLiveswitch.Log.error(`Failed to join channel ${channelId}`, ex)
    })
  }

  leaveChannel (client, channelId) {
    client.leave(channelId).then((channel) => {
      this.setState({ channel: null })
      fmLiveswitch.Log.info(`Left channel ${channelId}`)
    },
    (ex) => {
      fmLiveswitch.Log.error(`Failed to leave channel ${channelId}`, ex)
    })
  }

  onMessage (message) {
    console.log('onMessage', message)
  }
  
  onRemoteClientJoin (remoteClientInfo) {
    console.log('onRemoteClientJoin', remoteClientInfo)
  }

  onRemoteUpstreamConnectionOpen (remoteConnectionInfo) {
    console.log('onRemoteUpstreamConnectionOpen', remoteConnectionInfo)
  }

  onRemoteUpstreamConnectionClose (remoteConnectionInfo) {
    console.log('onRemoteUpstreamConnectionClose', remoteConnectionInfo)
  }

  onPeerConnectionOffer (peerConnectionOffer) {
    console.log('onPeerConnectionOffer', 'not implemented')
    // Not implemented
  }

}

Channel.propTypes = {
  client: PropTypes.object,
  channelId: PropTypes.string
}

Channel.defaultProps = {
}

export default Channel
