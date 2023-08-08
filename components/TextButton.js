import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const TextButton = ({ text, ContainerStyle, onPress, disabled }) => {
    return (
        <TouchableOpacity style={ContainerStyle} onPress={onPress} activeOpacity={0.8} disabled={disabled}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}

export default TextButton