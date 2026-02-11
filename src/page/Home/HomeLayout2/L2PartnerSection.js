import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'

const L2PartnerSection = ({ data = [] }) => {
  const sliderRef = useRef(null)
  const [numberSlide, setNumberSlide] = useState(4)
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: numberSlide,
    slidesToScroll: 1,
    rows: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    initialSlide: data?.length > 0 ? Math.floor(Math.random() * data?.length) : 0,
  }

  useEffect(() => {
    if (data && data.length > 0) {
      let displaySlides = data.length > 4 ? 4 : data.length
      setNumberSlide(displaySlides)
    }
  }, [data])

  return (
    <div className="l2-partner-section">
      {data?.length > 0 && (
        <div className="card-slider partner-slider">
          <Slider ref={sliderRef} {...settings}>
            {data?.map((item, index) => (
              <div key={index}>
                <div className="group-wrapper w-100">
                  <a 
                    href={item.link || item.partnerLandingPageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="partner-link"
                  >
                    <div className='d-flex justify-content-center align-items-center flex-column'>
                      <div className='partner-icon-wrapper'>
                        {item.icon || <img src={item.image || item.imageUrl} alt={item.name} />}
                      </div>
                      <span className='text-center pt-1 text-small partner-name'>{item.name || item.title}</span>
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  )
}

export default L2PartnerSection
