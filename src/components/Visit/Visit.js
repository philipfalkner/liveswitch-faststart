import React, { Component } from 'react'
import querystring from 'querystring'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import VisitHeader from '../VisitHeader'
import ClientComponent from '../clientComponent'
import Channel from '../Channel'
import Layout from '../Layout'
import './Visit.scss'

class Visit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isInChannel: true
    }
  }

  render() {
    const { params } = this.props.match
    const { search } = this.props.location
    const { isInChannel } = this.state
    const { sessionType, role } = querystring.parse(search.substring(1))

    return (
      <Stack verticalFill className='visit'>
        <VisitHeader />
        <button onClick={() => this.toggleChannel()}>
          {isInChannel ? 'Leave Channel' : 'Join Channel'}
        </button>
        <Stack horizontal verticalFill>
          <Stack.Item grow>
            {/* Non-rendering components */}
            <ClientComponent
              gatewayUrl='https://v1.liveswitch.fm:8443/sync' //'https://stage-liveswitch.on.novarihealth.net:8443/sync'
              applicationId='my-app-id'
              userId='01010101-0101-0101-0101-010101010101'>
              {isInChannel && <Channel
                channelId={params.visitId}
                sessionType={sessionType}
                role={role}
              />}
            </ClientComponent>

            {/* Rendering components */}
            <Layout channelId={params.visitId} />
          </Stack.Item>
        </Stack>
      </Stack>
    )
  }

  toggleChannel() {
    this.setState({ isInChannel: !this.state.isInChannel })
  }
}

Visit.propTypes = {
}

Visit.defaultProps = {
}

export default Visit
