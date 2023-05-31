import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../store/auth-context";
import { deleteUser, fetchUserById } from "../utils/database";
import Colors from "../constants/colors";
import Font from "../constants/customFonts";
import SeondaryButton from "../components/SecondaryButton";
import { Dimensions } from "react-native";

function WelcomeScreen() {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        // Fetching the use Details by userId
        async function fetchUserData() {
            try {
                const data = await fetchUserById(authCtx.userId);
                if (data.success) {
                    const userDetails = data.result.rows.item(0);
                    setUserName(userDetails.name);
                    setUserEmail(userDetails.email);
                } else {
                    // Handle fetch error here
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchUserData();
    }, []);

    // Handling delete account action
    const handleDeleteAccount = () => {
        Alert.alert("Delete Account", "Are you sure you want to delete your account?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: confirmDeleteHandler, style: "destructive" },
        ]);
    };

    // When press confirm on delete alert
    const confirmDeleteHandler = async () => {
        try {
            const data = await deleteUser(authCtx.userId);
            if (data.success) {
                authCtx.logout();
            } else {
                console.log(data.message);
                Alert.alert("Error", "User not found");
            }
        } catch (error) {
            Alert.alert("Deletion Failed", "Please try again after sometime");
        }
    };

    return (
        <View style={styles.rootContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.text}>UserName</Text>
                <View style={styles.elementView}>
                    <Text style={styles.text}>{userName}</Text>
                </View>

                <Text style={styles.text}>UserEmail</Text>
                <View style={styles.elementView}>
                    <Text style={styles.text}>{userEmail}</Text>
                </View>

                <SeondaryButton onPress={handleDeleteAccount}>Delete Account</SeondaryButton>
            </View>
        </View>
    );
}

const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
    },
    innerContainer: {
        marginTop: 50,
        width: deviceWidth / 1.2,
        height: deviceWidth / 1.2,
        padding: 15,
        backgroundColor: Colors.primary500,
        borderRadius: 8,
        gap: 20,
    },
    text: {
        fontFamily: Font.medium,
        fontSize: 16,
        color: "white",
    },
    elementView: {
        borderColor: "white",
        borderWidth: 1.5,
        padding: 8,
        borderRadius: 4,
    },
});

export default WelcomeScreen;
