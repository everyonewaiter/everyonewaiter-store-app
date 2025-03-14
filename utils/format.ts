export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{4})(\d{1,4})/, '$1 - $2')
}
