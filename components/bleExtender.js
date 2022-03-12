import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Button, SafeAreaView } from 'react-native';

import {
  BleManager,
  State,
  Device,
  BleError,
  Subscription }
  from "react-native-ble-plx";

import React, { useState, createContext, useContext, useEffect } from 'react';
import { DataReader } from './services'

  const manager = new BleManager({
    restoreStateIdentifier: 'BleInTheBackground',
    restoreStateFunction: restoredState => {
      if (restoredState == null) {
        // BleManager was constructed for the first time.
  } else {
    // BleManager was restored. Check `restoredState.connectedPeripherals` property.
      }
    },
  });

/*We begin by creating the one and only instance of BleManager to call the APIs, then create a component
The component checks if Ble is powered on, then searches for availble devices, trying to find the Adafruit
this Adafruit will be found or the timer will end the search, we then setState for jsx comps and stop search
*/

    const Extendor = () => {

      const ConnectedButton = () => {

        return (
          <>
          <Button
                style={styles.connectButton}
                title="Connect Device"
                onPress={componentWillMount}
            />
          <Text style ={styles.normalText}> {"Connect to the Respiration Device"} </Text>
          </>
        )
      }

      const uARTService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
      const rxChar = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
      const txChar = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

    const [connectedState, setConnectedState] = useState(false);
    const [ deviceState, setDeviceState ] = useState("Connect to the Respiration Device")
    const [ bleDevice, setBleDevice ] = useState()


    const componentWillMount = () => {
      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            scanTime();
            subscription.remove();
        }
    }, true);
}

  const disconnectDevice = () => {
    manager.cancelDeviceConnection(bleDevice.id);
    setBleDevice(null)
    setDeviceState("Connect to the Respiration Device");
  }

  const scanTime = () => {
    manager.startDeviceScan([uARTService], {allowDuplicates: true}, (error, device) => {

              setDeviceState("Loading...")

              if (error) {
                console.warn(JSON.stringify(error));
              }

              if(device.name === 'Adafruit Bluefruit LE') {

                device.connect();

                manager.stopDeviceScan();
                setDeviceState("All Connected to")

                setBleDevice(device)

                device = bleDevice

              }
        });
      }

      useEffect(() => {
          manager.onDeviceDisconnected(bleDevice, (error, bleDevice) => {
            console.log("DeviceState:",  deviceState)
          })
      }, []);

      return (
        <View style={styles.middleSection}>
        { bleDevice != null ?
        <>
        <Button
          style={styles.connectButton}
          title="Disconnect Device"
          onPress={disconnectDevice}
        />
        <Text style= {styles.normalText} >
          {deviceState} {bleDevice.name}
        </Text>
        <Text style={styles.normalText}>
          BPM:
          <DataReader bleDevice={bleDevice} setBleDevice={() => setBleDevice()} />
        </Text>
          <Text style= {styles.bpmText}>
        </Text>
        </>
        : <ConnectedButton />
      }

      {deviceState == "Loading..." ?
        <Button
          title = "Cancel"
          onPress={() => console.log("Disconnect and set Loading")}
        />
        :
        <>
        </>
    }
        </View>
      )
}; //Extendor ending parenthesis

//The return statement is a few simple buttons and text with dynamic blocks of
//jsx code and jsx fragments(<> and </>) to allow for the use of custom comps.
//Accesses the StyleSheet in order to make the layout look nice seen with the respective styles

//Basic Styles StyleSheet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
   connectButton: {
     color: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
     padding: 20,
   },
   title: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'stretch',
     padding: 10,
     justifyContent: 'flex-start',
   },
   middleSection: {
     flex: 5,
     alignItems: 'center',
     justifyContent: 'flex-start',
   },
   normalText: {
     fontSize: 30,
     color: 'white',
   },
   bpmText: {
     fontSize: 15,
     color: 'white',
     padding: 35,
   }
});

export { Extendor }

/*

*/
