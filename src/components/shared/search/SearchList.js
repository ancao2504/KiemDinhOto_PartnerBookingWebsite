import React from 'react'
import { Input } from 'antd'

import './SearchList.scss'
const { Search } = Input

function SearchList(props) {
  return <Search {...props} className={props.className + ' SearchList'} />
}

export default SearchList
