import React, { useEffect } from 'react'
import './index.scss'
import { useHistory, useLocation } from 'react-router-dom'
import { MESSAGE_BACK_TO_HOME_MINI_APP, PARAM_URL_IFRAME } from '../../constants/params'

export default function IframeView() {
  const history = useHistory()
  const location = useLocation()
  const searchparam = location.search
  const params = new URLSearchParams(searchparam)
  const urlIframe = params.get(PARAM_URL_IFRAME)
  const urlIframeDecode = urlIframe ? decodeURIComponent(urlIframe) : null
  useEffect(() => {
    if (!urlIframeDecode) return history.replace('/')

    let iframeOrigin

    try {
      iframeOrigin = new URL(urlIframeDecode).origin
    } catch {
      console.warn('Invalid iframe URL:', urlIframeDecode)
      return history.replace('/')
    }

    const listener = (event) => {
      if (event.origin !== iframeOrigin) return

      const data = event?.data

      if (data === MESSAGE_BACK_TO_HOME_MINI_APP || data?.action === MESSAGE_BACK_TO_HOME_MINI_APP || data?.key === MESSAGE_BACK_TO_HOME_MINI_APP) {
        history.replace('/')
      }
    }

    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [urlIframeDecode, history])

  return (
    <div className="IframeView">
      <iframe key={urlIframeDecode} src={urlIframeDecode} width="100%" height="100%" title="iframeView"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
    </div>
  )
}
