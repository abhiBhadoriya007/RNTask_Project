import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    Dimensions,
    Alert,
    ScrollView,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import Colors from "../constants/colors";
import IonIcon from 'react-native-vector-icons/Ionicons';
import Font from "../constants/customFonts";
import LoadingOverlay from "../components/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
import { createUser, checkExistingUser, loginUser } from "../utils/database";
import { Icon } from "@rneui/themed";

function LoginScreen({ navigation }) {
    const authCtx = useContext(AuthContext);
    const [isFetching, setFetchingState] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRegistration, setScreenBool] = useState(true);
    const [email, setemail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // Toggles the visibility of the password field
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    // Handles the user input for email field
    const handleUserEmailInput = (value) => {
        setemail(value);
    }

    // Handles the user input for username field
    const handleUserNameInput = (value) => {
        setUserName(value);
    }

    // Toggles between registration and login screens
    const toggleRegistrationScreen = () => {
        resetDataHandler();
        setScreenBool(!showRegistration);
    }

    // Resets the input data to initial state
    function resetDataHandler() {
        setemail('');
        setPassword('');
        setUserName('');
    }

    // Handles the submission of the form
    function submitHandler() {
        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 5;

        // Validates the email and password
        if (!emailIsValid) {
            Alert.alert('Invalid email', 'Please check your entered email.');
            return;
        } else if (!passwordIsValid) {
            Alert.alert('Invalid password', 'Password must be at least 6 characters long.');
            return;
        }

        // Initiates the login or registration flow
        pressHandler();
    }

    // Handles the login or registration flow
    async function pressHandler() {
        if (showRegistration) {
            try {
                const exists = await checkExistingUser(email);

                if (exists) {
                    Alert.alert('User Already Exists', 'User already exists with this email. Please login.');
                } else {
                    const dict = {
                        name: userName,
                        email: email,
                        password: password,
                    };

                    try {
                        const result = await createUser(dict);
                        let userDetails = result.rows.item(0);
                        authCtx.authenticate(userDetails.id);
                    } catch (createUserError) {
                        console.log(createUserError);
                        Alert.alert('Authentication Failed', 'Could not sign up. Please check credentials.');
                        setFetchingState(false);
                    }
                }
            } catch (checkExistingUserError) {
                console.log(checkExistingUserError);
                Alert.alert('Error', 'Please try again later.');
            }
        } else {
            try {
                const exists = await checkExistingUser(email);

                if (exists) {
                    try {
                        const data = await loginUser(email, password);
                        let userDetails = data.result.rows.item(0);
                        if (data.success) {
                            // Login successful
                            authCtx.authenticate(userDetails.id)
                        } else {
                            Alert.alert('Login Failed', 'Please check credentials and try again.');
                        }
                    } catch (loginUserError) {
                        console.log(loginUserError);
                        Alert.alert('Login Failed', 'Please check credentials and try again.');
                    }
                } else {
                    Alert.alert('User not found', 'User not found with this email. Please register.');
                }
            } catch (checkExistingUserError) {
                console.log(checkExistingUserError);
                Alert.alert('Error', 'Please try again later.');
            }
        }
    }

    // Renders a loading overlay while fetching data
    if (isFetching) {
        return <LoadingOverlay message={showRegistration ? 'Creating User...' : 'Logging in...'} />
    }

    return (
        <ScrollView
            style={{
                backgroundColor: 'white',
            }}
            contentContainerStyle={styles.rootContainer}
        >
            <View style={styles.innerContainer}>
                <View style={styles.imgContainer}>
                    <Icon name="account-group" color={Colors.primary500} size={80} type="material-community" />
                </View>

                {showRegistration && (
                    <View style={styles.txtFieldContainer}>
                        <TextInput
                            style={styles.txtField}
                            placeholder="Full Name"
                            placeholderTextColor={Colors.borderColor}
                            onChangeText={handleUserNameInput}
                        />
                    </View>
                )}

                <View style={styles.txtFieldContainer}>
                    <TextInput
                        style={styles.txtField}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor={Colors.borderColor}
                        onChangeText={handleUserEmailInput}
                    />
                </View>

                <View style={styles.txtFieldContainer}>
                    <TextInput
                        style={styles.txtField}
                        placeholder="password"
                        placeholderTextColor={Colors.borderColor}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity onPress={toggleShowPassword}>
                        <IonIcon size={24} color="gray" type='evilicon' name={showPassword ? 'eye' : 'eye-off'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.loginBtn}>
                    <PrimaryButton onPress={submitHandler}>{showRegistration ? 'Registration' : 'Login'}</PrimaryButton>
                </View>

                <View style={styles.bottomContainer}>
                    <Text style={{
                        color: 'black',
                        fontFamily: Font.regular,
                    }}>{showRegistration ? 'Already a User?' : 'New User?'}</Text>

                    <View>
                        <TouchableOpacity style={styles.customBtnBG} onPress={toggleRegistrationScreen}>
                            <Text style={{
                                paddingLeft: 3,
                                color: Colors.primary500,
                                fontFamily: Font.regular,
                            }}>{showRegistration ? 'Login' : 'Create Account'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default LoginScreen;

let deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    rootContainer: {
        flexGrow: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imgContainer: {
        height: 80,
        marginBottom: 30,
    },
    innerContainer: {
        flex: 1,
        top: 70,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
    },
    txtFieldContainer: {
        paddingHorizontal: 10,
        width: '100%',
        height: 55,
        borderColor: Colors.borderColor,
        borderWidth: 2,
        borderRadius: 10,
        marginVertical: 8,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    loginBtn: {
        marginTop: 10,
        marginBottom: 12,
        marginHorizontal: 5,
    },
    customBtnBG: {
        fontSize: 20,
        color: Colors.primary500,
    },
    orSection: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    line: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        margin: 16,
        paddingHorizontal: 8,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    txtField: {
        flex: 1,
        fontFamily: Font.medium,
        fontSize: 16,
        color: Colors.primary500,
    },
});
