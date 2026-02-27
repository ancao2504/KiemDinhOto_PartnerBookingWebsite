import React from 'react'
import { LocalStorageManager, SessionStorageManager } from '../helper/localStorage'
import { getUrlParamValue, smartParseParam } from '../helper/params'
import { PARAM_IS_HEADER_MINI_APP, PARAM_IS_WEB_VIEW, PARAM_REFER_STATION_ID, PARAM_REFER_USER_ID } from '../constants/params'
export const AppParamsContext = React.createContext(null)

const resolveParamsMiniAppSessionStorage = (config) => {
  // 1. param (raw)
  const param = getUrlParamValue(config.paramKey)

  // có param thì lưu session (raw)
  if (param !== null && param !== undefined && config.storageKey) {
    SessionStorageManager.setItem(config.storageKey, param)
  }

  // 2. resolve raw theo thứ tự ưu tiên
  const raw = param ?? SessionStorageManager.getItem(config.storageKey) ?? smartParseParam(process.env?.[config.envKey]) ?? config.defaultValue

  // 3. parse giá trị cuối cùng
  return config.parser ? config.parser(raw) : raw
}

const resolveParamsMiniAppLocalStorage = (config) => {
  // 1. param (raw)
  const param = getUrlParamValue(config.paramKey)

  // có param thì lưu local (raw)
  if (param !== null && param !== undefined && config.storageKey) {
    LocalStorageManager.setItem(config.storageKey, param)
  }

  // 2. resolve raw theo thứ tự ưu tiên
  const raw = param ?? LocalStorageManager.getItem(config.storageKey) ?? smartParseParam(process.env?.[config.envKey]) ?? config.defaultValue

  // 3. parse giá trị cuối cùng
  return config.parser ? config.parser(raw) : raw
}

/* =====================
 * PARAM MINI APP SCHEMA
 * ===================== */
const PARAMS_MINIAPP_SCHEMA_SESSION_STORAGE = {
  isWebView: {
    paramKey: PARAM_IS_WEB_VIEW,
    storageKey: PARAM_IS_WEB_VIEW,
    envKey: undefined,
    defaultValue: false,
    parser: (v) => v === true || v === 1
  },
  isHeaderMiniApp: {
    paramKey: PARAM_IS_HEADER_MINI_APP,
    storageKey: PARAM_IS_HEADER_MINI_APP,
    envKey: undefined,
    defaultValue: false,
    parser: (v) => v === true || v === 1
  },
  referUserId: {
    paramKey: PARAM_REFER_USER_ID,
    storageKey: PARAM_REFER_USER_ID,
    envKey: undefined,
    defaultValue: undefined,
    parser: (v) => v
  },
  referStationId: {
    paramKey: PARAM_REFER_STATION_ID,
    storageKey: PARAM_REFER_STATION_ID,
    envKey: undefined,
    defaultValue: undefined,
    parser: (v) => v
  },
}

const PARAMS_MINIAPP_SCHEMA_LOCAL_STORAGE = {
}

export const AppParamsContextProvider = (props) => {
  const paramsMiniAppSessionStorage = React.useMemo(() => {
    const params = {}

    Object.keys(PARAMS_MINIAPP_SCHEMA_SESSION_STORAGE).forEach((key) => {
      params[key] = resolveParamsMiniAppSessionStorage(PARAMS_MINIAPP_SCHEMA_SESSION_STORAGE[key])
    })

    return params
  }, [])

  const paramsMiniAppLocalStorage = React.useMemo(() => {
    const params = {}

    Object.keys(PARAMS_MINIAPP_SCHEMA_LOCAL_STORAGE).forEach((key) => {
      params[key] = resolveParamsMiniAppLocalStorage(PARAMS_MINIAPP_SCHEMA_LOCAL_STORAGE[key])
    })

    return params
  }, [])

  // pass resolved params through context value
  return React.createElement(
    AppParamsContext.Provider,
    {
      value: {
        ...paramsMiniAppSessionStorage,
        ...paramsMiniAppLocalStorage
      }
    },
    props.children
  )
}
export const useAppParamsContext = () => {
  const context = React.useContext(AppParamsContext)
  if (!context) {
    throw new Error('useAppParamsContext must be used within AppParamsContextProvider')
  }
  return context
}
