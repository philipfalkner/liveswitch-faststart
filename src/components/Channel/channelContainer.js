import { connect } from 'react-redux'
import Channel from './Channel'
import { addRemoteMedia, removeRemoteMedia } from '../../modules/Liveswitch/actions'

const mapDispatchToProps = {
  addRemoteMedia,
  removeRemoteMedia
}

const mapStateToProps = (state) => ({
  channels: state.liveswitch.channels
})

export default connect(mapStateToProps, mapDispatchToProps)(Channel)
