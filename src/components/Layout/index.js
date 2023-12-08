import React from 'react'

function LayoutPage(props) {
  const { Component } = props
  return (
    <>
      <Component {...props} />
    </>
  )
}


export default LayoutPage