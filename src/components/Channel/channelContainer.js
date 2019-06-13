import { connect } from 'react-redux'
import Channel from './Channel'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  channels: state.liveswitch.channels
})

export default connect(mapStateToProps, mapDispatchToProps)(Channel)
