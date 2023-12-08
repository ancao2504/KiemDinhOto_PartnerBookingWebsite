import React, { useState } from 'react'
import { VIHCLE_TYPES } from 'constants/global'
import { Form, Input, Button, DatePicker, message, Spin, Radio, Tag, Row, Col, Modal, Result } from 'antd'
import UserVihcleService from 'services/userVihcleService'
import { DATE_DISPLAY_FORMAT } from 'constants/dateFormats'
import moment from 'moment'
import { USER_VEHICLE_ERROR } from 'constants/errorMessage'
import DefaultButton from 'components/elements/button'

function InspectionExtensionRetrieveInfo({ setData, data, setStep }) {
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dataVehicle, setDataVehicle] = useState(data.vehicle)
  const [form] = Form.useForm()

  const refreshDataVehicle = () => {
    UserVihcleService.getDetailVihcle({ id: dataVehicle.appUserVehicleId }).then((res) => {
      if (res.isSuccess) {
        setDataVehicle(res.data)
        setVisible(true)
      }
    })
  }

  const onFinish = (values) => {
    if (values.certificateSeries === dataVehicle.certificateSeries) {
      message.warn('Vui lòng điền thông tin mới nhất')
    } else {
      setIsLoading(true)
      UserVihcleService.updateVihcle({
        id: dataVehicle.appUserVehicleId,
        data: {
          certificateSeries: values.certificateSeries,
          vehicleExpiryDate: values.vehicleExpiryDate.format('DD/MM/YYYY')
        }
      })
        .then((result) => {
          const { isSuccess, message: rsMess } = result
          if (!isSuccess) {
            message.warn('Cập nhật thất bại! ' + USER_VEHICLE_ERROR[rsMess])
          } else {
            refreshDataVehicle()
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white" style={{ maxWidth: 600, margin: 'auto', padding: '10px 15px' }}>
        <div className="loading">
          <Spin />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white" style={{ maxWidth: 600, margin: 'auto', padding: '10px 15px' }}>
      <div className="mb-3">
        {dataVehicle.extendLicenseUrl ? (
          <Button type="link" href={dataVehicle.extendLicenseUrl} target="_blank">
            <i>Xem giấy gia hạn</i>
          </Button>
        ) : (
          <i className="ant-form-item-explain ant-form-item-explain-error">Phương tiện chưa được gia hạn</i>
        )}
      </div>
      <Form
        form={form}
        layout="vertical"
        className="custom-form form-heigh-booking-car"
        name="form"
        onFinish={onFinish}
        fields={[
          {
            name: ['licensePlate'],
            value: dataVehicle.vehicleIdentity
          },
          {
            name: ['vehicleExpiryDate'],
            value: dataVehicle.vehicleExpiryDate ? moment(dataVehicle.vehicleExpiryDate, DATE_DISPLAY_FORMAT) : ''
          },
          {
            name: ['vihcleId'],
            value: dataVehicle
          },
          {
            name: ['vehicleType'],
            value: parseInt(dataVehicle.vehicleType)
          },
          {
            name: ['licensePlateColor'],
            value: { WHITE: 1, BLUE: 2, YELLOW: 3, RED: 1 }[dataVehicle.vehiclePlateColor]
          },
          {
            name: ['certificateSeries'],
            value: dataVehicle.certificateSeries
          }
        ]}>
        <Form.Item
          label="Phương tiện"
          name="licensePlate"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập'
            }
          ]}>
          <Input type="text" size="large" disabled />
        </Form.Item>
        <Form.Item
          name="vehicleExpiryDate"
          label="Ngày hết hạn"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập'
            }
          ]}>
          <DatePicker format={DATE_DISPLAY_FORMAT} placeholder="Chọn hết hạn" />
        </Form.Item>
        <Form.Item
          className="radio-label"
          label="Màu nền biển số"
          name="licensePlateColor"
          rules={[
            {
              required: true,
              message: <div className="message">Vui lòng nhập</div>
            }
          ]}>
          <Radio.Group disabled={true} style={{ width: '100%' }}>
            <Row span={12}>
              <Col span={8} className="mgbt-20">
                <Radio value={1}>
                  <Tag className="plate-tag white" color="#fffff">
                    Trắng
                  </Tag>
                </Radio>
              </Col>
              <Col span={8} className="mgbt-20">
                <Radio value={2}>
                  <Tag className="plate-tag" color="#0050B3">
                    Xanh
                  </Tag>
                </Radio>
              </Col>
              <Col span={8} className="mgbt-20">
                <Radio value={3}>
                  <Tag className="plate-tag" color="#FFC53D">
                    Vàng
                  </Tag>
                </Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          className="radio-label ps-23"
          label="Loại phương tiện"
          name="vehicleType"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập'
            }
          ]}>
          <Radio.Group disabled={true} style={{ width: '100%' }}>
            <Row>
              {VIHCLE_TYPES.map((e) => (
                <Col span={24} className="mgbt-20" key={e.value}>
                  <Radio value={e.value}>{e.label}</Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="certificateSeries"
          extra={
            <i className="ant-form-item-explain ant-form-item-explain-error">
              Vui lòng nhập đầy đủ và chính xác thông tin theo giấy đăng kiểm (GCN) mới nhất để tra cứu thông tin
            </i>
          }
          label="Số tem GCN mới nhất"
          className="ps-40"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value === dataVehicle.certificateSeries || value === '-') {
                  return Promise.reject('Vui lòng nhập số tem GCN mới nhất')
                } else {
                  return Promise.resolve()
                }
              }
            }
          ]}>
          <Input
            placeholder="Ví dụ: KA-7461980"
            type="text"
            onInput={(event) => (event.target.value = event.target.value.toUpperCase())}
            size="large"
          />
        </Form.Item>

        <div className="w-100 d-flex justify-content-center">
          <DefaultButton className="mgt-15" colorType="dark" title="Tra cứu" action={form.submit} />
        </div>
      </Form>
      <Modal
        visible={visible}
        title=""
        footer={<></>}
        onOk={() => window.open(dataVehicle.extendLicenseUrl, '_blank')}
        onCancel={() => setStep('Service')}>
        <Result
          status={dataVehicle.extendLicenseUrl ? 'success' : 'warning'}
          title="Cập nhật thông tin thành công!"
          subTitle={dataVehicle.extendLicenseUrl ? '' : 'Tuy nhiên phương tiện chưa được gia hạn'}
          extra={[
            dataVehicle.extendLicenseUrl ? (
              <Button type="primary" key="console">
                Xem giấy gia hạn ngay
              </Button>
            ) : (
              <></>
            ),
            <Button key="buy" onClick={() => setStep('Service')}>
              Quay lại
            </Button>
          ]}
        />
      </Modal>
    </div>
  )
}

export default InspectionExtensionRetrieveInfo
