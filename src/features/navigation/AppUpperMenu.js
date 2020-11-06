import React from 'react';
import {Link} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import Dropdown from 'react-bootstrap/Dropdown';

import { signout } from '../signin/signinSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default function AppNavbar({className}) {

  const user = useSelector(state => state.signin.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const isAdmin = user.role === "admin";

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <span onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }} ref={ref }>
      <FontAwesomeIcon className="text-primary" size="2x" 
        icon={faUserCircle} />
      </span>
  ));

  const handleOnSignout = e => {
    dispatch(signout());
    history.push("/signin");
  }

  return <Dropdown className={className}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components"/>
      <Dropdown.Menu alignRight>
        { user && <Dropdown.ItemText className="text-center">{`Connected as ${user.local.login}`}</Dropdown.ItemText>}
        <Dropdown.Divider />
        <Dropdown.Item eventKey="1" as={Link} to="/profile">Profile</Dropdown.Item>
        {isAdmin &&
        <Dropdown.Item eventKey="1" as={Link} to="/admin">Admin</Dropdown.Item>}
        <Dropdown.Divider />
        <Dropdown.Item eventKey="2" onClick={handleOnSignout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

}