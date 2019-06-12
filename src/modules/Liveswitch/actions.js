import * as constants from './constants'

export const startLocalMedia = () => {
  return {
    type: constants.LOCAL_MEDIA_START
  }
}

export const stopLocalMedia = () => {
  return {
    type: constants.LOCAL_MEDIA_STOP
  }
}

export const startedLocalMedia = (localMedia) => {
  return {
    type: constants.LOCAL_MEDIA_STARTED,
    payload: localMedia
  }
}

export const stoppedLocalMedia = () => {
  return {
    type: constants.LOCAL_MEDIA_STOPPED
  }
}

export const openUpstream = (channelId) => {
  return {
    type: constants.OPEN_UPSTREAM_CONNECTION,
    payload: channelId
  }
}

export const closeAllConnections = (channelId) => {
  return {
    type: constants.CLOSE_ALL_CONNECTIONS,
    payload: channelId
  }
}

export const addRemoteMedia = (channelId, remoteMedia) => {
  return {
    type: constants.ADD_REMOTE_MEDIA,
    payload: {
      channelId: channelId,
      remoteMedia: remoteMedia
    }
  }
}

export const removeRemoteMedia = (channelId, remoteMediaId) => {
  return {
    type: constants.REMOVE_REMOTE_MEDIA,
    payload: {
      channelId: channelId,
      remoteMediaId: remoteMediaId
    }
  }
}

export const sendMessage = (channelId, message, userId) => {
  return {
    type: constants.SEND_MESSAGE,
    payload: {
      channelId: channelId,
      message: message,
      userId: userId
    }
  }
}