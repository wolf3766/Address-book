// form to appear when edit button is clicked

function Editabledetails({editformdata, handleEditformData,handleEditFormSubmit}){
  
    return(
            <tr>
                <td>
                <input type="text" name="Name" placeholder="Name" value={editformdata.Name} onChange={handleEditformData} />
                </td>
                <td>
                <input type="text" name="address" placeholder="address" value={editformdata.address} onChange={handleEditformData} />
                </td>
                <td>
                <input type="text" name="city"  placeholder="city" value={editformdata.city} onChange={handleEditformData}/>
                </td>
                
                <td>
                <input type="text"  name="state"  placeholder="state" value={editformdata.state} onChange={handleEditformData} />
                </td>
                <td>
                <input type="Number"  name="zip" placeholder="zip" value={editformdata.zip} onChange={handleEditformData} />
                </td>
                <td>
                    <button type="submit" onClick={handleEditFormSubmit}>Save</button>
                </td>
            </tr>
        
    )
}

export default Editabledetails;