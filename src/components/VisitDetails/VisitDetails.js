import React from 'react'
import PropTypes from 'prop-types'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import './VisitDetails.scss'

function VisitDetails () {
  return (
    <Stack verticalFill className='visit-details'>
      Tabbed Section
    </Stack>
  )
}

VisitDetails.propTypes = {
  mobile: PropTypes.bool
}

VisitDetails.defaultProps = {
}

export default VisitDetails
