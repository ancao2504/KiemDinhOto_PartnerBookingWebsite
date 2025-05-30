import React from 'react'
import addKeyLocalStorage from '../../helper/localStorage'

function LayoutPage(props) {
  const { Component } = props
  const dataTheme = (JSON.parse(localStorage.getItem(addKeyLocalStorage('dataTheme'))) || {})
  return (
    <>
      <style>{`
        .ant-spin-dot-item {
          background-color: ${dataTheme?.partnerColorButton} !important;
        }
       .ant-input:focus, .ant-input:hover {
          border-color: transparent !important;
        }
        .ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: color-mix(in srgb, ${dataTheme?.partnerColorButton} 10%, transparent);
        }
        .ant-select-selector {
          border-color: transparent !important;
        }
      `}</style>
      <Component {...props} />
    </>
  )
}


export default LayoutPage