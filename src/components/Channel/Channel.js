import { Component } from 'react'
import PropTypes from 'prop-types'
import fmLiveswitch from 'fm.liveswitch'
import withLocalMedia from '../LocalMedia'
import Connection, { TransportType, Direction } from './Connection'
import { ChannelType, ParticipantRole } from '../../helpers/sessionHelper'
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
    const { client, channelId, channels, shouldStart } = this.props

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

    if (prevProps.shouldStart !== shouldStart) {
      if (shouldStart === true) {
        this.openUpstream()
      } else if (shouldStart === false) {
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

      //look at channel type and participant role to figure out what to send
      console.log('Channel Type:', this.props.channelType)
      console.log('Participant Role:', this.props.participantRole)

      //open upstream connection the moment we join the channel
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

  openUpstream () {
    const { channelType, participantRole } = this.props

    switch (channelType) {
      case ChannelType.private:
        //depending on number of users pre-assigned to this session, we start a SFU or MCU upstream
        if (true) {
          console.log("Opening SFU upstream")
          this.createConnection(TransportType.sfu, Direction.upstream)
        } else {
          console.log("Opening MCU upstream")
          this.createConnection(TransportType.mcu, Direction.upstream)
        }
        break;

      case ChannelType.public:
        console.log("Opening MCU duplex")
        this.createConnection(TransportType.mcu, Direction.duplex)
        break;

      case ChannelType.presenter:
        switch (participantRole) {
          case ParticipantRole.presenter:
            console.log("Opening SFU upstream")
            this.createConnection(TransportType.sfu, Direction.upstream)
            break
          case ParticipantRole.student:
            console.log('Not opening upstream: audience doesn\'t send upstream in presenter channel')
            break
          default:
            console.error('Invalid participant role', participantRole)
        }
        break
      
      case ChannelType.audience:
        switch (participantRole) {
          case ParticipantRole.presenter:
            console.log('Not opening upstream: presenter doesn\'t send upstream in audience channel')
            break
          case ParticipantRole.student:
            console.log("Opening MCU upstream")
            this.createConnection(TransportType.mcu, Direction.upstream)
            break
          default:
            console.error('Invalid participant role', participantRole)
        }
        break

      default:
        console.error('Invalid channel type', channelType)
    }
  }

  closeAllConnections () {
    this.connections.forEach((connection) => connection.disconnect())
    this.connections = []
  }

  isSfuUpstreamConnectionOpen () {
    var isSfuUpstreamConnectionOpen = !!(this.connections.find((connection) => {
      return connection.props.transportType === TransportType.sfu && connection.props.direction === Direction.upstream
    }));

    return isSfuUpstreamConnectionOpen;
  }

  isMcuDownstreamConnectionOpen () {
    var isMcuDownstreamConnectionOpen = !!(this.connections.find((connection) => {
      return connection.props.transportType === TransportType.mcu && connection.props.direction === Direction.downstream
    }));

    return isMcuDownstreamConnectionOpen;
  }

  isMcuDuplexConnectionOpen () {
    var isMcuDuplexConnectionOpen = !!(this.connections.find((connection) => {
      return connection.props.transportType === TransportType.mcu && connection.props.direction === Direction.duplex
    }));

    return isMcuDuplexConnectionOpen;
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
    const { channelType, participantRole } = this.props
    
    console.log('onRemoteUpstreamConnectionOpen', remoteConnectionInfo)

    switch (channelType) {
      case ChannelType.private:
      case ChannelType.public:
        // Just open the same type of connection we just got
        switch (remoteConnectionInfo.getType()) {
          case 'sfu':
            this.createConnection(TransportType.sfu, Direction.downstream, remoteConnectionInfo)
            if (this.isSfuUpstreamConnectionOpen() === false) {
              this.createConnection(TransportType.sfu, Direction.upstream)
            }
            break
          case 'mcu':
            if (this.isMcuDuplexConnectionOpen() === false) {
              this.createConnection(TransportType.mcu, Direction.duplex, remoteConnectionInfo)
            }
            break
          default:
            console.error('Invalid connection type', remoteConnectionInfo)
            break
        }
        break

      case ChannelType.presenter:
        switch (participantRole) {
          case ParticipantRole.presenter:
            // Maybe do a downstream to see other presenters...?
            console.log('Not opening downstream: presenter doesn\'t receive downstream in presenter channel')
            break
          case ParticipantRole.student:
            if (this.isMcuDownstreamConnectionOpen() === false) {
              this.createConnection(TransportType.mcu, Direction.downstream, remoteConnectionInfo)
            }
            break
          default:
            console.error('Invalid participant role', participantRole)
            break
        }
        break

      case ChannelType.audience:
        switch (participantRole) {
          case ParticipantRole.presenter:
            if (this.isMcuDownstreamConnectionOpen() === false) {
              this.createConnection(TransportType.mcu, Direction.downstream, remoteConnectionInfo)
            }
            break
          case ParticipantRole.student:
            console.log('Not opening downstream: audience doesn\'t receive downstream in audience channel')
            break
          default:
            console.error('Invalid participant role', participantRole)
            break
        }
        break

      default:
        console.error('Invalid channel type', channelType)
        break
    }    
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
  channelId: PropTypes.string,
  channelType: PropTypes.number,
  shouldStart: PropTypes.bool
}

Channel.defaultProps = {
}

export default withLocalMedia(Channel)
