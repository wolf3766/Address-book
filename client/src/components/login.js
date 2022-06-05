import axios  from "axios"
import { useEffect, useState } from "react"


function Login(){
    axios.defaults.withCredentials=true;

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
        })
    }

    const handleauth= async(e)=>{ //handling auth to check if user is authenticated or not
        e.preventDefault();
       
       await axios.get("http://localhost:8080/auth",{ // getting current user data from backend
           headers:{
               "x-access-token":localStorage.getItem("token")
           }
       })
        .then(Response=>{
            console.log(Response);

        })
    }

    useEffect(()=>{ //checking if user is logged in or not
        axios.get("http://localhost:8080/login") 
       .then(Response=>{
          // console.log(Response);  
       }) 
    },[])

    return( //form to take data from user
        <div>
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
        <button onClick={handleauth}>authenticated</button>

       </div> 
    )
}
export default Login;