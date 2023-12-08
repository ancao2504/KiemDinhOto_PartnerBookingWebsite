const MIN_PLATE_NUMBER = 6
const MAX_PLATE_NUMBER = 16

// Validate at least 6 characters and at most 14 characters
// Validate must have 1 letter A-Z or Vietnamese alphabet "Đ"
// Validate at least one number .

export const validatorPlateNumber = (value) => {
  if (!value) {
    return Promise.reject('Vui lòng nhập biển số xe')
  }
  if (value.length < MIN_PLATE_NUMBER || value.length > MAX_PLATE_NUMBER) {
    return Promise.reject('Biển số xe chỉ được nhập chữ và số')
  }
  if (!/^([A-Z0-9Đ]*[A-ZĐ]|[A-ZĐ]|[0-9])+$/i.test(value)) {
    return Promise.reject('Biển số xe chỉ được nhập chữ và số')
  }
  if (!/[A-ZĐ]/.test(value)) {
    return Promise.reject('Biển số xe chỉ được nhập chữ và số')
  }
  if (!/[0-9]/.test(value)) {
    return Promise.reject('Biển số xe chỉ được nhập chữ và số')
  }
  return Promise.resolve()
}
