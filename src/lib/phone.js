'use strict'

const LibPhoneNumber = require('google-libphonenumber')

const PhoneNumber = LibPhoneNumber.PhoneNumber
const PhoneNumberFormat = LibPhoneNumber.PhoneNumberFormat
const PhoneNumberUtil = LibPhoneNumber.PhoneNumberUtil.getInstance()

exports.parse = (phone) => {
  const cleaned = phone.replace(/[^\d]/g, '')

  const parsed = PhoneNumberUtil.parse(`+${cleaned}`)

  return { countryCode: parsed.getCountryCode(), nationalNumber: parsed.getNationalNumber(), isValidNumber: PhoneNumberUtil.isValidNumber(parsed) }
}

exports.format = (nationalNumber, countryCode) => {
  let phoneNumber = new PhoneNumber()
  phoneNumber.setNationalNumber(nationalNumber)
  phoneNumber.setCountryCode(countryCode)

  return PhoneNumberUtil.format(phoneNumber, PhoneNumberFormat.E164)
}

exports.enumDomainToParsedPhone = (enumDomain) => {
  const split = enumDomain.split('.')
  let suffixPos = split.findIndex(s => s.length > 1 && isNaN(s))
  let phone = split.slice(0, suffixPos).reverse().join('')
  return exports.parse(phone)
}
