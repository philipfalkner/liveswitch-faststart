import fmLiveSwitch from 'fm.liveswitch'

class Client {

  constructor({
    gatewayUrl,
    applicationId,
    userId,
    deviceId,
    getClientToken
  }) {
    this.getClientToken = getClientToken

    this.client = new fmLiveSwitch.Client(gatewayUrl, applicationId, userId, deviceId)
    this.client.addOnStateChange(this.onClientStateChange)
  }

  async register() {
    try {
      let token = await this.getClientToken()
      await this.client.register(token)
    } catch (ex) {
      console.error('Failed to register client', ex)
    }
  }

  async unregister() {
    try {
      await this.client.unregister()
    } catch (ex) {
      console.error('Failed to unregister client', ex)
    }
  }

  onStateChange(client) {
    let clientState = client.getState()
    console.log(`Client ${client.getId()}: State changed to ${new fmLiveSwitch.ClientStateWrapper(clientState).toString()}.`)

    if (clientState === fmLiveSwitch.ClientState.Unregistered) {
      // Client has failed for some reason:
      // We do not need to `c.closeAll()` as the client handled this for us as part of unregistering.
      // if (!this.unRegistering) {
      //     let self = this
      //     setTimeout(() => {
      //       // Back off our reregister attempts as they continue to fail to avoid runaway process.
      //       if (self.reRegisterBackoff < self.maxRegisterBackoff) {
      //         self.reRegisterBackoff += self.reRegisterBackoff
      //       }

      //       // ReRegister
      //       token = self._generateToken(claims)
      //       self.client.register(token).then((channels: fmLiveswitch.Channel[]) => {
      //         self.reRegisterBackoff = 200 // reset for next time
      //         self.onClientRegistered(channels, incomingMessage, peerLeft, peerJoined, clientRegistered)
      //       })
      //   }, this.reRegisterBackoff)
      }
    }
  }
}

export default Client
