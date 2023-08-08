import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-virtualized-view';
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { Separator } from '../components';
import { Display } from '../utils';

const SongInfoScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    console.log(route.params)
    const albumUrl = route?.params?.item?.track?.album?.uri;
    const [tracks, setTracks] = useState([]);
    //console.log(albumUrl);
    const albumId = albumUrl.split(":")[2];
    console.log(albumId);
    useEffect(() => {
        async function fetchSongs() {
            const accessToken = await AsyncStorage.getItem("access_token");
            try {
                const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                if (!response.ok) {
                    throw new Error("failed to fetch the tracks");
                }
                const data = await response.json();
                const tracks = data.items
                setTracks(tracks);
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchSongs()
    }, [])
    console.log(tracks);
    return (
        <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
            <Separator height={Display.setHeight(3)} />
            <ScrollView>
                <View style={{ flexDirection: "row-reverse", padding: 12 }}>
                    <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={24} color="white" />
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Image style={{ width: 200, height: 200 }} source={{ uri: route?.params?.item?.track?.album?.images[0].url }} />
                    </View>
                </View>
                <Text style={styles.TextLabel}>{route?.params?.item?.track?.name}</Text>
                <View style={{ marginHorizontal: 12, flexDirection: "row-reverse", alignSelf: "flex-start", flexWrap: "wrap", marginTop: 10, gap: 7 }}>
                    {route?.params?.item?.track?.artists?.map((item, index) => (
                        <Text style={{ color: "#909090", fontSize: 13, fontWeight: '500' }}>{item.name}</Text>
                    ))}
                </View>
                <Separator height={Display.setHeight(3)} />
                <Pressable style={styles.playContainer}>
                    <Pressable style={styles.downloadContainer}>
                        <AntDesign name="arrowdown" size={24} color="white" />
                    </Pressable>
                    <View style={{ flexDirection: "row-reverse", alignItems: 'center', gap: 10 }}>
                        <MaterialCommunityIcons name="cross-bolnisi" size={24} color="#1DB954" />
                        <Pressable style={styles.controllerPlay} >
                            <Entypo name="controller-play" size={24} color="white" />
                        </Pressable>
                    </View>
                </Pressable>
                <View>
                    <View style={{ marginTop: 10, marginHorizontal: 12, }}>
                        {tracks?.map((track, index) => (
                            <Pressable style={{ marginVertical: 10, flexDirection: "row", justifyContent: "space-between", }}>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: "white" }}>{track?.name}</Text>
                                    <View style={{ flexDirection: "row-reverse", alignItems: 'center', gap: 8, marginTop: 5, }}>
                                        {track?.artists?.map((item, index) => (
                                            <Text style={{ fontSize: 16, fontWeight: '500', color: "gray" }}>{item?.name}</Text>
                                        ))}
                                    </View>
                                </View>
                                <Entypo name="dots-three-vertical" size={24} color="white" />
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default SongInfoScreen

const styles = StyleSheet.create({
    TextLabel: {
        color: "white",
        marginHorizontal: 12,
        marginTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
    },
    downloadContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignSelf: "center",
        backgroundColor: "#1DB954",
        justifyContent: 'center',
        alignItems: 'center',
    },
    controllerPlay: {
        width: 60,
        height: 60,
        borderRadius: 35,
        alignSelf: "flex-end",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1DB954",
    },
    playContainer: {
        flexDirection: "row-reverse",
        alignItems: 'center',
        justifyContent: "space-between",
        marginHorizontal: 10,
    },

})