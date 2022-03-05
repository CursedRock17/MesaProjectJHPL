import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Button, SafeAreaView } from 'react-native';
import { BleManager, Device, DeviceId, Service, Subscription} from "react-native-ble-plx";
import React, { useState, createContext, useContext } from 'react';

  export const Extendor = () => {

    const [connectedState, setConnectedState] = useState(false);
    const manager = new BleManager();

    const componentWillMount = () => {
          setConnectedState(true);
    const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            scanAndConnect();
            subscription.remove();
        }
    }, true);
}

  const scanAndConnect = () => {
    manager.startDeviceScan(null, null, (error, device) => {

        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log(error);
        }
        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device.name === 'Adafruit Bluefruit LE') {

            // Stop scanning as it's not necessary if you are scanning for one device.
            manager.stopDeviceScan();

            // Proceed with connection.
            device.connect()
            .then((device) => {
              setConnectedState(true);
              let chars = device.discoverAllServicesAndCharacteristics()
              Alert.alert(chars);
              return device.discoverAllServicesAndCharacteristics()
            })
            .then((device) => {
              // Do work on device with services and characteristics
            })
            .catch((error) => {
              // Handle errors
              console.log(error);
            });
          }
          else {
            const hold = manager.isDeviceConnected();
            console.log(hold);
          }
        });
      }


      return(
        <View style={styles.middleSection}>
        <Text style ={{ fontSize: 25 }}> Shmog </Text>
        { connectedState ?
        <Text>
          All Connected, BPM:
        </Text>
        : <Button
              style={styles.connectButton}
              title="Connect Device"
              onPress={componentWillMount}
              />
      }
        </View>
      )
}; //class ending parenthesis

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
   }
});
