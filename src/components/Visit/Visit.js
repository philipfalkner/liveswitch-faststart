import React, { Component } from 'react'
import querystring from 'querystring'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import VisitHeader from '../VisitHeader'
import ClientComponent from '../clientComponent'
import Channel from '../Channel'
import Session from '../Session'
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
    const { sessionType, role, userId } = querystring.parse(search.substring(1))

    return (
      <Stack verticalFill className='visit'>
        <VisitHeader />
        <Stack horizontal verticalFill>
          <Stack.Item grow>
            {/* Non-rendering components */}
            <ClientComponent
              gatewayUrl='https://v1.liveswitch.fm:8443/sync' //'https://stage-liveswitch.on.novarihealth.net:8443/sync'
              applicationId='my-app-id'
              userId={userId}>
              <Channel channelId={params.visitId} />
              <Session sessionType={sessionType} />
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
