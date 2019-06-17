import fmLiveSwitch from 'fm.liveswitch'
import ConnectionManager from './connectionManager'
import { TransportType, Direction, StreamType } from './connection'

class Channel {

  constructor({
    client,
    channelId,
    getChannelToken
  }) {
    this.client = client
    this.channelId = channelId
    this.getChannelToken = getChannelToken

    this.channel = null
    this.connectionManager = new ConnectionManager()
  }

  async join() {
    try {
      let token = await this.getChannelToken()

      this.channel = await this.client.join(this.channelId, token)

      // Event handlers
      this.channel.addOnMessage(this.onMessage)
      this.channel.addOnRemoteClientJoin(this.onRemoteClientJoin)
      this.channel.addOnRemoteUpstreamConnectionOpen(this.onRemoteUpstreamConnectionJoin)
      this.channel.addOnRemoteUpstreamConnectionClose(this.onRemoteUpstreamConnectionClose)
      this.channel.addOnPeerConnectionOffer(this.onPeerConnectionOffer)

      // Query existing channel details
      this.channel.getRemoteClientInfos().forEach(remoteClientInfo => {

      })

      console.log(`Joined channel ${this.channelId}`)

    } catch (ex) {
      console.error(`Failed to join channel ${this.channelId}`, ex)
    }
  }

  async leave() {
    try {
      // Close all connections before leaving channel
      await this.connectionManager.closeAllConnections()

      await this.client.leave(this.channelId)
      console.log(`Left channel ${this.channelId}`)
    } catch (ex) {
      console.error(`Failed to leave channel ${this.channelId}`, ex)
    }
  }

  sendMessage(message, userId) {
    if (!userId) {
      this.state.channel.sendMessage(message)
    } else {
      this.state.channel.sendUserMessage(userId, message)
    }
  }

  onMessage(clientInfo, message) {
    console.log('onMessage', 'TODO', clientInfo, message)
  }

  onRemoteClientJoin(remoteClientInfo) {
    console.log('onRemoteClientJoin', 'TODO', remoteClientInfo)
  }

  async onRemoteUpstreamConnectionOpen(remoteConnectionInfo) {
    console.log('onRemoteUpstreamConnectionOpen', remoteConnectionInfo)

    if (true) { // TODO check if user has entered video call
      if (this.connectionManager.findConnections({
        transportType: TransportType.MCU,
        direction: Direction.Receive
      })) {
        // Nothing to do: we're already receiving via the MCU downstream
        return
      }

      // TODO obey a policy that comes from somewhere
      // until then, just use the matching transport type
      let connectionSettings = {
        remoteConnectionInfo: remoteConnectionInfo
      }
      connectionSettings.transportType = remoteConnectionInfo.getType()
      if (connectionSettings.transportType === TransportType.SFU) {
        connectionSettings.direction = Direction.Receive
      } else {
        connectionSettings.direction = Direction.Send | Direction.Receive
      }

      // TODO only receive what they're sending
      connectionSettings.streamType = StreamType.Audio | StreamType.Video

      await this.connectionManager.createConnection({
        ...connectionSettings,
        channel: this.channel,
        localMedia: this.localMedia,
        iceServers: this.iceServers,
      })
    }
  }

  async onRemoteUpstreamConnectionClose(remoteConnectionInfo) {
    console.log('onRemoteUpstreamConnectionClose', 'TODO', remoteConnectionInfo)
  }

  async onPeerConnectionOffer(peerConnectionOffer) {
    console.log('onPeerConnectionOffer', 'not implemented')
  }
}

export default Channel
