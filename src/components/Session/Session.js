import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SessionType } from '../../helpers/sessionHelper'

class Session extends Component {
  constructor(props) {
    super(props)

    this.connections = []
  }

  render () {
    const { sessionType } = this.props

    switch (sessionType) {
      case SessionType.private:
        return this.renderPrivateSession()
      case SessionType.public:
        return this.renderPublicSession()
      case SessionType.presentation:
        return this.renderPresentationSession()
      default:
        console.error('Invalid session type', sessionType)
        return null
    }
  }

  renderPrivateSession () {
    return (<div>Private</div>)
  }

  renderPublicSession () {
    return (<div>Public</div>)
  }

  renderPresentationSession () {
    return (<div>Presentation</div>)
  }
}

Session.propTypes = {
  client: PropTypes.object,
  sessionType: PropTypes.string
}

Session.defaultProps = {
}

export default Session
