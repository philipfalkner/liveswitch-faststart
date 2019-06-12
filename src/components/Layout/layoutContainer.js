import { connect } from 'react-redux'
import Layout from './layout'
import { openUpstream, closeAllConnections, sendMessage } from '../../modules/Liveswitch/actions'

const mapDispatchToProps = {
  openUpstream,
  closeAllConnections,
  sendMessage
}

const mapStateToProps = (state) => ({
  channels: state.liveswitch.channels
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
