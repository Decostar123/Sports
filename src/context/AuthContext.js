import { useCallback, useContext, useState, createContext, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
    const [authenticatedUserDetails, setAuthenticatedUserDetails] = useState(null);

    const setUserDetails = useCallback((userDetails) => {
        localStorage.setItem('authenticatedUserDetails', JSON.stringify(userDetails));
        setAuthenticatedUserDetails(userDetails);
    }, [])

    useEffect(() => {
        const authenticatedUserDetails = JSON.parse(localStorage.getItem('authenticatedUserDetails'));
        if (authenticatedUserDetails) {
            setAuthenticatedUserDetails(authenticatedUserDetails);
        }

    }, [])

    return (
        <AuthContext.Provider value={{ setUserDetails, authenticatedUserDetails }}>
            <GoogleOAuthProvider clientId='241331083778-2qb703qth4p4rgrts49t9i9tci4qq5j8.apps.googleusercontent.com'>
                {children}
            </GoogleOAuthProvider>
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {

    const authValues = useContext(AuthContext);
    return authValues;
}