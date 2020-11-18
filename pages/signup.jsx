import React, { useState } from "react";
import Head from "next/head";
import { useUser } from "../lib/hooks";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/loader";

const SignupPage = () => {
  const { mutate } = useUser();
  const [errorMsg, setErrorMsg] = useState("");
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: e.currentTarget.email.value,
      name: e.currentTarget.name.value,
      password: e.currentTarget.password.value,

    };
		setLoading(true);
    try {
      const res = await axios.post("/api/users", body);
      if (res.status === 201) {
        const userObj = await res.data.user;
        await mutate(userObj);
      }
    } catch (err) {
			setLoading(false);
      setErrorMsg(err.response.data);
		}
	};
	
	if (loading) {
    return <Loader />;
  }
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <div className="forms-wrapper">
        <Form onSubmit={handleSubmit}>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Email</Form.Label>
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
              name="password"
              type="password"
              placeholder="Create a password"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Form>
      </div>
    </>
  );
};
export default SignupPage;