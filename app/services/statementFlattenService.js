const unflatten = (flatStatement) =>{
  return null
}

const flatten = (statement) =>{
  let flatStatement = {}

  flatStatement.NameA = "Alice"
  flatStatement.FirstNameA = "statement.driverA.firstname"
  // flatStatement.AddressA = statement.driverA.
  // flatStatement.ZipA = statement.driverA.
  // flatStatement.countryA = statement.driverA.nationality //TODO : find a way to turn it into a nationality correctly
  //flatStatement.ContactA = statement.driverA.phone?statement.driverA.phone:statement.driverA.email
  // flatStatement.InsuranceNameA
  // flatStatement.InsurancePolicyA
  //flatStatement.GreenCardA = statement.driverA.greenCard.imageRef // TODO:switch to the real nA
  // flatStatement.InsuranceDateA
  // flatStatement.InsuranceEndDateA
  // flatStatement.InsuranceCompanyA
  // flatStatement.InsuranceAddressA
  // flatStatement.countryInsuranceA
  // flatStatement.ContactInsuranceA

  // flatStatement.NameDriverA 
  // flatStatement.FirstNameDriverA
  // flatStatement.AirthdateDriverA
  // flatStatement.AddressDriverA
  // flatStatement.countryDriverA
  // flatStatement.ContactDriverA
  //flatStatement.DrivingLicenseDriverA = statement.driverA.drivingLicense.imageRef
  // flatStatement.CategoryDriverA
  // flatStatement.ValidityLicenseDriverA
  // flatStatement.VehicleTypeA
  // flatStatement.VehicleIDA
  // flatStatement.countryVehicleA
  // flatStatement.VehicleIDTrailerA
  // flatStatement.countryTrailerA
  
  flatStatement.NameB = "Doe"
  flatStatement.FirstNameB = "John"
  // flatStatement.AddressB = statement.driverB.
  // flatStatement.ZipB = statement.driverB.
  // flatStatement.countryB = statement.driverB.nationality //TODO : find a way to turn it into a nationality correctly
  //flatStatement.ContactB = statement.driverB.phone?statement.driverB.phone:statement.driverB.email
  // flatStatement.InsuranceNameB
  // flatStatement.InsurancePolicyB
  //flatStatement.GreenCardB = statement.driverB.greenCard.imageRef // TODO:switch to the real nb
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
  //flatStatement.DrivingLicenseDriverB = statement.driverB.drivingLicense.imageRef
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
  return flatStatement
}

const StatementFlattenService = {
  flatten,
  unflatten
}

module.exports = StatementFlattenService
