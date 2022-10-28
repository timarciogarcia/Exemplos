import { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { api, createSession } from "../Services/api";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const recoveredUser = localStorage.getItem('user');
        if(recoveredUser){
            setUser(recoveredUser);
        }
        setLoading(false);
    }, []);

    async function login(email, password){
        await createSession(email, password);
        //const loggedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        //const id = localStorage.getItem('id');
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser({ email });
        navigate("/");
        window.location.reload();
    };
  
    function logout(){
        localStorage.removeItem("user_id");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("password");
        localStorage.removeItem("menu");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("elementos");
        api.defaults.headers.Authorization = null;
        setUser(null);
        navigate("/login");
        window.location.reload();
    };
  
    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider> 
    );
};