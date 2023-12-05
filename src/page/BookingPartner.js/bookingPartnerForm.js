import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select as SelectAntd } from 'antd'
import BookingService from './../../services/addBookingService'
import { WarningOutlined } from '@ant-design/icons'
import { xoa_dau } from './../../helper/common'
import { DATE_DISPLAY_FORMAT } from '../../constants/dateFormats'
import { changeTime } from '../../helper/changeTime'
import queryString from 'query-string'
import _ from 'lodash'
import moment from 'moment'
import Select from 'react-select'
import { PLATE_COLOR, SCHEDULE_ERROR, SCHEDULE_TYPE } from '../../constants/global'
import PopupMessage from './PopupMessage'


function getContentAutoFill() {
  const dataCompleteForm = queryString.parse(window.location.search)
  if (
    !_.isEmpty(dataCompleteForm) &&
    dataCompleteForm.stationsId &&
    dataCompleteForm.stationArea
  ) {
    return dataCompleteForm
  } else {
    return undefined
  }
}
function BookingPartnerForm({form}) {
  const [customerParam, setCustomerParam] = useState({filter: {} })
  const [errorMessage, setErrorMessage] = useState('')
  const [isModalErrOpen, setIsModalErrOpen] = useState(false)
  const [bookingData, setBookingData] = useState({})
  console.log("BookingPartnerForm ~ bookingData:", bookingData)
  const [listPlate, setListPlate] = useState([])
  const [listStation, setListStation] = useState([])
  const [listBookingTime, setListBookingTime] = useState([])
  const [listStationArea, setListStationArea] = useState([])
  const [listBookingDate, setListBookingDate] = useState([])
  const [vehicleType, setVehicleType] = useState([
    {
      label: 'Xe ô tô con < 9 chỗ',
      value: 1,
    },
    {
      label: 'Xe rơ mooc',
      value: 20,
    },
    {
      label: 'Xe bán tải, phương tiện khác',
      value: 10,
    }
  ])
  const [licensePlateColor, setLicensePlateColor] = useState(PLATE_COLOR)
  const [scheduleTypes, setScheduleTypes] = useState(SCHEDULE_TYPE)
  const [disableBookingDate, setDisableBookingDate] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dateFilter, setDateFilter] = useState({
    stationsId: null,
    startDate: moment().format(DATE_DISPLAY_FORMAT),
    endDate:moment().add(30, 'days').format(DATE_DISPLAY_FORMAT),
    vehicleType: 1
  })
  const [isVisible, setIsVisible] = useState({
    stationsId: false,
    dateSchedule: false,
    time: false
  })
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 48,
      minHeight: 35,
      fontSize: 14
    })
  }
  function getBookingHours(params) {
    setIsVisible((prev) => ({ ...prev, time: true }))
    BookingService.getBookingHours(params)
      .then((data) => {
        let tmp = data || []
        if (tmp.length > 0) {
          tmp.forEach((element) => {
            if(bookingData.stationsId.stationStatus){
              element.disabled = element.scheduleTimeStatus == 0
            }
            element.label = (
              <div className="d-flex ai-c j-sb w-100">
                <span>{changeTime(element.scheduleTime)}</span>
                  <span className="text-primary">
                  {element.scheduleTimeStatus  == 0 ? (element?.totalBookingSchedule ? `${element?.totalBookingSchedule}` : '') : (element?.totalBookingSchedule || element?.totalSchedule ? `${element?.totalBookingSchedule || 0}/${element?.totalSchedule}` : '')}
                  </span>
              </div>
            )
            element.value = element.value
          })
          setListBookingTime(tmp)
        }
      })
      .catch(() => {
        // notification.error('Lấy thông tin thất bại')
        setErrorMessage('Lấy thông tin thất bại.')
        setIsModalErrOpen(true)
      })
      .finally(() => {
        setIsVisible((prev) => ({ ...prev, time: false }))
      })
  }

  function getStationAreas() {
    setIsLoading(true)
    BookingService.getStationAreaList()
      .then((data) => {
        let tmp = data.data || []
        if (tmp.length > 0)
          tmp.forEach((element) => {
            element.label = <div style={{ fontWeight: 'normal' }}>{element.value}</div>
            element.value = element.value
          })
        setListStationArea(tmp)
        setIsLoading(false)
      })
      .catch(() => {
        setErrorMessage('Lấy thông tin thất bại.')
        setIsModalErrOpen(true)
        setIsLoading(false)
      })
  }

  const onFinish = (values) => {
    console.log("onFinish ~ values:", values)
    console.log(form.getFieldsValue())
    setIsVisible(false)
    const newData = {
      licensePlates: values.licensePlates,
      phone: values.phone,
      fullnameSchedule: values.fullnameSchedule,
      email: values.email,
      dateSchedule: values.dateSchedule,
      time: values.time.scheduleTime,
      stationsId: values.stationsId,
      vehicleType:values.vehicleType,
      licensePlateColor: values.licensePlateColor,
      notificationMethod: 'SMS',
      scheduleType: values.scheduleType,
    }

    BookingService.createSchedule(newData).then((result) => {
      const { error: rsMess, statusCode, data } = result
      if (statusCode != 200) {
        setIsModalErrOpen(true)
        if (Object.keys(SCHEDULE_ERROR).includes(rsMess)) {
          setErrorMessage(SCHEDULE_ERROR[rsMess])
        } else {
          setErrorMessage(SCHEDULE_ERROR.INVALID_REQUEST)
        }
      setIsVisible(false)
      } else {
        setIsModalOpen(true)
        setIsModalErrOpen(true)
        setErrorMessage('Đặt lịch thành công')

      }
    })
    setIsVisible(true)
  }


  useEffect(() => {
    if (dateFilter.vehicleType && dateFilter.stationsId) {
      getBookingDate()
    }
  }, [dateFilter])
  function getBookingDate() {
    setIsVisible((prev) => ({ ...prev, dateSchedule: true }))
    BookingService.getBookingDate(dateFilter)
      .then((data) => {
        if(data.length > 0){
          let tmp = data || []
          if (tmp.length > 0) {
            tmp.forEach((element) => {
              if (element.scheduleDateStatus == 0) {
                setDisableBookingDate(false)
                element.disabled = false
              }else{
                setDisableBookingDate(true)
              }
              element.label = (
                <div className="d-flex ai-c j-sb w-100">
                  <span>{element.scheduleDate}</span>
                    <span className="text-primary">
                    {element.scheduleDateStatus == 0 ? (element?.totalBookingSchedule ? `${element?.totalBookingSchedule}` : '') : (element?.totalBookingSchedule || element?.totalSchedule ? `${element?.totalBookingSchedule || 0}/${element?.totalSchedule}` : '')}
                    </span>
                </div>
              )
              element.value = element.scheduleDate
            })
            setListBookingDate(tmp)
          }
        }else{
        setErrorMessage('Không tìm thấy ngày hẹn thích hợp.<br>Vui lòng chọn trạm khác.')
        setIsModalErrOpen(true)
        setBookingData({
          ...bookingData,
          stationsId: null,
          dateSchedule: null,
          time: null
        })
        }
      })
      .catch(() => {
        setErrorMessage('Lấy thông tin thất bại.')
        setIsModalErrOpen(true)
        // notification.error('Lấy thông tin thất bại')
      })
      .finally(() => {
        setIsVisible((prev) => ({ ...prev, dateSchedule: false }))
      })
  }

  useEffect(() => {
    const dataCompleteForm = getContentAutoFill()
    if (customerParam.filter && _.isEmpty(dataCompleteForm)) getStations()
  }, [customerParam])

  function getStations(filter = null, callback = null) {
    filter = filter ? filter : customerParam
    setIsVisible((prev) => ({ ...prev, stationsId: true }))
    BookingService.getStationList(filter)
      .then((data) => {
        setIsVisible((prev) => ({ ...prev, stationsId: false }))
        let tmp = data?.data || []
        if (tmp.length > 0)
          tmp.forEach((element) => {
            const name = `${element.stationCode} - ${element.stationsName}`

            element.label = <div className="text-station-select">{name}</div>
            element.value = element.stationsId
            const textParse = JSON.parse(element?.stationBookingConfig)
            const enableBookingHandler = textParse.some((item) => {
              return item?.enableBooking
            })

            if (!enableBookingHandler) {
              element.disabled = false
              element.label = (
                <div className="text-station-select" style={{display:'flex',flexWrap:'wrap'}}>
                  {name}
                </div>
              )
            }
            if (element.stationStatus == 0) {
              element.disabled = true
              element.label = (
                <div className="text-station-select" style={{ color: 'var(--error-btn-color)',display:'flex',flexWrap:'wrap' }}>
                  {name}
                  <div className="ai-c disable-station" style={{ display: 'inline-flex' }}>
                    <WarningOutlined style={{ margin: '0 5px' }} /> <span>Ngưng hoạt động</span>
                  </div>
                </div>
              )
              return
            } else {
              if (element.availableStatus == 0) {
                element.disabled = false
                element.label = (
                  <div className="text-station-select" style={{display:'flex',flexWrap:'wrap' }}>
                    {name}{' '}
                  </div>
                )
              }
            }
          })

        if (!callback) return setListStation(tmp)
        callback(tmp)
      })
      .catch(() => {
        setIsVisible((prev) => ({ ...prev, stationsId: false }))
        setErrorMessage('Lấy thông tin thất bại.')
        setIsModalErrOpen(true)
        // notification.error('Lấy thông tin thất bại')
      })
  }

  useEffect(() => {
    if (!bookingData?.vntId && !bookingData?.stationsId && !bookingData?.dateSchedule && !bookingData?.time) {
      getStationAreas()
    } else {
      setBookingData({ ...bookingData })
    }
  }, [])

  // useEffect(() => {
  //   const dataCompleteForm = getContentAutoFill()
  //   if (
  //     !_.isEmpty(dataCompleteForm) &&
  //     !bookingData?.vntId &&
  //     !bookingData?.stationsId &&
  //     !bookingData?.dateSchedule &&
  //     !bookingData?.time
  //   ) {
  //     Promise.all([
  //       getStationAreas(),
  //       getStations({
  //         filter: {
  //           stationArea: dataCompleteForm.stationArea || undefined
  //         }
  //       }),
  //       setDateFilter({
  //         ...dateFilter,
  //         stationsId: dataCompleteForm.stationsId,
  //       }),
  //       dataCompleteForm.scheduleDate &&
  //         getBookingHours({
  //           stationsId: dataCompleteForm.stationsId,
  //           date: dataCompleteForm.scheduleDate,
  //           vehicleType: bookingData.vehicleType
  //         })
  //     ]).then(() => {
  //       setBookingData({
  //         vntId: dataCompleteForm.stationArea,
  //         stationsId: dataCompleteForm.stationsId,
  //         dateSchedule: dataCompleteForm.scheduleDate
  //       })
  //       form.setFieldsValue({
  //         vntId: dataCompleteForm.stationArea,
  //         stationsId: dataCompleteForm.stationsId,
  //         dateSchedule: dataCompleteForm.scheduleDate
  //       })
  //     })
  //   }
  // }, [])

  // fix antd select label
  useEffect(() => {
    const dataCompleteForm = queryString.parse(window.location.search)
    const labelSelectEl = document.querySelector('#station .ant-select-selector .ant-select-selection-item')

    if (!_.isEmpty(dataCompleteForm) && listStation && listStation.length > 0 && labelSelectEl?.title) {
      const stationData = listStation.find((_item) => _item.value == dataCompleteForm.stationsId)
      if (stationData) {
        const name = `${stationData.stationCode} - ${stationData.stationsName}`
        labelSelectEl.innerHTML = name
        labelSelectEl.removeAttribute('title')
      }
    }
  }, [listStation])


  return (
    <Form
      name="booking"
      layout="vertical"
      initialValues={{
        scheduleType:bookingData?.scheduleType,
        licensePlateColor:bookingData?.licensePlateColor,
        vehicleType: bookingData?.vehicleType,
        vntId: bookingData?.vntId,
        stationsId: bookingData?.stationsId,
        dateSchedule: bookingData?.dateSchedule,
        time: bookingData?.time
      }}
      form={form}
      onFinish={(values) => {
        onFinish(values)
      }}>
      <Form.Item
        name="fullnameSchedule"
        label="Họ và tên chủ xe"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên'
          }
        ]}>
        <div className="login__input__icon">
          <Input className="login__input" classNames={'booking-input'} placeholder="Nguyễn Văn a" type="text" size="large" />
        </div>
      </Form.Item>
      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          {
            required: true,
            message: 'VD: 0957473xxx'
          },
          {
            pattern: new RegExp(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/),
            message: 'Số điện thoại không hợp lệ'
          },
          {
            min: 10,
            message: 'Số điện thoại quá ngắn'
          },
          {
            max: 11,
            message: 'Số điện thoại quá dài'
          }
        ]}>
        <div className="login__input__icon">
          <Input className="login__input" classNames={'booking-input'} placeholder="Nhập số điện thoại" type="text" size="large" />
        </div>
      </Form.Item>

      <Form.Item
        name="scheduleType"
        label="Tình trạng xe"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn tình trạng xe'
          }
        ]}>
        <div className="login__input__icon">
        <SelectAntd
            className="cs-select ant-custom booking-input"
            isSearchable={true}
            placeholder="Vui lòng chọn tình trạng xe"
            styles={customStyles}
            options={scheduleTypes}
            menuPlacement="top"
            isOptionDisabled={(option) => option.disabled}
            // disabled={!bookingData.stationsId}
            onChange={(values) => {
              form.setFieldsValue({
                scheduleType:values,
                licensePlateColor:null,
                vehicleType: null,
                vntId: null,
                area: null,
                stationsId: null,
                dateSchedule: null,
                time: null
              })
              setBookingData({
              ...bookingData,
              scheduleType:values,
              licensePlateColor:null,
              vehicleType: null,
              vntId: null,
              area: null,
              stationsId: null,
              dateSchedule: null,
              time: null
            })
            }}
          />
        </div>
      </Form.Item>

      <Form.Item name="licensePlates" 
        label="Biển số xe"
        rules={[
            {
              required: true,
              message: 'Vui lòng nhập biển số xe'
            }
          ]}>
        <div className="login__input__icon">
          <Input className="login__input" classNames={'booking-input'} placeholder="59B16856" type="text" size="large" />
        </div>
      </Form.Item>
      <Form.Item
        name="licensePlateColor"
        label="Màu biển số"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn màu biển số'
          },
        ]}>
        <div className="login__input__icon">
          <SelectAntd
            className="cs-select ant-custom booking-input"
            isSearchable={true}
            placeholder="Vui lòng chọn màu biển số"
            styles={customStyles}
            options={licensePlateColor}
            menuPlacement="top"
            defaultValue={bookingData?.licensePlateColor}
            isOptionDisabled={(option) => option.disabled}
            disabled={!bookingData.scheduleType}
            onChange={(values) => {
              console.log("BookingPartnerForm ~ values:", values)
              form.setFieldsValue({
              licensePlateColor:values,
                vehicleType: null,
                vntId: null,
                area: null,
                stationsId: null,
                dateSchedule: null,
                time: null
              })
              setBookingData({
              ...bookingData,
              licensePlateColor:values,
              vehicleType: null,
              vntId: null,
              area: null,
              stationsId: null,
              dateSchedule: null,
              time: null
            })
            }}
          />
        </div>
      </Form.Item>
      <Form.Item
        name="vehicleType"
        label="Chọn loại xe"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn loại xe'
          },
        ]}>
        <div className="login__input__icon">
          <SelectAntd
            className="cs-select ant-custom booking-input"
            isSearchable={true}
            placeholder="Vui lòng chọn loại xe"
            styles={customStyles}
            options={vehicleType}
            menuPlacement="top"
            isOptionDisabled={(option) => option.disabled}
            disabled={!bookingData.licensePlateColor}
            onChange={(values) => {
              form.setFieldsValue({
                vehicleType: values,
                vntId: null,
                area: null,
                stationsId: null,
                dateSchedule: null,
                time: null
              })
              setBookingData({
              ...bookingData,
              vehicleType: values,
              vntId: null,
              area: null,
              stationsId: null,
              dateSchedule: null,
              time: null
            })
            }}
          />
        </div>
      </Form.Item>
      <Form.Item label="Khu vực" name="vntId" rules={[]}>
        <SelectAntd
          className="cs-select ant-custom booking-input"
          filterOption={(input, option) => {
            return xoa_dau((option?.value ?? '').toLowerCase()).includes(xoa_dau(input.toLowerCase()))
          }}
          showSearch
          onChange={(values) => {
            form.setFieldsValue({
              stationsId: null,
              dateSchedule: null,
              time: null
            })
            getStations({
              ...customerParam,
              filter: {
                stationArea: values
              }
            })
            setCustomerParam({
              ...customerParam,
              filter: {
                stationArea: values
              }
            })
            setBookingData({
              ...bookingData,
              vntId: values,
              area: null,
              stationsId: null,
              dateSchedule: null,
              time: null
            })
          }}
          placeholder="Vui lòng chọn khu vực"
          styles={customStyles}
          options={listStationArea}
        />
      </Form.Item>

      <span id="station">
        <Form.Item
          label="Chọn trạm"
          name="stationsId"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập'
            }
          ]}>
          <SelectAntd
            className="cs-select ant-custom booking-input"
            isSearchable={true}
            size="middle"
            placeholder="Vui lòng chọn trạm đăng kiểm"
            style={{
              customStyles,
              ...{
                lineHeight: 48
              }
            }}
            options={listStation}
            menuPlacement="top"
            disabled={!bookingData.vntId || isVisible.stationsId}
            onChange={(values) => {
              form.setFieldsValue({
                dateSchedule: null,
                time: null,
                stationsId: values
              })
              setDateFilter({
                ...dateFilter,
                stationsId: values
              })
              const stationSelected = listStation?.find((e) => e.stationsId == values)
              setBookingData({
                ...bookingData,
                stationsId: stationSelected,
                dateSchedule: null,
                time: null
              })
            }}
          />
        </Form.Item>
      </span>

      <Form.Item
        name="dateSchedule"
        label="Ngày hẹn"
        extra="Khuyến cáo đặt lịch hẹn trước 3 ngày đến hạn kiểm định."
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập'
          }
        ]}>
        <SelectAntd
          className="cs-select ant-custom booking-input"
          isSearchable={true}
          placeholder="Vui lòng chọn ngày hẹn"
          styles={customStyles}
          options={listBookingDate}
          menuPlacement="top"
          isOptionDisabled={(option) => option.disabled}
          disabled={!bookingData.stationsId || isVisible.dateSchedule}
          onChange={(values) => {
            form.setFieldsValue({
              time: null
            })
            const  stationsId  = bookingData.stationsId.stationsId
            if (stationsId && bookingData) {
              getBookingHours({
                stationsId: stationsId,
                date: values,
                vehicleType: bookingData.vehicleType
              })
              setBookingData({
                ...bookingData,
                dateSchedule: values,
                time: null
              })
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label="Giờ hẹn"
        name="time"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập'
          }
        ]}>
        <Select
          className="cs-select schedule-hour booking-input"
          isSearchable={true}
          placeholder="Chọn khung giờ"
          isOptionDisabled={(option) => (
            !disableBookingDate ? '': option.disabled
          )}
          isDisabled={!bookingData.dateSchedule || isVisible.time}
          styles={customStyles}
          defaultValue={bookingData?.time?.scheduleTime}
          options={listBookingTime}
          getOptionValue={(option) => option.label}
          menuPlacement="top"
          onChange={(values) => {
            // form.setFieldsValue({
            //   time: values.scheduleTime
            // })
            setBookingData({
              ...bookingData,
              time: values.scheduleTime
            })
          }}
        />
      </Form.Item>

      <div className="w-100 d-flex justify-content-center mgt-40">
        <Button className="login__button df" type="primary" htmlType="submit" size="large">
          Đặt lịch
        </Button>
      </div>
      {isModalErrOpen &&
      <PopupMessage isModalOpen={isModalErrOpen} onClose={() => {setIsModalErrOpen(false)}} text={errorMessage} ></PopupMessage>
      }
    </Form>
  )
}

export default BookingPartnerForm
