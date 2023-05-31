import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
    userId: '',
    isAuthenticated: false,
    authenticate: () => { },
    logout: () => { }
});

function AuthContextProvider({ children }) {

    const [userId, setUserId] = useState();

    useEffect(() => {
        // Fetch the stored userId from AsyncStorage on component mount
        async function fetchUserId() {
            const storedUserId = await AsyncStorage.getItem('userId');

            if (storedUserId) {
                setUserId(storedUserId.toString());
            }
        }

        fetchUserId();
    }, []);

    function authenticate(userId) {
        setUserId(userId);
        AsyncStorage.setItem('userId', userId.toString()); // Always set a string value
    }

    function logout() {
        setUserId(null);
        AsyncStorage.removeItem('userId');
    }

    const value = {
        userId: userId,
        isAuthenticated: !!userId,
        authenticate: authenticate,
        logout: logout
    };

    console.log(`Ctx Details ${JSON.stringify(value)}`);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export default AuthContextProvider;
