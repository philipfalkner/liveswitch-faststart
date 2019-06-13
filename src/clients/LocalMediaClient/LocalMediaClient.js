import fmLiveswitch from 'fm.liveswitch'

class LocalMediaClient {
  constructor(audioEnabled, videoConfig) {
    if (audioEnabled === null) {
      audioEnabled = true
    }
    videoConfig = {
      width: 800,
      height: 600,
      frameRate: 15,
      ...videoConfig
    }
    this.localMedia = new fmLiveswitch.LocalMedia(
      audioEnabled,
      new fmLiveswitch.VideoConfig(videoConfig.width, videoConfig.height, videoConfig.frameRate))
    this.usersCount = 0
  }

  start() {
    return this.localMedia.start().then((o) => {
      fmLiveswitch.Log.info('LocalMedia started')
      ++(this.usersCount)
    },
      (ex) => {
        fmLiveswitch.Log.error('LocalMedia failed to start', ex)
      })
  }

  stop() {
    if (this.usersCount > 0) {
      --(this.usersCount)
    }

    if (this.usersCount <= 0) {
      return this.localMedia.stop().then((o) => {
        fmLiveswitch.Log.info('LocalMedia stopped')
        this.usersCount = 0
      },
        (ex) => {
          fmLiveswitch.Log.error('LocalMedia failed to stop', ex)
        })
    }
  }

  isActive() {
    let currentState = this.localMedia.getState()
    if (currentState === fmLiveswitch.LocalMediaState.Starting ||
      currentState === fmLiveswitch.LocalMediaState.Started) {
      return true
    }
    return false
  }

  getRawLocalMedia() {
    return this.localMedia
  }

  getView() {
    return this.localMedia.getView()
  }
}

export default LocalMediaClient
