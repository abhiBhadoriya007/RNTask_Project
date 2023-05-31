import { Pressable, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

function IconButton(props) {
    return <Pressable onPress={props.onPress}
        style={({ pressed }) => pressed && styles.pressed}>
        <Icon size={30} color={props.color} name={props.icon} />
    </Pressable>
};


const styles = StyleSheet.create({
    pressed: {
        opacity: 0.5
    }
})

export default IconButton;