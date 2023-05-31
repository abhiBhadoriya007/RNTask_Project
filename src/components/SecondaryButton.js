import { View, Text, Pressable, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../constants/colors.js'
import Font from '../constants/customFonts.js';

function SeondaryButton({ children, onPress, icon, color }) {
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
                <Icon size={24} name={icon} color={color} />
                <Text style={styles.buttonText}>{children}</Text>
            </Pressable>
        </View>
    );
}

export default SeondaryButton;

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    buttonOuterContainer: {
        borderColor: Colors.primary500,
        borderWidth: 1.5,
        width: deviceWidth - 100,
        height: 55,
        borderRadius: 10,
        margin: 4,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    buttonInnerContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: Font.bold,
        color: Colors.primary500,
        textAlign: 'center',
        left: 5,
    },
    pressed: {
        opacity: 0.75,
    },
});