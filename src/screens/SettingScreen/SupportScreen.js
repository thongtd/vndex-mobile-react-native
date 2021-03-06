import React from 'react';
import { Text, View, Image,Linking,StyleSheet } from 'react-native';
import ItemSetting from '../../components/Item/ItemSetting';
import icons from '../../configs/icons';
import Container from '../../components/Container';
import colors from '../../configs/styles/colors';
import { get } from '../../configs/utils';
const linkSupport={
    fb:"https://www.facebook.com/FinanceX.io/",
    twitter:"https://twitter.com/FinanceX_Fiat",
    telegram:"https://t.me/FinanceX_Vietnam",
    email:"support@financex.io",
    medium:"https://medium.com/FinanceX-vietnam",
    teleChanel:"https://t.me/financex_channel"
}
const SupportScreen = ({
    componentId,
}) => {
    const data = [
        { textLeft: "Like us on Facebook", iconLeft: icons.fb, iconRight: true, onPress: ()=>Linking.openURL(linkSupport.fb) },
        { textLeft: "Follow us on Twitter", iconLeft: icons.twitter, iconRight: true, onPress: ()=>Linking.openURL(linkSupport.twitter) },
        { textLeft: "Join us on Telegram", iconLeft: icons.telegram, iconRight: true, onPress: ()=>Linking.openURL(linkSupport.telegram) },
        { textLeft: "Email Support", iconLeft: icons.gmail, iconRight: true, onPress: ()=> Linking.openURL(`mailto:${linkSupport.email}`) },
        { textLeft: "Get new on Medium", iconLeft: icons.medium, iconRight: true, onPress: ()=>Linking.openURL(linkSupport.medium) },
        { textLeft: "Track FNX Channel on Telegram", iconLeft: icons.telegram, iconRight: true, onPress: ()=>Linking.openURL(linkSupport.teleChanel) },
    ]
    
    return (
        <Container
        title={"Support".t()}
        // space={0}
        nameLeft={"arrow-left"}
        hasBack
        componentId={componentId}
        >   
        <View style={stylest.container}>
        <Image source={icons.logoBlue} style={stylest.logo} />
        </View>
           {data.map((item,index)=>{
               return <ItemSetting 
               key={index}
                iconLeft={get(item,"iconLeft")}
                textLeft={get(item,"textLeft").t()}
                iconRight={get(item,"iconRight")}
                isBorder
                colorIcon={colors.text}
                sizeIconLeft={{width:20,height:20}}
                sizeIconRight={15}
                onPress={get(item,"onPress")}
               />
           })}
        </Container>

    );
}
const stylest = StyleSheet.create({
    container:{
        alignItems:"center",
        height:120,
        justifyContent:"center",
        borderBottomWidth:0.5,
        borderBottomColor:colors.line,
        marginTop:-15
    },
    logo:{
        height: 45, width: 200
    }
})
export default SupportScreen;
