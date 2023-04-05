import {useEffect} from "react"
import axios from "axios";

export const Logout = () => {
    useEffect(() => {
        (async () => {
            try {
                // perform the logout API request
                const {data} = await axios.post(process.env.REACT_APP_API_URL+'logout/', 
                    {refresh_token:localStorage.getItem('refresh_token')}, 
                    {headers: {'Content-Type': 'application/json'}},  
                    {withCredentials: true});

                // clean the local storage and redirect to /
                console.log(data);
                localStorage.clear();
                axios.defaults.headers.common['Authorization'] = null;
                window.location.href = '/login'
            } catch (e) {
                console.log('logout not working', e)
            }
        })();
    }, []);
    return <div></div>
}