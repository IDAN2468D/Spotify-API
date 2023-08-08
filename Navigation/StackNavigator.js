import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, LinkedSongScreen, LoginScreen, ProfileScreen } from '../screens';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import SongInfoScreen from '../screens/SongInfoScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: "rgba(0,0,0,0.9)",
                    position: 'absolute',
                    shadowOpacity: 4,
                    shadowRadius: 4,
                    elevation: 8,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderColor: "#000",
                    paddingVertical: 5,
                    shadowOffset: {
                        height: -4,
                        width: 0
                    },
                    borderTopWidth: 0
                }
            }}
        >
            <Tab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarLabel: "Profile",
                    headerShown: false,
                    tabBarLabelStyle: { color: "white" },
                    tabBarIcon: ({ focused }) => focused ? (
                        <Ionicons name="person" size={24} color="white" />
                    ) : (
                        <Ionicons name="person-outline" size={24} color="white" />
                    )
                }}

            />
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Home",
                    headerShown: false,
                    tabBarLabelStyle: { color: "white" },
                    tabBarIcon: ({ focused }) => focused ? (
                        <Entypo name="home" size={24} color="white" />
                    ) : (
                        <AntDesign name="home" size={24} color="white" />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
                <Stack.Screen name='LInked' component={LinkedSongScreen} options={{ headerShown: false }} />
                <Stack.Screen name='Info' component={SongInfoScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default Navigation