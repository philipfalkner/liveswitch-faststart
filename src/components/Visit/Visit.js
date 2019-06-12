import React from 'react'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import VisitHeader from '../VisitHeader'
import VideoComponent from '../videoComponent'
import ClientComponent from '../clientComponent'
import LocalMedia from '../localMediaComponent'
import Channel from '../Channel'
import VideoControls from '../VideoControls'
import Layout from '../Layout'
import './Visit.scss'
import fmLiveswitch from 'fm.liveswitch'
import querystring from 'querystring'

function Visit(props) {
  const { params } = props.match
  const { search } = props.location
  const { sessionType, role } = querystring.parse(search.substring(1))

  return (
    <Stack verticalFill className='visit'>
      <VisitHeader />
      <Stack horizontal verticalFill>
        <Stack.Item grow>
          {/* <VideoComponent
            isVideoCall
            channelId={params.visitId} /> */}

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
          <LocalMedia 
            videoConfig = {new fmLiveswitch.VideoConfig(800, 600, 15)}>
          </LocalMedia>

          {/* Rendering components */}
          <VideoControls />
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
