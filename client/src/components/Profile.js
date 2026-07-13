import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const navigate = useNavigate();
  const {user: userDetails, isAuthenticated, isAuthLoading} = useSelector((state) => state.auth);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isAuthLoading, navigate]);
  
  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-lg text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center mt-12">
      <div className="w-full max-w-2xl rounded-2xl shadow-xl shadow-gray-500/10 bg-black border border-white/10">
        <div className="bg-gradient-to-r from-green-400/30 via-blue-500/20 to-purple-500/30 text-white text-center py-6 rounded-t-2xl">
          <h2 className="text-3xl font-bold tracking-wide drop-shadow-lg">Profile</h2>
        </div>
        <div className="flex flex-col items-center p-8">
          <div className="relative mb-6">
            <img
              src={userDetails.image}
              alt="Profile"
              className="rounded-full border-4 border-white shadow-xl object-cover"
              style={{ width: '9rem', height: '9rem' }}
            />
            <span className="absolute bottom-2 right-2 bg-green-400 border-2 border-white rounded-full w-5 h-5"></span>
          </div>
          <div className="w-full max-w-md space-y-4 text-white/90">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-semibold">Name:</span>
              <span className="font-normal">{userDetails.name || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-semibold">ID:</span>
              <span className="font-normal break-all">{userDetails._id || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-semibold">Age:</span>
              <span className="font-normal">{userDetails.age || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-semibold">Email:</span>
              <span className="font-normal break-all">{userDetails.email || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Phone Number:</span>
              <span className="font-normal">{userDetails.phone || '7400330785'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;