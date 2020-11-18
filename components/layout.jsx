import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useUser } from "../lib/hooks";
import {
  Navbar,
  Container,
  Nav,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ children }) => {
  const { user, mutate } = useUser();
  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "DELETE",
    });
    mutate(null);
  };
  return (
    <>
      <style jsx global>
        {`
          h2 {
            color: #333;
            text-align: center;
          }
          button {
            display: block;
            margin-bottom: 0.5rem;
            color: #fff;
            border-radius: 5px;
            border: none;
            background-color: #000;
            cursor: pointer;
            transition: all 0.2s ease 0s;
            padding: 10px 25px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
          }
          .forms-wrapper {
            width: 60%;
            margin-left: auto;
            margin-right: auto;
          }
          .genre-element {
            width: 140px;
          }

          .log-wrapper {
            display: flex;
            align-items: center;
          }

          .mb-3 {
            width: 40%;
            margin-bottom: 0 !important;
          }

          .navbar {
            margin-bottom: 1rem;
          }
        `}
      </style>
      <>
        <Head>
          <title>Next.js + MongoDB App</title>
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta
            name="description"
            content="nextjs-mongodb-app is a continously developed app built with Next.JS and MongoDB. This project goes further and attempts to integrate top features as seen in real-life apps."
          />
          <meta property="og:title" content="Next.js + MongoDB App" />
          <meta
            property="og:description"
            content="nextjs-mongodb-app is a continously developed app built with Next.JS and MongoDB. This project goes further and attempts to integrate top features as seen in real-life apps."
          />
          <meta
            property="og:image"
            content="https://repository-images.githubusercontent.com/201392697/5d392300-eef3-11e9-8e20-53310193fbfd"
          />
        </Head>

        <Navbar expand="lg" bg="dark" variant="dark">
          <Container>
            <Nav id="responsive-navbar-nav">
              <Link href="/">
                <Nav.Link href="#home">Next.js + MongoDB App</Nav.Link>
              </Link>
            </Nav>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
            </InputGroup>

            {!user ? (
              <Nav>
                <div className="log-wrapper">
                  <Link href="/login">
                    <Nav.Link href="#home">Sign in </Nav.Link>
                  </Link>
                  <Link href="/signup">
                    <Nav.Link href="#home">Sign up</Nav.Link>
                  </Link>
                </div>
              </Nav>
            ) : (
                <Nav>
                  <div className="log-wrapper">
                    <Link href="/profile">
                      <Nav.Link href="#home">Profil</Nav.Link>
                    </Link>
                    {user.isAdmin ? (
                      <Link href="/adminPage">
                        <Nav.Link href="#home">Admin Page</Nav.Link>
                      </Link>
                    ):null

                    }

                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link href="/">
                      <Nav.Link onClick={handleLogout} href="#home">
                        {" "}
                      Logout
                    </Nav.Link>
                    </Link>
                  </div>
                </Nav>
              )}
          </Container>
        </Navbar>
      </>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}

export default Layout;