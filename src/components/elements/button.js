import React from 'react'
import { Button } from 'antd'

import './index.scss'

function DefaultButton(props) {
  const { title, colorType, width, action, className, subtitle, disabled = false } = props
  const widthSet = width || '100%'
  return (
    <Button
      disabled={disabled}
      className={`custom-df-btn default-btn ${colorType} ${className}`}
      style={{ width: widthSet }}
      onClick={() => {
        action()
      }}>
      {title} {subtitle}
    </Button>
  )
}
export default DefaultButton
