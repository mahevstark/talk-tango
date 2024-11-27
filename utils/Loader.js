
import React from "react";
import {
    View,
    Animated,
    Easing,
    Text,
    ActivityIndicator
} from "react-native";
import { colors } from "./Constants";

const Loader= () => {

    var spinValue = new Animated.Value(0);


    Animated.loop(
        Animated.timing(
            spinValue,
            {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true
            }
        )
    ).start();


    // Next, interpolate beginning and end values (in this case 0 and 1)
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    return (
        <View style={{ position:"absolute",width:"100%",top:0,left:0,right:0,bottom:0, flex:1,zIndex:999999999,backgroundColor:"rgba(255,255,255,0.5)",justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator color={colors.primary} />
        </View>);
};
export default React.memo(Loader);
