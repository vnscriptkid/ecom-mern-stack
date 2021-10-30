import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import { Header, Icon, Table, Checkbox } from "semantic-ui-react";

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

function UserPermission({ name, email, createdAt, updatedAt, role }) {
  return (
    <Table.Row>
      <Table.Cell>
        <Checkbox toggle />
      </Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{email}</Table.Cell>
      <Table.Cell>{createdAt}</Table.Cell>
      <Table.Cell>{updatedAt}</Table.Cell>
      <Table.Cell>{role}</Table.Cell>
    </Table.Row>
  );
}

export default AccountPermissions;
