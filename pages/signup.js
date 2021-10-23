import { Button, Form, Icon, Message, Segment } from "semantic-ui-react";
import Link from "next/link";
import { useState } from "react";

import baseUrl from "../utils/baseUrl";
import axios from "axios";

const INITIAL_USER = {
  name: "",
  email: "",
  password: "",
};

function Signup() {
  const [user, setUser] = useState(INITIAL_USER);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const url = `${baseUrl}/api/signup`;
    // await axios.post(url, user);
    console.log(user);
    setSuccess(true);
  };

  return (
    <>
      <Message
        attached
        icon="settings"
        header="Get Started!"
        content="Create a new account"
        color="teal"
      />
      <Form onSubmit={handleSubmit}>
        <Segment>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label="Name"
            placeholder="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="envelope"
            iconPosition="left"
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            user={user.password}
            onChange={handleChange}
          />
          <Button icon="signup" type="submit" color="orange" content="Signup" />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
        Existing user?{" "}
        <Link href="/login">
          <a>Log in here</a>
        </Link>{" "}
        instead.
      </Message>
    </>
  );
}

export default Signup;
