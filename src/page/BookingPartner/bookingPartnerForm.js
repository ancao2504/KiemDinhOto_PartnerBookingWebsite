import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select as SelectAntd, Row, Col } from 'antd'
import BookingService from '../../services/addBookingService'
import { WarningOutlined } from '@ant-design/icons'
import { xoa_dau } from '../../helper/common'
import { DATE_DISPLAY_FORMAT } from '../../constants/dateFormats'
import { changeTime } from '../../helper/changeTime'
import queryString from 'query-string'
import _ from 'lodash'
import moment from 'moment'
import Select from 'react-select'
import { PLATE_COLOR, SCHEDULE_TYPE, VEHICLE_SUB_CATEGORY, VEHICLE_SUB_TYPE, VIHCLE_CATEGORY_BUS, VIHCLE_CATEGORY_GROUP, VIHCLE_CATEGORY_MOOC, VIHCLE_CATEGORY_OTO, VIHCLE_CATEGORY_PICKUP, VIHCLE_CATEGORY_SPECIALIZED, VIHCLE_CATEGORY_TRUCK, VIHCLE_TYPES } from '../../constants/global'
import { SCHEDULE_ERROR } from '../../constants/errorMessage'
import PopupMessage from './PopupMessage'
import BookingSuccess from './BookingSuccessModal'
import { useLocation } from 'react-router-dom'
import AreaByIP from '../../services/getAreaByIP'
import addKeyLocalStorage from '../../helper/localStorage'


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
function BookingPartnerForm({form, setTabKey}) {
  const location = useLocation();
  const searchparam = location.search
  const params = new URLSearchParams(searchparam)
  const [customerParam, setCustomerParam] = useState({filter: {} })
  const [errorMessage, setErrorMessage] = useState('')
  const [isModalErrOpen, setIsModalErrOpen] = useState(false)
  const [bookingData, setBookingData] = useState({})
  const [localBookingData, setLocalBookingData] = useState(JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData'))))
  const [listPlate, setListPlate] = useState([])
  const [listStation, setListStation] = useState([])
  const [listBookingTime, setListBookingTime] = useState([])
  const [listStationArea, setListStationArea] = useState([])
  const [listBookingDate, setListBookingDate] = useState([])
  const [licensePlateColor, setLicensePlateColor] = useState(PLATE_COLOR)
  const [scheduleTypes, setScheduleTypes] = useState(SCHEDULE_TYPE)
  const [disableBookingDate, setDisableBookingDate] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleSubCategoryOptions, setVehicleSubCategoryOptions] = useState([])
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
  const [dataBookingParam, setDataBookingParam] = useState({
    licensePlates: localBookingData?.licensePlates || params.get('licenseplates'),
    phone: localBookingData?.phone || params.get('phone'),
    fullnameSchedule: localBookingData?.fullnameSchedule || params.get('name'),
    email: localBookingData?.email || params.get('email'),
    dateSchedule: localBookingData?.dateSchedule || params.get('dateschedule'),
    time: localBookingData?.time?.scheduleTime || params.get('time'),
    stationsId: localBookingData?.stationsId?.stationsId || params.get('stationsid'),
    vehicleType: localBookingData?.vehicleType ||params.get('vehicletype'),
    licensePlateColor: localBookingData?.licensePlateColor || params.get('licenseplatecolor'),
    scheduleType: localBookingData?.scheduleType || params.get('scheduletype'),
    vehicleSubType: localBookingData?.vehicleSubType || params.get('vehiclesubtype'),
    vehicleSubCategory: localBookingData?.vehicleSubCategory || params.get('vehiclesubcategory'),
    vntId: localBookingData?.vntId || params.get('vntid'),
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
            if(bookingData?.stationsId?.stationStatus){
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
  const getAreaByIP = () => {
    AreaByIP.getAreaByIP().then((result) => {
      const { statusCode,data } = result
      if (statusCode == 200) {
        if(data.stationArea){
          setBookingData((prev)=>({
            ...prev,
            vntId:data.stationArea,
          }))
          form.setFieldsValue({
            vntId:data.stationArea,
          })
          getStations({
            filter: {
              stationArea: data.stationArea
            }
          })
        }
      }else{
        getStations({
          filter: {
            stationArea: dataBookingParam?.vntId
          }
        })
      }
      return result
    })
  }

  const onFinish = (values) => {
    setIsVisible(false)
    const newData = {
      licensePlates: values.licensePlates.toUpperCase(),
      phone: values.phone,
      fullnameSchedule: values.fullnameSchedule,
      email: values.email,
      dateSchedule: values.dateSchedule,
      time: values.time.scheduleTime,
      stationsId: values.stationsId,
      vehicleType:bookingData.vehicleType,
      licensePlateColor: values.licensePlateColor,
      notificationMethod: 'SMS',
      scheduleType: values.scheduleType,
      vehicleSubCategory:values.vehicleSubCategory,
      vehicleSubType:values.vehicleSubType,
      // certificateSeries:values.certificateSeries,
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
        localStorage.removeItem(addKeyLocalStorage('bookingData'))
        setTimeout(() => {
          setBookingData({})
          form.resetFields();
          form.setFieldsValue({
            vntId:null,
            dateSchedule: null,
            time: null,
            stationsId: null
          })
        }, 500);
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
  const handleCategory = (evt,vehicleSubCategory) => {
    const categoryOptionsMap = {
      [VEHICLE_SUB_CATEGORY.CAR]: VIHCLE_CATEGORY_OTO,
      [VEHICLE_SUB_CATEGORY.PASSENGER]: VIHCLE_CATEGORY_BUS,
      [VEHICLE_SUB_CATEGORY.TRUCKER]: VIHCLE_CATEGORY_TRUCK,
      [VEHICLE_SUB_CATEGORY.GROUP]: VIHCLE_CATEGORY_GROUP,
      [VEHICLE_SUB_CATEGORY.ROMOOCL]: VIHCLE_CATEGORY_MOOC,
      [VEHICLE_SUB_CATEGORY.CAR_SPECIALIZED]: VIHCLE_CATEGORY_PICKUP,
      [VEHICLE_SUB_CATEGORY.ORTHER]: VIHCLE_CATEGORY_SPECIALIZED,
    };

    const options = categoryOptionsMap[evt];
    if(options){
      setBookingData(prev => ({
        ...prev,
        vehicleSubCategory: vehicleSubCategory||options[0].value,
      }));
      let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
      let localData={
        ...data,
        vehicleSubCategory: dataBookingParam?.vehicleSubCategory || vehicleSubCategory||options[0].value,
      }
      localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
      form.setFieldsValue({
        vehicleSubCategory: vehicleSubCategory||options[0].value,
      })
    }
      setVehicleSubCategoryOptions(options);
  }
  const handleFillData=()=>{
    setBookingData({
      ...bookingData,
      fullnameSchedule:dataBookingParam?.fullnameSchedule|| undefined,
      phone:dataBookingParam?.phone|| undefined,
      scheduleType:Number(dataBookingParam?.scheduleType)|| SCHEDULE_TYPE[0].value,
      licensePlateColor:Number(dataBookingParam?.licensePlateColor)|| PLATE_COLOR[0].value,
      licensePlates:dataBookingParam?.licensePlates|| undefined,
      vehicleType: Number(dataBookingParam?.vehicleType)|| VEHICLE_SUB_TYPE[0].vehicleType,
      vntId: dataBookingParam?.vntId || undefined,
      stationsId: dataBookingParam?.stationsId || undefined,
      dateSchedule: dataBookingParam?.dateSchedule|| undefined,
      time: dataBookingParam?.time || undefined,
      vehicleSubCategory:dataBookingParam?.vehicleSubCategory || VIHCLE_CATEGORY_OTO[0].value,
      vehicleSubType:dataBookingParam?.vehicleSubType || VEHICLE_SUB_TYPE[0].value,
    })
    form.setFieldsValue({
      fullnameSchedule:dataBookingParam?.fullnameSchedule|| undefined,
      phone:dataBookingParam?.phone|| undefined,
      scheduleType:Number(dataBookingParam?.scheduleType)||  SCHEDULE_TYPE[0].value,
      licensePlateColor:Number(dataBookingParam?.licensePlateColor)|| PLATE_COLOR[0].value,
      licensePlates:dataBookingParam?.licensePlates|| undefined,
      vehicleType: Number(dataBookingParam?.vehicleType)|| VEHICLE_SUB_TYPE[0].vehicleType,
      vntId: dataBookingParam?.vntId|| undefined,
      stationsId: dataBookingParam?.stationsId|| undefined,
      dateSchedule: dataBookingParam?.dateSchedule|| undefined,
      time: dataBookingParam?.time || undefined,
      vehicleSubCategory:dataBookingParam?.vehicleSubCategory || VIHCLE_CATEGORY_OTO[0].value,
      vehicleSubType:dataBookingParam?.vehicleSubType || VEHICLE_SUB_TYPE[0].value,
    })
  }

  useEffect(() => {
    getAreaByIP()
    if (!bookingData?.vntId && !bookingData?.stationsId && !bookingData?.dateSchedule && !bookingData?.time) {
      getStationAreas()
    } else {
      setBookingData({ ...bookingData })
    }
  }, [])

  useEffect(() => {
    if(!dataBookingParam.vehicleSubType){
      handleCategory(VEHICLE_SUB_TYPE[0].value)
    }else{
      handleCategory(dataBookingParam.vehicleSubType)
    }
    let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
      let localData={
        ...data,
        vehicleSubCategory:dataBookingParam?.vehicleSubCategory || VIHCLE_CATEGORY_OTO[0].value,
        vehicleSubType:dataBookingParam?.vehicleSubType || VEHICLE_SUB_TYPE[0].value,
        vehicleType: Number(dataBookingParam?.vehicleType)|| VEHICLE_SUB_TYPE[0].vehicleType,
      }
      localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
    const dataCompleteForm = getContentAutoFill()
    if (
      !_.isEmpty(dataCompleteForm) &&
      !bookingData?.vntId &&
      !bookingData?.stationsId &&
      !bookingData?.dateSchedule &&
      !bookingData?.time
    ) {
      Promise.all([
        getStationAreas(),
        getStations({
          filter: {
            stationArea: dataCompleteForm.stationArea || undefined
          }
        }),
        setDateFilter({
          ...dateFilter,
          stationsId: dataCompleteForm.stationsId,
        }),
        dataCompleteForm.scheduleDate &&
          getBookingHours({
            stationsId: dataCompleteForm.stationsId,
            date: dataCompleteForm.scheduleDate,
            vehicleType: bookingData.vehicleType
          })
      ]).then(() => {
        setBookingData({
          vntId: dataCompleteForm.stationArea,
          stationsId: dataCompleteForm.stationsId,
          dateSchedule: dataCompleteForm.scheduleDate
        })
        form.setFieldsValue({
          vntId: dataCompleteForm.stationArea,
          stationsId: dataCompleteForm.stationsId,
          dateSchedule: dataCompleteForm.scheduleDate
        })
      })
    }
  }, [])

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
  useEffect(()=>{
    handleFillData()
    setDateFilter({
      ...dateFilter,
      vehicleType: Number(dataBookingParam?.vehicleType)||  VEHICLE_SUB_TYPE[0].vehicleType,
      stationsId: dataBookingParam?.stationsId || undefined,
    })
    if (dataBookingParam.stationsId && bookingData) {
      getBookingHours({
        stationsId: dataBookingParam?.stationsId,
        date: dataBookingParam?.dateSchedule,
        vehicleType: dataBookingParam?.vehicleType
      })
    }
  },[])
  console.log(form.getFieldsValue())

  return (
    <Form
      name="booking"
      layout="vertical"
      initialValues={{
        // fullname:dataBookingParam?.fullnameSchedule|| undefined,
        // phone:dataBookingParam?.phone|| undefined,
        // scheduleType:Number(dataBookingParam?.scheduleType)|| undefined,
        // licensePlateColor:dataBookingParam?.licensePlateColor|| undefined,
        // licensePlates:dataBookingParam?.licensePlates|| undefined
        // vehicleType: dataBookingParam?.vehicleType|| undefined,
        // vntId: dataBookingParam?.vntId|| undefined,
        // stationsId: dataBookingParam?.stationsId|| undefined,
        // dateSchedule: dataBookingParam?.dateSchedule|| undefined,
        // time: dataBookingParam?.time || undefined,
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
          <Input defaultValue={dataBookingParam?.fullnameSchedule|| undefined}
            className="login__input booking-input"
            placeholder="Nguyễn Văn a" 
            type="text" 
            size="large"
            onInput={(e) => {
              let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
              let localData={
                ...data,
                fullnameSchedule:e.target.value
              }
              localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
            }} />
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
          <Input defaultValue={dataBookingParam?.phone|| undefined} 
            className="login__input booking-input" 
            placeholder="Nhập số điện thoại" 
            type="text" 
            size="large"
            onInput={(e)=>{
              let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
              let localData={
                ...data,
                phone:e.target.value
              }
              localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
            }} />
        </div>
      </Form.Item>

      <Form.Item
        name="scheduleType"
        label="Mục đích đặt hẹn"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn mục đích đặt lịch'
          }
        ]}>
        <div className="login__input__icon">
        <SelectAntd
            className="cs-select ant-custom booking-input"
            isSearchable={true}
            placeholder="Vui lòng chọn mục đích đặt lịch"
            styles={customStyles}
            options={scheduleTypes}
            defaultValue={Number(dataBookingParam?.scheduleType)|| undefined}
            menuPlacement="top"
            isOptionDisabled={(option) => option.disabled}
            value={bookingData.scheduleType}
            // disabled={!bookingData.stationsId}
            onChange={(values) => {
              let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
              let localData={
                ...data,
                scheduleType:values
              }
              localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
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
          <Input defaultValue={dataBookingParam?.licensePlates?.toUpperCase() || undefined} 
            className="login__input booking-input" 
            style={{textTransform:'uppercase'}} 
            placeholder="59B16856" 
            type="text" 
            size="large"
            onInput={(e)=>{
              let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
              let localData={
                ...data,
                licensePlates:e.target.value
              }
              localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
            }} />
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
            value={bookingData.licensePlateColor}
            menuPlacement="top"
            defaultValue={Number(dataBookingParam?.licensePlateColor)|| undefined}
            isOptionDisabled={(option) => option.disabled}
            // disabled={!bookingData?.scheduleType}
            onChange={(values) => {
              let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
              let localData={
                ...data,
                licensePlateColor:values
              }
              localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
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
      <Row className='vehicleType'>
        <Col className='mWidth-100' span={11}>
          <Form.Item
            className="radio-label ps-23"
            label="Loại phương tiện"
            name="vehicleSubType"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập'
              }
            ]}>
            <SelectAntd
                className='cs-select ant-custom booking-input'
                options={VEHICLE_SUB_TYPE}
                defaultValue={Number(dataBookingParam?.vehicleSubType)|| undefined}
                onChange={(values,vehicletype) => {
                  let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
                  let localData={
                    ...data,
                    vehicleSubType:values,
                    vehicleType: vehicletype.vehicleType,
                  }
                  localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
                  handleCategory(values,null)
                  form.setFieldsValue({
                    vehicleType: vehicletype.vehicleType,
                    vehicleSubType: values,
                  })
                  setBookingData({
                    ...bookingData,
                    vehicleType: vehicletype.vehicleType,
                    vehicleSubType: values,
                  })
                  setDateFilter({
                    ...dateFilter,
                    vehicleType: vehicletype.vehicleType,
                  })
                }}
              />
          </Form.Item>
        </Col>
        <Col span={2}></Col>
        <Col className='mWidth-100' span={11}>
          <Form.Item
            className="radio-label ps-23"
            label="Phân loại"
            name="vehicleSubCategory"
            >
            <SelectAntd
              className='cs-select ant-custom booking-input'
              options={vehicleSubCategoryOptions}
              defaultValue={Number(dataBookingParam?.vehicleSubCategory)|| undefined}
              onChange={(values) => {
                let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
                let localData={
                  ...data,
                  vehicleSubCategory:values
                }
                localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
                form.setFieldsValue({
                    vehicleSubCategory: values,
                  })
                  setBookingData({
                    ...bookingData,
                    vehicleSubCategory: values,
                  })
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="certificateSeries"
        extra={'Nhập số seri GCN để được tự động kiểm tra phạt nguội'}
        label={
          <div>
            Số tem GCN mới nhất
            <span
              className="text-important text-very-small text-primary"
              onClick={() =>{
                setIsModalErrOpen(true);
                setErrorMessage('Số seri là dãy số có dạng XXXXXXXX.<br>Số seri có thể được tìm thấy trên tem đăng kiểm hoặc dòng chữ cuối cùng ở trang 1 của sổ / giấy đăng kiểm')
              }}>
              (Tìm số seri)
            </span>
          </div>
          }
        className="ps-40 mt-3"
        rules={[
        ]}>
        <Input
          className="login__input"
          placeholder="Ví dụ: KA-7461980"
          type="text"
          size="large"
          onInput={(event) => {
            event.target.value = event.target.value.toUpperCase()
            let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
            let localData={
              ...data,
              certificateSeries:event.target.value
            }
            localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
          }}
        />
      </Form.Item>
      <Form.Item label="Khu vực" name="vntId" rules={[]}>
        <SelectAntd
          className="cs-select ant-custom booking-input"
          filterOption={(input, option) => {
            return xoa_dau((option?.value ?? '').toLowerCase()).includes(xoa_dau(input.toLowerCase()))
          }}
          showSearch
          disabled={!bookingData.vehicleSubType}
          defaultValue={dataBookingParam.vntId || undefined}
          onChange={(values) => {
            let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
            let localData={
              ...data,
              vntId:values
            }
            localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
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
            defaultValue={dataBookingParam.stationsId || undefined}
            onChange={(values) => {
              console.log("BookingPartnerForm ~ values:", values)
              form.setFieldsValue({
                dateSchedule: null,
                time: null,
                stationsId: values
              })
              setDateFilter({
                ...dateFilter,
                stationsId: values,
              })
              const stationSelected = listStation?.find((e) => e.stationsId == values)
              let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
              let localData={
                ...data,
                stationsId:stationSelected
              }
              localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
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
            let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
            let localData={
              ...data,
              dateSchedule:values
            }
            localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
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
          options={listBookingTime}
          getOptionValue={(option) => option.label}
          menuPlacement="top"
          onChange={(values) => {
            form.setFieldsValue({
              time: values
            })
            let data=JSON.parse(localStorage.getItem(addKeyLocalStorage('bookingData')))
            let localData={
              ...data,
              time:values
            }
            localStorage.setItem(addKeyLocalStorage('bookingData'), JSON.stringify(localData))
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
      <BookingSuccess isModalOpen={isModalOpen} setTabKey={setTabKey} setIsModalOpen={setIsModalOpen} onClose={() => {setIsModalOpen(false);window.location.reload()}}></BookingSuccess>
      {isModalErrOpen &&
      <PopupMessage isModalOpen={isModalErrOpen} onClose={() => {setIsModalErrOpen(false)}} text={errorMessage} ></PopupMessage>
      }
    </Form>
  )
}

export default BookingPartnerForm
