//import liraries
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-virtualized-view';
import { Separator } from '../components';
import { Display } from '../utils';

// create a component
const ProfileScreen = () => {
    const [useProfile, setUseProfile] = useState(null);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const getPlaylists = async () => {
            try {
                const accessToken = await AsyncStorage.getItem("access_token");
                const response = await axios.get(
                    "https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
                )
                setPlaylists(response.data.items)
            } catch (error) {
                console.log("Error retrieving playlists", error)
            }
        }
        getPlaylists()
    }, [])

    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        console.log("hi")
        const accessToken = await AsyncStorage.getItem("access_token");
        console.log("access token", accessToken)
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            })
            const data = await response.json();
            setUseProfile(data);
            return data;
        } catch (err) {
            console.log("error my friend", err.message)
        }
    }

    console.log(playlists)
    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <Separator height={Display.setHeight(5)} />
            <ScrollView>
                <View style={{ padding: 15 }}>
                    <View style={{ flexDirection: "row-reverse", alignItems: 'center', gap: 10 }}>
                        <Image
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                resizeMode: "cover",
                                alignSelf: "flex-end",

                            }}
                            source={{ uri: useProfile?.images[0].url }}
                        />
                        <View>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{useProfile?.display_name}</Text>
                            <Text style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}>{useProfile?.email}</Text>
                        </View>
                    </View>
                </View>
                <Text style={{ color: "white", fontSize: 20, fontWeight: 'bold', marginHorizontal: 15, }}>Your Playlists</Text>
                <View style={{ padding: 15, alignSelf: "flex-end" }}>
                    {playlists.map((item, index) => (
                        <View style={{ flexDirection: "row-reverse", alignItems: 'center', gap: 8, marginVertical: 8, }}>
                            <Image source={{
                                uri: item?.images[0]?.url ||
                                    "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800"
                            }}
                                style={{ width: 50, height: 50, borderRadius: 4, alignSelf: "flex-end", }}
                            />
                            <View>
                                <Text style={{ color: "white" }}>{item?.name}</Text>
                                <Text style={{ color: "white", marginTop: 7, }}>0 followers</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "black",
    },
});

//make this component available to the app
export default ProfileScreen;
