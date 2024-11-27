const { urls } = require("../utils/Api_urls");
import {doConsole} from "../utils/functions";
import { urrls } from "./Common";

export async function api(url_plus, body_data, method, token=null) {

  const apiUrl = urrls.server;

  // doConsole(" I request @ " + urls.API + url_plus);
  // doConsole(body_data);

  let headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  if(token !== null) {
    headers["Authorization"] = "Bearer " + token;
  }
  // doConsole(headers);
  let hasError = false;

  let others = {
    method: method || 'POST',
    headers: headers,
    
  }

  if(body_data !== null) {
    others["body"] = JSON.stringify(body_data);
  }
  const { isError, data } = await fetch(apiUrl + url_plus, others)
  .then((response) => {
    let r = response;
    hasError = response.status !== 200 && response.status !== 201;
    return r.json()
  })
    .then((responseJson) => {

      if(hasError) {
        console.log('error is' + apiUrl + url_plus)
        console.log(responseJson)
        return {isError: true, data: responseJson};
      }
      return { isError: false, data: responseJson }
    }).catch((error) => {
      console.log('error is' + apiUrl + url_plus)
      console.log(error)
      return { isError: true, data: error }
    });
  return { isError, data };
}


export async function doPost(body_data,url_plus) {

    doConsole(" I request @ " + urls.API + url_plus);
    // doConsole(body_data);
    var {isError, data} = await fetch(urls.API + url_plus, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body_data),
    }).then((response) => response.json())
      .then((responseJson) => {
        return {isError:false,data:responseJson}
      }).catch((error) => {
        console.log(error)
        return {isError:true,data:{}}
      });
    return {isError,data};
  }


  export async function doPostDoc(response,url_plus,token="",path) {



    // console.log("gallery response");
    // console.log(response);

    // var response = this.state.selected_modal_image[0];
    var my_ext = response.uri.split('.');

    var _ext = my_ext[my_ext.length - 1];


    var real_name = response.uri.split('/');
    var _real_name = real_name[real_name.length - 1];



    const formData = new FormData();

    formData.append("photo", {
      name: _real_name,
      type: Platform.OS === "android" ? "image/jpeg" : response.type,
      uri:Platform.OS === "android" ? response.uri : response.uri.replace("file://", "")
    });
    formData.append("token", token);
    formData.append("path", path);

    // console.log("this is wat I'm submitting");
    // console.log(formData);
    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    };




    // console.log(" I request @ " + urls.API + url_plus);
    // console.log(config);
    var {isError, data} = await fetch(urls.API + url_plus, config).then((response) => response.json())
      .then((responseJson) => {
          console.log("Data did come")
          console.log(responseJson)
        return {isError:false,data:responseJson}
      }).catch((error) => {
        return {isError:true,data:{}}
      });
    return {isError,data};
}
