import React, { useState, useEffect } from 'react'
import { Form, Button, Spin } from 'antd'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import UserVihcleService from 'services/userVihcleService'

function InspectionExtensionCar({ setData, setStep }) {
  const [isLoading, setIsLoading] = useState(false)
  const [dataVehicle, setDataVehicle] = useState([])
  const auth = useSelector((state) => state.authReducer)
  const user = auth.data

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 48,
      minHeight: 35,
      fontSize: 14
    })
  }

  const onFinish = (values) => {
    setData((prev) => ({
      ...prev,
      vehicle: JSON.parse(values.vehicleId.value)
    }))
    setStep('RetrieveInfoCar')
  }

  const getVihcle = () => {
    setIsLoading(true)
    UserVihcleService.getListVihcle({
      limit: 500,
      skip: 0,
      filter: {
        appUserId: user?.appUserId
      }
    })
      .then((result) => {
        const { isSuccess, data } = result
        if (isSuccess && data?.data.length > 0) {
          setDataVehicle(data.data)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getVihcle()
  }, [])

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
      <Form layout="vertical" className="custom-form form-heigh-booking-car" name="form" onFinish={onFinish}>
        <Form.Item
          label="Phương tiện"
          name="vehicleId"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập'
            }
          ]}>
          <Select
            className="cs-select"
            isSearchable={true}
            placeholder="Vui lòng chọn phuơng tiện"
            styles={customStyles}
            options={dataVehicle.map((item) => ({
              label: item.vehicleIdentity,
              value: JSON.stringify(item)
            }))}
          />
        </Form.Item>

        <Button
          className="login__button df"
          type="primary"
          htmlType="submit"
          size="large"
          // disabled={
          //     !form.isFieldsTouched(true) ||
          //     form.getFieldsError().filter(({ errors }) => errors.length).length > 0
          // }
        >
          Tiếp theo
        </Button>
      </Form>
    </div>
  )
}

export default InspectionExtensionCar
