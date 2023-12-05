import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import './index.scss'
const PopupMessage = (props) => {
  const {
    isModalOpen, 
    onClose,
    text = 'Xử lý thất bại, vui lòng liên hệ CSKH để được hỗ trợ',
    children,
    buttonText = 'Xác nhận',
    type = ''
  } = props
  return (
    <div >
      <Modal title={type}  visible={isModalOpen}  onCancel={false}
      footer ={<Button className='btn-ok' onClick={onClose}>{buttonText}</Button>}
      className="popup-message"
      style={{
        top: 20,
        maxWidth:'350px',
        textAlign:'center'
      }}
      >
      <div dangerouslySetInnerHTML={{ __html:text }}>
        {children}
      </div>
      </Modal>
    </div>
  )
}

export default PopupMessage
