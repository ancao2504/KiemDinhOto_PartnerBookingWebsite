import React, { useEffect, useState } from 'react'
import { Form, Input, Button, notification, Checkbox, Tabs, Spin,Tag,Pagination,Empty } from 'antd'
import _ from 'lodash'
import { SCHEDULE_STATUS_3_0, SCHEDULE_TITLE, VIHCLE_TYPES_STATE } from '../../constants/global'
import { changeTime } from '../../helper/changeTime'
import BookingService from './../../services/addBookingService'

const LicensePlateTag = ({ color, licensePlate }) => {
  const plateColor = {
    1: (
      <Tag className="licensePlate-tag white mgl-5" color="#fffff" style={{ color: '#333', borderColor: '#000' }}>
        {licensePlate}
      </Tag>
    ),
    2: (
      <Tag className="licensePlate-tag mgl-5" color="#0050B3">
        {licensePlate}
      </Tag>
    ),
    3: (
      <Tag className="licensePlate-tag mgl-5" color="#FFC53D">
        {licensePlate}
      </Tag>
    ),
    4: (
      <Tag className="licensePlate-tag mgl-5" color="#FF4D4F">
        {licensePlate}
      </Tag>
    )
  }

  return plateColor[color || 1]
}
const ScheduleItem = ({
  licensePlates,
  licensePlateColor,
  dateSchedule,
  stationsName,
  stationsAddress,
  time,
  status,
  vehicleType,
  customerScheduleId,
  scheduleHash,
  scheduleType,
  stationsId,
  chatLinkUserToEmployee
}) => {
  const [isModal, setIsModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const RetunStatus = ({ status }) => {
    let el = _.find(SCHEDULE_STATUS_3_0, { value: status })
    return el ? (
      <div style={{ color: el?.color, fontWeight: 500, fontSize: 14, lineHeight: '15.4px', display: 'inline' }} className="ms-1">
        {el?.label}
      </div>
    ) : (
      <></>
    )
  }

  return (
    <div className="scheduleItem cursor" >
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          {licensePlates && <LicensePlateTag licensePlate={licensePlates} color={licensePlateColor} />}
        </div>
      </div>
      <div>
        <div className="scheduleItem-info">
          <div className="d-flex mt-2 align-items-center inline-content">
            <span className="me-1 scheduleItem-lable">Dịch vụ: </span>
            <div className="scheduleItem-value scheduleItem-href d-inline">
              {SCHEDULE_TITLE[scheduleType] ? SCHEDULE_TITLE[scheduleType].title : 'Đăng kiểm xe'}
            </div>
          </div>
          <div className="d-flex mt-2 align-items-center inline-content">
            <span className="me-1 scheduleItem-lable">Ngày giờ hẹn:</span>
            <div className="scheduleItem-value scheduleItem-black d-inline">
              {changeTime(time?.split('-')[0])}{time && '-'} {dateSchedule}
            </div>
          </div>
          <div className="d-block mt-2 d-flex justify-content-between" style={{gap:'5px',padding:'0 5px'}}>
            <span>
              <span className="me-1 scheduleItem-lable">Tên trạm: </span>
              <a className="scheduleItem-value scheduleItem-href" href="#">
                <span className="scheduleItem-decoration">{stationsName}</span>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between w-100">
        <span className="mb-0">
          Trạng thái:
          <RetunStatus status={status} />
        </span>
      </div>
    </div>
  )
};

function BookingPartnerHistory({ location, onFinish, form }) {

  
  const DEFAULT_FILTER = {
    skip: 0,
    limit: 20,
    filter: {
      // CustomerScheduleStatus: status
    }
  }
  const [filter, setFilter] = useState(DEFAULT_FILTER)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState({ data: [], total: 0 })

  // useEffect(() => {
  //   setFilter((prev) => ({
  //     ...prev,
  //     searchText: search
  //   }))
  //   getData({
  //     ...filter,
  //     searchText: search
  //   })
  // }, [search])
  useEffect(() => {
    getData(filter)
  }, [])
  

  function getData(filter) {
    setLoading(true)
    BookingService.getBookingHistory(filter).then((result) => {
      const { isSuccess, message, data } = result
      setLoading(false)
      if (!isSuccess || !data) {
        //lấy danh sách lỗi không cần show lỗi
        return
      } else {
        setDataList(data)
      }
    })
  }

  if (loading) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Spin />
      </div>
    )
  }

  return (
    <div>
      <div>
        {dataList?.data.map((element, index) => {
          return (
            <ScheduleItem
              key={index}
              {...{
                ...element,
                status: element?.CustomerScheduleStatus
              }}
              scheduleHash={element.scheduleHash}
            />
          )
        })}
      </div>
      <div className="" style={{ maxWidth: 600, margin: 'auto', width: '100%',marginBottom:'60px' }}>
        {(dataList.data.length > 0 && (
          <Pagination
            current={currentPage}
            style={{ textAlign: 'right' }}
            defaultPageSize={filter.limit}
            className='paging'
            simple={true}
            total={dataList.total}
            onChange={(pageCurrent, pageSize) => {
              const skip = (pageCurrent-1) * filter.limit
              const newFilter = {
                ...filter,
                skip
              }
              setCurrentPage(pageCurrent)
              setFilter(newFilter)
              getData(newFilter)
            }}
          />
        )) || <Empty description="Chưa có dữ liệu" />}
      </div>
    </div>
  )
}

export default BookingPartnerHistory
