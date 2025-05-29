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
      `}</style>
      <Component {...props} />
    </>
  )
}


export default LayoutPage