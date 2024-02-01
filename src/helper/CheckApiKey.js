export const CheckApiKey = () => {
  let params = new URLSearchParams(document.location.search);
  let apikey
  const _TTDKMiniAppKey=process.env.REACT_APP_BOOKING_API_KEY
  if(_TTDKMiniAppKey){
    return(
      apikey = _TTDKMiniAppKey
    )
  }else{
    return(
      apikey=params.get("apikey")
    )
  }
}
