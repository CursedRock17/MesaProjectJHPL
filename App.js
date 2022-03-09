import { StyleSheet, Text, View, Button, SafeAreaView, Alert, Image, ImageBackground } from 'react-native';
import { BleManager, Device, DeviceId, Service, Subscription } from 'react-native-ble-plx';
import React, { useState, useContext } from 'react';
import { Extendor } from './bleExtender';
import { DataReader } from './services'

const backImage = { uri: "https://tse2.mm.bing.net/th?id=OIP.RYVznDEGM-r8C6dNTpLT9gHaEK&pid=Api&P=0&w=372&h=209" };
const otherIm = { uri: "https://tse4.mm.bing.net/th?id=OIP.YaqlKDmq0mPrnvljys4FFQHaEo&pid=Api&P=0&w=346&h=216"}
const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={otherIm}>
        <View style={styles.title}>
          <Text style={{ fontSize: 45 }}> Respiration Device </Text>
        </View>
        <ImageBackground style={styles.imageStyles} source={backImage}>
          <Extendor />
        </ImageBackground>
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
     width: 400,
     height: 550,
   }
});

export default App;
