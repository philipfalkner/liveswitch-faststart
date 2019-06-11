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

export const startedLocalMedia = (localMediaVideoElement) => {
  return {
    type: constants.LOCAL_MEDIA_STARTED,
    payload: localMediaVideoElement
  }
}

export const stoppedLocalMedia = () => {
  return {
    type: constants.LOCAL_MEDIA_STOPPED
  }
}
