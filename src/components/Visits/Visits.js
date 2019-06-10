import React from 'react'
import { Stack } from 'office-ui-fabric-react/lib-commonjs/Stack'
import Visit from '../Visit'
import { useTranslation, Trans } from 'react-i18next'
import './Visits.scss'

function Visits (props) {
  const { t } = useTranslation()
  return (
    <Stack verticalFill className='visits'>
      Visit List
      <dl>
        <dt>Does i18n work?</dt>
        <dd>{t('test-it-works')}</dd>

        <dt>Does i18n work with tags?</dt>
        <dd>
          <Trans i18nKey="test-tagged-message">
          The final two words have <code>different</code> <strong>formatting</strong> (but without this text).
          </Trans>
        </dd>

        <dt>Does i18n work with singulars and plurals?</dt>
        <dd>
          {RenderSingularPluralTest(3)}
        </dd>
      </dl>
    </Stack>
  )
}

function RenderSingularPluralTest (max) {
  const { t } = useTranslation()
  let list = []

  for (var ctr = 0; ctr < max + 1; ++ctr) {
    list.push(<dt key={`${ctr}-dt`}>{ctr}</dt>)
    list.push(<dd key={`${ctr}-dd`}>{t('test-count-message', { count: ctr })}</dd>)
  }

  return <dl>{list}</dl>
}

Visit.propTypes = {
}

Visit.defaultProps = {
}

export default Visits
