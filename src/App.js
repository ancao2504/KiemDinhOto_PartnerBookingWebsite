import './App.css';
import React, { useEffect } from "react";
import { Spin } from 'antd'
import "./assets/scss/index.scss"

const BookingPartner = React.lazy(() => import('./page/BookingPartner.js'))

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
      <React.Suspense
        fallback={
          <div className="loading" style={{ background: 'white' }}>
            <Spin />
          </div>
        }>
        <div className="App">
          <BookingPartner></BookingPartner>
        </div>
      </React.Suspense>
    </>
  );
}

export default App;
