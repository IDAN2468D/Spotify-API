import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

const IconButton = ({ ContainerStyle, text, onPress, size, icon, StyleText, color }) => {
    return (
        <TouchableOpacity style={ContainerStyle} onPress={onPress} activeOpacity={0.5}>
            <AntDesign name={icon} size={size} color={color} />
            <Text style={StyleText}>{text}</Text>
        </TouchableOpacity>
    )
}

export default IconButton