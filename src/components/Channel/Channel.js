import { Component } from 'react'
import PropTypes from 'prop-types'
import fmLiveswitch from 'fm.liveswitch'
import withLocalMedia from '../LocalMedia'
import Connection, { TransportType, Direction } from './Connection'
import { sessionType, participantRole } from '../../helpers/sessionHelper'
import { generateGuid } from '../../helpers/guidHelpers'

class Channel extends Component {
  constructor (props) {
    super(props)

    this._isMounted = false
    this.connections = []

    this.state = {
      channel: null
    }
  }

  componentDidMount () {
    const { client, channelId } = this.props

    this._isMounted = true

    if (client !== null && channelId !== null) {
      this.joinChannel(client, channelId)
    }
  }

  componentDidUpdate (prevProps) {
    const { client, channelId, channels } = this.props

    if (prevProps.client !== client || prevProps.channelId !== channelId) {
      if (prevProps.client !== null) {
        this.leaveChannel(prevProps.client, prevProps.channelId)
      }
      if (client !== null) {
        this.joinChannel(client, channelId)
      }
    }

    let prevMessage = null
    if (prevProps.channels[channelId] && prevProps.channels[channelId].message) {
      prevMessage = prevProps.channels[channelId].message
    }
    let message = null
    if (channels[channelId] && channels[channelId].message) {
      message = channels[channelId].message
    }
    if (prevMessage !== message) {
      this.sendMessage(message.messageText, message.userId)
    }

    let prevShouldConnect = null
    if (prevProps.channels[channelId]) {
      prevShouldConnect = prevProps.channels[channelId].shouldConnect
    }
    let shouldConnect = null
    if (channels[channelId]) {
      shouldConnect = channels[channelId].shouldConnect
    }
    if (prevShouldConnect !== shouldConnect) {
      if (shouldConnect === true) {
        this.openCorrectTypeOfUpstreamConnection()
      } else if (prevShouldConnect && !shouldConnect) {
        this.closeAllConnections()
      }
    }
  }

  componentWillUnmount () {
    const { client, channelId } = this.props

    this._isMounted = false

    if (client !== null && channelId !== null) {
      this.leaveChannel(client, channelId)
    }
  }

  render () {
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
      channel.addOnMessage(this.onMessage.bind(this))
      channel.addOnRemoteClientJoin(this.onRemoteClientJoin.bind(this))
      channel.addOnRemoteUpstreamConnectionOpen(this.onRemoteUpstreamConnectionOpen.bind(this))
      channel.addOnRemoteUpstreamConnectionClose(this.onRemoteUpstreamConnectionClose.bind(this))
      channel.addOnPeerConnectionOffer(this.onPeerConnectionOffer.bind(this))

      // Query existing channel details
      channel.getRemoteClientInfos().forEach((remoteClientInfo) => {

      })

      fmLiveswitch.Log.info(`Joined channel ${channelId}`)

      //look at session type to figure out what to send
      console.log('Session Type:', this.props.sessionType)

      //open upstream connection the moment we join the channel
      console.log('Ready to send upstream')
      // this.openCorrectTypeOfUpstreamConnection()
    },
      (ex) => {
        fmLiveswitch.Log.error(`Failed to join channel ${channelId}`, ex)
      })
  }

  leaveChannel (client, channelId) { // TODO should also be called when window unloads
    this.closeAllConnections();
    client.leave(channelId).then((channel) => {
      this._isMounted && this.setState({ channel: null })
      fmLiveswitch.Log.info(`Left channel ${channelId}`)
    },
      (ex) => {
        fmLiveswitch.Log.error(`Failed to leave channel ${channelId}`, ex)
      })
  }

  createConnection (transportType, direction, connectionInfo) {
    const { localMedia, addRemoteMedia, removeRemoteMedia } = this.props
    const { channel } = this.state

    let newConnection = new Connection({
      id: generateGuid(),
      channel: channel,
      transportType: transportType,
      direction: direction,
      connectionInfo: connectionInfo,
      onDisconnect: this.removeConnection.bind(this),
      localMedia: localMedia,
      addRemoteMedia: addRemoteMedia,
      removeRemoteMedia: removeRemoteMedia
    })
    newConnection.connect()
    this.connections = [...this.connections, newConnection]
  }

  removeConnection (id, connection) {
    let foundConnection = this.connections.find((connection) => {
      return connection.id === id
    })

    if (foundConnection !== null) {
      foundConnection.disconnect()
      let newConnections = this.connections.filter(e => e !== foundConnection)
  
      this.connections = newConnections
    } else {
      console.warn('Can\'t remove unknown connection id', id)
    }
  }

  openCorrectTypeOfUpstreamConnection () {
    switch (this.props.sessionType) {
      case sessionType.private:
        //depending on number of users pre-assigned to this session, we start a SFU or MCU upstream
        if (true) {
          console.log("Opening SFU upstream")
          this.createConnection(TransportType.sfu, Direction.upstream)
        } else {
          console.log("Opening MCU upstream")
          this.createConnection(TransportType.mcu, Direction.upstream)
        }
        break;

      case sessionType.public:
        console.log("Opening MCU duplex")
        this.createConnection(TransportType.mcu, Direction.duplex)
        break;

      case sessionType.presentation:
        //if presenter then upstream is sfu
        //if student then upstream is mcu
        console.log("role: ", this.props.role)
        if (this.props.role === participantRole.presenter) {
          console.log("Opening SFU upstream")
          this.createConnection(TransportType.sfu, Direction.upstream)
        } else if (this.props.role === participantRole.student) {
          console.log("Opening MCU upstream")
          this.createConnection(TransportType.mcu, Direction.upstream)
        } else {
          console.log("Invalid role");
        }
        break;

      default:
        console.log("Invalid session type")
    }
  }

  closeAllConnections () {
    this.connections.forEach((connection) => connection.disconnect())
    this.connections = []
  }

  isSfuUpStreamConnectionOpen () {
    var isSfuUpStreamConnectionOpen = !!(this.connections.find((connection) => {
      return connection.props.transportType === TransportType.sfu && connection.props.direction === Direction.upstream
    }));

    return isSfuUpStreamConnectionOpen;
  }

  sendMessage (message, userId) {
    if (!userId) {
      this.state.channel.sendMessage(message)
    } else {
      this.state.channel.sendUserMessage(userId, message)
    }
  }

  onMessage (clientInfo, message) {
    console.log('onMessage', 'TODO', clientInfo, message)
  }

  onRemoteClientJoin (remoteClientInfo) {
    console.log('onRemoteClientJoin', 'TODO', remoteClientInfo)
  }

  onRemoteUpstreamConnectionOpen (remoteConnectionInfo) {
    console.log('onRemoteUpstreamConnectionOpen', remoteConnectionInfo)
    this.createConnection(TransportType.sfu, Direction.downstream, remoteConnectionInfo)

    //check do we have a upstream connection open
    //for sfu -> sfu
    //for mcu -> sfu

    if (remoteConnectionInfo.getType() === "sfu") {
      if (this.isSfuUpStreamConnectionOpen() === false) {
        this.createConnection(TransportType.sfu, Direction.upstream)
      }
    } else if (remoteConnectionInfo.getType() === "mcu") {
      console.log('onRemoteUpstreamConnectionOpen: MCU not yet implemented')
    }

    // var isMcuUpStreamConnectionOpen = false;
    // for (var connectionId in this.upstreamConnections) {
    //   let connection = this.upstreamConnections[connectionId]
    //   if (connection.type === "mcu") {
    //     isMcuUpStreamConnectionOpen = true;
    //     break;
    //   }
    // }
  }

  onRemoteUpstreamConnectionClose (remoteConnectionInfo) {
    console.log('onRemoteUpstreamConnectionClose', 'TODO', remoteConnectionInfo)
  }

  onPeerConnectionOffer (peerConnectionOffer) {
    console.log('onPeerConnectionOffer', 'not implemented')
  }
}

Channel.propTypes = {
  client: PropTypes.object,
  channelId: PropTypes.string
}

Channel.defaultProps = {
}

export default withLocalMedia(Channel)
