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

export const openSfuUpstream = (channelId) => {
  return {
    type: constants.OPEN_SFU_UPSTREAM_CONNECTION,
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
