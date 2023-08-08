import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, Pressable, FlatList } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { ArtistsCard, RecentlyPlayedCard, Separator } from '../components';
import { Display } from '../utils';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [useProfile, setUseProfile] = useState();
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const navigation = useNavigation();
    const greetingMessage = () => {
        const currentTime = new Date().getHours();
        if (currentTime < 12) {
            return "Good Morning";
        } else if (currentTime < 16) {
            return "Good Afternoon"
        } else {
            return "Good Evening"
        }
    }
    const message = greetingMessage();

    const getProfile = async () => {
        const accessToken = await AsyncStorage.getItem("access_token");
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            })
            const data = await response.json();
            setUseProfile(data);
            return data;
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getProfile()
    }, [])
    console.log(useProfile);

    const getRecentlyPlayedSongs = async () => {
        const accessToken = await AsyncStorage.getItem("access_token");
        try {
            const response = await axios({
                method: "GET",
                url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const tracks = response.data.items;
            setRecentlyPlayed(tracks);
        } catch (err) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        getRecentlyPlayedSongs();
    }, []);
    console.log(recentlyPlayed);

    const renderItem = ({ item }) => {
        return (
            <Pressable
                style={{
                    flex: 1,
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    marginHorizontal: 10, marginVertical: 8,
                    backgroundColor: "#282828",
                    borderRadius: 4,
                    elevation: 3,
                }}
            >
                <Image style={{ width: 55, height: 55, }} source={{ uri: item.track.album.images[0].url }} />
                <View style={{ flex: 1, marginHorizontal: 8, justifyContent: 'center', }}>
                    <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: 'bold', color: "white" }}>{item.track.name}</Text>
                </View>
            </Pressable>
        )
    }

    function RecentlyPlayed({ item, index }) {
        return (
            <RecentlyPlayedCard item={item} key={index} />
        )
    }

    useEffect(() => {
        const getTopItem = async () => {
            try {
                const accessToken = await AsyncStorage.getItem("access_token");
                if (!accessToken) {
                    console.log("Access token not found");
                    return;
                }
                const type = "artists";
                const response = await axios(`https://api.spotify.com/v1/me/top/${type}`, {
                    //method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                setTopArtists(response.data.items)
            } catch (err) {
                console.log(err.message)
            }
        }
        getTopItem()
    }, [])
    console.log(topArtists);

    return (
        <LinearGradient colors={["#040306", "#131624"]} start={{ x: 0, y: 2 }} end={{ x: 3, y: 0 }} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View pagingEnabled={true} style={styles.HeaderContainer}>
                    <View style={styles.ImageContainer}>
                        {useProfile?.images && useProfile.images[0] && (
                            <Image style={styles.UserLogo} source={{ uri: useProfile?.images[0].url }} />
                        )}
                        <Text style={styles.TextMessage}>{message}</Text>
                    </View>
                    <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="white" />
                </View>
                <View style={styles.PressableContainer}>
                    <Pressable style={styles.Pressable}>
                        <Text style={styles.PressableText}>Music</Text>
                    </Pressable>
                    <Pressable style={styles.Pressable}>
                        <Text style={styles.PressableText}>Podcasts & Shows</Text>
                    </Pressable>
                </View>
                <Separator height={Display.setHeight(1)} />
                <View style={{ flexDirection: "row-reverse", alignItems: 'center', justifyContent: "space-between" }}>
                    <Pressable onPress={() => navigation.navigate("LInked")} style={styles.PressableItem}>
                        <LinearGradient colors={["#33006F", "#FFFFFF"]}>
                            <Pressable style={styles.PressableIcon}>
                                <AntDesign name="heart" size={24} color="white" />
                            </Pressable>
                        </LinearGradient>
                        <Text style={styles.ItemText}>Linked Song</Text>
                    </Pressable>
                    <View style={styles.PressableItem}>
                        <Image style={{ width: 55, height: 55, }} source={{ uri: "https://i.pravatar.cc/100" }} />
                        <View style={styles.randomArtist}>
                            <Text style={styles.ItemText}>Hiphop Tamhiza</Text>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={recentlyPlayed}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                />
                <Text
                    style={{
                        color: "white",
                        fontSize: 19,
                        fontWeight: 'bold',
                        marginHorizontal: 10,
                        marginTop: 10,
                    }}
                >Your Top Artists</Text>
                <FlatList
                    data={topArtists}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <ArtistsCard item={item} key={index} />
                    )}
                />
                <Separator height={Display.setHeight(1)} />
                <Text
                    style={{
                        color: "white",
                        fontSize: 19,
                        fontWeight: 'bold',
                        marginHorizontal: 10,
                        marginTop: 10,
                    }}
                >Recently Played</Text>
                <FlatList
                    data={recentlyPlayed}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={RecentlyPlayed}
                />
                <Separator height={Display.setHeight(6)} />
            </ScrollView>
        </LinearGradient>
    );
};

// define your styles
const styles = StyleSheet.create({
    UserLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignSelf: "flex-end",
        resizeMode: "cover",
    },
    TextMessage: {
        marginRight: 10,
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    ImageContainer: {
        marginHorizontal: 10,
        flexDirection: "row-reverse",
        alignItems: 'center',
    },
    HeaderContainer: {
        padding: 10,
        flexDirection: "row-reverse",
        alignItems: 'center',
        justifyContent: "space-between",
    },
    Pressable: {
        backgroundColor: "#282828",
        padding: 10,
        borderRadius: 30,
    },
    PressableText: {
        fontSize: 15,
        color: "white"
    },
    PressableContainer: {
        marginHorizontal: 10,
        marginVertical: 5,
        flexDirection: "row-reverse",
        alignItems: 'center',
        gap: 10,
    },
    PressableIcon: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    PressableItem: {
        marginBottom: 10,
        flexDirection: "row-reverse",
        alignItems: 'center',
        gap: 10,
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: "#202020",
        borderRadius: 4,
        elevation: 3
    },
    ItemText: {
        color: "white",
        fontSize: 13,
        fontWeight: 'bold',
    }
});

//make this component available to the app
export default HomeScreen;
