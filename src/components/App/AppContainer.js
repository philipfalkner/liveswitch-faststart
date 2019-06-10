import { connect } from 'react-redux'
import { getAppConfiguration } from '../../modules/App/actions'
import App from './App'

const mapDispatchToProps = {
  getAppConfiguration
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
