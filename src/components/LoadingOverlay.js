import { View, ActivityIndicator, StyleSheet } from "react-native";
import Colors from "../constants/colors";

function LoadingOverlay() {
    return (
        <View style={styles.rootView}>
            <ActivityIndicator size="large" color="white" />
        </View>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: Colors.primary500,
    }
})


export default LoadingOverlay;