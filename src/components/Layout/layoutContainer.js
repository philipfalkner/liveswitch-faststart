import { connect } from 'react-redux'
import Layout from './layout'
import { openSfuUpstream, closeAllConnections, sendMessage } from '../../modules/Liveswitch/actions'

const mapDispatchToProps = {
    openSfuUpstream,
    closeAllConnections,
    sendMessage
}

const mapStateToProps = (state) => ({
    channels: state.liveswitch.channels,
    localMedia: state.liveswitch.localMedia
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
