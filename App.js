import React, {useCallback, useState, useEffect} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  Modal,
  Alert,
  Button,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import DeviceInfo from 'react-native-device-info';

const App = () => {
  const [showUpdate, setshowUpdate] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  let appURL = '';
  useEffect(() => {
    async function getFirebaseData() {
      const version = await DeviceInfo.getVersion();
      const build = await DeviceInfo.getBuildNumber();

      console.log(version, build);

      const fetch = await remoteConfig().fetch(0);
      const activated = remoteConfig().activate();
      console.log('fetch', fetch, activated);
      if (activated) {
        const force_update_required = remoteConfig().getValue(
          'force_update_required',
        );
        const force_update_current_version = remoteConfig().getValue(
          'force_update_current_version',
        );
        appURL = remoteConfig().getValue('force_update_store_url').asString();
        console.log(
          'build force_update_required',
          force_update_required.asBoolean(),
          force_update_current_version.asString(),
          appURL,
        );

        if (
          force_update_required.asBoolean() &&
          version !== force_update_current_version.asString()
        ) {
          console.log('Inside IF');
          setshowUpdate(force_update_required.asString());
        }
      }
    }
    getFirebaseData();
  }, [showUpdate]);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  console.log('showupdate', showUpdate);
  console.log('appURL outside useeffect', appURL);
  const onPress = () => {
    Alert.alert('', 'Update the app', [
      {
        onPress: () => {
          if (Platform.OS === 'android') {
            Linking.canOpenURL(`market://details?id=${1}`)
              .then(() => {
                Linking.openURL(`market://details?id=${1}`);
              })
              .catch();
          } else if (Platform.OS === 'ios') {
            console.log('appURL:', appURL);
            Linking.canOpenURL(appURL)
              .then(() => Linking.openURL(appURL))
              .catch();
          }
        },
      },
    ]);
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        {showUpdate ? (
          <Modal animationType="fade" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.card}>
                <Text style={styles.title}>Your version is outdated !</Text>
                {/* <TouchableOpacity
                  onPress={onPress}
                  style={styles.redirectButton}>
                  <Text>Redirect to the store</Text>
                </TouchableOpacity> */}
                <Button
                  title="Redirect to the store"
                  onPress={onPress}
                  style={styles.redirectButton}></Button>
              </View>
            </View>
          </Modal>
        ) : (
          <View>
            <Text>App is up to date.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '15%',
    paddingVertical: '15%',
    background: 'rgba(0, 0, 0, 0.4)',
  },
  card: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  redirectButton: {
    alignItems: 'center',
    background: '#172b49',
    height: 30,
    paddingHorizontal: 5,
    justifyContent: 'center',
    width: 'auto',
  },
  redirectButtonText: {
    color: '#f4f5fd',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
