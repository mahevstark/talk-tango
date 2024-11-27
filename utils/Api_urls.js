const production = false;
export const urls = {
  // API: "http://192.168.18.17/jpcarrier-backend/api/",
  // PHP_API: "http://192.168.18.17/jpcarrier-backend/",
  // Fashion38400@@@
  fake_otp: true,
  API: "https://talktango.estamart.com/api/",
  PHP_API: "https://talktango.estamart.com/",
  // API: "http://192.168.18.40/talktango-backend/api/",
  // PHP_API: "http://192.168.18.40/talktango-backend/",
  ALL_DATA: "http://193.168.18.3/esta-data.json",

  WEB_API: "",
  OFFLINE_API: "https://souq-s4.s3.ap-south-1.amazonaws.com/esta-data.json",
  OFFLINE_VERSION: 1,
  payments: "",
  is_offline: false,

  COD_ENABLED: true,
  CARD_ENABLED: true,
  taking_orders: true,
  taking_orders_msg:
    "We are not taking orders at the moment, please try again later",

  //... more colors here
  MARGIN: false,
  error_title: "No Internet",
  error: "Error connecting to the server, please try again later",
  production,
  MAPS_KEY: production
    ? "AIzaSyAyL7v06RvkI8DHP25oxNa9emHnm2B7o2o"
    : "AIzaSyBAhdTXHZ00xkF3lKvRuuLBQobJq67OC8k",
  MAPS_KEY_IOS: production
    ? "AIzaSyDsquArCR126IRwFxhZVXjQyXSd_qP7Zm8"
    : "AIzaSyDsquArCR126IRwFxhZVXjQyXSd_qP7Zm8",
  MAPS_UNRESTRICTED: "AIzaSyAGtPCyRaZgwu3T0spLcDYrNIDMGT5lsOs",
  dLat: 31.4697,
  dLng: 74.2728,
  // https://maps.googleapis.com/maps/api/staticmap?center=Berkeley,CA&zoom=14&size=400x400&key=AIzaSyA1R8WBbKJnXN6Wbwc8Tq1rCIK_sT3_FO8
};
