import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "https://atulniye-blogs.onrender.com/";

export default function useAuth(){
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
    axios.get(`${API_URL}/api/auth/status`,{withCredentials: true})
        .then(res => {
            setAuthenticated(true);
            setUser(res.data.user);
        })
        .catch(() => {
            setAuthenticated(false);
            setUser(null);
        })
        .finally(()=>{
            setLoading(false);
        })
    },[]);
    return { authenticated, user, loading }
}