import React from 'react'
import './index.scss'
import { useLocation } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from '../../assets/icons/arrows.svg'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { PARAM_HEADER_TITLE } from '../../constants/params'
import { smartParseParam } from '../../helper/params'

export default function Header() {
  const location = useLocation()
  const searchparam = location.search
  const params = new URLSearchParams(searchparam)
  const headerTitle = smartParseParam(params.get(PARAM_HEADER_TITLE)) || 'Thông tin lịch hẹn'
  const history = useHistory()
  return (
    <div className="Header">
      <div className="Header_fixed">
        <ArrowLeft onClick={() => history.goBack()} />
        <span>{headerTitle || ''}</span>
        <div className="no_icon"></div>
      </div>
      <div className="Header_padding"></div>
    </div>
  )
}
