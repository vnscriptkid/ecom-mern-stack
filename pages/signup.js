import { Button, Form, Icon, Message, Segment } from "semantic-ui-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

import baseUrl from "../utils/baseUrl";
import catchErrors from '../utils/catchErrors';

const INITIAL_USER = {
  name: "",
  email: "",
  password: "",
};

function Signup() {
  const [user, setUser] = useState(INITIAL_USER);
  const [success, setSuccess] = useState(false);
  const [allValid, setAllValid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const formValidated = Object.values(user).every((value) => Boolean(value));
    setAllValid(formValidated);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // const url = `${baseUrl}/api/signup`;
      // await axios.post(url, user);
      console.log(user);
      setSuccess(true);
    } catch (e) {
      catchErrors(e, setError);
    } finally {
      setLoading(false);
    }
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
      <Form loading={loading} error={Boolean(error)} success={success} onSubmit={handleSubmit}>
      <Message
          success
          icon="check"
          header="Success!"
          content="Your account has been created"
        />
        <Message error header="Ooops!" content={error} />
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
          <Button
            disabled={!allValid || loading}
            icon="signup"
            type="submit"
            color="orange"
            content="Signup"
          />
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
