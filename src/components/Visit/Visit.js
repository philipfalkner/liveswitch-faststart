import React from 'react'
import querystring from 'querystring'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import VisitHeader from '../VisitHeader'
import ClientComponent from '../clientComponent'
import Channel from '../Channel'
import Layout from '../Layout'
import './Visit.scss'

function Visit(props) {
  const { params } = props.match
  const { search } = props.location
  const { sessionType, role } = querystring.parse(search.substring(1))

  return (
    <Stack verticalFill className='visit'>
      <VisitHeader />
      <Stack horizontal verticalFill>
        <Stack.Item grow>
          {/* Non-rendering components */}
          <ClientComponent
            gatewayUrl='https://v1.liveswitch.fm:8443/sync' //'https://stage-liveswitch.on.novarihealth.net:8443/sync'
            applicationId='my-app-id'
            userId='01010101-0101-0101-0101-010101010101'>
            <Channel
              channelId={params.visitId}
              sessionType={sessionType}
              role={role}
            />
          </ClientComponent>

          {/* Rendering components */}
          <Layout channelId={params.visitId} />
        </Stack.Item>
      </Stack>
    </Stack>
  )
}

Visit.propTypes = {
}

Visit.defaultProps = {
}

export default Visit
