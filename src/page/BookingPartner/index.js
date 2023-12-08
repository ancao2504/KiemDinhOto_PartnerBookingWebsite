import React, { useEffect, useState } from 'react'
import { Form, Tabs, Spin } from 'antd'
import './index.scss'
import BookingPartnerHistory from './bookingPartnerHistory'
import BookingPartnerForm from './bookingPartnerForm'

function BookingPartner() {
  const [isVisible, setIsVisible] = useState(false)
  const [nextTab, setNextTab] = useState('partner')
  const [tabKey, setTabKey] = useState()
  const [form] = Form.useForm()

  const handCreateSchedule=()=>{

  }
  return (
    <div className={`partner app-container ${nextTab === 'otp' ? 'py-0 px-2' : 'pd-30-15'}`} style={{ maxWidth: 600, margin: 'auto',padding:'10px' }}>
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
        <Tabs activeKey={nextTab}>
          <Tabs.TabPane tab="" key="partner">
            <div className="h-100">
              <div className="partner-select">
                <Tabs activeKey={tabKey}>
                  <Tabs.TabPane tab="Đặt lịch" key="booking">
                    <BookingPartnerForm setTabKey={setTabKey} onFinish={handCreateSchedule} form={form} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Lịch hẹn" key="bookingList">
                    <BookingPartnerHistory setTabKey={setTabKey} tabKey={tabKey} form={form} />
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}
export default BookingPartner
