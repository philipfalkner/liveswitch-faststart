import { Component } from 'react'
import PropTypes from 'prop-types'
import fmLiveswitch from 'fm.liveswitch'

class Channel extends Component {
  constructor(props) {
    super(props)

    this.iceServers = [
      new fmLiveswitch.IceServer('stun:turn.frozenmountain.com:3478'),
      new fmLiveswitch.IceServer('turn:turn.frozenmountain.com:80', 'test', 'pa55w0rd!'),
      new fmLiveswitch.IceServer('turns:turn.frozenmountain.com:443', 'test', 'pa55w0rd!')
    ];

    this.upstreamConnections = {}
    this.downstreamConnections = {}

    this.state = {
      channel: null
    }
  }

  componentDidMount() {
    const { client, channelId, channels } = this.props

    if (client !== null && channelId !== null) {
      this.joinChannel(client, channelId)
    }
  }

  componentDidUpdate(prevProps) {
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
    if (prevProps.channels[channelId] && prevProps.channels[channelId].shouldConnect) {
      prevShouldConnect = prevProps.channels[channelId].shouldConnect
    }
    let shouldConnect = null
    if (channels[channelId] && channels[channelId].shouldConnect) {
      shouldConnect = channels[channelId].shouldConnect
    }
    if (prevShouldConnect != shouldConnect) {
      if (shouldConnect === true) {
        this.openSfuUpStreamConnection()
      } else {
        this.closeAllConnections()
      }
    }
  }

  componentWillUnmount() {
    const { client, channelId } = this.props

    if (client !== null && channelId !== null) {
      this.leaveChannel(client, channelId)
    }
  }

  render() {
    return null
  }

  joinChannel(client, channelId) {
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

      //open sfu upstream connection the moment we join the channel
      // this.openSfuUpStreamConnection();
    },
      (ex) => {
        fmLiveswitch.Log.error(`Failed to join channel ${channelId}`, ex)
      })
  }

  leaveChannel(client, channelId) { // TODO should also be called when window unloads
    this.closeAllConnections();
    client.leave(channelId).then((channel) => {
      this.setState({ channel: null })
      fmLiveswitch.Log.info(`Left channel ${channelId}`)
    },
      (ex) => {
        fmLiveswitch.Log.error(`Failed to leave channel ${channelId}`, ex)
      })
  }

  closeAllConnections(){
    //upstreams

    for (var connectionId in this.upstreamConnections) {
      let connection = this.upstreamConnections[connectionId]
      connection.rawObject.close();
    }    

    //downstreams
    for (var connectionId in this.downstreamConnections) {
      let connection = this.downstreamConnections[connectionId]
      connection.rawObject.close();
    }

    this.upstreamConnections = {};
    this.downstreamConnections = {};
  }

  onMessage(clientInfo, message) {
    console.log('onMessage', clientInfo, message)
  }

  onRemoteClientJoin(remoteClientInfo) {
    console.log('onRemoteClientJoin', remoteClientInfo)
  }

  isSfuUpStreamConnectionOpen(){
    var isSfuUpStreamConnectionOpen = false;
    for (var connectionId in this.upstreamConnections) {
      let connection = this.upstreamConnections[connectionId]
      if (connection.type === "sfu") {
        isSfuUpStreamConnectionOpen = true;
        break;
      }
    }

    return isSfuUpStreamConnectionOpen;
  }

  onRemoteUpstreamConnectionOpen(remoteConnectionInfo) {
    this.openSfuDownStreamConnection(remoteConnectionInfo)

    //check do we have a upstream connection open
    //for sfu -> sfu
    //for mcu -> sfu

    var isSfuUpStreamConnectionOpen = false;
    for (var connectionId in this.upstreamConnections) {
      let connection = this.upstreamConnections[connectionId]
      if (connection.type === "sfu") {
        isSfuUpStreamConnectionOpen = true;
        break;
      }
    }

    var isMcuUpStreamConnectionOpen = false;
    for (var connectionId in this.upstreamConnections) {
      let connection = this.upstreamConnections[connectionId]
      if (connection.type === "mcu") {
        isMcuUpStreamConnectionOpen = true;
        break;
      }
    }

    if (remoteConnectionInfo.getType() === "sfu"){
      if (isSfuUpStreamConnectionOpen === false) {

        // this.props.startLocalMedia().then(() => {
            this.openSfuUpStreamConnection();
          // }).fail((ex) => {
          //   console.log('failed to open upstream connection', ex)
          // })
        }
    }
  }

  onRemoteUpstreamConnectionClose(remoteConnectionInfo) {
    console.log('onRemoteUpstreamConnectionClose', remoteConnectionInfo)
  }

  onPeerConnectionOffer(peerConnectionOffer) {
    console.log('onPeerConnectionOffer', 'not implemented')
    // Not implemented
  }

  openSfuUpStreamConnection(tag) {
    const { client, channelId, localMedia } = this.props
    const { channel } = this.state

    const _this = this

    if (localMedia !== null) {
      var connection = null;
      var dataChannel = null;
      var dataChannelsSupported = false;
      var dataStream = null;

      if (dataChannelsSupported) {
        // dataChannel = this.prepareDataChannel();
        // dataStream = new fmLiveswitch.DataStream(dataChannel);
        // this.dataChannels.push(dataChannel);
      }
      else {
        dataStream = null;
      }

      var audioStream = null;
      var videoStream = null;

      //check to make sure that localMedia has audio and video
      if (localMedia.getAudioTrack() !== null)
        audioStream = new fmLiveswitch.AudioStream(localMedia);

      if (localMedia.getVideoTrack() !== null)
        videoStream = new fmLiveswitch.VideoStream(localMedia);

      connection = channel.createSfuUpstreamConnection(audioStream, videoStream, dataStream);

      if (tag)
        connection.setTag(tag);
      else
        connection.setTag(channel.getId());

      connection.setIceServers(this.iceServers);

      //event handlers
      connection.addOnStateChange((connection) => {
        console.log("Upstream Connection state: " + connection.getState());

        fmLiveswitch.Log.info(connection.getId() + ': SFU upstream connection state is ' +
          new fmLiveswitch.ConnectionStateWrapper(connection.getState()).toString() + '.');

        // Cleanup if the connection closes or fails.
        if (connection.getState() == fmLiveswitch.ConnectionState.Closing ||
          connection.getState() == fmLiveswitch.ConnectionState.Failing) {

          if (connection.getRemoteClosed()) {
            fmLiveswitch.Log.info(connection.getId() + ': Media server closed the connection.');
          }
          //this.logConnectionState(connection, "SFU Upstream");
          // if (dataChannelsSupported) {
          //     dataChannels = dataChannels.filter(element => element !== dataChannel);
          //}

          delete _this.upstreamConnections[connection.getId()];
        }
        else if (connection.getState() == fmLiveswitch.ConnectionState.Failed) {
          // Note: no need to close the connection as it's done for us.
          _this.openSfuUpstreamConnection(tag);
          //this.logConnectionState(connection, "SFU Upstream");
        }
        else if (connection.getState() == fmLiveswitch.ConnectionState.Connected) {
          _this.upstreamConnections[connection.getId()] = {
            rawObject: connection,
            type: connection.getType()
          }
          //this.logConnectionState(connection, "SFU Upstream");
        }
      });

      connection.open();
    }
    else
      console.log("Local Media null, we will not send an upstream");
  }

  closeUpStreamConnection(connectionId){
    var connection = this.upstreamConnections[connection.getId()]
    if (connection !== null)
      connection.rawObject.close();

    delete this.upstreamConnections[connection.getId()];
  }

  openSfuDownStreamConnection (remoteConnectionInfo, tag){
    const { channelId, localMedia, addRemoteMedia, removeRemoteMedia } = this.props
    const { channel } = this.state

    const _this = this

    // Create remote media to manage incoming media.
    var remoteMedia = new fmLiveswitch.RemoteMedia();
    remoteMedia.setAudioMuted(false);
    remoteMedia.setVideoMuted(false);

    // Add the remote video view to the layout.
    if (remoteMedia.getView()) {
      remoteMedia.getView().id = 'remoteView_' + remoteMedia.getId();
    }
    //this.layoutManager.addRemoteView(remoteMedia.getId(), remoteMedia.getView());

    var connection = null;
    var dataChannel = null;
    var dataChannelsSupported = false;
    var dataStream = null;

    if (this.dataChannelsSupported && remoteConnectionInfo.getHasData() != null) {
      //dataChannel = this.prepareDataChannel();
      //dataStream = new fmLiveswitch.DataStream(dataChannel);
    }

    var audioStream = null;
    var videoStream = null;

    if (remoteConnectionInfo.getHasAudio()) {
      audioStream = new fmLiveswitch.AudioStream(localMedia, remoteMedia);
    }

    if (remoteConnectionInfo.getHasVideo() && !this.audioOnly) {
      videoStream = new fmLiveswitch.VideoStream(localMedia, remoteMedia);
    }

    connection = channel.createSfuDownstreamConnection(remoteConnectionInfo, audioStream, videoStream, dataStream);

    if (tag)
      connection.setTag(tag);
    else
      connection.setTag(channel.getId());    

    //this.sfuDownstreamConnections[connection.getId()] = connection;

    // Configure the connection.
    connection.setIceServers(this.iceServers);

    // Monitor the connection state changes.
    connection.addOnStateChange((connection) => {
      console.log("Downstream Connection state: " + connection.getState());

      // fmLiveswitch.Log.info(connection.getId() + ': SFU downstream connection state is ' +
      //   new fmLiveswitch.ConnectionStateWrapper(connection.getState()).toString() + '.');

      // Cleanup if the connection closes or fails.
      if (connection.getState() == fmLiveswitch.ConnectionState.Closing ||
        connection.getState() == fmLiveswitch.ConnectionState.Failing) {

        removeRemoteMedia(channelId, remoteMedia.getId())
        remoteMedia.destroy();
        delete _this.downstreamConnections[connection.getId()];
      }
      else if (connection.getState() == fmLiveswitch.ConnectionState.Failed) {
        // Note: no need to close the connection as it's done for us.
        this.openSfuDownStreamConnection(remoteConnectionInfo, tag);
      }
      else if (connection.getState() == fmLiveswitch.ConnectionState.Connected) {
        _this.downstreamConnections[connection.getId()] = {
          rawObject: connection,
          type: connection.getType()
        }
        addRemoteMedia(channelId, remoteMedia)
      }
    });

    // Open the connection.
    connection.open();

  }

  sendMessage(message, userId){
    //message the channel
    if (!userId)
    {
      this.state.channel.sendMessage(message)
    }
    //message a user
    else{
      this.state.channel.sendUserMessage(userId, message)
    }

  }

}

Channel.propTypes = {
  client: PropTypes.object,
  channelId: PropTypes.string
}

Channel.defaultProps = {
}

export default Channel
