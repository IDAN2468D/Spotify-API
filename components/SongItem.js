//import liraries
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { Player } from '../PlayerContext';

// create a component
const SongItem = ({ item, onPress, isPlaying }) => {
    const { currentTrack, setCurrentTrack } = useContext(Player);

    const handlePress = () => {
        setCurrentTrack(item);
        onPress(item)
    }

    return (
        <Pressable style={styles.container} onPress={handlePress}>
            <Image style={{ width: 50, height: 50, marginLeft: 10, }} source={{ uri: item?.track?.album?.images[0].url }} />
            <View style={{ flex: 1 }}>
                <Text
                    numberOfLines={1}
                    style={
                        isPlaying ? {
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: "#3FFF00",
                            alignSelf: "flex-end",
                        } : {
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: "white",
                            alignSelf: "flex-end",
                        }
                    }>
                    {item?.track?.name}
                </Text>
                <Text style={{ marginTop: 4, color: "#989898", }}>{item?.track?.artists[0].name}</Text>
            </View>

            <View style={{ flexDirection: "row-reverse", alignItems: 'center', gap: 7, marginHorizontal: 10, }}>
                <AntDesign name="heart" size={24} color="#1DB954" />
                <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
            </View>
        </Pressable>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: "row-reverse",
        alignItems: 'center',
        padding: 10,
    }
});

//make this component available to the app
export default SongItem;
