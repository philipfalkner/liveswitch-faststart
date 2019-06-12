import React, { Component } from 'react'
import LocalMediaContext from '../../contexts/LocalMediaContext'

function withLocalMedia (WrappedComponent) {
  return class WithLocalMedia extends Component {
    render() {
      return (
        <LocalMediaContext.Consumer>
          {localMedia =>
            <WrappedComponent
              {...this.props}
              localMedia={localMedia}
            />
          }
        </LocalMediaContext.Consumer>
      );
    }
  }
}

export default withLocalMedia
