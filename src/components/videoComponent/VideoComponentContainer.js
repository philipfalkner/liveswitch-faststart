import { connect } from 'react-redux'
import VideoComponent from './VideoComponent'

const mapDispatchToProps = {
}

const mapStateToProps = (state) => ({
  userInfo: {
    userId: '01010101-0101-0101-0101-010101010101'
  },
  frozenMountainVideoConfiguration: {
    FrozenMountainVideoBaseUrl: 'https://v1.liveswitch.fm:8443/sync', //'https://stage-liveswitch.on.novarihealth.net:8443/sync'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoComponent)
