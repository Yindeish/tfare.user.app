import { Redirect, Stack, Tabs } from 'expo-router';
import { Dimensions, View, } from 'react-native';
import { useSession } from '../../contexts/userSignedInContext';
import { tabs } from '@/constants/tabs';
import Colors, { colors } from '@/constants/Colors';
// import HomeSVG from '@/components/svg/home';
// import HomeSVG from '@/components/svg/home.svg';
import TabBartTitle from '@/components/tab/tabTitle';
import { images } from '@/constants/images';
import { IUser } from '@/state/types/account';
import { pages } from '@/constants/pages';
import { Image } from 'expo-image';


export default function AppLayout() {
  const { userSession, isLoading, } = useSession();

  const { width, height } = Dimensions.get('window');

  if (isLoading) {
    return <View style={{ width, height, backgroundColor: '#D8D8D8' }} />;
  }

  if (!userSession) {
    return <Redirect href="/(auth)/signin" />;
  }

  else return <Tabs screenOptions={{ tabBarActiveTintColor: Colors.light.background, headerShown: false }}>
    <Tabs.Screen
      name={tabs.home}
      options={{
        tabBarStyle: {
          backgroundColor: colors.white,
        },
        tabBarLabel: ({ color }) => <TabBartTitle title='Home' color={color} />,
        // tabBarIcon: ({ color }) => <HomeSVG width={20} height={20} />,
        // tabBarIcon: ({ color }) => <HomeSVG color={color} />,
        tabBarIcon: ({ color, focused }) => <Image style={{ width: 18, height: 19.72 }} source={focused ? require('@/assets/images/icons/active-home-image.png') : require('@/assets/images/icons/home-image.png')} />,
        //   tabBarActiveBackgroundColor: colors.white
        // }}
        // tabBarIcon: ({ color, focused }) => <Image style={{ width: 30, height: 50 }} source={focused ? require('@/assets/images/icons/active-home-image.png') : require('@/assets/images/icons/home-image.png')} />,
        // tabBarActiveBackgroundColor: colors.white
        // tabBarIcon: ({ color, focused }) => <Image style={{ width: 30, height: 50 }} source={require('@/assets/images/icons/active-home-image.png')} />,
        // tabBarActiveBackgroundColor: colors.white
      }}
    />
    <Tabs.Screen
      name={tabs.trip}
      options={{
        tabBarLabel: ({ color }) => <TabBartTitle title='Trip' color={color} />,
        tabBarIcon: ({ color, focused }) => <Image style={{ width: 22, height: 19 }} source={focused ? images.activeTripImage : images.tripImage} />,
      }}
    />
    <Tabs.Screen
      name={tabs.offer}
      options={{
        tabBarLabel: ({ color }) => <TabBartTitle title='Offers' color={color} />,
        tabBarIcon: ({ color, focused }) => <Image style={{ width: 20.12, height: 19.43 }} source={focused ? images.activeOffersImage : images.offersImage} />,
      }}
    />
    <Tabs.Screen
      name={tabs.account}
      options={{
        tabBarLabel: ({ color }) => <TabBartTitle title='Account' color={color} />,
        tabBarIcon: ({ color, focused }) => <Image style={{ width: 15, height: 18 }} source={focused ? images.activeAccountImage : images.accountImage} />,
      }}
    />
  </Tabs>
}



