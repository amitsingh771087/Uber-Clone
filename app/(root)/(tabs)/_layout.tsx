import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";

const TabIcon = ({
  source,
  color,
  focused,
}: {
  source: ImageSourcePropType;
  color: string;
  focused: boolean;
}) => (
  <View className="items-center justify-center">
    <Image
      source={source}
      resizeMode="contain"
      tintColor={color}
      className={focused ? "h-7 w-7" : "h-6 w-6"}
    />
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0286FF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          height: 78,
          paddingBottom: 18,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Jakarta-SemiBold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={icons.home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={icons.list} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={icons.chat} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon source={icons.profile} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
