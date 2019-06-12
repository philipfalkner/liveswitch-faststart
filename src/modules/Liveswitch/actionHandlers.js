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

    return {
      ...state,
      channels: {
        ...state.channels,
        [channelId]: {
          ...state.channels[channelId],
          shouldConnect: true
        }
      }
    }
  },
  [constants.CLOSE_ALL_CONNECTIONS]: (state, action) => {
    const channelId = action.payload

    let newState = { ...state }
    let newChannels = { ...newState.channels }
    let newChannel = { ...newChannels[channelId] }

    newChannel.shouldConnect = false

    newChannels[channelId] = newChannel
    newState.channels = newChannels
    return newState
  },
  [constants.ADD_REMOTE_MEDIA]: (state, action) => {
    const channelId = action.payload.channelId
    const remoteMedia = action.payload.remoteMedia

    return {
      ...state,
      channels: {
        ...state.channels,
        [channelId]: {
          ...state.channels[channelId],
          remoteMedias: {
            ...(state.channels[channelId] && state.channels[channelId].remoteMedias),
            [remoteMedia.getId()]: {
              mediaObject: remoteMedia
            }
          }
        }
      }
    }
  },
  [constants.REMOVE_REMOTE_MEDIA]: (state, action) => {
    const channelId = action.payload.channelId
    const remoteMediaId = action.payload.remoteMediaId

    let newState = {
      ...state,
      channels: {
        ...state.channels,
        [channelId]: {
          ...state.channels[channelId],
          remoteMedias: {
            ...(state.channels[channelId] && state.channels[channelId].remoteMedias)
          }
        }
      }
    }

    newState.channels[channelId].remoteMedias && delete newState.channels[channelId].remoteMedias[remoteMediaId]
    return newState
  },
  [constants.SEND_MESSAGE]: (state, action) => {
    const channelId = action.payload.channelId
    const message = action.payload.message
    const userId = action.payload.userId

    return {
      ...state,
      channels: {
        ...state.channels,
        [channelId]: {
          ...state.channels[channelId],
          message: {
            messageText: message,
            userId: userId
          }
        }
      }
    }
  }
}

export default actionHandlers
