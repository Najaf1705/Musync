import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.user.user);
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
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-black rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-700 text-white text-center py-4">
            <h2 className="text-2xl font-bold">Profile</h2>
          </div>
          <div className="bg-gray-600 p-6">
            <div className="flex flex-col items-center mb-6">
              <img
                src={userDetails.image}
                alt="Profile"
                className="rounded-full border-4 border-gray-700 shadow-lg"
                style={{ width: '9rem', height: '9rem', objectFit: 'cover' }}
              />
            </div>
            <div className="text-center space-y-2 text-white">
              <p className="font-semibold">Name: <span className="font-normal">{userDetails.name || 'N/A'}</span></p>
              <p className="font-semibold">ID: <span className="font-normal">{userDetails._id || 'N/A'}</span></p>
              <p className="font-semibold">Age: <span className="font-normal">{userDetails.age || 'N/A'}</span></p>
              <p className="font-semibold">Email: <span className="font-normal">{userDetails.email || 'N/A'}</span></p>
              <p className="font-semibold">Phone Number: <span className="font-normal">{userDetails.phone || 'N/A'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
