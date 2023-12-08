import { Modal, Select, Spin } from 'antd'
import React, { useMemo, useRef, useState } from 'react'
// import { useSelector } from 'react-redux'
// import UserVihcleService from 'services/userVihcleService'
import debounce from 'lodash/debounce'

let timeoutId
function ChoosingCarModal({ isOpen, onCancel, onOk, listPlate, setListPlate, selectedValue }) {
  // const [selectedItem, setSelectedItem] = useState(null)
  const newArr = [...listPlate]
  const [fetching, setFetching] = useState(false)
  // const [options, setOptions] = useState([])
  const [value, setValue] = useState([])
  const fetchRef = useRef(0)
  localStorage.setItem("Selected_car" , JSON.stringify(selectedValue))
  // const getVihcle = (param) => {
  //   return UserVihcleService.getListVihcle({
  //     limit: 500,
  //     skip: 0,
  //     filter: {},
  //     searchText: param
  //   }).then((result) => {
  //     const { isSuccess, data } = result
  //     if (isSuccess) {
  //       // setSelectedItem(data.data)
  //       const newItem = data.data.map((value) => {
  //         return {
  //           value: JSON.stringify(value),
  //           label: value.vehicleIdentity
  //         }
  //       })
  //       setListPlate(newItem)
  //     }
  //   })
  // }

  const onSearch = (value) => {
    // if (timeoutId) {
    //   clearTimeout(timeoutId)
    // }

    // timeoutId = setTimeout(() => {
    //   if (value.length > 2) {
    //     getVihcle(value)
    //   }
    //   if (value.length <= 0) {
    //     getVihcle('')
    //   }
    // }, 1000)
  }

  return (
    <Modal visible={isOpen} onCancel={onCancel} footer={null} title="Chọn phương tiện kiểm định">
      <div className="ant-form-item-label">Chọn phương tiện:</div>
      <Select
        showSearch
        className="w-100 choose-vehicle"
        filterOption={false}
        optionFilterProp="children"
        onSearch={onSearch}
        value={selectedValue}
        onChange={(value) => {
          onOk(value)
          // setSelectedItem(value)
        }}
        options={listPlate}
      />
    </Modal>
  )
}

export default ChoosingCarModal
