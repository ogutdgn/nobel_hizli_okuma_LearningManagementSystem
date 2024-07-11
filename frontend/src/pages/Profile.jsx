import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button, TextField } from '@mui/material';
import { toastSuccessNotify, toastErrorNotify } from '../helper/ToastNotify';
import useUserCalls from '../service/useUserCalls';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { updateUser } = useUserCalls();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser({ ...user, ...userData }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data', error);
      toastErrorNotify("Error updating profile.");
    }
  };

  const handleCancel = () => {
    if (user) {
      setUserData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }
    setIsEditing(false);
  };

  return (
    <Container>
      <form onSubmit={handleSave}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                  First name
                </label>
                <div className="mt-2">
                  <TextField
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    value={userData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                  Last name
                </label>
                <div className="mt-2">
                  <TextField
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="family-name"
                    value={userData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <TextField
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="given-name"
                    value={userData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {isEditing ? (
            <>
              <Button type="button" onClick={handleCancel} className="text-sm font-semibold leading-6 text-gray-900">
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Edit
            </Button>
          )}
        </div>
      </form>
    </Container>
  );
};

export default Profile;
