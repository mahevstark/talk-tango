import { BehaviorSubject } from 'rxjs';
import { urls } from './Api_urls';

const location = new BehaviorSubject({t:"",g:"",a:"",s:"",area:""})
let locationInContext = null
const snackself = new BehaviorSubject({shown:false,msg:""})
const alertheader = new BehaviorSubject({msg:"",type:"", title:""})
const cartItems = new BehaviorSubject([]);
const scrollSubIndex = new BehaviorSubject(-1);
const scrollSubMainIndex = new BehaviorSubject(-1);
const appliedFilters = new BehaviorSubject([]);
const msgsLoading = new BehaviorSubject(false);
const navigateToPost = new BehaviorSubject({id:0,where:"nowhere", is_blocked:0, blocked_by_from:0, user_id:0,convo:{}});
const isMsgsError = new BehaviorSubject(false);


const navigateToPostNow = {
    navigate: function(t){
        // if(t.where=="nowhere") return;
        console.log("opening with honor")
        console.log(t);
        navigateToPost.next(t)
    }
}

const setMsgsError = function(t){
    isMsgsError.next(t)
}
const setMessagesLoading = function (t){
    msgsLoading.next(t)
}

const msgsMain = new BehaviorSubject([]);

const setMsgsMain = function(t){
    msgsMain.next(t)

}

const appendNewMsg = function(t){
    let msgs = msgsMain.getValue();
    msgs.unshift(t)
    msgsMain.next(msgs)
}

const updateMsgById = function(id, fields_to_update){
    console.log("debug 2")
    console.log(id,fields_to_update)
    let msgs = msgsMain.getValue();
    let index = msgs.findIndex((m)=>m._id==id);
    if(index!=-1){
    console.log("debug 3")

        msgs[index] = {...msgs[index], ...fields_to_update}
        msgsMain.next(msgs)
    }

}

const darkModeObservable = new BehaviorSubject(false);

const waiting = new BehaviorSubject({waiting:false, percent:0, msg:'Please wait...', error:false});

const loggedInObservable = new BehaviorSubject(0);
const changeLoggedIn = {
    changeNow: function(t){
        loggedInObservable.next(t)
    }
}

const applyFilters = function(t){
    appliedFilters.next(t)
}

const withUrl = (url)=>{
    if(url?.includes("https://")){
        return url
    }else{
        return urls.PHP_API + "resources/uploads/users/" + url;
    }
}

// 1 = user, 2 = business owner
const roleObservable = new BehaviorSubject(1);
const setRole= function(t) {
    roleObservable.next(t)
}

const applyDarkMode = function(t){
    darkModeObservable.next(t)
}

const showSuccessObservable = new BehaviorSubject(0);
const showSuccess =(t) => {
    showSuccessObservable.next(t)
}

const showAlert = (title,msg,type)=>{
    alertheader.next({title,msg,type})
}


const updateAvailable = new BehaviorSubject(-1);

const offlineData = new BehaviorSubject(null);
let urrls ={
    server:urls.API,
    payments:urls.WEB_API,
    offline:urls.OFFLINE_API,
    offline_version:urls.OFFLINE_VERSION,
    cod_enabled:urls.COD_ENABLED,
    card_enabled:urls.CARD_ENABLED,
    taking_orders:urls.taking_orders,
    taking_orders_msg:urls.taking_orders_msg,
    is_offline:urls.is_offline,
};

let offlineDataObject = null;
let offlineDataObjectCats = null;
let offlineDataObjectSubCats = null;
let offlineDataObjectSubCatsFoodOnly = null;

const scrollSubTo = function(index){
    scrollSubIndex.next(index)
}

const updatePrices = function(index){
    updateAvailable.next(index)
}

const scrollSubMainTo = function(index){
    scrollSubMainIndex.next(index)
}


const waitNow = function(obj){
    waiting.next(obj)
}


const updateOfflineData = function(a){
    offlineDataObject = a;
    // offlineDataObjectSupers = a.map((s)=>{return {id:s.id,title:s.title,image:s.image}})
    offlineDataObjectCats = a.map((s)=>{return s.categories.map((ss)=>{return {id:ss.id,title:ss.title,image:ss.image,category_id:s.id,sub_category_id:ss.sub_categories[0]?.id}})})
    offlineDataObjectSubCats = a.map((s)=>{return s.categories.map((ss)=>{return ss.sub_categories.map((sss)=>{return {id:sss.id,title:sss.title,image:sss.image,category_id:s.id,sub_category_id:ss.id}})})}).flat().flat()
    offlineDataObjectSubCatsFoodOnly = a.map((s)=>{
        if(s.title!="Grocery")
        return s.categories.map((ss)=>{return ss.sub_categories.map((sss)=>{return {id:sss.id,title:sss.title,image:sss.image,category_id:s.id,sub_category_id:ss.id}})})}).flat().flat()
    offlineData.next(a)
}

const changeLocationRxjs = function(t,g,a,s,area){
    location.next({t,g,a,s,area})
}

const changeLocationInContext = function(t,g,a,s,area){
    locationInContext = {t,g,a,s,area}
}

const setUrls = function(ob){

    urrls = ob;

}

const toast = function(msg){
    snackself.next({shown:true,msg})
}

const updateCartItems = function(c){
    console.log("Updating cart items")
    cartItems.next(c)
}

export {
    changeLocationRxjs,
    location,
    toast,
    snackself,

    updateCartItems,
    cartItems,
    offlineData,
    updateOfflineData,
    offlineDataObject,
    offlineDataObjectCats,
    offlineDataObjectSubCats,
    offlineDataObjectSubCatsFoodOnly,
    urrls,
    setUrls,
    scrollSubIndex,
    scrollSubTo,
    scrollSubMainIndex,
    scrollSubMainTo,
    changeLocationInContext,
    locationInContext,
    updatePrices,
    updateAvailable,

    waiting,
    waitNow,

    loggedInObservable,
    changeLoggedIn,
    showSuccess,
    showSuccessObservable,

    darkModeObservable,
    applyDarkMode,

    setRole,
    roleObservable,

    showAlert,
    alertheader,

    applyFilters,
    appliedFilters,

    withUrl, 
    msgsMain,
    setMsgsMain,
    msgsLoading,
    setMessagesLoading,

    isMsgsError,
    setMsgsError,

    appendNewMsg,
    updateMsgById,

    navigateToPostNow,
    navigateToPost
    
}