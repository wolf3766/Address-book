import axios from "axios";
import { useState } from "react";

function Register(){
    const [user,setuser]=useState({ //storing current user details
        "Email":"",
        "Password":""
    });

    const handlechange=(e)=>{ //handling changes within in the form
            setuser({
                ...user,
                [e.target.name]:e.target.value
            })
    }

    const handlesubmit= async(e)=>{ //sending user data to backend to be saved and later used
        await axios.post("http://localhost:8080/usercred",{
            Email:user.Email,
            Password:user.Password
        }) 
        .then(Response=>{
            console.log("register",Response);
        })
    }

    return( //form to accept data from the user
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
  <button type="submit" class="btn btn-primary">Register</button>

        </form>

       </div>
    )
}

export default Register;