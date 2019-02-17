import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './Home'
import myapp from './MainPage'
import MapPage from './MapPage'
export const MainNavigator = createStackNavigator({
  Home: {screen: Home},
  MapScreen: {screen: myapp},
  Map:{screen: MapPage}
});

const App = createAppContainer(MainNavigator);

export default App;