// Import the react JS packages
import {useEffect, useState} from "react";
import axios from "axios";


export const Home = () => {
    const [username, setUserName] = useState('');
    const [userBalance, setUserBalance] = useState('');
    const [operations, setOperations] = useState(0);
    const [responseData, setResponseData] = useState('');
    const [selectedOperation, setSelectedOperation] = useState(0);
    const [operator1, setOperator1] = useState(0);
    const [operator2, setOperator2] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');


    const submit = e => {
        // prevent form submission and hide error message
        e.preventDefault();
        setErrorMessage("");

        // perform the operation request
        axios.post(process.env.REACT_APP_API_URL+'operation/',
            {
                operation_id: selectedOperation,
                operator1: operator1,
                operator2: operator2,
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(response=>{
            if(response.status===200 && response.data){
                // show response data and update user balance if the request is successfull
                if(response.data.status===1){
                    setResponseData(`${response.data.response_data}`);
                    setUserBalance(response.data.user_balance);
                }
                else{
                    // show error message if the request fails
                    setErrorMessage(response.data.error_message);
                }
            }
             else {
                setErrorMessage("Unknown error");
            }
        }).catch(err => {
            // Handle errors
            console.error(err);
        });
        
    }

    const requestUserData = () => {
        // get data from API and update state variables
        axios.get( 
            process.env.REACT_APP_API_URL, {
                headers: {
                   'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        ).then((res)=>{
            // update user data 
            setUserName(res.data.username);
            setUserBalance(res.data.user_balance);
            setOperations(res.data.operations);
        }).catch((e)=> {
            console.log('user not authenticated')
        });
    }

    useEffect(() => {
        // redirect to login if access_token does not exist
        if(localStorage.getItem('access_token') === null) {                   
            window.location.href = '/login'
        }
        else {
            // request user data
            requestUserData();
        };
    }, []);

    return (
        <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={submit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Operation</h3>
            <div className="form-group mt-3">
                <label>Username</label>
                <label className="form-control mt-1 disabled">{username}</label>
            </div>
            <div className="form-group mt-3">
                <label>Balance</label>
                <label className="form-control mt-1 disabled">$ {userBalance ? userBalance.toFixed(2) : '0.00'}</label>
            </div>
            <div className="form-group mt-3">
              <label>Operation</label>
              <select className="form-control mt-1" 
                name='operation'  
                defaultValue={operations ? operations[0].id : 0}
                onChange={(e)=>setSelectedOperation(e.target.value)}>
                <option value="0">Select an operation</option>
                {operations ? operations.map((item) => <option value={item.id} key={item.id}>{item.type_str}</option>) : ''}
                </select>
            </div>
            <div className="form-group mt-3">
              <label>Data 1</label>
              <input type="number" className="form-control mt-1" 
                name='operator1' onChange={(e)=>setOperator1(e.target.value)} 
                value={operator1}/>
            </div>
            <div className="form-group mt-3">
              <label>Operator 2</label>
              <input type="number" className="form-control mt-1" 
                name='operator2' onChange={(e)=>setOperator2(e.target.value)} 
                value={operator2}/>
            </div>
            { responseData.length>0 ? (<div className="form-group mt-3">
                                        <label>Response:</label>
                                        <label className="form-control mt-1 disabled">{responseData}</label>
                                        </div>) : ''}
            
            { errorMessage ? (<label className="text-danger">{errorMessage}</label>) : ''}
            <div className="d-grid gap-2 mt-3">
              <button type="request" 
                 className="btn btn-primary" disabled={operations ? false : true}>Submit</button>
            </div>
          </div>
       </form>
     </div>
    )
}