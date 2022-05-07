# MesaProjectJHPL

Competed in a state based MESA competition, in order to receive outputs from a device, our team created an app.

This app works with MicroSoft Makecode which was used to program the Adafruit Playground Express, in this case we used Adafruit's Flora Bluetooth

The app is quite simple it uses the BLEManager for React Native in order to actually take in low level coding from the actual Adafruit. From there the device can take in uART going in or out, through Rx and Tx points on the device. uART transmission are sent through Base64 encodings, thankfully Javascript has their own functions (atob and btoa), found at this link - https://developer.mozilla.org/en-US/docs/Web/API/atob

We use this algorithm to turn that data into real strings, which are displayed in the middle, there's also a button which sends out data towards the adafruit. These numbers can be toyed with in both MakeCode and then inside of the React Native code in order to fit a specific device.

In order to find our device, we would search until we found the device with the specific brand seen here - 

``` javascript
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
```

A big portion of the work comes from the BLEManager repository - https://github.com/dotintent/react-native-ble-plx
