import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KoiScreen from './KoiScreen';
import HomeScreen from './HomeScreen';
// import CartScreen from './CartScreen';
import AccountScreen from './AccountScreen';
import KoiDetail from './KoiDetail';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'HomeScreen') {
                        iconName = 'home';
                    } else if (route.name === 'CartScreen') {
                        iconName = 'cart';
                    } else if (route.name === 'KoiScreen') {
                        iconName = 'fish';
                    } else if (route.name === 'AccountScreen') {
                        iconName = 'account';
                    }

                    return <Icon name={iconName} color={color} size={size} />;
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#FF6633',
                tabBarInactiveTintColor: '#000',
                tabBarStyle: { backgroundColor: '#66FF99' },
            })}>
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="KoiScreen" component={KoiScreen} />
            <Tab.Screen name="KoiDetail" component={KoiDetail} />
            <Tab.Screen name="AccountScreen" component={AccountScreen} />
        </Tab.Navigator>
    );
}