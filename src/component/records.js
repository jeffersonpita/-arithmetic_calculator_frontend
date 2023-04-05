// Import the react JS packages
import {useEffect, useState} from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, Trash } from "react-bootstrap-icons";
import { format } from 'date-fns'


export const Records = () => {
    const apiUrl = process.env.REACT_APP_API_URL+'records/';

    const [records, setRecords] = useState('');
    const [nextUrl, setNextUrl] = useState('');
    const [previousUrl, setPreviousUrl] = useState('');
    const [currentUrl, setCurrentUrl] = useState(apiUrl);

    useEffect(() => {
        // redirect to login if access_token does not exist
        if(localStorage.getItem('access_token') === null) {                   
            window.location.href = '/login'
        }
        else {
            // load records data
            paginationHandler(apiUrl);
        };
    }, [apiUrl]);

    const paginationHandler = (url) => {
        // get data from API and update state variables
        try {
            axios.get(
                url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    }
                }
            ).then((res)=>{
                setCurrentUrl(url);
                setRecords(res.data.results);
                setNextUrl(res.data.next);
                setPreviousUrl(res.data.previous);
            });
            
        } catch (e) {
            console.log(e)
        }
    }

    const deleteHandler = (id) => {
        // perform deletion
        try {
            axios.delete(
                apiUrl+id+'/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    }
                }
            ).then((res)=>{
                paginationHandler(currentUrl);
            });
            
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="container mt-3 col-md-6 col-12">
            <h2>Records</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">creation date</th>
                    <th scope="col">operation</th>
                    <th scope="col">cost</th>
                    </tr>
                </thead>
                <tbody>
                { records ? (records.map((item) => <tr>
                    <td>{item.id}</td>
                    <td>{format(new Date(item.date), 'yyyy-MM-dd HH:ii:ss')}</td>
                    <td>{item.operation_type_str}</td>
                    <td>$ {item.cost ? item.cost.toFixed(2) : "0.00"}</td>
                    <td>
                        <button className="page-link" size="sm" onClick={()=>deleteHandler(item.id)}>
                        <Trash color="royalblue" size={12}/> Remove
                        </button>
                    </td>
                    </tr>)) 
                    : (<tr><td colSpan={5}>No records found</td></tr>)}
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
                    <li className="page-item" key="li-left">
                        { previousUrl ? (<button className="page-link" onClick={()=>paginationHandler(previousUrl)}>
                        <ArrowLeft color="royalblue" size={12}/> Previous</button>) 
                        : (null) }
                    </li>
                    <li className="page-item" key="li-right">
                        { nextUrl ? (<button className="page-link" onClick={()=>paginationHandler(nextUrl)}>
                        Next <ArrowRight color="royalblue" size={12}/>
                        </button>) 
                        : (null) }
                    </li>
                </ul>
            </nav>
        </div>
    )
}