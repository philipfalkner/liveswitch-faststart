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
  }
}

export default actionHandlers
