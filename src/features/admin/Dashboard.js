import React, {useState}from 'react';
import { Route, Switch, Link, useRouteMatch } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';


import UserMgt from './users/UserMgt';

export default function Dashboard({location}) {

  const { path, url } = useRouteMatch();
  const [active, setActive] = useState(location.pathname)

  const handleSelect = (event) => {
    setActive(event.href);
  }

  return (<div>
    <Nav variant="pills" activeKey={active} onSelect={handleSelect}>
      <Nav.Item>
        <Nav.Link href="/admin" to={`${url}`} as={Link}>
          Dasboard
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/admin/users" title="Item" to={`${url}/users`} as={Link}>
          Users
        </Nav.Link>
      </Nav.Item>
    </Nav>

    <Switch>
      <Route exact path={path}>DashBoard</Route>
      <Route exact path={`${path}/users`} component={UserMgt}/>
    </Switch>
  </div> );
}
