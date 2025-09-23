import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(){
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('https://atulniye-blogs.onrender.com/api/auth/status',{withCredentials: true})
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