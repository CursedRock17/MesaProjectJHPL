import React, { useState, useEffect } from 'react'
import {View, SafeAreaView, Text, Button, ImageBackground, Alert} from 'react-native'
import { Device, Service, Characteristic, Descriptor} from 'react-native-ble-plx'
import { Extendor } from './bleExtender'

//Currently these are the channels that rx and tx use for the uART serivce
//Must pass props in order to get the device (bleDevice) and gain our information
const DataReader =  ( props ) => {
  const uARTService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  const rxChar = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
  const txChar = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

  const [ renderState, setRenderState ] = useState(false)
  const [ characteristics, setCharacteristics] = useState([]);
  const [ rate, setRate ] = useState();

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

      currentChar.monitor((err, cha) => {
      if (err) {
        console.warn('ERROR', err);
        return;
      }

      setRate(atob(cha?.value));
    }, null);

    }

    getInformations();
    console.log("Rate: ",rate)
  } //End of check if device is connected

}) //useEffect ending

  const sayHello = async () => {
    if(!renderState){
      setRenderState(true);
    }

    else {
      setRenderState(false);
    }

  }

  return (
    <>
    <Text style={{ fontSize: 30, color: 'white' }}>
      {rate}
    </Text>
    <Button
      title="Refresh"
      onPress={sayHello}
    >
    </Button>
    </>
  )
}

export { DataReader }

/*
  This component goes through the process of fetching the device, it's Services
  The characteristics, the value, then processing the value to a number live
  after being rerendered. All in the order, as seen with the respective commands

*/
