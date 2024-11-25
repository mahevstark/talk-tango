import { BehaviorSubject } from 'rxjs';
import ExpoMixpanelAnalytics from '@bothrs/expo-mixpanel-analytics';
import { getDeviceId } from './functions';
const analytics = new ExpoMixpanelAnalytics("3d7f901b958d6cc0271fffe57ad36318");
const identify = async ()=>{
    const deviceId = await getDeviceId();
    analytics.identify(deviceId);
    analytics.register({email:deviceId+"@estamart.com"});
    // analytics.people_set_once({email:deviceId+"@estamart.com"})
    
}
identify();
export {
    analytics
}