
const year = ['2010','2011','2012','2013','2014','2015','2016','2017','2018'];

const countryList =
[["CAMEROON","Middle Africa"],["ANGOLA","Middle Africa"],["BANGLADESH","Southern Asia"],["GHANA","Western Africa"],["LIBYA","Northern Africa"],["MALI","Western Africa"],["SUDAN","Northern Africa"],["UGANDA","Eastern Africa"],["EGYPT","Northern Africa"],["IRAN","Middle East"],["ISRAEL","Middle East"],["PALESTINE","Middle East"],["YEMEN","Middle East"],["AFGHANISTAN","Southern Asia"],["TURKEY","Middle East"],["IRAQ","Middle East"],["SYRIA","Middle East"],["CENTRAL AFRICAN REPUBLIC","Middle Africa"],["KENYA","Eastern Africa"],["NIGERIA","Western Africa"],["RWANDA","Eastern Africa"],["SOMALIA","Eastern Africa"],["PAKISTAN","Southern Asia"],["DEMOCRATIC REPUBLIC OF CONGO","Middle Africa"],["BENIN","Western Africa"],["NEPAL","Southern Asia"],["INDONESIA","South-Eastern Asia"],["ETHIOPIA","Eastern Africa"],["ZIMBABWE","Southern Africa"],["SOUTH SUDAN","Eastern Africa"],["CHAD","Middle Africa"],["BAHRAIN","Middle East"],["SRI LANKA","Southern Asia"],["MOZAMBIQUE","Eastern Africa"],["SOUTH AFRICA","Southern Africa"],["SAUDI ARABIA","Middle East"],["ALGERIA","Northern Africa"],["MAURITANIA","Western Africa"],["TUNISIA","Northern Africa"],["GUINEA","Western Africa"],["LIBERIA","Western Africa"],["MADAGASCAR","Eastern Africa"],["SENEGAL","Western Africa"],["TANZANIA","Eastern Africa"],["ZAMBIA","Southern Africa"],["LEBANON","Middle East"],["MOROCCO","Northern Africa"],["GUINEA-BISSAU","Western Africa"],["JORDAN","Middle East"],["BURUNDI","Eastern Africa"],["IVORY COAST","Western Africa"],["BURKINA FASO","Western Africa"],["NIGER","Western Africa"],["EQUATORIAL GUINEA","Middle Africa"],["GAMBIA","Western Africa"],["GABON","Middle Africa"],["TOGO","Western Africa"],["NAMIBIA","Southern Africa"],["MALAWI","Eastern Africa"],["SWAZILAND","Southern Africa"],["OMAN","Middle East"],["VIETNAM","South-Eastern Asia"],["CAMBODIA","South-Eastern Asia"],["KUWAIT","Middle East"],["REPUBLIC OF CONGO","Middle Africa"],["SIERRA LEONE","Western Africa"],["ERITREA","Eastern Africa"],["DJIBOUTI","Eastern Africa"],["LESOTHO","Southern Africa"],["LAOS","South-Eastern Asia"],["UNITED ARAB EMIRATES","Middle East"],["QATAR","Middle East"],["BOTSWANA","Southern Africa"]];

const countryCode = [{"code":"CM","full":"CAMEROON"},{"code":"AO","full":"ANGOLA"},{"code":"BD","full":"BANGLADESH"},{"code":"GH","full":"GHANA"},{"code":"LY","full":"LIBYA"},{"code":"ML","full":"MALI"},{"code":"SS","full":"SUDAN"},{"code":"UG","full":"UGANDA"},{"code":"EG","full":"EGYPT"},{"code":"IR","full":"IRAN"},{"code":"IL","full":"ISRAEL"},{"code":"PS","full":"PALESTINE"},{"code":"YE","full":"YEMEN"},{"code":"AF","full":"AFGHANISTAN"},{"code":"TR","full":"TURKEY"},{"code":"IQ","full":"IRAQ"},{"code":"SY","full":"SYRIA"},{"code":"CF","full":"CENTRAL AFRICAN REPUBLIC"},{"code":"KE","full":"KENYA"},{"code":"NG","full":"NIGERIA"},{"code":"RW","full":"RWANDA"},{"code":"SO","full":"SOMALIA"},{"code":"PK","full":"PAKISTAN"},{"code":"BJ","full":"BENIN"},{"code":"NP","full":"NEPAL"},{"code":"ID","full":"INDONESIA"},{"code":"ET","full":"ETHIOPIA"},{"code":"ZW","full":"ZIMBABWE"},{"code":"SS","full":"SOUTH SUDAN"},{"code":"TD","full":"CHAD"},{"code":"BH","full":"BAHRAIN"},{"code":"LK","full":"SRI LANKA"},{"code":"MZ","full":"MOZAMBIQUE"},{"code":"ZA","full":"SOUTH AFRICA"},{"code":"SA","full":"SAUDI ARABIA"},{"code":"DZ","full":"ALGERIA"},{"code":"MR","full":"MAURITANIA"},{"code":"TN","full":"TUNISIA"},{"code":"GQ","full":"GUINEA"},{"code":"LR","full":"LIBERIA"},{"code":"MG","full":"MADAGASCAR"},{"code":"SN","full":"SENEGAL"},{"code":"TZ","full":"TANZANIA"},{"code":"ZM","full":"ZAMBIA"},{"code":"LB","full":"LEBANON"},{"code":"MA","full":"MOROCCO"},{"code":"GW","full":"GUINEA-BISSAU"},{"code":"JO","full":"JORDAN"},{"code":"BI","full":"BURUNDI"},{"code":"CI","full":"IVORY COAST"},{"code":"BF","full":"BURKINA FASO"},{"code":"NE","full":"NIGER"},{"code":"GQ","full":"EQUATORIAL GUINEA"},{"code":"GM","full":"GAMBIA"},{"code":"GA","full":"GABON"},{"code":"TG","full":"TOGO"},{"code":"NA","full":"NAMIBIA"},{"code":"MW","full":"MALAWI"},{"code":"SZ","full":"SWAZILAND"},{"code":"OM","full":"OMAN"},{"code":"VN","full":"VIETNAM"},{"code":"KH","full":"CAMBODIA"},{"code":"KW","full":"KUWAIT"},{"code":"SL","full":"SIERRA LEONE"},{"code":"ER","full":"ERITREA"},{"code":"DJ","full":"DJIBOUTI"},{"code":"LS","full":"LESOTHO"},{"code":"LA","full":"LAOS"},{"code":"AE","full":"UNITED ARAB EMIRATES"},{"code":"QA","full":"QATAR"},{"code":"BW","full":"BOTSWANA"}]

// const regionList = {
//   continent: {
//     regions: {
//       country
//     }
//   }
// }

const event_dict = [ 'violence against civilians',
  'riots/protests',
  'battle-no change of territory',
  'remote violence',
  'strategic development',
  'battle-government regains territory',
  'battle-non-state actor overtakes territory',
  'non-violent transfer of territory',
  'headquarters or base established' ]

module.exports = {
  year: year,
  countryList: countryList,
  event_dict: event_dict,
  countryCode:countryCode
};
