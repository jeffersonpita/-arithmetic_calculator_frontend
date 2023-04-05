import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login} from "./component/login";
import {Home} from "./component/home";
import {Records} from "./component/records";
import {Navigation} from './component/navigation';
import {Logout} from './component/logout';

function App() {
    return <BrowserRouter>
            <Navigation></Navigation>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/records" element={<Records/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/logout" element={<Logout/>}/>
            </Routes>
          </BrowserRouter>;
}
export default App;

