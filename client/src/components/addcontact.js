import axios from "axios"
import {useState,useEffect} from "react"
import "../styles/addcontact.css"
import { useNavigate } from "react-router-dom";

function Addcontact(){


  axios.defaults.withCredentials=true; 

  const nav = useNavigate();

    const [formdata,setformdata]=useState({ //state variable to store data of new contact
        "Name":"", 
        "address":"",
        "city":"",
        "state":"",
        "zip":""
    });

    const handlechange=(e)=>{ //function to dynamically store data on change
        setformdata({
            ...formdata,
            [e.target.name]:  e.target.value
        }) 
        //console.log(e.target.value);
    }

    const handlesubmit =async (e)=>{ // fucntion used to add data to backend
      e.preventDefault();
            // console.log("token :", localStorage.getItem("token"));
        await axios.post("http://localhost:8080/create",{
            NAME:formdata.Name,
            address:formdata.address,
            city:formdata.city,
            state:formdata.state,
            zip:formdata.zip
          ,
            headers:{"x-access-token": localStorage.getItem("token")}
        })
        .then(response=>{
            console.log("post",response);
        });
    }

    useEffect(()=>{ // checking if user is logged in or not
      axios.get("http://localhost:8080/login") 
      
     .then(Response=>{
      if(Response.data.loggedIn===false){
        nav("/login")
      }
         
     }) 
  },[])

    return( //form to collect data
    <div className="main">
    <form onSubmit={handlesubmit}>
  <div class="form-row">
    <div class="form-group ">
      <label for="Name">Name</label>
      <input type="String" class="form-control" name="Name" placeholder="Name"  onChange={handlechange} />
    </div>
  </div>
  <div class="form-group">
    <label for="inputAddress">Address</label>
    <input type="text" class="form-control" name="address" placeholder="address"  onChange={handlechange}/>
  </div>
  
  <div class="form-row">
    <div class="form-group ">
      <label for="inputCity">City</label>
      <input type="text" class="form-control" name="city" onChange={handlechange} />
    </div>
    <div class="form-group ">
    <label for="inputState">State</label>
      <input type="text" class="form-control" name="state" onChange={handlechange} />
    </div>
    <div class="form-group ">
      <label for="inputZip">Zip</label>
      <input type="Number" class="form-control" name="zip" onChange={handlechange} />
    </div>
  </div>
  
  <button type="submit" class="btn btn-primary">create</button>
</form>

    </div>
    )
}

export default Addcontact;
