import React, {Component} from 'react';
import {AsyncStorage, View, Text, Alert, Linking} from 'react-native';
//import * as CONSTANTS from '../assets/constants/Constant';
import remoteConfig from '@react-native-firebase/remote-config';
import VersionNumber from 'react-native-version-number';

export default class RemoteConfig extends Component {
  async componentDidMount() {
    await remoteConfig()
      .setDefaults({
        base_url: 'testurl',
      })
      .then(() => remoteConfig().fetchAndActivate())

      .then(fetchedRemotely => {
        if (fetchedRemotely) {
          console.log(
            '+++Configs were retrieved from the backend and activated.',
          );
          console.log(fetchedRemotely);
        } else {
          console.log(
            '+++++No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      });

    //Code to get All parameters from Firebase Remote config
    const parameters = remoteConfig().getAll();
    Object.entries(parameters).forEach($ => {
      const [key, entry] = $;
      console.log('--Key: ', key);
      console.log('--Source: ', entry.getSource());
      console.log('--Value: ', entry.asString());
      console.log('--------------------------------');
    });

    //Get Firebase remote config parameters by key
    const baseUrl = remoteConfig().getValue('base_url');
    const is_force_update = remoteConfig().getBoolean(
      'force_update_current_version',
    );
    const build_version = remoteConfig().getValue('force_update_required');
    const playstore_url = remoteConfig().getValue('force_update_store_url');
    var bnewBuildVersion = build_version.asString();
    var playstoreUrl = playstore_url.asString();

    AsyncStorage.setItem('base_url', baseUrl.asString());
    console.log(
      '++++++++ ' +
        VersionNumber.appVersion +
        '+ ' +
        is_force_update +
        ' ' +
        playstoreUrl,
    );
  }

  render() {
    return <></>;
  }
}
