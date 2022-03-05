import { StyleSheet, Text, View, Button, SafeAreaView, Alert, Image, ImageBackground } from 'react-native';
import { BleManager, Device, DeviceId, Service, Subscription } from 'react-native-ble-plx';
import React, { useState, useContext } from 'react';
import { Extendor } from './bleExtender';

const kanye = { uri: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/cda1ea66315731.5b127ad13547f.jpg" };

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={{ fontSize: 55 }}> Title </Text>
      </View>
      <ImageBackground style={styles.imageStyles} source={kanye}>
        <Extendor />
      </ImageBackground>
    </SafeAreaView>
  );
}

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
   imageStyles: {
     flex: 10,
     alignItems: 'center',
     justifyContent: 'center',
     width: 300,
     height: 550,
   }
});

export default App;
