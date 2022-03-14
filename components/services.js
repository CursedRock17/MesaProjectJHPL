import React, { useState, useEffect } from 'react';
import {View, SafeAreaView, Text, Button, ImageBackground, Alert} from 'react-native';
import { Device, Service, Characteristic, Descriptor} from 'react-native-ble-plx';
import { Extendor } from './bleExtender';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import { Base64 } from 'js-base64';

//Currently these are the channels that rx and tx use for the uART serivce
//Must pass props in order to get the device (bleDevice) and gain our information
const DataReader =  ( props ) => {
  const uARTService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  const rxChar = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
  const txChar = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

  const [ characteristics, setCharacteristics] = useState([]);
  const [ rate, setRate ] = useState();
  const [ triggerOnce, setTriggerOnce ] = useState(0)

  PushNotificationIOS.requestPermissions();

  useEffect(() => {

    props.bleDevice.onDisconnected((error, bleDevice) => {
      props.setBleDevice(null)
    })

    if(props.bleDevice.isConnected()){
      console.log("Connected")

      const getInformations = async () => {
      console.log("Discovering Services")

      const allServices = await props.bleDevice.discoverAllServicesAndCharacteristics();

      const discoveredServices = await allServices.services();

      discoveredServices.forEach(async (service) => {
        console.log(await service.characteristics())
      })

      const newCharacteristics = await discoveredServices[2].characteristics();
      const currentChar = newCharacteristics[0];
      const secondaryChar = newCharacteristics[1];

      currentChar.monitor((err, cha) => {
      if (err) {
        console.warn('ERROR', err);
        return;
      }

      var datar = Base64.atob(cha?.value)
      setRate(datar);
    }, null);


    if(props.resetNumber == 1){
      const baseOut = Base64.btoa("A");
      Alert.alert("Device Reset")

      secondaryChar.writeWithResponse(baseOut, null)
    }

    }

    getInformations();
    if(rate <= 5 && rate >= 0){
      setColor("Red")
      console.log("datar", rate)
      PushNotificationIOS.addNotificationRequest({
        id: "1",
        title: "Safe Sleeper",
        subtitle: "Your baby may be in serious trouble"
      });
    }
    console.log("Rate: ", rate)
  } //End of check if device is connected
  //Needed to use Base64.atob to decode the characteristic value for the BPM

}) //useEffect ending

  return (
    <>
    <Text style={{ fontSize: 50, color: "Black"}}>
      {rate}
    </Text>
    </>
  )
}

export { DataReader }

/*
  This component goes through the process of fetching the device, it's Services
  The characteristics, the value, then processing the value to a number live
  after being rerendered. All in the order, as seen with the respective commands

*/
