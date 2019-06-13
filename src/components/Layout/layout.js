import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withLocalMedia from '../LocalMedia'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import './layout.scss'

class Layout extends Component {
  constructor(props) {
    super(props)

    this.childRefs = {}
  }

  render() {
    const { channels, startSession, stopSession, sendMessage, localMedia } = this.props

    console.log('renderLayout', channels)
    return (
      <Stack verticalFill className='video-layout'>
        {channels} {/* TODO add keys */}
        <Stack horizontal>
          <Stack.Item>
            <button onClick={() => { startSession() }}>Send Upstream</button>
          </Stack.Item>
          <Stack.Item>
            <button onClick={() => { stopSession() }}>Close Connections</button>
          </Stack.Item>
        </Stack>
        <Stack vertical>
          <Stack.Item>
            <button onClick={() => sendMessage("Hello!!! This is a message")}>Send Message</button>
          </Stack.Item>
        </Stack>
        <Stack horizontal verticalFill>
          <Stack vertical>
            <div>Remote</div>
            {this.renderRemoteMedias()}
          </Stack>
          <Stack vertical>
            <div>Local</div>
            {localMedia && localMedia.isActive() &&
              <div ref={nodeElement => (nodeElement && nodeElement.appendChild(localMedia.getView()))}></div>}
          </Stack>
        </Stack>
      </Stack>
    )
  }

  renderRemoteMedias() {
    const { remoteMedias } = this.props

    let remoteMediaEntries = Object.values(remoteMedias)

    return (
      <div>
        {remoteMediaEntries && remoteMediaEntries.map((remoteMedia, i) => {
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
}

Layout.propTypes = {
  openSfuUpstream: PropTypes.func,
  channels: PropTypes.array,
  channelId: PropTypes.string
}

Layout.defaultProps = {
}

export default withLocalMedia(Layout)
