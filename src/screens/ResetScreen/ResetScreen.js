import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import { LayoutSplashScreen } from '../../components';
import { Navigation } from 'react-native-navigation';
import { ALERT_NOTICE_PASSWORD, PICKER_SEARCH, CONFIRM_RESET_SCREEN, ALERT_ACCOUNT_ACTIVE, pushSingleScreenApp } from '../../navigation';
import { hiddenModal, size, toast, validateEmail, get } from '../../configs/utils';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';
import { authService } from '../../services/authentication.service';
import ButtonBack from '../../components/Button/ButtonBack';

const ResetScreen = ({
    componentId
}) => {
    const [email, setEmail] = useState("");
    const [disabled, setDisabled] = useState(false);
    const handleNext = async () => {
        setDisabled(true);
        if (size(email) === 0) {
            setDisabled(false)
            return toast("PLEASE_ENTER_EMAIL".t());
        } else if (!validateEmail(email)) {
            setDisabled(false)
            return toast("PLEASE_INPUT_A_VALID_EMAIL".t())
        } else {
            let res = await authService.resetPassword(email);
            setDisabled(false)
            if (get(res, "status")) {
                pushSingleScreenApp(componentId,CONFIRM_RESET_SCREEN,{
                    sessionId: get(res, "otpToken.sessionId"),
                    email
                })
            } else if (get(res, "code") === 1) {
                Navigation.showModal(hiddenModal(ALERT_ACCOUNT_ACTIVE))
            } else {
                toast(get(res, "message").t())
            }
        }
    }

    return (
        <LayoutSplashScreen
        isLoadding={disabled}
        >
            <View style={stylest.title}>
                <TextFnx size={25} color={colors.tabbarActive} weight={"bold"} value={"RESET_PASSWORD".t()} />
            </View>
            <Input
            onSubmitEditing={handleNext}
                value={email}
                keyboardType={"email-address"}
                spaceVertical={10}
                isIconLeft
                nameIconLeft={"envelope"}
                placeholder={"Enter your email or phone".t()}
                isCircle
                onChangeText={(mail) => setEmail(mail)}
            />
            <Button
                disabled={disabled}
                onSubmit={handleNext}
                spaceVertical={10}
                isSubmit
                isButtonCircle
                textSubmit={"NEXT".t()}
            />
            <View style={stylest.layoutFooter}>
                <TextFnx style={stylest.noteReset} value={`${"NOTE_RESET_PASSWORD".t()} `} />
            </View>
            <ButtonBack 
            componentId={componentId}
            />
            <ButtonFooterAuth
                textLeft={""}
            />
        </LayoutSplashScreen>
    )
};
const stylest = StyleSheet.create({
    blockCheckbox: { flexDirection: "row", alignItems: "center" },
    title: {
        alignItems: "center",
        paddingTop: 65,
        paddingBottom: 10
    },
    textRegister: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10
    },
    textBottom: {
        position: "absolute",
        bottom: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "120%",
        left: "-10%"
    },
    noteReset: {
        textAlign: "center",
        color: colors.background,
        paddingVertical: 10,
    },
    layoutFooter: {
        width: "124%",
        marginLeft: "-12%",
    }
})
export default ResetScreen;
