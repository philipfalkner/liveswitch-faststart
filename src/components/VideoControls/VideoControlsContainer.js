import { connect } from 'react-redux'
import VideoControls from './VideoControls'
import { startLocalMedia, stopLocalMedia } from '../../modules/Liveswitch/actions'

const mapDispatchToProps = {
  startLocalMedia,
  stopLocalMedia
}

const mapStateToProps = (state) => ({
  currentLocalMediaState: state.liveswitch.currentLocalMediaState,
  targetLocalMediaState: state.liveswitch.targetLocalMediaState,
  localMedia: state.liveswitch.localMedia
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoControls)
