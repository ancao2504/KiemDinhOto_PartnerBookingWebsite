
import React from 'react'
import "./index.scss"
import MainLogo from '../MainLogo'

const LoadingPopup = ({type = "full", className, noText}) => { // full và content : toàn màn hình và trong thành phần hiện có, mặc định full
  return (
    <div className={`loadingPopup ${"loadingPopup-" + type} ${className}`}>
      <MainLogo height={60} width={60}></MainLogo>
      <span className='title-very-small'>{!noText ? "Đang tải dữ liệu..." : ""}</span>
    </div>
  )
}

export default LoadingPopup