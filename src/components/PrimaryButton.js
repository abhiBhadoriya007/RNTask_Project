import { View, Text, Pressable, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';

import Colors from '../constants/colors.js'
import Font from '../constants/customFonts.js';

function PrimaryButton({ children, onPress }) {
    return (
        <View style={styles.buttonOuterContainer}>
            <Pressable
                style={({ pressed }) =>
                    pressed
                        ? [styles.buttonInnerContainer, styles.pressed]
                        : styles.buttonInnerContainer
                }
                onPress={onPress}
                android_ripple={{ color: Colors.borderColor }}
            >
                <Text style={styles.buttonText}>{children}</Text>
            </Pressable>
        </View>
    );
}

export default PrimaryButton;

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    buttonOuterContainer: {
        width: deviceWidth - 30,
        borderRadius: 10,
        margin: 4,
        overflow: 'hidden',
    },
    buttonInnerContainer: {
        justifyContent: 'center',
        height: 50,
        backgroundColor: Colors.primary500,
        //paddingVertical: 15,
        paddingHorizontal: 8,
        //elevation: 2,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: Font.bold,
        color: 'white',
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.75,
    },
});