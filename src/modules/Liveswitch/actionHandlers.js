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
  }
}

export default actionHandlers
