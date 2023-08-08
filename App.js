import { AppRegistry } from 'react-native';
import Navigation from './Navigation/StackNavigator';
import { PlayerContext } from './PlayerContext';
import { ModalPortal } from 'react-native-modals';

export default function App() {
  return (
    <PlayerContext>
      <Navigation />
      <ModalPortal />
    </PlayerContext>
  );
}

AppRegistry.registerComponent('Spotify', () => App);
