import React from 'react'
import { useIntl } from 'react-intl'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

import './index.scss'

function TopDirection(props) {
  const { title, backurl } = props
  const intl = useIntl()
  const history = useHistory()
  const t = (t) => intl.formatMessage({ id: t })
  return (
    <div className="top-direction po-r">
      <div
        className="back-btn"
        onClick={() => {
          backurl ? history.push(backurl) : history.goBack()
        }}>
        <ArrowLeftOutlined style={{ fontSize: 18, color: 'white' }} />
      </div>
      <div className="title po-a"> {t(title)}</div>
    </div>
  )
}
export default TopDirection
