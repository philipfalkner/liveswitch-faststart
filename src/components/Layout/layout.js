import React from 'react'
import PropTypes from 'prop-types'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'

function Layout(props) {
  return (
    <Stack verticalFill className='video-layout'>
      <Stack horizontal verticalFill>
        <Stack.Item grow>
          <button onClick={() => { props.openSfuUpstream(props.channelId) }}>Send SFU Upstream</button>
          {renderRemoteMedias(props)}
        </Stack.Item>
      </Stack>
    </Stack>
  )
}

function renderRemoteMedias(props) {
  let channel = props.channels && props.channels[props.channelId]
  console.log('layout - remoteMedia', channel)
  let remoteMedias = channel && channel.remoteMedias && Object.values(channel.remoteMedias)

  return (
    <div>
      {remoteMedias && remoteMedias.map((remoteMedia, i) => {
        return <div key={i} ref={nodeElement => (nodeElement && remoteMedia && remoteMedia.mediaObject && nodeElement.appendChild(remoteMedia.mediaObject.getView()))}></div>
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
