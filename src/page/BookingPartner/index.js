import React, { useEffect, useState } from 'react'
import { Form, Tabs, Spin } from 'antd'
import './index.scss'
import BookingPartnerHistory from './bookingPartnerHistory'
import BookingPartnerForm from './bookingPartnerForm'
import { useLocation } from 'react-router-dom'
import LoadFormBookingFailed from '../../components/BasicComponent/LoadFormBookingFailed'
import { CheckApiKey } from '../../helper/CheckApiKey'

function BookingPartner() {
  const [isVisible, setIsVisible] = useState(false)
  const [nextTab, setNextTab] = useState('partner')
  const [tabKey, setTabKey] = useState()
  const [form] = Form.useForm()
  const location = useLocation();
  const searchparam = location.search
  const params = new URLSearchParams(searchparam)
  let apikey = CheckApiKey()
  const handCreateSchedule=()=>{

  }
  return (
    <>
    {apikey ? 
      (
        <div className={`partner app-container ${nextTab === 'otp' ? 'py-0 px-2' : 'pd-30-15'}`} style={{ maxWidth: 480, margin: 'auto',padding:'10px' }}>
        {isVisible && (
          <div className="loading">
            <Spin />
          </div>
        )}
        <div
          className={`
            partner-container 
            ${nextTab === 'partner' ? 'small' : 'full'}
            ${nextTab === 'success' ? 'd-flex justify-content-center align-items-center' : ''}
            `}>
          {/* <Tabs activeKey={nextTab}>
            <Tabs.TabPane tab="" key="partner">
              <div className="h-100">
                <div className="partner-select">
                  <Tabs activeKey={tabKey}>
                    <Tabs.TabPane tab="Đặt lịch" key="booking"> */}
                    <div className='booking-title title-small'>ĐẶT LỊCH ĐĂNG KIỂM</div>
                    <div className='mt-4'>
                      <BookingPartnerForm setTabKey={setTabKey} onFinish={handCreateSchedule} form={form} />
                    </div>
                    {/* </Tabs.TabPane>
                    <Tabs.TabPane tab="Lịch hẹn" key="bookingList">
                      <BookingPartnerHistory setTabKey={setTabKey} tabKey={tabKey} form={form} />
                    </Tabs.TabPane>
                  </Tabs>
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs> */}
        </div>
      </div>
      ):
      (
        <LoadFormBookingFailed></LoadFormBookingFailed>
      )
    }
    </>
  )
}
export default BookingPartner
