'use strict'

const Moment = require('moment')

const DateFormat = 'ddd MMM DD HH:mm:ss [GMT] YYYY'

exports.mapToPhoneNumberResponse = (phone, profile, customerId) => {
  let phones = !Array.isArray(phone) ? [phone] : phone
  return { TNData: phones.map(p => mapToTN(p, profile, customerId)) }
}

exports.mapToProfileResponse = (profile, records, customerId) => {
  return {
    DNSProfileData: {
      ProfileID: profile.name,
      Customer: { attributes: { id: customerId } },
      DateCreated: Moment.utc(profile.created).format(),
      IsInUse: false,
      Tier: profile.tier,
      NAPTR: records.map(mapToNaptrResponse)
    }
  }
}

const mapToNaptrResponse = (record) => {
  return {
    attributes: { ttl: record.ttl },
    DomainName: record.domainName,
    Preference: record.preference,
    Order: record.order,
    Flags: record.flags.toLowerCase(),
    Service: record.service,
    Regexp: {
      attributes: { pattern: record.regexp },
      $value: record.uri
    },
    Replacement: record.replacement,
    CountryCode: false,
    Partner: { attributes: { id: record.partnerId } }
  }
}

const mapToTN = (phone, profile, customerId) => {
  return {
    TN: {
      Base: phone.number,
      CountryCode: phone.countryCode
    },
    Customer: { attributes: { id: customerId } },
    DateCreated: Moment.utc(phone.created).format(DateFormat),
    DateUpdated: Moment.utc(phone.created).format(DateFormat),
    Status: phone.status,
    DNSProfileID: profile.name,
    Tier: profile.tier
  }
}
