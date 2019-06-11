import { connect } from 'react-redux'
import Layout from './layout'
import { openSfuUpstream } from '../../modules/Liveswitch/actions'

const mapDispatchToProps = {
    openSfuUpstream
}

const mapStateToProps = (state) => ({
    channels: state.liveswitch.channels
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
