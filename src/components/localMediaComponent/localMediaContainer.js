import { connect } from 'react-redux'
import LocalMedia from './localMediaComponent'
import { startedLocalMedia, stoppedLocalMedia } from '../../modules/Liveswitch/actions'

const mapDispatchToProps = {
  startedLocalMedia,
  stoppedLocalMedia
}

const mapStateToProps = (state) => ({
  targetLocalMediaState: state.liveswitch.targetLocalMediaState
})

export default connect(mapStateToProps, mapDispatchToProps)(LocalMedia)
