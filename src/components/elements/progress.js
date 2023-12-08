import React from 'react'
import { useIntl } from 'react-intl'
import { Button } from 'antd'

import './index.scss'

function Progress(props) {
  const { color = '#0CE87E', percent = 0 } = props
  return (
    <div className="po-r bg-progress">
      <div className="po-a prg" style={{ backgroundColor: color, width: percent + '%' }}></div>
    </div>
  )
}
export default Progress
