//all imports

import {useEffect, useState,Fragment} from "react" 
import Details from "./details"; 
import Editabledetails from "./editabledetails";
import ReactPaginate from "react-paginate"; //npm package for easy pagination 
import axios from "axios";
import "../styles/contacts.css"

//Primary function defined

function Contacts(){

    const [formdata,setformdata]=useState({"NAME":""}); // statevariable to store variable to be searched 
    const [editcontactid,seteditcontactid]=useState(null); // statevariable to store variable id to be edit 
    
    const [editformdata,seteditformdata]=useState({ // state variable to store data after editing
        "_id":"",
        "Name":"",
        "address":"",
        "city":"",
        "state":"",
        "zip":""
    })

    const contacts=[]; // an array to store contacts
    const [list,setlist]=useState(contacts); // statevariable to store list retrieved from database 
    const [PageNumber,setPageNumber] =useState(0); // statevariable to store pagenumber during pagination


    const search=(list)=>{ // function to filter the data wrt to the searched keyword
        return list.filter((item)=> item.Name.toLowerCase().includes(formdata.NAME))
    }

    const usersperpage=10; // number of contacts per page
    const pagesvisited=PageNumber*usersperpage; // number of page visited

    const handlechange =(e)=>{ // handling change of search keyword
        setformdata({  // dynamically updating data of searched keyword
            ...formdata,
            [e.target.name]:e.target.value
        }); 
        search(list); // calling search function 
    };

    const handleEditclick=(e,contact)=>{  // handling edit click button press
        e.preventDefault();   // preventing refresh
        seteditcontactid(contact._id); // setting id of the contact to be updated

        const formvalues={  // saving preexisting values to a const
            _id:contact._id,
            Name: contact.Name,
            address: contact.address,
            city:contact.city,
            state:contact.state,
            zip:contact.zip
        }
        seteditformdata(formvalues); // saving the updated values to editformdata
    }
    
    const handleEditformData = (e)=>{ //handling editing of contacts
        seteditformdata({  //setting new values of data after updation
            ...editformdata,
            [e.target.name]:e.target.value
        });
    }

    const handleEditFormSubmit=async (e)=>{ //handling data updation after editing
      await  axios.post("http://localhost:8080/update",{ //post request to server with all the data   
      _id:editformdata._id,
            NAME:editformdata.Name,
            address:editformdata.address,
            city:editformdata.city,
            state:editformdata.state,
            zip:editformdata.zip,
            headers:{
                "x-access-token":localStorage.getItem("token")
            }
        })
        .then(response =>{ //handling response recieved
            console.log("update",response);
           
            window.location.reload(); // forcing reload for live experience
        });
    }

    const handledeleteclick= async(e,contact)=>{ //handling delete button click
        e.preventDefault();  //preventing auto refersh
      await axios.post("http://localhost:8080/delete",{ // post request with id of the contact to be deleted
      _id:contact._id,
      headers:{
        "x-access-token":localStorage.getItem("token")
    }
      })
      .then(response =>{ //handling response
          console.log("delete",response);
          window.location.reload(); //forcing reload for live experience
      })
    }

    const displaycontacts = search(list) //function to displaying whole contact list after searched keyword filter
    .slice(pagesvisited,pagesvisited+usersperpage) // slicing the whole list in 10 contacts per page
    .map((value) => { //iterating over the array
        return (
            //to show multiple values in a single coloumn
        <Fragment>                
        {editcontactid===value._id ? <Editabledetails  //display editable form if given condition matches
        editformdata={editformdata}  // passing function editform function as a prop
        handleEditformData={handleEditformData} // passing function handlieditformdata function as a prop
        handleEditFormSubmit={handleEditFormSubmit} /> : // passing function handleeditformsubmit function as a prop

        <Details list={value}  //display original list if given condition matches
        handleEditclick={handleEditclick}  // passing function handleeditclick function as a prop
        handledeleteclick={handledeleteclick} /> //passing function handledeleteclick function as a prop
        }  
        </Fragment>
        )
    })

    const pageCount=Math.ceil(list.length / usersperpage); // logic to get the current page number 
    const changePage = ({selected})=>{ 
        setPageNumber(selected);
    }

    useEffect(()=>{ //useeffect to get latest list of contact on every page rendring
        axios.get("http://localhost:8080/search")
        .then(response=>{
            setlist(response.data);
        })
    },[]);

   
return (
        <div >

         <label>Search :</label>
         <input type="String" className="search" name="NAME" required autocomplete="off" placeholder="Name" onChange={handlechange} /> 
                
                <table className="table table-striped overflow-auto"> 
                <thead>
                {/* table header row */}
                    <tr>
                        <th>Name</th>
                        <th>address</th>
                        <th>city</th>
                        <th>state</th>
                        <th>zip</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {/* calling function display contacts to display latest list of contacts */}
                {displaycontacts}

                {/* whole pagination box */}
                <div className="paginate">
                <ReactPaginate 
                 previousLabel={"Previous"}
                 nextLabel={"Next"}
                 pageCount={pageCount}
                 onPageChange={changePage}   
                 containerClassName={"paginationBttns"}
                 previousLinkClassName={"previousBttn"}
                 nextLinkClassName={"nextBttn"}
                 disabledClassName={"paginationDisabled"}
                 activeClassName={"paginationActive"}
                />
                </div>
                </tbody>
            </table>
           </div>
)
}

export default Contacts;