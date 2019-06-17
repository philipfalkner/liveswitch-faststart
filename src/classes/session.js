import fmLiveSwitch from 'fm.liveswitch'
import Client from './client'
import Channel from './channel'

class Session {

  static SessionType = {
    Private: 0,
    Public: 1,
    Presentation: 2
  }

  constructor({
    sessionId,
    sessionType,
    logLevel,
    gatewayUrl,
    applicationId,
    userId,
    deviceId,
    getClientToken,
    getChannelToken
  }) {
    fmLiveSwitch.Log.registerProvider(new fmLiveSwitch.ConsoleLogProvider(logLevel || fmLiveSwitch.LogLevel.Info))

    this.sessionId = sessionId
    this.sessionType = sessionType
    this.getClientToken = getClientToken
    this.getChannelToken = getChannelToken

    this.client = new Client({
      gatewayUrl,
      applicationId,
      userId,
      deviceId,
      getClientToken
    })
    this.channels = []

    // TODO bubble up media views from Connection to Session
    // so that Session's owner can use them in the DOM

    // TODO add _lots_ of logic to Session, since it's basically
    // the interface between the DOM layout and the underlying
    // channels/connections/media
    // e.g. if a user wants to open a video stream, what channel
    // do they use when there's more than one channel in the session?

    // TODO? if we go with this structure, then we could claim channels
    // as part of registering the client and save a roundtrip to the
    // auth server...
  }

  async start() {
    try {
      await this.client.register()

      switch (this.sessionType) {
        case Session.SessionType.Private:
          this.channels = [
            new Channel({
              client: this.client,
              channelId: `${this.sessionId}-private`,
              getChannelToken: this.getChannelToken
            })
          ]
          break

        case Session.SessionType.Public:
          this.channels = [
            new Channel({
              client: this.client,
              channelId: `${this.sessionId}-public`,
              getChannelToken: this.getChannelToken
            })
          ]
          break

        case Session.SessionType.Presentation:
          this.channels = [
            new Channel({
              client: this.client,
              channelId: `${this.sessionId}-presenter`,
              getChannelToken: this.getChannelToken
            }),
            new Channel({
              client: this.client,
              channelId: `${this.sessionId}-audience`,
              getChannelToken: this.getChannelToken
            })
          ]
          break

        default:
          console.error('Unknown session type', this.sessionType)
      }

      this.channels.forEach(async channel => await channel.join())
    } catch (ex) {
      console.error('Failed to start session', ex)
    }
  }

  async stop() {
    try {
      this.channels.forEach(async channel => await channel.leave())
      this.channels = []

      await this.client.unregister()
    } catch (ex) {
      console.error('Failed to stop session', ex)
    }
  }
}

export default Session
