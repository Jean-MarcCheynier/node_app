const { now } = require('lodash')
const logger = require('../config/winston')

const toString = (dict) => {
  logger.debug(dict)
  for (const key in dict) {
    //TODO switch between valueDate and valueString based on type
    dict[key] = dict[key] ? dict[key].text : 'TO FILL'
  }
}

const unflatten = (flatStatement) => {
  return null
}
/**
 * turns a statement of form:
 *status: { type: String, enum: ['new', 'pending', 'review', 'complete'] },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  driverA: { type: DriverSchema },
  driverB: { type: DriverSchema },
  damage: { type: DamageSchema }
  into a series of fields for insertion in the PDF
 * @param {*} statement
 */
const flatten = (statement) => {
  let flatStatement = {}

  if (statement.driverA.idCard.imageRef) {
    const fields = statement.driverA.idCard.imageRef
    logger.debug(fields)
    const { name: NameDriverA, givenNames: FirstNameDriverA, birthDate: BirthdateDriverA } = fields.classification
    flatStatement = { ...flatStatement, NameDriverA, FirstNameDriverA, BirthdateDriverA }
  } else {
    flatStatement.NameDriverA = { text: 'Missing ID' }
  }

  if (statement.driverA.drivingLicense.imageRef) {
    const fields = statement.driverA.drivingLicense.imageRef
    logger.debug(fields)
    const { licenseId: DrivingLicenseDriverA, expiryDate: ValidityLicenseDriverA } = fields.classification
    flatStatement = { ...flatStatement, DrivingLicenseDriverA, ValidityLicenseDriverA }
  } else {
    flatStatement.DrivingLicenseDriverA = { text: 'Missing license' } // structure required as we use it in toString after//TODO fix that
  }

  if (statement.driverA.greenCard.imageRef) {
    const fields = statement.driverA.greenCard.imageRef
    logger.debug(fields)
    const {
      fullname: NameDriverA, policy: InsurancePolicyA, validFrom: InsuranceDateA,
      validUntil: InsuranceEndDateA, vehicleModel: VehicleTypeA, vehicleNumber: VehicleIDA
    } = fields.classification
    flatStatement = { ...flatStatement, NameDriverA, InsurancePolicyA, InsuranceDateA, InsuranceEndDateA, VehicleTypeA, VehicleIDA }
  } else {
    flatStatement.NameA = { text: 'Missing Greencard' } // structure required as we use it in toString after//TODO fix that
  }

  if (statement.driverB.idCard.imageRef) {
    const fields = statement.driverB.idCard.imageRef
    logger.debug(fields)
    const { name: NameDriverB, givenNames: FirstNameDriverB, birthDate: BirthdateDriverB } = fields.classification
    flatStatement = { ...flatStatement, NameDriverB, FirstNameDriverB, BirthdateDriverB }
  } else {
    flatStatement.NameDriverB = { text: 'Missing ID' } // structure required as we use it in toString after//TODO fix that
  }

  if (statement.driverB.drivingLicense.imageRef) {
    const fields = statement.driverB.drivingLicense.imageRef
    logger.debug(fields)
    const { licenseId: DrivingLicenseDriverB, expiryDate: ValidityLicenseDriverB } = fields.classification
    flatStatement = { ...flatStatement, DrivingLicenseDriverB, ValidityLicenseDriverB }
  } else {
    flatStatement.DrivingLicenseDriverB = { text: 'Missing license' } // structure required as we use it in toString after//TODO fix that
  }
  toString(flatStatement)
  flatStatement.AccidentPlace = statement._id
  flatStatement.AccidentDate = new Date(Date.now())
  // flatStatement.AddressA = statement.driverA.
  // flatStatement.ZipA = statement.driverA.
  // flatStatement.countryA = statement.driverA.nationality //TODO : find a way to turn it into a nationality correctly
  // flatStatement.ContactA = statement.driverA.phone?statement.driverA.phone:statement.driverA.email
  // flatStatement.InsuranceNameA
  // flatStatement.InsurancePolicyA
  // flatStatement.GreenCardA = statement.driverA.greenCard.imageRef // TODO:switch to the real nA
  // flatStatement.InsuranceDateA
  // flatStatement.InsuranceEndDateA
  // flatStatement.InsuranceCompanyA
  // flatStatement.InsuranceAddressA
  // flatStatement.countryInsuranceA
  // flatStatement.ContactInsuranceA

  // flatStatement.NameDriverA
  // flatStatement.FirstNameDriverA
  // flatStatement.BirthdateDriverA
  // flatStatement.AddressDriverA
  // flatStatement.countryDriverA
  // flatStatement.ContactDriverA
  // flatStatement.DrivingLicenseDriverA = statement.driverA.drivingLicense.imageRef
  // flatStatement.CategoryDriverA
  // flatStatement.ValidityLicenseDriverA
  // flatStatement.VehicleTypeA
  // flatStatement.VehicleIDA
  // flatStatement.countryVehicleA
  // flatStatement.VehicleIDTrailerA
  // flatStatement.countryTrailerA

  flatStatement.NameB = 'Doe'
  flatStatement.FirstNameB = 'John'
  // flatStatement.AddressB = statement.driverB.
  // flatStatement.ZipB = statement.driverB.
  // flatStatement.countryB = statement.driverB.nationality //TODO : find a way to turn it into a nationality correctly
  // flatStatement.ContactB = statement.driverB.phone?statement.driverB.phone:statement.driverB.email
  // flatStatement.InsuranceNameB
  // flatStatement.InsurancePolicyB
  // flatStatement.GreenCardB = statement.driverB.greenCard.imageRef // TODO:switch to the real nb
  // flatStatement.InsuranceDateB
  // flatStatement.InsuranceEndDateB
  // flatStatement.InsuranceCompanyB
  // flatStatement.InsuranceAddressB
  // flatStatement.countryInsuranceB
  // flatStatement.ContactInsuranceB

  // flatStatement.NameDriverB
  // flatStatement.FirstNameDriverB
  // flatStatement.BirthdateDriverB
  // flatStatement.AddressDriverB
  // flatStatement.countryDriverB
  // flatStatement.ContactDriverB
  // flatStatement.DrivingLicenseDriverB = statement.driverB.drivingLicense.imageRef
  // flatStatement.CategoryDriverB
  // flatStatement.ValidityLicenseDriverB
  // flatStatement.VehicleTypeB
  // flatStatement.VehicleIDB
  // flatStatement.countryVehicleB
  // flatStatement.VehicleIDTrailerB
  // flatStatement.countryTrailerB

  /* flatStatement.damage.truck_side_B
    flatStatement.damage.truck_side_A
    flatStatement.damage.truck_front_B
    flatStatement.damage.bike_back_A
    flatStatement.damage.bike_back_B
    flatStatement.damage.bike_front_A
    flatStatement.damage.bike_front_B
    flatStatement.damage.bike_side_A
    flatStatement.damage.bike_side_B
    flatStatement.damage.car_back_A
    flatStatement.damage.car_back_B
    flatStatement.damage.car_front_A
    flatStatement.damage.car_front_B
    flatStatement.damage.car_side_A
    flatStatement.damage.car_side_B
    flatStatement.damage.truck_back_A
    flatStatement.damage.truck_back_B
    flatStatement.damage.truck_front_A */

  for (const key in flatStatement) {
    logger.debug(`key : ${key} value : ${flatStatement[key]}`)
  }
  return flatStatement
}

const StatementFlattenService = {
  flatten,
  unflatten
}

module.exports = StatementFlattenService
