// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APIEndpoint: 'http://50.17.29.77/api/v1',
  PRICE_PREFIX: '$ ',
  // APIEndpoint: 'http://34.233.128.163/api/v1'
  // STATES :'Alabama,Alaska,American Samoa,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,District of Columbia,Federated States of Micronesia ,Florida,Georgia,Guam,Hawaii,Idaho,Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Marshall Islands,Maryland,Massachusetts,Michigan,Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,North Carolina,North Dakota,Northern Mariana Islands  ,Ohio,Oklahoma,Oregon,Palau,Pennsylvania,Puerto Rico,Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virgin Islands,Virginia,Washington,West Virginia,Wisconsin,Wyomin,Armed Forces Americas,Armed Forces Europe,Armed Forces Pacific',
  STATES : JSON.stringify([{"state":"Alabama","abreviation":"AL"},{"state":"Alaska","abreviation":"AK"},{"state":"Arizona","abreviation":"AZ"},{"state":"Arkansas","abreviation":"AR"},{"state":"California","abreviation":"CA"},{"state":"Colorado","abreviation":"CO"},{"state":"Connecticut","abreviation":"CT"},{"state":"Delaware","abreviation":"DE"},{"state":"Florida","abreviation":"FL"},{"state":"Georgia","abreviation":"GA"},{"state":"Hawaii","abreviation":"HI"},{"state":"Idaho","abreviation":"ID"},{"state":"Illinois","abreviation":"IL"},{"state":"Indiana","abreviation":"IN"},{"state":"Iowa","abreviation":"IA"},{"state":"Kansas","abreviation":"KS"},{"state":"Kentucky","abreviation":"KY"},{"state":"Louisiana","abreviation":"LA"},{"state":"Maine","abreviation":"ME"},{"state":"Maryland","abreviation":"MD"},{"state":"Massachusetts","abreviation":"MA"},{"state":"Michigan","abreviation":"MI"},{"state":"Minnesota","abreviation":"MN"},{"state":"Mississippi","abreviation":"MS"},{"state":"Missouri","abreviation":"MO"},{"state":"Montana","abreviation":"MT"},{"state":"Nebraska","abreviation":"NE"},{"state":"Nevada","abreviation":"NV"},{"state":"New Hampshire","abreviation":"NH"},{"state":"New Jersey","abreviation":"NJ"},{"state":"New Mexico","abreviation":"NM"},{"state":"New York","abreviation":"NY"},{"state":"North Carolina","abreviation":"NC"},{"state":"North Dakota","abreviation":"ND"},{"state":"Ohio","abreviation":"OH"},{"state":"Oklahoma","abreviation":"OK"},{"state":"Oregon","abreviation":"OR"},{"state":"Pennsylvania","abreviation":"PA"},{"state":"Rhode Island","abreviation":"RI"},{"state":"South Carolina","abreviation":"SC"},{"state":"South Dakota","abreviation":"SD"},{"state":"Tennessee","abreviation":"TN"},{"state":"Texas","abreviation":"TX"},{"state":"Utah","abreviation":"UT"},{"state":"Vermont","abreviation":"VT"},{"state":"Virginia","abreviation":"VA"},{"state":"Washington","abreviation":"WA"},{"state":"West Virginia","abreviation":"WV"},{"state":"Wisconsin","abreviation":"WI"},{"state":"Wyoming","abreviation":"WY"},{"state":"District of Columbia","abreviation":"DC"},{"state":"Marshall Islands","abreviation":"MH"},{"state":"Armed Forces Africa","abreviation":"AE"},{"state":"Armed Forces Americas","abreviation":"AA"},{"state":"Armed Forces Canada","abreviation":"AE"},{"state":"Armed Forces Europe","abreviation":"AE"},{"state":"Armed Forces Middle East","abreviation":"AE"},{"state":"Armed Forces Pacific","abreviation":"AP"}]),  
  DeliveryDate_Configurable_days : 12,
  CART_ERROR_CODES : '200,201,2011,2012,2013,2014,2015,2016,2017,202,203,204,300,3001,3002,301,3010,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,3220,3221,3222,323,324,325,326,32605,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,3430,344,3440,3441,345,3450,3450,346,347,348,349,3490,3491,350,3501,3502,3503,3504,3505,3506,3507,3508,3509,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,3740,3741,3742,3743,3744,3745,375,3750,376,377,378,3780,379,380,381,382,383,3830,3831,3830,384,385,3850,386,3860,3861,387,390,400,4001,4002,401,402,403,404,405,406,407,408,4080,409,410,411,4110,4111,412,413,416,417,418,419,420,421,422,423,4230,4231,4232,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,500,501,502,503,510,520,521,522,523,530,531,532,534,535,536,537',
  WHITELIST_IPS:'183.83.206.55,122.169.214.67,124.123.75.224,223.230.113.92,49.206.202.233,106.212.226.40,183.82.3.50,203.199.178.211,122.175.90.178,103.110.147.108',
  // WHITELIST_IPS:'183.83.206.55,122.169.214.67,124.123.75.224',
  IPAPIKEY : 'c73005c0a4a90d0a5eab78166558be59',
  MIN_AGE_RULE: 18
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
