import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import { ReactComponent as SuccessIcon } from './../../assets/icons/success.svg'
import './index.scss'
const BookingSuccess = ({ isModalOpen, onClose,setTabKey,setIsModalOpen }) => {

  const handleViewListBooking=()=>{
    setTimeout(() => {
      setTabKey()
    }, 1000);
    return(
      setIsModalOpen(false),
      setTabKey('bookingList')
      )
  }
  return (
    <>
      <Modal title="" visible={isModalOpen} footer={null} closable={false} className="text-center" onClose={onClose}>
        <div className={'register app-container'} style={{ maxWidth: 600, margin: 'auto', padding:15}}>
          <div className="register-success text-center">
            <SuccessIcon className={'text-center'} />
            <div className="login__title mgt-40">
              <div>Đặt lịch thành công</div>
            </div>
            <div>
              <Button className="login__button df" onClick={()=>handleViewListBooking()} type="primary" htmlType="submit" size="large">
                Xem lịch hẹn
              </Button>
              <Button className="login__button df" onClick={onClose} type="primary" htmlType="submit" size="large">
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default BookingSuccess
