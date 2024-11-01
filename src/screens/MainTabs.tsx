import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KoiScreen from './KoiScreen';
import HomeScreen from './HomeScreen';
import AccountScreen from './AccountScreen';
import CartScreen from './CartScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Cart') {
                        iconName = 'cart';
                    } else if (route.name === 'Koi') {
                        iconName = 'fish';
                    } else if (route.name === 'Account') {
                        iconName = 'account';
                    }

                    return <Icon name={iconName} color={color} size={size} />;
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#FF6633',
                tabBarInactiveTintColor: '#000',
                tabBarStyle: { backgroundColor: '#66FF99' },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Koi" component={KoiScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
}
