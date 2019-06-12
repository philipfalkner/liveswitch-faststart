import * as constants from './constants'

const actionHandlers = {
  [constants.OPEN_UPSTREAM_CONNECTION]: (state, action) => {
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

    return {
      ...state,
      channels: {
        ...state.channels,
        [channelId]: {
          ...state.channels[channelId],
          shouldConnect: false
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
