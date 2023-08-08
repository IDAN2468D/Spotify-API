//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// create a component
const ArtistsCard = ({ item }) => {
    return (
        <View style={styles.container}>
            <Image style={{
                width: 130,
                height: 130,
                borderRadius: 5,
            }}
                source={{ uri: item.images[0].url }} />
            <Text style={{
                fontSize: 15,
                fontWeight: '500',
                color: "white",
                marginTop: 10,
            }}>
                {item?.name}
            </Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
});

//make this component available to the app
export default ArtistsCard;
