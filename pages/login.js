import { Button, Form, Icon, Message, Segment } from "semantic-ui-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";
import { handleLogin } from "../utils/auth";

const INITIAL_USER = {
  email: "",
  password: "",
};

function Login() {
  const [user, setUser] = useState(INITIAL_USER);
  const [success, setSuccess] = useState(false);
  const [allValid, setAllValid] = useState(false);
  const [error, setError] = useState("");
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
    setError("");
    try {
      const url = `${baseUrl}/api/login`;

      const payload = { ...user };

      const res = await axios.post(url, payload);
      handleLogin(res.data);

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
        icon="privacy"
        header="Welcome back!"
        content="Log in with email and password"
        color="blue"
      />
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        <Message
          success
          icon="check"
          header="Success!"
          content="You are logged in now!"
        />
        <Message error header="Ooops!" content={error} />
        <Segment>
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
            icon="sign in"
            type="submit"
            color="orange"
            content="Login"
          />
        </Segment>
      </Form>
      <Message attached="bottom" warning>
        <Icon name="help" />
        New user?{" "}
        <Link href="/signup">
          <a>Sign up here</a>
        </Link>{" "}
        instead.
      </Message>
    </>
  );
}

export default Login;
