import React from 'react'
import PropTypes from 'prop-types'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import './layout.scss'

function Layout(props) {
  return (
    <Stack verticalFill className='video-layout'>
      <Stack horizontal verticalFill>
        <Stack.Item grow>
          <button onClick={() => { props.openSfuUpstream(props.channelId) }}>Send SFU Upstream</button>
          <button onClick={() => { props.closeAllConnections(props.channelId) }}>Close Connections</button>
        </Stack.Item>
      </Stack>
      <Stack horizontal verticalFill>
        <Stack vertical>
          {renderRemoteMedias(props)}
        </Stack>
        <Stack vertical>
          {/* local media */}
        </Stack>
      </Stack>
    </Stack>
  )
}

function renderRemoteMedias(props) {
  let channel = props.channels && props.channels[props.channelId]
  let remoteMedias = channel && channel.remoteMedias && Object.values(channel.remoteMedias)

  return (
    <div>
      {remoteMedias && remoteMedias.map((remoteMedia, i) => {
        return (
          <Stack.Item grow>
            test
            <div style={{overflow: 'auto', border: '1px black'}}
              key={i}
              ref={nodeElement => (nodeElement && remoteMedia && remoteMedia.mediaObject && nodeElement.appendChild(remoteMedia.mediaObject.getView()))}
            />
          </Stack.Item>
        )
      })}
    </div>
  )
}

Layout.propTypes = {
  openSfuUpstream: PropTypes.func,
  channels: PropTypes.object,
  channelId: PropTypes.string
}

Layout.defaultProps = {
}

export default Layout
