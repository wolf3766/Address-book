//table to display data in each row

function Details({list,handleEditclick,handledeleteclick}){
    
    return (
            <tr>
                <td>{list['Name']}</td>
                <td>{list['address']}</td>
                <td> {list['city']}</td>
                <td>{list['state']}</td>
                <td>{list['zip']}</td>
                <td>
                <button type="button" onClick={(e)=>handleEditclick(e,list)}>EDIT </button>
                <button type="button" onClick={(e)=> handledeleteclick(e,list) } >Delete</button>
                </td>
            </tr>
    )
}

export default Details;