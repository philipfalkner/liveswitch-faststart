import * as constants from './constants'
import fmLiveswitch from 'fm.liveswitch'

const actionHandlers = {
  [constants.LOCAL_MEDIA_START]: (state, action) => {
    return {
      ...state,
      targetLocalMediaState: fmLiveswitch.LocalMediaState.Started
    }
  },
  [constants.LOCAL_MEDIA_STOP]: (state, action) => {
    return {
      ...state,
      targetLocalMediaState: fmLiveswitch.LocalMediaState.Stopped
    }
  },
  [constants.LOCAL_MEDIA_STARTED]: (state, action) => {
    return {
      ...state,
      currentLocalMediaState: fmLiveswitch.LocalMediaState.Started,
      localMedia: action.payload
    }
  },
  [constants.LOCAL_MEDIA_STOPPED]: (state, action) => {
    return {
      ...state,
      currentLocalMediaState: fmLiveswitch.LocalMediaState.Stopped,
      localMediaVideoElement: null
    }
  },
  [constants.OPEN_SFU_UPSTREAM_CONNECTION]: (state, action) => {
    const channelId = action.payload

    let newState = { ...state }
    let newChannels = { ...newState.channels }
    let newChannel = { ...newChannels[channelId] }

    newChannel.shouldConnect = true

    newChannels[channelId] = newChannel
    newState.channels = newChannels
    return newState
  },
  [constants.ADD_REMOTE_MEDIA]: (state, action) => {
    const channelId = action.payload.channelId
    const remoteMedia = action.payload.remoteMedia

    let newState = { ...state }
    let newChannels = { ...newState.channels }
    let newChannel = { ...newChannels[channelId] }
    let newRemoteMedias = { ...newChannel.remoteMedias }

    newRemoteMedias[remoteMedia.getId()] = {
      mediaObject: remoteMedia
    }

    newChannel.remoteMedias = newRemoteMedias
    newChannels[channelId] = newChannel
    newState.channels = newChannels
    return newState
  }
}

export default actionHandlers
