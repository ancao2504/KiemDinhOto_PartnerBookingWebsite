import React, { useEffect, useState } from 'react'
import { Form, Tabs, Spin } from 'antd'
import BookingService from '../../services/addBookingService'
import './index.scss'
import BookingPartnerHistory from './bookingPartnerHistory'
import BookingPartnerForm from './bookingPartnerForm'
import { useLocation } from 'react-router-dom'
import LoadFormBookingFailed from '../../components/BasicComponent/LoadFormBookingFailed'
import { CheckApiKey } from '../../helper/CheckApiKey'
import { ReactComponent as LogoTTDK } from './../../assets/icons/Logo.svg'
import api from "zmp-sdk";
function BookingPartner() {
  const [isVisible, setIsVisible] = useState(false)
  const [nextTab, setNextTab] = useState('partner')
  const [tabKey, setTabKey] = useState()
  const [zaloUserPhone, setZaloUserPhone] = useState('')
  const [zaloUserName, setZaloUserName] = useState('')
  const [form] = Form.useForm()
  const location = useLocation();
  const searchparam = location.search
  const params = new URLSearchParams(searchparam)
  let apikey = CheckApiKey()

  const getZaloUserPhone=()=>{
    api.getPhoneNumber({
      success: (data) => {
        // xử lý khi gọi api thành công
        const { token } = data;
        if(token){
          handleGetPhoneNumber(token)
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      }
    });
  };
  const handleGetPhoneNumber = async(token) => {
    const accessToken = await api.getAccessToken();
    let headers = {
      access_token: accessToken,
      code: token,
      secret_key: 'Y8vfyoJc7nUtmw72TUOx',
    }
    await BookingService.getZaloUserPhoneNumber(headers).then((result) => {
      console.log("awaitBookingService.getZaloUserPhoneNumber ~ result:", result)
      const { error,data } = result
      if(error){
        console.log('lỗi')
      }else{
        setZaloUserPhone(data?.number)
      }
    })
  }
  const getZaloUserName=()=>{
    api.getUserInfo({
      success: (data) => {
        const { userInfo } = data;
        if(userInfo){
          if(userInfo.name=='User Name'){
            setZaloUserName('')
          }else{
            setZaloUserName(userInfo.name)
          }
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        return
      }
    });
  };
  useEffect(()=>{
    setIsVisible(true)
    if(process.env.REACT_APP_ZALO_AUTH_ENABLE == 1){
      getZaloUserPhone()
      getZaloUserName()
    }
    setTimeout(() => {
      setIsVisible(false)
    }, 1000);
  },[])
  return (
    <>
    {apikey ? 
      (
        <div className={`partner app-container ${nextTab === 'otp' ? 'py-0 px-2' : 'pd-30-15'}`} style={{ maxWidth: 480, margin: 'auto',padding:'10px' }}>
        {isVisible ? (
          <div className="loading">
            <Spin style={{width:'100%'}} />
          </div>
        ):(
          <>
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
                          <BookingPartnerForm zaloUserPhone={zaloUserPhone} zaloUserName={zaloUserName} setTabKey={setTabKey} form={form} />
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
            <div style={{ maxWidth: 600, margin: 'auto', padding: '30px 0',textAlign:'center' }}>
              <div style={{display:'flex',justifyContent:'center'}}>
                <LogoTTDK></LogoTTDK>
              </div>
              <div style={{color:'var(--primary-button-color)',marginTop:'0.5rem'}}>Powered by TTDK</div>
            </div>
          </>
        )
        }
      </div>
      ):
      (
        <>
          <LoadFormBookingFailed></LoadFormBookingFailed>
          <div style={{ maxWidth: 600, margin: 'auto', padding: '30px 0',textAlign:'center' }}>
            <div style={{display:'flex',justifyContent:'center'}}>
              <LogoTTDK></LogoTTDK>
            </div>
            <div style={{color:'var(--primary-button-color)',marginTop:'0.5rem'}}>Powered by TTDK</div>
          </div>
        </>
      )
    }
    </>
  )
}
export default BookingPartner
