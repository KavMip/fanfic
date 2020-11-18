import React, { useState } from "react";
import Head from "next/head";
import { useUser } from "../lib/hooks";
import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../components/loader";

const LoginPage = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const { mutate} = useUser();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };
    setLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      await mutate(userObj);
    } else {
			setLoading(false);
			setErrorMsg("Incorrect username or password. Try again!");
    }
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className="forms-wrapper">
        <Form onSubmit={onSubmit}>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              name="password"
              placeholder="Password"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Sign In
          </Button>
          {/* <Link href="/forgetpassword">
          <a>Forget password</a>
        </Link> */}
        </Form>
      </div>
    </>
  );
};
export default LoginPage;