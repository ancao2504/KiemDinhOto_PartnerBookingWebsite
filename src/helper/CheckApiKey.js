export const CheckApiKey = () => {
  let params = new URLSearchParams(document.location.search);
  let apikey
  const zaloKey=process.env.REACT_APP_BOOKING_API_KEY
  if(zaloKey){
    return(
      apikey = zaloKey
    )
  }else{
    return(
      apikey=params.get("apikey")
    )
  }
}
