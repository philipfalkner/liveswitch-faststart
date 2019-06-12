import fmLiveswitch from 'fm.liveswitch'

class LocalMediaClient {
  constructor(audioEnabled, videoConfig) {
    videoConfig = {
      width: 800,
      height: 600,
      frameRate: 15,
      ...videoConfig
    }
    this.localMedia = new fmLiveswitch.LocalMedia(
      audioEnabled,
      new fmLiveswitch.VideoConfig(videoConfig.width, videoConfig.height, videoConfig.frameRate))
  }

  start () {
    return this.localMedia.start().then((o) => {
      fmLiveswitch.Log.info('LocalMedia started')
    },
    (ex) => {
      fmLiveswitch.Log.error('LocalMedia failed to start', ex)
    })
  }

  stop () {
    return this.localMedia.stop().then((o) => {
      fmLiveswitch.Log.info('LocalMedia stopped')
    },
    (ex) => {
      fmLiveswitch.Log.error('LocalMedia failed to stop', ex)
    })
  }

  getRawLocalMedia () {
    return this.localMedia
  }
  
  getView () {
    return this.localMedia.getView()
  }
}

export default LocalMediaClient
