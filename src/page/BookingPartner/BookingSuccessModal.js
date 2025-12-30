import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import { ReactComponent as SuccessIcon } from './../../assets/icons/success.svg'
import './index.scss'
import { SCHEDULE_TYPE } from '../../constants/serviceOption'
import { PARAM_IS_MINI_APP, PARAM_IS_WEB_VIEW } from '../../constants/params'
import { useLocation } from 'react-router-dom'
import { smartParseParam } from '../../helper/params'
const BookingSuccess = ({ isModalOpen, onClose,setTabKey,setIsModalOpen,scheduleType }) => {
  const consultantTypes = [
    SCHEDULE_TYPE.CONSULTANT_MAINTENANCE,
    SCHEDULE_TYPE.CONSULTANT_INSURANCE,
    SCHEDULE_TYPE.CONSULTANT_RENOVATION,
    SCHEDULE_TYPE.VEHICLE_INSPECTION_CONSULTATION,
    SCHEDULE_TYPE.TRAFFIC_FINE_CONSULTATION,
    SCHEDULE_TYPE.CONSULTANT_TNDS_INSURANCE,
  ]
  const isConsultantType = consultantTypes.includes(scheduleType)
  const location = useLocation()
  const searchparam = location.search
  const params = new URLSearchParams(searchparam)
  const isMiniApp = smartParseParam(params.get(PARAM_IS_MINI_APP))
  const isWebView = smartParseParam(params.get(PARAM_IS_WEB_VIEW))

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
            <div className='mb-4'>
              <div className="mb-2">
                <div className='title-normal text-uppercase m-2'>Đặt lịch thành công</div>
              </div>
              <div>Thông tin đã được chuyển đến tư vấn viên của chúng tôi. Nhân viên tư vấn sẽ sớm liên hệ lại để hỗ trợ tư vấn cho bạn.</div>
            </div>
            <div>
            {isConsultantType && !(isMiniApp || isWebView) && (
              <>
            <p style={{ margin: '15px 0' }}>
                Bạn có thể tham khảo thông tin tại các nhóm, cộng đồng để có câu trả lời nhanh hơn
                </p>
                <Button 
                    type="primary" 
                    block
                    onClick={() => window.open('https://www.facebook.com/groups/940007330455923', '_blank')}
                    style={{ color:'white' }}
                    className='login__button df'
                >
                  Tham gia cộng đồng đăng kiểm
              </Button>
              </>
            )}
              {/* <Button className="login__button df" onClick={()=>handleViewListBooking()} type="primary" htmlType="submit" size="large">
                Xem lịch hẹn
              </Button> */}
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
