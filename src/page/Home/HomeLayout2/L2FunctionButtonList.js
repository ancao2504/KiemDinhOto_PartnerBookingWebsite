import React, { useState } from 'react'
import './index.scss'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useGlobalContext } from './../../../context/GlobalContext'

const L2FunctionButtonList = (props) => {
  const {setSheetVisible, setDataBtn}=props
  const { list ,title,className } = props
  const history = useHistory()
  const { handleGetUserPhone } = useGlobalContext();
  const handleRouter = async (path) => {
    handleGetUserPhone().then(data => {
      history.push(path)
    })
  }
  
  const renderBtns = () => {
    return (
      <div style={{marginBottom:'1rem'}}>
      <div className='text-large title-homelayout' style={{padding:'0 10px'}}>{title}</div>
      <div className={`layout1-btn-booking-section d-flex ai-c ${className}`} style={{ flexWrap: 'wrap'}}>
        {list.map((element, key) => {
          if(element?.unOpen){
            return(
              <div className="layout1-btn-booking-item" onClick={() => handleRouter(element?.link || element?.linkNavigation)}>
                {element.icon ? element.icon : (
                  <img style={{width:'40px',height:'40px',borderRadius:'4px'}} className='mb-2' src={element?.imageUrl} alt="" />
                )}
                <div className='text-small' style={{height: 44, transform: "translateY(-50%)",marginTop:'1rem' }} dangerouslySetInnerHTML={{ __html: element.label || element?.title }}></div>
              </div>
            )
          }else{
            return(
              <div className="layout1-btn-booking-item" onClick={()=>{setSheetVisible(true);setDataBtn(element)}}>
                {element.icon ? element.icon : (
                  <img style={{width:'40px',height:'40px',borderRadius:'4px'}} className='mb-2' src={element?.imageUrl} alt="" />
                )}
                <div className='text-small' style={{height: 44, transform: "translateY(-50%)",marginTop:'1rem' }} dangerouslySetInnerHTML={{ __html: element.label || element?.title }}></div>
              </div>
            )
          }
        })}
      </div>
    </div>
    )
  }
  return (
    <>
      <div> {renderBtns()}</div>
    </>
  )
}
export default L2FunctionButtonList