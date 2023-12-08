import React from 'react'
import { Form, Input, Button } from 'antd'
import './index.scss'
import { useLocation } from 'react-router-dom'

function BookingPartnerForm({ history, setData, data, listPlate, setListPlate, setStep , step, dataBookingParam }) {
  const location =useLocation()
  const search = location.search
  const params = new URLSearchParams(search)
  const fullName = params.get('name') || ''
  const phoneNumber = params.get('phone') || ''
  const { TextArea } = Input;
  const [form] = Form.useForm()
  const onFinish=(values) => {

    setData((prev) => {
      if (prev) {
        return { ...prev,
          fullnameSchedule:values?.fullName,
          phone:values?.phoneNumber
        }
      } else {
        return { 
          fullnameSchedule:values?.fullName,
          phone:values?.phoneNumber
        }
      }
    })
    setStep('Car')
  }

  return (
    <div className="bg-white" style={{ maxWidth: 600, margin: 'auto' }}>
      <div style={{ padding: '10px 15px'}}>
      <div className="login__title__text text-large" style={{margin:'10px 0 14% 0'}}>
      </div>
      <div>
        <Form
          layout="vertical"
          className="custom-form form-heigh-askadvice"
          name="login"
          autoComplete="new-password"
          initialValues={{
            fullName: dataBookingParam.fullnameSchedule,
            phoneNumber: dataBookingParam.phone,
          }}
          form={form}
          onFinish={(values) => {
            onFinish(values)
          }}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            className="ps-40 mt-3"
            rules={[{ 
              required: true,
              message: 'Vui lòng nhập Họ và tên' 
            },
            {
              message: 'Vui lòng nhập Họ và tên',
              pattern: new RegExp(/^\S/)
            }
            ]}>
            <Input
              className="login__input"
              placeholder="Nguyễn Văn A"
              type="text"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            className="ps-40 mt-3"
            rules={[{ 
              required: true,
              message: 'Vui lòng nhập số điện thoại' 
            },
            {
              message: 'Số điện thoại không hợp lệ',
              pattern: new RegExp(/^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})*$\b/),
            }
            ]}>
            <Input
              className="login__input"
              type="text"
              size="large"
              placeholder="0362548xxx"
            />
          </Form.Item>
          <div className="w-100 d-flex justify-content-center">
            <Button
              className="login__button df ps-40 mt-4"
              type="primary"
              htmlType="submit"
              size="large"
            >
              Tiếp theo
            </Button>
          </div>
        </Form>
      </div>
      </div>
    </div>
  )
}

export default BookingPartnerForm
