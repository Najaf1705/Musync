import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate=useNavigate();
  const [data,setData]=useState({});

  const callProfile = async () => {
    try {
      const res = await fetch('/serverprofile', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (res.status === 200) {
        const userdata = await res.json();
        // console.log(userdata);
        setData(userdata);
      } else if (res.status === 401) {
        // Handle the "Unauthorized" error specifically
        throw new Error('Unauthorized: Please log in or provide a valid token.');
      } else {
        // Handle other errors
        throw new Error('Request failed with status ' + res.status);
      }
    } catch (error) {
      console.log(error);
      navigate('/login');
    }
  };
  

  useEffect(()=>{
    callProfile();
  });

  return (
    <div className="col-md-6 mt-5 mx-auto">
      <div className="card">
        <div className="card-header">
          <h2>{data.name}</h2>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group row">
              <div className="col-md-6">Name: </div>
              <div className="col-md-6"> {data.name}</div>
            </div>
            <div className="form-group row">
              <div className="col-md-6">Id: </div>
              <div className="col-md-6"> {data._id}</div>
            </div>
            <div className="form-group row">
              <div className="col-md-6">Age:</div>
              <div className="col-md-6"> {data.age}</div>
            </div>
            <div className="form-group row">
              <div className="col-md-6">Email:</div>
              <div className="col-md-6"> {data.email}</div>
            </div>
            <div className="form-group row">
              <div className="col-md-6">Phone Number:</div>
              <div className="col-md-6"> {data.phone}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile
