
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LayoutSplashScreen } from '../../components';
import WellCome from '../../components/WellCome';
import Input from '../../components/Input';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';
import ButtonWithTitle from '../../components/Button/ButtonWithTitle';
import Icon from '../../components/Icon';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';
import { CHECK_LOGIN, useActionsAuthen, CONFIRM_2FA_CODE } from '../../redux/modules/authentication/actions';
import { createAction, size, toast, listenerEventEmitter, get } from '../../configs/utils';
import { useDispatch,useSelector } from "react-redux"
import { pop, pushSingleScreenApp } from '../../navigation/Navigation';
import { REGISTER_SCREEN } from '../../navigation';
import { constant } from '../../configs/constant';
import { useActionsMarket } from '../../redux';
import { GET_ASSET_SUMARY, GET_WITHDRAW_COIN_LOG, GET_WITHDRAW_FIAT_LOG, GET_DEPOSIT_COIN_LOG, GET_DEPOSIT_FIAT_LOG } from '../../redux/modules/wallet/actions';
const ConfirmLoginScreen = ({
  componentId,
  email,
  ipAddress,
  password,
  twoFactorType,
  ...rest
}) => {
  const [otp, setOtp] = useState("");
  const dispatcher = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const [sessionId, setSessionId] = useState(rest.sessionId);
  const userInfo = useSelector(state => state.authentication.userInfo);
  const marketWatch = useSelector(state => state.market.marketWatch);
  useActionsMarket().handleGetCryptoWallet(get(userInfo,"id"));
  useActionsMarket().handleGetFiatWallet(get(userInfo,"id"));
  useEffect(() => {
    dispatcher(createAction(GET_ASSET_SUMARY,{
      UserId:get(userInfo,"id"),
      marketWatch
    }))
    dispatcher(createAction(GET_WITHDRAW_COIN_LOG, {
      UserId:get(userInfo, "id"),
      pageIndex: 1
    }))
    dispatcher(createAction(GET_WITHDRAW_FIAT_LOG, {
      UserId:get(userInfo, "id"),
      pageIndex: 1
    }))
    dispatcher(createAction(GET_DEPOSIT_COIN_LOG, {
      UserId:get(userInfo, "id"),
      pageIndex: 1
    }))
    dispatcher(createAction(GET_DEPOSIT_FIAT_LOG, {
      UserId:get(userInfo, "id"),
      pageIndex: 1
    }))
  }, [userInfo,marketWatch])
  useEffect(() => {
    const emitterData = listenerEventEmitter(constant.EVENTS_DEVICE.onAPI, (data) => {
      if (get(data, "sessionId")) {
        setSessionId(get(data, "sessionId"))
      }
      setDisabled(false);
    });
    setSessionId(rest.sessionId)
    return () => {
      emitterData.remove();
    };
  }, [rest.sessionId])
  const handleLogin = () => {

    let dataConfirm = {
      otp,
      email,
      sessionId,
      ipAddress
    }
    if (size(otp) === 0) {

      toast("Please enter 2FA code".t())
    } else {
      setDisabled(true)
      dispatcher(createAction(CONFIRM_2FA_CODE, dataConfirm))
    }


  }
  const handleResend = () => {
    let dataLogin = {
      email,
      password,
      ipAddress,
      isResend: true
    }
    dispatcher(createAction(CHECK_LOGIN, dataLogin))
  }
  return (
    <LayoutSplashScreen
      isLoadding={disabled}
    >
      <View style={stylest.title}>
        <TextFnx size={25} color={colors.tabbarActive} weight={"bold"} value={"LOGIN".t()} />
      </View>
      <Input
        isIconLeft
        nameIconLeft={"key"}
        onSubmitEditing={handleLogin}
        handleResend={handleResend}
        value={otp}
        onChangeText={(text) => setOtp(text)}
        isPaste
        spaceVertical={10}
        isResend={twoFactorType === constant.TWO_FACTOR_TYPE.EMAIL_2FA}
        placeholder={"2FA_CODE".t()} isCircle />
      <Button
        disabled={disabled}
        onSubmit={handleLogin}
        spaceVertical={10}
        isSubmit
        isButtonCircle />

      <View style={stylest.textRegister}>
        <TextFnx space={10} value={`${"NOT_REGISTERED_YET".t()} `} />
        <ButtonWithTitle space={10} onPress={() => pushSingleScreenApp(componentId, REGISTER_SCREEN)} color={colors.highlight} title={"REGISTER".t()} />
      </View>
      <ButtonWithTitle onPress={() => pop(componentId)} style={[stylest.textRegister, { alignItems: 'center', }]}>
        <Icon name="arrow-left" color={colors.background} />
        <TextFnx value={` ${"BACK".t()}`} />
      </ButtonWithTitle>
      <ButtonFooterAuth />
    </LayoutSplashScreen>
  );
}
const stylest = StyleSheet.create({
  title: {
    alignItems: "center",
    paddingTop: 65,
    paddingBottom: 10
  },
  textRegister: {
    flexDirection: "row",
    justifyContent: "center"
  },
  textBottom: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "120%",
    left: "-10%"
  }
})
export default ConfirmLoginScreen;
