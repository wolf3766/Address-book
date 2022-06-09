import axios  from "axios"
import "../styles/login.css"
import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"

function Login(){
    axios.defaults.withCredentials=true;
     const nav= useNavigate();

    const [usercred,setusercred]=useState({ //state variable to store credentials
        "Email":"",
        "Password":""
    })
    const handlechange=(e)=>{ //saving data to on change
        setusercred({
            ...usercred,
            [e.target.name]:e.target.value
        })
    }
 
    const handlesubmit= async(e)=>{ //sending data at backend to verify
        e.preventDefault();
       // console.log("token :", localStorage.getItem("token"));
        await axios.post("http://localhost:8080/login",{ //api request to verify
            Email:usercred.Email,
            Password:usercred.Password
        }) 
        .then(Response=>{
               // console.log(Response);
                localStorage.setItem("token",Response.data.token);
                nav("/add")
        })
    }

        const handlesignup =(e)=>{
            nav("/register")
        }

    useEffect(()=>{ //checking if user is logged in or not
        axios.get("http://localhost:8080/login") 
       .then(Response=>{
           console.log(Response);  
       }) 
    },[])

    return( //form to take data from user
        <div className="main">
        <h2>Log In</h2>
        <form onSubmit={handlesubmit}>
        <div class="form-row">
    <div class="form-group ">
      <label for="Email">Email</label>
      <input type="Email" class="form-control" autoComplete="off" name="Email" placeholder="Email"  onChange={handlechange}  />
    </div>
  </div>
  <div class="form-group">
    <label for="Password">Password</label>
    <input type="password" class="form-control" name="Password" placeholder="Password" onChange={handlechange} />
  </div>
  <button type="submit" onClick={handlesubmit} class="btn btn-primary">Login</button>
        </form>
        <div className=" register">
        <h6>Register with us </h6>
       <button  class="btn btn-secondary" onClick={handlesignup}>Register</button> 
        </div>
       </div> 
    )
}
export default Login;