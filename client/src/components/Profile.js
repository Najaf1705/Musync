import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';

const Profile = () => {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.user.userDetails);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid" style={{ minHeight: "100vh", background: "rgb(53 53 53)" }}>
      <div className="row justify-content-center">
        <div className="col-md-8 profilecard">
          <div className="card shadow-sm bg-black">
            <div className="card-header text-white text-center" style={{ background: "#584848" }}>
              <h2>Profile</h2>
            </div>
            <div className="card-body" style={{ background: "#858585" }}>
              <div className="text-center mb-4">
                <img
                  src={userDetails.image}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '9rem', height: '9rem' }}
                />
              </div>
              <div className="text-center">
                <p className="font-weight-bold">Name: {userDetails.name || 'N/A'}</p>
                <p className="font-weight-bold">ID: {userDetails._id || 'N/A'}</p>
                <p className="font-weight-bold">Age: {userDetails.age || 'N/A'}</p>
                <p className="font-weight-bold">Email: {userDetails.email || 'N/A'}</p>
                <p className="font-weight-bold">Phone Number: {userDetails.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
