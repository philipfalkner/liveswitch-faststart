import { connect } from 'react-redux'
import Channel from './Channel'
import { startLocalMedia, stopLocalMedia, addRemoteMedia, removeRemoteMedia } from '../../modules/Liveswitch/actions'

const mapDispatchToProps = {
  startLocalMedia,
  stopLocalMedia,
  addRemoteMedia,
  removeRemoteMedia
}

const mapStateToProps = (state) => ({
  localMedia: state.liveswitch.localMedia,
  channels: state.liveswitch.channels
})

export default connect(mapStateToProps, mapDispatchToProps)(Channel)
