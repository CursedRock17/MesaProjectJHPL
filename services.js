import React, { useState, useEffect } from 'react'
import {View, SafeAreaView, Text, Button, ImageBackground} from 'react-native'
import { Device, Service, Characteristic, Descriptor} from 'react-native-ble-plx'
import { Extendor } from 'bleExtender'

//Currently these are the channels that rx and tx use for the uART serivce
//Must pass props in order to get the device (bleDevice) and gain our information
const DataReader = ( props ) => {
  const uARTService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
  const rxChar = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
  const txChar = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

  const [ testState, setTestState ] = useState(false)

  useEffect(() => {
      console.log("New Component", props.bleDevice.id)
  })

  const sayHello = () => {
    if(!testState){
      setTestState(true);
    }

    else {
      setTestState(false);
    }

  }

  return (
    <>
    <Text>
      {props.bleDevice.id}
    </Text>
    <Button
      title="Hello"
      onPress={sayHello}
    >
    </Button>
    </>
  )
}

export { DataReader }

/*
  We have access to our device in the bleExtender so we need to pull all
  of the data from it (bleDevice) we need the ble64.js library and have to update
  the number on the screen, when the Adafruit updates
*/
