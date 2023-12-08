import React, { memo, useState } from 'react'

import BookingHistoryList from './BookingHistoryList'

const TabNotification = ({ search }) => {

  return (
    <div>
      <BookingHistoryList search={search} status={undefined} />
    </div>
  )
}

export default memo(TabNotification)
