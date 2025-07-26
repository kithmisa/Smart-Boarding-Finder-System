import react,{useState} from "react";
import Sidebar from "./Sidebar";
import AddBoardingForm from "./AddBoardingForm";
import Welcome from "./WelcomePage";
import './OwnerDashboard.css';
import WelcomePage from "./WelcomePage";
const OwnerDashboard=()=>{
   const[selected,setSelected]=useState('welcome');
   
    return(
        <div className="dashboard-wrapper">
        <div className="dashboard-overlay"/>
        <div className="dashboard-container">
            <Sidebar onSelect={setSelected}/>
            <div className="dashboard-content">
                {selected==='welcome' && <WelcomePage/>}
                {selected==='add'&& <AddBoardingForm/>}
                {selected==='list' && <h2>View My Listings</h2>}
                {selected==='profile' && <h2>Edit Profile</h2>}
                 {selected==='logout' && <h2>Logout Successful</h2>}
            </div>
        </div>
        </div>
    );
};

export default OwnerDashboard;