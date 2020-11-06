import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map } from 'lodash';
import UserTable from './UserTable';

import {
  fetchUsers,
  updateUser, 
  deleteUser } from './userSlice';

export default function UserMgt() {

  const dispatch = useDispatch();
  const {users, pending} = useSelector(state => state.users);


  useEffect( () => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRowUpdate = (newValue) => (dispatch(updateUser(newValue)));
  const handleRowDelete = (userId) => (dispatch(deleteUser(userId)));

  return (<div className="mt-2">
    <UserTable data={map(users, user=> ({ ...user} ))}
      isLoading={pending} 
      onRowUpdate={handleRowUpdate} 
      onRowDelete={handleRowDelete}/>
  </div>)
}
