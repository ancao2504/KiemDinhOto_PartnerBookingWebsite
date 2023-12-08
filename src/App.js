import './App.css';
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { Spin } from 'antd'
import "./assets/scss/index.scss"
import './bootstrap.min.css'
import './common.scss'
import './inputCommon.scss'
import './selectCommon.scss'
import './tableCommon.scss'
import './modalCommon.scss'
import './buttonCommon.scss'
import './main.scss'
import './dropDownCommon.scss'
import { IS_ZALO_MINI_APP } from './constants/global';
import Layout from './components/Layout';
import Logo from './assets/MAINLOGO.png'
const BookingPartner = React.lazy(() => import('./page/BookingPartner/index'))
const BookingPartnerIframe = React.lazy(() => import('./page/Booking/index'))
const BookingHistory = React.lazy(() => import('./page/BookingHistory/index'))

export const routes = {
  home: {
    path: '/',
    component: BookingPartner
  },
  bookingPartnerIframe: {
    path: '/booking-partner-iframe',
    component: BookingPartnerIframe
  },
  // bookingHistory: {
  //   path: '/booking-history',
  //   component: BookingHistory
  // },
}

export const baseName = IS_ZALO_MINI_APP ? `/zapps/${process.env.REACT_APP_ZMP_APP_ID}` : '/'

function App() {
  const themeApp=process.env.REACT_APP_THEME_NAME
  const setThemeApp=()=>{
    document.querySelector('body').setAttribute('data-theme',themeApp)
  }
  useEffect(() => {
    setThemeApp()
  }, [])
  return (
    <>
      <Router export basename={baseName}>
        <Switch>
          {Object.keys(routes).map((key) => {
            return (
              <Route
                key={Math.random()}
                exact
                path={routes[key].path}
                component={(props) => (
                  <React.Suspense
                    fallback={
                      <div className="loading" style={{ background: 'white' }}>
                        <Spin />
                      </div>
                    }>
                    <Layout {...props} Component={routes[key].component} hideMobileMenu={routes[key].hideMobileMenu} />
                  </React.Suspense>
                )}
              />
            )
          })}
        </Switch>
      </Router>
      <div style={{ maxWidth: 600, margin: 'auto', padding: '30px 0',textAlign:'center' }}>
        <div style={{display:'flex',justifyContent:'center'}}>
          <img style={{maxWidth:'40px'}} src={Logo} alt="" />
        </div>
        <div style={{color:'var(--primary-button-color)',marginTop:'0.5rem'}}>Powered by TTDK</div>
      </div>
    </>
  );
}

export default App;
