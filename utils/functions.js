// importing local storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {Platform, Share} from 'react-native';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
// local storage function that retreives the data
export async function readItem(key) {
    try {
    const retrievedItem =  await AsyncStorage.getItem(key);
    const item = JSON.parse(retrievedItem);
    return item;
    } catch (error) {
    console.log(error.message);
    }
    return
}


// store data in lcoalstorage
export async function storeItem(key, item) {
    try {
        var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
        return jsonOfItem;
    } catch (error) {
        console.log(error.message);
    }
}

export const EventFormatedDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
  return formattedDate;
};


//validing email
export function validateEmail(text){
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {

        return false;
    }
    else {
        return true;
    }
}


// simple console log, so I can turn it off later
export function doConsole(d){
    console.log(d)
}


// simple alert
export function doAlertPlease(a,b,c)
{

    // let shown = true

    // return (
    //     <>
    //     {shown && <SimpleAlert
    //         Confirm={()=>{ shown = false}}
    //         title={b ?? "Alert"}
    //         text={c ?? "Error"}
    //         btn2="Okay"
    //     />}
    //     </>
    // )

    alert(c)
    

    
}


export function timeZoneTry(timeNow){
    var tzo = -timeNow.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return dif + pad(tzo / 60) +':' + pad(tzo % 60);
}

export const onShare = async (msg) => {
    try {
      const result = await Share.share({
        message:msg
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
    }
  };


  export function getParamFromURL(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1]);
      // If first entry with this name
      if (typeof query_string[key] === "undefined") {
        query_string[key] = decodeURIComponent(value);
        // If second entry with this name
      } else if (typeof query_string[key] === "string") {
        var arr = [query_string[key], decodeURIComponent(value)];
        query_string[key] = arr;
        // If third or later entry with this name
      } else {
        query_string[key].push(decodeURIComponent(value));
      }
    }
    return query_string;
  }


  export const getDeviceId = async () => {
    if (Platform.OS === 'android') {
      return Application.androidId;
    } else {
      let deviceId = await SecureStore.getItemAsync('deviceId');
  
      if (!deviceId) {
        deviceId = Application.applicationId + '-' + Math.random() * 100000000 + '-' + Date.now() + '-' + Math.random() * 1000000000 + '-' + Math.random() * 1000000000;
        await SecureStore.setItemAsync('deviceId', deviceId);
      }
  
      return deviceId;
    }
  }


// common Navigations

module.exports.storeItem = storeItem;
module.exports.retrieveItem = readItem;
// module.exports.doConsole = doConsole;
// module.exports.validateEmail = validateEmail;
// module.exports.doAlertPlease = doAlertPlease;
// module.exports.timeZoneTry = timeZoneTry;
// module.exports.onShare = onShare;
// module.exports.getParamFromURL = getParamFromURL;


