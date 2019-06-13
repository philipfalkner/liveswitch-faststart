import fmLiveswitch from 'fm.liveswitch'
import { connectionType } from '../../helpers/sessionHelper'

export const TransportType = {
  p2p: 0,
  sfu: 1,
  mcu: 2
}

export const Direction = {
  upstream: 0,
  downstream: 1
}

class Connection {
  constructor(props) {
    this.props = {
      onConnect: (id, connection) => {},
      onDisconnect: (id, connection) => {},
      ...props
    }

    this.connection = null;
    this.localMediaStarted = false

    this.iceServers = [
      new fmLiveswitch.IceServer('stun:turn.frozenmountain.com:3478'),
      new fmLiveswitch.IceServer('turn:turn.frozenmountain.com:80', 'test', 'pa55w0rd!'),
      new fmLiveswitch.IceServer('turns:turn.frozenmountain.com:443', 'test', 'pa55w0rd!')
    ];
  }

  connect () {
    const { transportType, direction, connectionInfo } = this.props

    switch (transportType) {
      case TransportType.p2p:
        console.error('P2P transport not implemented')
        break
      case TransportType.sfu:
        switch (direction) {
          case Direction.upstream:
            console.log('Opening upstream SFU connection')
            this.openUpstreamConnection(connectionType.sfu)
            break
          case Direction.downstream:
            console.log('Opening downstream SFU connection')
            this.openSfuDownstreamConnection(connectionInfo)
            break
          default:
            console.error('Invalid direction for SFU', direction)
        }
        break
      case TransportType.mcu:
        console.log('Opening upstream MCU connection')
        this.openUpstreamConnection(connectionType.mcu)
        break
      default:
        console.error('Invalid transport type', transportType)
    }
  }

  disconnect () {
    const { localMedia } = this.props

    this.connection && this.connection.close()

    if (this.localMediaStarted) {
      localMedia.stop()
    }
  }

  openUpstreamConnection (requestedConnectionType, tag) {
    const { channel, localMedia, onConnect, onDisconnect } = this.props

    const _this = this

    localMedia.start().then(() => {
      this.localMediaStarted = true

      const rawLocalMedia = localMedia.getRawLocalMedia()
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
      if (rawLocalMedia.getAudioTrack() !== null) {
        audioStream = new fmLiveswitch.AudioStream(rawLocalMedia);
      }

      if (rawLocalMedia.getVideoTrack() !== null) {
        videoStream = new fmLiveswitch.VideoStream(rawLocalMedia);
      }

      if (requestedConnectionType === connectionType.sfu) {
        this.connection = channel.createSfuUpstreamConnection(audioStream, videoStream, dataStream);
      } else {
        //what method must be invoked to open mcu upstream connection
        this.connection = channel.createMcuConnection(audioStream, videoStream, dataStream);
      }

      if (tag) {
        this.connection.setTag(tag);
      }
      else {
        this.connection.setTag(channel.getId());
      }

      this.connection.setIceServers(this.iceServers);

      //event handlers
      this.connection.addOnStateChange((connection) => {
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
          onDisconnect(_this.props.id, _this)
        }
        else if (connection.getState() == fmLiveswitch.ConnectionState.Failed) {
          // Note: no need to close the connection as it's done for us.
          _this.openUpstreamConnection(requestedConnectionType, tag);
          //this.logConnectionState(connection, "SFU Upstream");
        }
        else if (connection.getState() == fmLiveswitch.ConnectionState.Connected) {
          //this.logConnectionState(connection, "SFU Upstream");
          onConnect(_this.props.id, _this);
        }
      });

      this.connection.open();
    },
      (ex) => {
        console.log('Upstream connection failed: LocalMedia failed to start', ex);
      })
  }

  openSfuDownstreamConnection (remoteConnectionInfo, tag) {
    const { channel, onConnect, onDisconnect, addRemoteMedia, removeRemoteMedia } = this.props
    const rawLocalMedia = this.props.localMedia && this.props.localMedia.getRawLocalMedia()

    const channelId = channel.getId()
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
      audioStream = new fmLiveswitch.AudioStream(rawLocalMedia, remoteMedia);
    }

    if (remoteConnectionInfo.getHasVideo() && !this.audioOnly) {
      videoStream = new fmLiveswitch.VideoStream(rawLocalMedia, remoteMedia);
    }

    this.connection = channel.createSfuDownstreamConnection(remoteConnectionInfo, audioStream, videoStream, dataStream);

    if (tag) {
      this.connection.setTag(tag);
    } else {
      this.connection.setTag(channel.getId());
    }

    // Configure the connection.
    this.connection.setIceServers(this.iceServers);

    // Monitor the connection state changes.
    this.connection.addOnStateChange((connection) => {
      console.log("Downstream Connection state: " + connection.getState());

      // fmLiveswitch.Log.info(connection.getId() + ': SFU downstream connection state is ' +
      //   new fmLiveswitch.ConnectionStateWrapper(connection.getState()).toString() + '.');

      // Cleanup if the connection closes or fails.
      if (connection.getState() == fmLiveswitch.ConnectionState.Closing ||
        connection.getState() == fmLiveswitch.ConnectionState.Failing) {

        removeRemoteMedia(channelId, remoteMedia.getId())
        remoteMedia.destroy();
        onDisconnect(_this.props.id, _this)
      }
      else if (connection.getState() == fmLiveswitch.ConnectionState.Failed) {
        // Note: no need to close the connection as it's done for us.
        this.openSfuDownstreamConnection(remoteConnectionInfo, tag);
      }
      else if (connection.getState() == fmLiveswitch.ConnectionState.Connected) {
        onConnect(_this.props.id, _this)
        addRemoteMedia(channelId, remoteMedia)
      }
    });

    // Open the connection.
    this.connection.open();
  }
}

export default Connection
