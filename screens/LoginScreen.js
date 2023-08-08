//import liraries
import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { IconButton, Separator, TextButton } from '../components';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Display } from '../utils';
import { ResponseType, useAuthRequest } from 'expo-auth-session';

SplashScreen.preventAutoHideAsync();

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

// create a component
const LoginScreen = ({ navigation }) => {

    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: "d69447c78565485fa2a88eb33efd0107",
            clientSecret: "52302f3ab727477a99260e398de5299b",
            scopes: [
                "user-read-currently-playing",
                "user-read-recently-played",
                "user-read-playback-state",
                "user-top-read",
                "user-library-modify",
                "user-modify-playback-state",
                "streaming",
                "user-library-read",
                "user-read-email",
                "user-read-private",
                "playlist-read-collaborative",
                "playlist-modify-public",
                "playlist-modify-private"
            ],
            redirectUri: "exp://192.168.1.190:19000/--/spotify-auth-callback",
        },
        discovery
    );

    useEffect(() => {
        const handleAuthenticationResponse = async () => {
            if (response?.type === "success") {
                const { access_token } = response.params;
                await storeData(access_token); // שמירת ה-Access Token ב-AsyncStorage
                console.log("access_token", access_token);
                navigation.navigate("Main"); // ניווט לדף "Main"
            }
        };

        handleAuthenticationResponse();
    }, [response]);

    const storeData = async (token) => {
        try {
            await AsyncStorage.setItem("access_token", token)
        } catch (e) {
            console.log("Error", e)
        }
    }


    const [fontsLoaded] = useFonts({
        'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1, }}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container} onLayout={onLayoutRootView}>
                <Separator height={Display.setHeight(15)} />
                <Entypo style={{ textAlign: 'center', }} name="spotify" size={80} color="white" />
                <Text style={styles.TextLogo} >Million of Songs Free on spotify!</Text>
                <Separator height={Display.setHeight(10)} />
                <TextButton
                    ContainerStyle={styles.SpotifyButton}
                    text="Sign In width spotify"
                    onPress={() => promptAsync()}

                />
                <Separator height={Display.setHeight(2)} />
                <IconButton
                    ContainerStyle={styles.IconButton}
                    text="Continue with phone number"
                    icon="phone"
                    size={24}
                    color="white"
                    StyleText={styles.StyleText}
                />
                <Separator height={Display.setHeight(2)} />
                <IconButton
                    ContainerStyle={styles.IconButton}
                    text="Continue with Google" phone-and
                    icon="google"
                    size={24}
                    color="red"
                    StyleText={styles.StyleText}
                />
                <Separator height={Display.setHeight(2)} />
                <IconButton
                    ContainerStyle={styles.IconButton}
                    text="Continue with Facebook"
                    icon="facebook-square"
                    size={24}
                    color="#4267B2"
                    StyleText={styles.StyleText}
                />
            </View>
        </LinearGradient>
    );
};


// define your styles
const styles = StyleSheet.create({
    container: {},
    TextLogo: {
        color: "white",
        fontSize: 40,
        fontFamily: 'Inter-Black',
        fontWeight: "bold",
        textAlign: "center"
    },
    SpotifyButton: {
        backgroundColor: "#1DB954",
        paddingVertical: 10,
        marginHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    IconButton: {
        backgroundColor: "#131624",
        flexDirection: "row-reverse",
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "#C0C0C0",
        borderWidth: 0.8,

    },
    StyleText: {
        flex: 1,
        color: "white",
        fontWeight: '500',
        textAlign: "center",
    }
});

//make this component available to the app
export default LoginScreen;
