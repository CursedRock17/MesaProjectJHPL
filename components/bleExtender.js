import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Button, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { Base64 } from 'js-base64';

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

          <View style={styles.circleDisplay}>
            <Text style ={styles.normalText}> {"Connect to the Respiration Device to see BPM"} </Text>
          </View>

        <View style={styles.buttonList}>
          <TouchableOpacity
                style={styles.connectButton}
                onPress={componentWillMount}
            >
                <Text style={{ fontSize: 50 }}> 🔌 </Text>
          </TouchableOpacity>

          <TouchableOpacity
                style={styles.connectButton}
                onPress={loadListComponent}
            >
                <Text style={{ fontSize: 50 }}> 🗂️ </Text>
          </TouchableOpacity>
        </View>
          </>
        )
      }

      const uARTService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
      const rxChar = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
      const txChar = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

      let animationValueHolder = new Animated.Value(1)

    const [connectedState, setConnectedState] = useState(false);
    const [ deviceState, setDeviceState ] = useState("Connect to the Respiration Device")
    const [ bleDevice, setBleDevice ] = useState()
    const [ renderState, setRenderState ] = useState(false)
    const [ animationValue, setAnimationValue ] = useState(animationValueHolder);
    const [ resetNumber, setResetNumber ] = useState(0)
    const [ alertMessage, setAlertMessage ] = useState("Select Your Rate")

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

  //Reset funciton that writes data to device

  const reRender = async () => {
    if(!renderState){
      setRenderState(true);

      setResetNumber(1)
      setTimeout(() => {
        setResetNumber(0)
      }, 1000)
    }

    else {
      setRenderState(false);
    }

  }

  const jiggleSet = {

      transform : [
        {
          scale : animationValue
        }
      ]

    }

  const loadListComponent = () => {
    Alert.alert(
        "BPM Rates: ",
        `${alertMessage}`,
        [
          {
            text: "Less than 10 or Greater than 100",
            onPress: () => setAlertMessage("Immediate Danger"),
            style: "cancel"
          },
          {
            text: "Between 10 and 20 or 70 and 100",
            onPress: () => setAlertMessage("Critcal Warning"),
            style: "cancel"
          },
          {
            text: "Between 20 and 40 or 60 and 70",
            onPress: () => setAlertMessage("Slighty around Average, be cautious"),
            style: "cancel"
          },
          {
            text: "Between 40 and 60",
            onPress: () => setAlertMessage("Perfect Average for Toddler"),
            style: "cancel"
          },
          {
            text: "Cancel",
            onPress: () => console.log("Perfect Average for Toddler"),
            style: "cancel"
          },
        ]
      );
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

    const jiggleStyle = () => {
      Animated.timing(animationValue, {
      toValue : 1.2,
      timing : 300,
      useNativeDriver: false
    }).start(()=>{
      Animated.timing(animationValue,{
        toValue : 1,
        duration : 300,
        useNativeDriver: false
      }).start();
    })
  }


      useEffect(() => {
          manager.onDeviceDisconnected(bleDevice, (error, bleDevice) => {
            console.log("DeviceState:",  deviceState)
          })

          const beats = setInterval(() => {
              jiggleStyle();
            }, 3000);
      }, []);

      return (
        <View style={styles.middleSection}>
        { bleDevice != null ?
        <>

        <Text style= {styles.normalText} >
          {deviceState} Safe Sleeper
        </Text>

        <Animated.View style={[styles.circleBPMDisplay, jiggleSet]}>
            <DataReader bleDevice={bleDevice} resetNumber={resetNumber} setBleDevice={() => setBleDevice()} />
        </Animated.View>

        <View style={styles.ender}>
        <View style={styles.buttonList}>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={reRender}
            >

            <Text style={{fontSize: 50}}> 🔄 </Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.connectButton}
                  onPress={disconnectDevice}
                  >
              <Text style={{fontSize: 50}}> 🔓 </Text>
              </TouchableOpacity>
        </View>
        </View>
        </>
        :
        <>
        <ConnectedButton />
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
     backgroundColor: "#adadad",
     alignItems: 'center',
     justifyContent: 'center',
     marginTop:10,
     paddingTop:15,
     paddingBottom:15,
     marginLeft:30,
     marginRight:30,
     borderRadius:10,
     borderWidth: 1,
     borderColor: '#fff',
     height: 100,
     width: 100,
     flex: 1,
   },
   circleDisplay: {
     alignItems: 'center',
     borderRadius: 300/2,
     height: 300,
     width: 300,
     marginLeft: 50,
     marginRight:50,
     marginTop: 50,
     marginBottom: 50,
     backgroundColor: '#c9e265',
     justifyContent: 'center',
   },
   circleBPMDisplay: {
     alignItems: 'center',
     backgroundColor: '#c9e265',
     justifyContent: 'center',
     width: 200,
     height: 200,
     borderRadius: 200/2,
   },
   buttonList: {
     alignItems: 'center',
     flexDirection: 'row',
     justifyContent: 'flex-end',
  },
   title: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'stretch',
     padding: 10,
     justifyContent: 'flex-start',
   },
   ender: {
     flex: 1,
     alignItems: 'flex-end',
     justifyContent: 'flex-end',
   },
   middleSection: {
     flex: 5,
     alignItems: 'center',
     justifyContent: 'flex-start',
   },
   normalText: {
     fontSize: 25,
     color: 'black',
     paddingLeft: 15,
     paddingRight: 15,
     paddingTop: 15,
     paddingBottom: 15,
   },
   bpmText: {
     fontSize: 50,
     color: 'black',
     padding: 35,
   }
});

export { Extendor }

/*

*/
