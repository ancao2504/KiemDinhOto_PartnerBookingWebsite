import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import './index.scss'

function DefaultPageTitle(props) {
  const { title } = props
  const intl = useIntl()
  const t = (t) => intl.formatMessage({ id: t })
  return <div className="default-page-title">{t(title)}</div>
}
export default DefaultPageTitle
