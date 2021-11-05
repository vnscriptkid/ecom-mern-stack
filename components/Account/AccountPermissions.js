import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import { Header, Icon, Table, Checkbox } from "semantic-ui-react";
import formatDate from "../../utils/formatDate";

function AccountPermissions() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const token = Cookies.get("token");
    const config = { headers: { Authorization: token } };

    const url = `${baseUrl}/api/users`;
    try {
      const res = await axios.get(url, config);
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{ margin: "2em 0" }}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <UserPermission key={user._id} {...user} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function UserPermission({ _id, name, email, createdAt, updatedAt, role }) {
  const [isAdmin, setIsAdmin] = useState(role === "admin");
  const firstRender = useRef(true);

  function handleToggle() {
    setIsAdmin((prevState) => !prevState);
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    toggleRoleAsync();
  }, [isAdmin]);

  async function toggleRoleAsync() {
    const token = Cookies.get("token");
    const config = { headers: { Authorization: token } };

    const url = `${baseUrl}/api/users`;
    try {
      const payload = { _id, role: isAdmin ? "admin" : "user" };
      const res = await axios.put(url, payload, config);
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Table.Row>
      <Table.Cell>
        <Checkbox onChange={handleToggle} checked={isAdmin} toggle />
      </Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{email}</Table.Cell>
      <Table.Cell>{formatDate(createdAt)}</Table.Cell>
      <Table.Cell>{formatDate(updatedAt)}</Table.Cell>
      <Table.Cell>{role}</Table.Cell>
    </Table.Row>
  );
}

export default AccountPermissions;
