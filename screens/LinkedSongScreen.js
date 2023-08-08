//import liraries
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-virtualized-view';
import { Ionicons, AntDesign, Feather, FontAwesome, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { Separator, SongItem } from '../components';
import { Display } from '../utils';
import { Player } from '../PlayerContext';
import { BottomModal, ModalContent } from 'react-native-modals';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'debounce';

// create a component
const LinkedSongScreen = ({ navigation }) => {
    const [input, setInput] = useState("");
    const { currentTrack, setCurrentTrack } = useContext(Player);
    const [playPause, setPlayPause] = useState(false)
    const [savedTracks, setSavedTracks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentSound, setCurrentSound] = useState(null);
    const [searchedTracks, setSearchedTracks] = useState([]);
    const value = useRef(0);
    const [progress, setProgress] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    async function getSavedTracks() {
        const accessToken = await AsyncStorage.getItem("access_token");
        const response = await fetch(
            "https://api.spotify.com/v1/me/tracks?limit=50&offset=0",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    limit: 50,
                },
            }
        );

        if (!response.ok) {
            throw new Error("failed to fetch the tracks");
        }
        const data = await response.json();
        setSavedTracks(data.items);
    }
    useEffect(() => {
        getSavedTracks();
    }, []);
    //console.log(savedTracks);
    const playTrack = async () => {
        if (savedTracks.length > 0) {
            setCurrentTrack(savedTracks[0])
        }
        await play(savedTracks[0])
    }
    const play = async (nextTrack) => {
        //console.log(nextTrack)
        const preview_url = nextTrack?.track?.preview_url;
        try {
            if (currentSound) {
                await currentSound.stopAsync();
            }
            await Audio.setAudioModeAsync({
                playThroughEarpieceAndroid: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: false
            })
            const { sound, status } = await Audio.Sound.createAsync(
                {
                    uri: preview_url
                },
                {
                    didJustFinish: true,
                    isBuffering: true,
                    shouldPlay: true,
                    isLooping: false,
                },
                onPlaybackStatusUpdate,
            )
            //console.log("sound", status);
            onPlaybackStatusUpdate(status);
            setIsPlaying(status.isLoaded)
            setCurrentSound(sound);
            await sound.playAsync();
        } catch (err) {
            console.log(err.message)
        }
    }
    const onPlaybackStatusUpdate = async (status) => {
        //console.log(status);
        if (status.isLoaded && status.isPlaying) {
            const progress = status.positionMillis / status.durationMillis;
            //console.log("progress", progress);
            setProgress(progress);
            setCurrentTime(status.positionMillis);
            setTotalDuration(status.durationMillis);
        }
        if (status.didJustFinish === true) {
            setCurrentSound(null);
            playNextTrack();
        }
    };
    //console.log(currentTrack);
    const circleSize = 12;
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000 / 1000));
        return `${minutes}: ${seconds < 10 ? "0" : ""}${seconds}`
    }

    const handlePlayPause = async () => {
        if (currentSound) {
            if (isPlaying) {
                await currentSound.pauseAsync();
            } else {
                await currentSound.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    }

    const playNextTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }
        value.current += 1;
        if (value.current < savedTracks.length) {
            const nextTrack = savedTracks[value.current]
            setCurrentTrack(nextTrack)
            await play(nextTrack);
        } else {
            console.log("end of playlist")
        }
    }

    useEffect(() => {
        if (savedTracks.length > 0) {
            handleSearch(input)
        }
    }, [savedTracks])

    const playPreviousTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }
        value.current -= 1;
        if (value.current < savedTracks.length) {
            const nextTrack = savedTracks[value.current]
            setCurrentTrack(nextTrack)
            await play(nextTrack);
        } else {
            console.log("end of playlist")
        }

    }

    const debouncedSearch = debounce(handleSearch, 800);
    function handleSearch(text) {
        const filteredText = savedTracks.filter((item) =>
            item.track.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchedTracks(filteredText);
    }

    const handleInputChange = (text) => {
        setInput(text);
        debouncedSearch(text);
    }

    return (
        <>
            <LinearGradient colors={["#614385", "#516395"]} style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#614385" />
                <Separator height={Display.setHeight(1)} />
                <ScrollView style={{ flex: 1 }}>
                    <Pressable onPress={() => navigation.goBack()} style={{ marginHorizontal: 10, }}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </Pressable>
                    <Pressable style={styles.inputContainer}>
                        <Pressable
                            style={styles.inputText}>
                            <AntDesign name="search1" size={20} color="white" />
                            <TextInput
                                value={input}
                                onChangeText={(text) => handleInputChange(text)}
                                placeholder='Find in Liked songs'
                                placeholderTextColor={"white"}
                                style={{ fontWeight: '500', color: "white" }}
                            />
                        </Pressable>
                        <Pressable style={styles.sort}>
                            <Text style={{ color: "white" }}>Sort</Text>
                        </Pressable>
                    </Pressable>
                    <Separator height={Display.setHeight(5)} />
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }}>Liked Songs</Text>
                        <Text style={{ color: "white", fontSize: 13, marginTop: 5, }}>430 songs</Text>
                    </View>
                    <Pressable style={styles.playContainer}>
                        <Pressable style={styles.downloadContainer}>
                            <AntDesign name="arrowdown" size={24} color="white" />
                        </Pressable>
                        <View style={{ flexDirection: "row-reverse", alignItems: 'center', gap: 10 }}>
                            <MaterialCommunityIcons name="cross-bolnisi" size={24} color="#1DB954" />
                            <Pressable style={styles.controllerPlay} onPress={playTrack}>
                                <Entypo name="controller-play" size={24} color="white" />
                            </Pressable>
                        </View>
                    </Pressable>
                    {searchedTracks.length === 0 ? (
                        <ActivityIndicator size="large" color="gray" />
                    ) : (
                        <FlatList
                            data={searchedTracks}
                            renderItem={({ item }) => {
                                return (
                                    <SongItem
                                        item={item}
                                        onPress={play}
                                        isPlaying={item === currentTrack} pla
                                    />
                                )
                            }}
                        />

                    )}
                </ScrollView>
            </LinearGradient>
            {currentTrack && (
                <Pressable style={styles.currentTrackContainer} onPress={() => setModalVisible(!modalVisible)}>
                    <View style={{ flexDirection: "row-reverse", alignItems: 'center', gap: 10 }}>
                        <Image style={{ width: 40, height: 40, }} source={{ uri: currentTrack?.track?.album?.images[0].url }} />
                        <Text numberOfLines={1} style={styles.currentTrackText}>{currentTrack?.track?.name} • {""} {currentTrack?.track?.artists[0].name}</Text>
                    </View>
                    <View style={{ flexDirection: "row-reverse", alignItems: 'center', gap: 8 }}>
                        <AntDesign name="heart" size={24} color="#1DB954" />
                        <AntDesign name={playPause ? "playcircleo" : "pausecircleo"} size={24} color="white" onPress={() => { setPlayPause(!playPause), handlePlayPause() }} />
                    </View>
                </Pressable>
            )}
            <BottomModal
                visible={modalVisible}
                onHardwareBackPress={() => setModalVisible(false)}
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
            >
                <ModalContent style={{ height: "100%", width: "100%", backgroundColor: "#5072A7", }}>
                    <View style={{ height: "100%", width: "100%", }}>
                        <Pressable style={{ flexDirection: "row-reverse", alignItems: 'center', justifyContent: "space-between", }}>
                            <AntDesign name='down' size={24} color="white" onPress={() => setModalVisible(!modalVisible)} />
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: "white" }}>{currentTrack?.track?.name}</Text>
                            <Entypo name='dots-three-vertical' size={24} color="white" />
                        </Pressable>
                        <Separator height={Display.setHeight(6)} />
                        <View style={{ padding: 10 }}>
                            <Image style={{ width: "100%", height: 330, borderRadius: 4, }} source={{ uri: currentTrack?.track?.album?.images[0].url }} />
                            <View style={{ marginTop: 10, flexDirection: "row-reverse", justifyContent: "space-between" }}>
                                <View>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white", }}>{currentTrack?.track?.name}</Text>
                                    <Text style={{ color: "#D3D3D3", marginTop: 4 }}>{currentTrack?.track?.artists[0].name}</Text>
                                </View>
                                <AntDesign name='heart' size={24} color="#1DB945" />
                            </View>
                            <Separator height={Display.setHeight(1)} />
                            <View>
                                <View style={{
                                    width: "100%",
                                    marginTop: 10,
                                    height: 3,
                                    backgroundColor: "gray",
                                    borderRadius: 5,
                                }}>
                                    <View style={[styles.progressBar, { width: `${progress * 100}%` },]} />
                                    <View style={[
                                        {
                                            position: "absolute",
                                            top: -5,
                                            width: circleSize,
                                            height: circleSize,
                                            borderRadius: circleSize / 2,
                                            backgroundColor: "white",
                                        },
                                        {
                                            left: `${progress * 100}%`,
                                            marginLeft: - circleSize / 2,
                                        }
                                    ]} />
                                </View>
                                <View style={{ marginTop: 12, flexDirection: "row-reverse", alignItems: 'center', justifyContent: "space-between", }}>
                                    <Text style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}>{formatTime(totalDuration)}</Text>
                                    <Text style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}>{formatTime(currentTime)}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row-reverse", alignItems: 'center', justifyContent: "space-between", marginTop: 17, }}>
                                <FontAwesome name='arrows' size={30} color="#03C03C" />
                                <Ionicons name='play-skip-back' size={30} color="white" onPress={playPreviousTrack} />
                                <Pressable onPress={handlePlayPause}>
                                    {isPlaying ? (
                                        <AntDesign name='pausecircle' size={60} color="white" />
                                    ) : (
                                        <Pressable
                                            onPress={handlePlayPause}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 30,
                                                backgroundColor: "white",
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <Entypo name="controller-play" size={26} color="black" />
                                        </Pressable>
                                    )}
                                </Pressable>
                                <Ionicons name='play-skip-forward' size={30} color="white" onPress={playNextTrack} />
                                <Feather name='repeat' size={30} color="#03C03C" />
                            </View>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        marginHorizontal: 10,
        flexDirection: "row-reverse",
        alignItems: 'center',
        justifyContent: "space-between",
        marginTop: 9,
    },
    inputText: {
        flexDirection: "row-reverse",
        alignItems: 'center',
        gap: 10,
        backgroundColor: "#42275a",
        padding: 9,
        flex: 1,
        borderRadius: 9,
        height: 38,
    },
    sort: {
        marginHorizontal: 10,
        backgroundColor: "#42275a",
        padding: 10,
        borderRadius: 3,
        height: 38,
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
    currentTrackContainer: {
        position: "absolute",
        backgroundColor: "#5072A7",
        width: "90%",
        padding: 10,
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 15,
        borderRadius: 6,
        left: 20,
        bottom: 10,
        justifyContent: "space-between",
        flexDirection: "row-reverse",
        alignItems: 'center',
        gap: 10,
    },
    currentTrackText: {
        fontSize: 13,
        width: 220,
        color: "white",
        fontWeight: 'bold',
    },
    progressBar: {
        height: "100%",
        backgroundColor: "white",
    }
});

//make this component available to the app
export default LinkedSongScreen;
