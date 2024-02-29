import * as React from 'react';
import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DrawerBarContent from './src/drawerBar/DrawerBarContent';
import {useColorScheme} from 'react-native';
import {userStore} from './src/store/useStore';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://cc59228a70f3cb8927602390400d772a@o4506451331579904.ingest.us.sentry.io/4506451334004736',
});

const Drawer = createDrawerNavigator();

function DrawerBarContentComponent(
  props: DrawerContentComponentProps,
): React.JSX.Element {
  return <DrawerBarContent {...props} />;
}

function App() {
  const {isDarkMode, setIsDarkMode} = userStore(state => ({
    isDarkMode: state.isDarkMode,
    setIsDarkMode: state.setIsDarkMode,
  }));

  const isDark = useColorScheme() === 'dark';

  React.useEffect(() => {
    setIsDarkMode(isDark);
    console.log(isDarkMode);
  }, [isDark, isDarkMode, setIsDarkMode]);

  React.useEffect(() => {
    const changeSystemNavColor = async () => {
      await SystemNavigationBar.setNavigationColor(
        isDark ? '#101010' : '#E5E5E5',
      );
      await SystemNavigationBar.setNavigationBarContrastEnforced(true);
    };
    changeSystemNavColor();
  }, [isDark]);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Chat"
        screenOptions={{
          drawerType: 'back',
          headerStyle: {
            backgroundColor: 'blue',
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 0,
          },

          headerTintColor: 'white',
          headerTransparent: true,
          keyboardDismissMode: 'on-drag',
          drawerStyle: {
            backgroundColor: '#fff',
          },
        }}
        drawerContent={DrawerBarContentComponent}>
        <Drawer.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            title: 'Chat Bot',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            swipeEnabled: false,
            headerShown: false,
            drawerLabel: 'Profile',
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
