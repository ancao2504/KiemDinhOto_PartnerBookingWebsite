import React, { useState } from 'react'
import { Input, Button, message, Spin, Radio, Modal } from 'antd'
import BookingService from 'services/addBookingService'
import DetailScheduledComponent from 'components/ScheduledDetail'
import { SCHEDULE_ERROR } from 'constants/errorMessage'
import './index.scss'
import BookingSuccess from './BookingSuccessModal'

const { TextArea } = Input

const ConfirmModal = ({ data, history, setStep }) => {
  const [check, setCheck] = useState(false)
  const [error, setError] = useState(false)
  const [reasonNote, setReasonNote] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const handleOK = () => {
    const newData = {
      licensePlates: data.licensePlates,
      phone: data.phone,
      fullnameSchedule: data.fullnameSchedule,
      email: data.email,
      dateSchedule: data.dateSchedule,
      time: data.time,
      stationsId: data.stationsId,
      vehicleType: data.vehicleType,
      scheduleNote: reasonNote || undefined,
      licensePlateColor: data.licensePlateColor,
      notificationMethod: 'SMS',
      scheduleType: data.scheduleType
    }

    if (!check) {
      setError(true)
      return
    }
    setIsVisible(true)
    BookingService.createSchedule(newData).then((result) => {
      const { error: rsMess, statusCode } = result
      if (statusCode != 200) {
        if (Object.keys(SCHEDULE_ERROR).includes(rsMess)) {
          message.warn(SCHEDULE_ERROR[rsMess])
        } else {
          message.warn(SCHEDULE_ERROR.INVALID_REQUEST)
        }
        setStep('Car')
      } else {
        setIsModalOpen(true)
      }
      setIsVisible(false)
    })
  }
  const handleChange = (e) => {
    setCheck(e.target.checked)
    setError(false)
  }

  const handleCloseModal = () => setIsModalOpen(false)

  if (isVisible) {
    return (
      <div className="loading">
        <Spin />
      </div>
    )
  }

  if (!data) {
    return <></>
  }

  return (
    <div className="px-2 form-heigh-booking-car" style={{ maxWidth: 600, margin: 'auto' }}>
      <DetailScheduledComponent data={data} enableEditBtn={true} onEdit={() => setStep('Car')}>
        <div className="d-flex flex-column">
          <TextArea
            rows={4}
            onChange={(e) => {
              setReasonNote(e.target.value)
            }}
            placeholder="Nhập thông tin cần trao đổi cho trung tâm"
            className="mb-1"
          />
          <Radio onChange={handleChange}>
            <p className="fw-bolder">Tôi đã đọc và hiểu các quy định trên</p>
          </Radio>
          {error && <div className="modalConfirm-error">Bạn cần đọc và đồng ý với các quy định trên.</div>}
        </div>
      </DetailScheduledComponent>
      <Button
        type="primary"
        className="py-3 d-flex justify-content-center align-items-center modalConfirm-btn login__button df mgt-30"
        size="large"
        block
        onClick={handleOK}>
        Xác nhận
      </Button>
      <BookingSuccess isModalOpen={isModalOpen} history={history} onClose={handleCloseModal} />
    </div>
  )
}

export default ConfirmModal
