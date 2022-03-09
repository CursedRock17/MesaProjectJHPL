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

    const manager = new BleManager();

/*We begin by creating the one and only instance of BleManager to call the APIs, then create a component
The component checks if Ble is powered on, then searches for availble devices, trying to find the Adafruit
this Adafruit will be found or the timer will end the search, we then setState for jsx comps and stop search
*/

    const Extendor = () => {

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
    const ender = manager.cancelDeviceConnection(bleDevice.id);
    setBleDevice(null)
    console.log("Ballz", bleDevice)
  }

  const scanTime = () => {
    manager.startDeviceScan(null, null, (error, device) => {

              setDeviceState("Loading...")

              if (error) {
                console.warn(JSON.stringify(error));
              }

              if(device.name === 'Adafruit Bluefruit LE') {

                manager.stopDeviceScan();
                setDeviceState("All Connected to")

                setBleDevice(device)

                device = bleDevice

                console.log(bleDevice);

              }
        });
      }

      useEffect(() => {

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
          <DataReader bleDevice={bleDevice} />
        </Text>
          <Text style= {styles.bpmText}>
        </Text>
        </>

        : <>
        <Button
              style={styles.connectButton}
              title="Connect Device"
              onPress={componentWillMount}
          />
        <Text style ={styles.normalText}> {deviceState} </Text>
        </>
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
  TODO: Create a disconnect function that works normally
  Disconnect device if the user leaves the app or something like that
  Add a cancel button during loading process in case they get stuck
  or just create a 10 seconds timer, that's pry easier

  Also - Comment code for judges and everybody else and add notifactions
  (Do notifications on Friday and Thursday)
*/
