import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(){
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // In production, use relative paths since frontend and backend are served from same domain
        const API_URL = import.meta.env.VITE_API_URL || "/api";
        
        axios.get(`${API_URL}/auth/status`, {withCredentials: true})
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