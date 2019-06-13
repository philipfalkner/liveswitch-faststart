import React from 'react'
import PropTypes from 'prop-types'
import withLocalMedia from '../LocalMedia'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import './layout.scss'

function Layout(props) {
  return (
    <Stack verticalFill className='video-layout'>
      <Stack horizontal>
        <Stack.Item>
          <button onClick={() => { props.openUpstream(props.channelId) }}>Send Upstream</button>
        </Stack.Item>
        <Stack.Item>
          <button onClick={() => { props.closeAllConnections(props.channelId) }}>Close Connections</button>
        </Stack.Item>
      </Stack>
      <Stack vertical>
        <Stack.Item>
          <button onClick={() => props.sendMessage(props.channelId, "Hello!!! This is a message")}>Send Message</button>
        </Stack.Item>
      </Stack>
      <Stack horizontal verticalFill>
        <Stack vertical>
          <div>Remote</div>
          {renderRemoteMedias(props)}
        </Stack>
        <Stack vertical>
          <div>Local</div>
          {props.localMedia &&
            props.localMedia.isActive() &&
            <div ref={nodeElement => (nodeElement && nodeElement.appendChild(props.localMedia.getView()))}></div>}
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
          <Stack.Item key={remoteMedia.mediaObject.getId()}>
            <div>Id: {remoteMedia.mediaObject.getId()}</div>
            <div
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

export default withLocalMedia(Layout)
