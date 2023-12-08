import React from 'react'
import { Checkbox } from 'antd'
import './checkbox.scss'

function CheckboxConfig(props) {
  return (
    <Checkbox className="custom-checkbox" {...props}>
      {props.children}
    </Checkbox>
  )
}

export default CheckboxConfig
