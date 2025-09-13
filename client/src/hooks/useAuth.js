import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(){
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || "https://atulniye-blogs.onrender.com";
        // Remove trailing slash if present to avoid double slashes
        const cleanAPIUrl = API_URL.replace(/\/$/, '');
        
        axios.get(`${cleanAPIUrl}/api/auth/status`, {withCredentials: true})
        .then(res => {
            setAuthenticated(true);
            setUser(res.data.user);
        })
        .catch((error) => {
            console.log('Auth check failed:', error);
            setAuthenticated(false);
            setUser(null);
        })
        .finally(() => {
            setLoading(false);
        })
    }, []);
    
    return { authenticated, user, loading }
}