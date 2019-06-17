import fmLiveSwitch from 'fm.liveswitch'

class Connection {

  static TransportType = {
    P2P: 'p2p',
    SFU: 'sfu',
    MCU: 'mcu'
  }

  static StreamType = {
    Audio: 2 << 0,
    Video: 2 << 1,
    Data: 2 << 2
  }

  static Direction = {
    Send: 2 << 0,
    Receive: 2 << 1
  }

  constructor({
    channel,
    localMedia,
    iceServers,
    transportType,
    streamType,
    direction,
    // TODO replace streamType and direction with `streams`,
    // an array of objects specifying directionality of each
    // stream, e.g. { audio send/receive, video receive }
    tag,
    remoteConnectionInfo
  }) {
    this.localMedia = localMedia
    this.channel = channel
    this.transportType = transportType
    this.streamType = streamType
    this.direction = direction
    this.tag = tag
    this.remoteConnectionInfo = remoteConnectionInfo

    if (iceServers && iceServers.length > 0) {
      this.iceServers = iceServers.map((iceServer) => {
        return new fmLiveSwitch.IceServer(iceServer.uri, iceServer.username, iceServer.password)
      })
    }

    this.connection = null
    this.audioStream = null
    this.videoStream = null
    this.dataStream = null

    this.localMedia = null
    this.remoteMedia = null

    this.dataChannelsSupported = false // TODO determine if data channels are supported
  }

  validateConfiguration() {
    switch (this.transportType) {
      case Connection.TransportType.P2P:
        console.error('Unimplemented transport type', this.transportType)
        return false

      case Connection.TransportType.SFU:
        switch (this.direction) {
          case Connection.Direction.Send:
            return true
          case Connection.Direction.Receive:
            return true
          default:
            console.error('Invalid direction for SFU transport', this.direction)
            return false
        }

      case Connection.TransportType.MCU:
        switch (this.direction) {
          case Connection.Direction.Send | Connection.Direction.Receive:
            return true
          case Connection.Direction.Send:
            return true
          case Connection.Direction.Receive:
            return true
          default:
            console.error('Invalid direction for MCU transport', this.direction)
            return false
        }

      default:
        console.error('Invalid transport type', this.transportType)
        return false
    }
  }

  async connect() {
    return new Promise(async () => {
      if (!this.validateConfiguration()) {
        this.reject()
      }

      try {
        if (this.streamType | Connection.StreamType.Audio ||
          this.streamType | Connection.StreamType.Video) {

          if (this.direction | Connection.Direction.Receive) {
            // Prepare remote media
            this.remoteMedia = new fmLiveSwitch.RemoteMedia()
            this.remoteMedia.setAudioMuted(false) // TODO obey direction
            this.remoteMedia.setVideoMuted(false)
          }

          if (this.direction | Connection.Direction.Send) {
            // Fetch local media
            this.localMedia = await this.localMedia.start()

            if (this.localMedia.getAudioTrack() !== null) {
              this.audioStream = new fmLiveSwitch.AudioStream(this.localMedia, this.remoteMedia)
            }

            if (this.localMedia.getVideoTrack() !== null) {
              this.audioStream = new fmLiveSwitch.VideoStream(this.localMedia, this.remoteMedia)
            }
          }
        }

        if (this.streamType | Connection.StreamType.Data) {
          if (!this.dataChannelsSupported) {
            console.warn('Requested data channel, but data channels are not supported')
          } else {
            console.warn('Requested data channel, but data channels are not yet implemented')
            // dataChannel = this.prepareDataChannel()
            // dataStream = new fmLiveSwitch.DataStream(dataChannel)
            // this.dataChannels.push(dataChannel)
          }
        }

        switch (this.transportType) {
          case Connection.TransportType.SFU:
            switch (this.direction) {
              case Connection.Direction.Send:
                this.connection = this.channel.createSfuUpstreamConnection(this.audioStream, this.videoStream, this.dataStream)
                break
              case Connection.Direction.Receive:
                this.connection = this.channel.createSfuDownstreamConnection(this.remoteConnectionInfo, this.audioStream, this.videoStream, this.dataStream)
                break
              default:
                throw `Unsupported direction ${this.direction} for SFU connection`
            }
            break

          case Connection.TransportType.MCU:
            this.connection = this.channel.createMcuConnection(this.audioStream, this.videoStream, this.dataStream)
            break

          default:
            throw `Unsupported transport type ${this.transportType}`
        }

        if (!this.tag) {
          this.tag = this.connection.getId()
        }
        this.connection.setTag(this.tag)

        if (this.iceServers) {
          this.connection.setIceServers(this.iceServers)
        }

        // Event handlers
        this.connection.addOnStateChange(async (connection) => {
          let connectionState = connection.getState()
          console.log(`Connection ${connection.getId()}: ${connection.getType()} connection state changed to ${new fmLiveSwitch.ConnectionStateWrapper(connectionState).toString()}.`)

          switch (connectionState) {
            case fmLiveSwitch.ConnectionState.Closing:
            case fmLiveSwitch.ConnectionState.Failing:
              if (connection.getRemoteClosed()) {
                console.log(`Connection ${connection.getId()}: Remote connection closed.`)
              }
              this.remoteMedia.destroy()
              // TODO this.onDisconnect(this)
              break
            case fmLiveSwitch.ConnectionState.Failed:
              // Note: no need to close the connection as that's already done for us
              // TODO implement retry limits
              await this.connect()
              break
            case fmLiveSwitch.ConnectionState.Connected:
              // TODO this.onConnect(this)
              break
            default:
              break
          }
        })

        this.connection.open()
      } catch (ex) {
        console.error('Failed to open connection', ex)
        this.reject()
      }

      this.resolve()
    })
  }

  disconnect() {
    if (this.connection) {
      console.log(`Connection ${this.connection.getId()}: Disconnecting.`)
      this.connection.close()
    }

    this.audioStream = null
    this.videoStream = null
    this.dataStream = null

    this.localMedia = null
    this.remoteMedia = null
  }
}

export default Connection
