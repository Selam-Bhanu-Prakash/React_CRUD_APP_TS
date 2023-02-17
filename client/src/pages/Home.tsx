import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom';
import "./Home.css";
import axios from "axios";





const Home = () => {
  type User = {
      id:number;
      name: string;
      email: string;
      contactNo:number;
  };
  const [data,setData] = useState< User[]>([]);

  const initialStatus = {
    name : ""
  }

  const [status, setStatus] = useState(initialStatus);

  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/get");
    setData(response.data);
    setStatus({name:" "});
  };

  useEffect(() => {
    loadData();
  },[]);

  const history = useHistory();

  const deleteContact = (id) => {
    if(window.confirm("Are you sure to delete the contact? "))
    {
      axios.delete(`http://localhost:5000/api/remove/${id}`);
      setStatus({name: "Contact Deleted Successfully"});
      setTimeout(()=> loadData(), 500);
      setTimeout(() => history.push("/"), 500);
      
    }
  }

  
  return (
    <div style={{marginTop: "150px"}}>
      <Link to="/addContact">
        <button className="btn btn-contact">Add Contact</button>
      </Link>
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{textAlign: "center"}}>No.</th>
            <th style={{textAlign: "center"}}>Name</th>
            <th style={{textAlign: "center"}}>Email</th>
            <th style={{textAlign: "center"}}>Contact</th>
            <th style={{textAlign: "center"}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item,index)=> {
            return (
              <tr key={item.id}>
                <th scope="row">{index+1}</th>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.contactNo}</td>
                <td>
                  <Link to={`/update/${item.id}`}>
                    <button className="btn btn-edit">Edit</button>
                  </Link>
                  <button className="btn btn-delete" onClick={() => deleteContact(item.id)}>Delete</button>
                  <Link to={`/view/${item.id}`}>
                    <button className="btn btn-view">View</button>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {
        status.name && <h4>{status.name}</h4>
      }
    </div>
  )
}


export default Home
