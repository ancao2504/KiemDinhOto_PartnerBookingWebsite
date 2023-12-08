import React from 'react'
import { Button } from 'antd'
import './Button.scss'

function ButtonShared(props) {
  return (
    <div className="btnShared">
      <Button {...props}>{props.children}</Button>
    </div>
  )
}

export default ButtonShared
