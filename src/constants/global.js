import React from 'react'

export const IS_ZALO_MINI_APP = window.APP_CONTEXT === 'zalo-mini-app'

export const SCHEDULE_STATUS_3_0 = [
  {
    label: 'Chưa xác nhận',
    value: 0,
    color: '#ADADAD'
  },
  {
    label: 'Đã xác nhận',
    value: 10,
    color: '#FF7B42'
  },
  {
    label: 'Đã hủy',
    value: 20,
    color: '#424242'
  },
  {
    label: 'Thành công',
    value: 30,
    color: '#34AA44'
  }
]
export const VIHCLE_TYPES_STATE = {
  CAR: 0,
  OTHER_VEHICLES: 10,
  TRAILERS: 20
}
export const PLATE_COLOR=[
  {
    label: 'Trắng',
    value: 1,
  },
  {
    label: 'Xanh',
    value: 2,
  },
  {
    label: 'Vàng',
    value: 3,
  },
  {
    label: 'Đỏ',
    value: 4,
  },
]
export const SCHEDULE_TYPE = [
  {
    label: 'Đăng kiểm xe cũ',
    value: 1,
  },
  {
    label: 'Đăng kiểm xe mới',
    value: 2,
  },
]
export const SCHEDULE_TITLE = {
  [SCHEDULE_TYPE.VEHICLE_INSPECTION]: {
    title: 'Đăng kiểm xe cũ',
    subTitle: 'Dành cho khách hàng đặt lịch để đăng kiểm các xe đã đăng kiểm trước đây'
  },
  [SCHEDULE_TYPE.NEW_VEHICLE_INSPECTION]: {
    title: 'Đăng kiểm xe mới',
    subTitle: 'Dành cho khách hàng đăng kiểm lần đầu - không mang phương tiện đến trạm đăng kiểm'
  },
}
export const SCHEDULE_ERROR = {
  INVALID_STATION: 'Thiếu thông tin trạm',
  INVALID_BOOKING_CONFIG: 'Lịch hẹn đã đầy',
  BOOKING_MAX_LIMITED: 'Lịch hẹn đạt số lượng tối đa',
  UNCONFIRMED_BOOKING_EXISTED: 'Phương tiện của quý khách đã có lịch hẹn. Vui lòng kiểm tra lại!',
  INVALID_DATE: 'Ngày hẹn không hợp lệ',
  BLOCK_USER_BOOKING_SCHEDULE: 'Người dùng bị khóa đặt lịch',
  BOOKING_ON_DAY_OFF: 'Ngày hẹn không đúng',
  BOOKING_ON_SUNDAY: 'Sai thông tin ngày hẹn',
  INVALID_PLATE_NUMBER: 'Biển số xe không hợp lệ',
  INVALID_REQUEST: 'Đặt lịch thất bại',
  MAX_LIMIT_SCHEDULE_BY_USER: 'Số lượng lịch hẹn của người dùng quá giới hạn',
  MAX_LIMIT_SCHEDULE_BY_PHONE: 'Số lượng lịch hẹn của số điện thoại quá giới hạn ',
  MAX_LIMIT_SCHEDULE_BY_PLATE_NUMBER: 'Số lượng lịch hẹn của biển số xe quá giới hạn',
  ALREADY_CANCEL: 'Lịch hẹn đã hủy trước đó',
  BOOKING_MAX_LIMITED_BY_CONFIG: 'Lịch hẹn không được vượt giới hạn',
  BOOKING_MAX_LIMITED: 'Lịch hẹn đạt số lượng tối đa',
  CONFIRMED_BY_STATION_STAFF: 'Đã được trung tâm xác nhận',
  EARLY_BOOKING: ' Không được đặt lịch hẹn sớm hơn 10 ngày so với ngày hết hạn',
  BOOKING_ON_TODAY: 'Đã được trung tâm xác nhận',
  INVALID_VEHICLE_CERTIFICATE: 'Số seri GCN không trùng khớp với BSX',
  BLOCK_BOOKING_BY_PHONE: 'Tài khoản đã bị khóa chức năng đặt lịch',
  BLOCK_BOOKING_BY_LICENSE_PLATE: 'Biển số xe đã bị khóa do đặt lịch quá nhiều',
  MAX_LIMIT_SCHEDULE_BY_VEHICLE_COUNT: 'Số lượng lịch vượt quá giới hạn',
  STATION_NOT_ACCEPT_VEHICLE:'trạm không nhận đặt lịch cho xe trên 16 chỗ',
}