export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{4})(\d{1,4})/, '$1 - $2')
}

// eslint-disable-next-line no-extend-native
BigInt.prototype.toPrice = function () {
  return `${this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}
