import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as guidHelpers from '../../helpers/guidHelpers'
import fmLiveswitch from 'fm.liveswitch'

class ClientComponent extends Component {
  constructor(props) {
    super(props)

    //needs to be in a liveswitch component
    fmLiveswitch.Log.registerProvider(new fmLiveswitch.ConsoleLogProvider(fmLiveswitch.LogLevel.Info))

    this.state = {
      client: null
    }
  }

  componentDidMount() {
    const { gatewayUrl, applicationId, userId } = this.props
    var deviceId = guidHelpers.generateGuid()

    var client = new fmLiveswitch.Client(gatewayUrl, applicationId, userId, deviceId)

    //event handlers for state change for client
    client.addOnStateChange((client) => {
      if (client.getState() === fmLiveswitch.ClientState.Registering) {
        fmLiveswitch.Log.info("client is registering")
      }
      else if (client.getState() === fmLiveswitch.ClientState.Registered) {
        fmLiveswitch.Log.info("client is registered")
      }
      else if (client.getState() === fmLiveswitch.ClientState.Unregistering) {
        fmLiveswitch.Log.info("client is unregistering")
      }
      else if (client.getState() === fmLiveswitch.ClientState.Unregistered) {
        fmLiveswitch.Log.info("client is unregistered")
        //For uncontrolled disconnects, you might want to reconnect automatically
        // Client has failed for some reason:
        // We do not need to `c.closeAll()` as the client handled this for us as part of unregistering.
        // if (!this.unRegistering) {
        //     let self = this
        //     setTimeout(function () {

        //         // Back off our reregister attempts as they continue to fail to avoid runaway process.
        //         if (self.reRegisterBackoff < self.maxRegisterBackoff) {
        //             self.reRegisterBackoff += self.reRegisterBackoff
        //         }

        //         // ReRegister
        //         token = self._generateToken(claims)
        //         self.client.register(token).then((channels: fmLiveswitch.Channel[]) => {
        //             self.reRegisterBackoff = 200 // reset for next time
        //             self.onClientRegistered(channels, incomingMessage, peerLeft, peerJoined, clientRegistered)
        //         })
        //     }, this.reRegisterBackoff)
        //}
      }
    })



    var token = fmLiveswitch.Token.generateClientRegisterToken(
      applicationId,
      client.getUserId(),
      client.getDeviceId(),
      client.getId(),
      client.getRoles(),
      ["WhyDoWeNeedToBeInAChannel"],
      '--replaceThisWithYourOwnSharedSecret--' // TODO replace this with an auth server
    )

    client.register(token).then((channels) => {
      this.setState({ client: client })

      fmLiveswitch.Log.info('connected to the gateway')
    })
  }

  componentWillUnmount() {
    if (this.client != null) {
      //this.unRegistering = true
      // Unregister with the server.
      return this.client.unregister().then(() => {
        //clientUnregistered()
        fmLiveswitch.Log.info("Disconnected from gateway")
      }).fail(() => {
        fmLiveswitch.Log.error("Failed to disconnect from gateway")
      })
    }
  }

  render() {
    return null
  }
}

ClientComponent.propTypes = {
  gatewayUrl: PropTypes.string,
  applicationId: PropTypes.string,
  userId: PropTypes.string
}

ClientComponent.defaultProps = {
}

export default ClientComponent