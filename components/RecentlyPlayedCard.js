//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


// create a component
const RecentlyPlayedCard = ({ item }) => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => navigation.navigate("Info", { item: item })} style={styles.container}>
            <Image style={styles.images} source={{ uri: item.track.album.images[0].url }} />
            <Text style={styles.title}>{item.track.name}</Text>
        </Pressable>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    images: {
        width: 130,
        height: 130,
        borderRadius: 5,
    },
    title: {
        fontSize: 13,
        fontWeight: '500',
        color: "white",
        marginTop: 10,
    }
});

//make this component available to the app
export default RecentlyPlayedCard;
