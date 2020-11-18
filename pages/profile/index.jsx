import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useUserPosts, useUser } from "../../lib/hooks";
import { useRouter } from "next/router";

import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import axios from "axios";
import Loader from "../../components/loader";

const ProfilePage = () => {
  const {user} = useUser();
  const router = useRouter();
  const {posts, mutate:mutatePosts, loading:loadingPosts} = useUserPosts();
  const [checkedPosts, setCheckedPosts] = useState([]);
  const { name, email, bio, profilePicture } = user || {};
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await axios.delete("/api/user/posts", {
      data: { id: checkedPosts },
    });
    await mutatePosts(res.posts);
    setCheckedPosts([]);
    setLoading(false);
  };

  if (loadingPosts || loading) {
    return <Loader />;
  }
  return (
    <>
      <style jsx>
        {`
          h2 {
            text-align: left;
            margin-right: 0.5rem;
          }
          button {
            margin: 0 0.25rem;
          }
          img {
            width: 10rem;
            height: auto;
            border-radius: 50%;
            box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 1px;
            margin-right: 1.5rem;
          }
          div {
            color: #777;
            display: flex;
            align-items: center;
          }
          p {
            font-family: monospace;
            color: #444;
            margin: 0.25rem 0 0.75rem;
          }
          a {
            margin-left: 0.25rem;
          }
        `}
      </style>
      <Head>
        <title>{name}</title>
      </Head>
      <div>
        {profilePicture ? (
          <img src={profilePicture} width="256" height="256" alt={name} />
        ) : null}
        <section>
          <div>
            <h2>{name}</h2>
            <Link href="/profile/settings">
              <button type="button">Edit</button>
            </Link>
          </div>
          {/* Bio
          <p>{bio}</p> */}
          Email
          <p>{email}</p>
        </section>
      </div>

      <div>
        <ButtonToolbar aria-label="Toolbar with button groups">
          <ButtonGroup className="mr-2" aria-label="First group">
            <Link href="/profile/post">
              <Button>Create new element</Button>
            </Link>
            <Button
              disabled={checkedPosts.length === 0}
              variant="secondary"
              onClick={handleDelete}
            >
              Delete selected
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      <div className="users">
        <Table striped bordered hover variant="dark">
          <thead className="users">
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={
                    posts.length > 0 &&
                    posts.every((post) =>
                      checkedPosts.some((checkId) => post._id === checkId)
                    )
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedPosts(posts.map((post) => post._id));
                    } else {
                      setCheckedPosts([]);
                    }
                  }}
                />
              </th>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Genres</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => {
              return (
                <Link href={`/profile/post?id=${post._id}`} key={post._id}>
                  <tr>
                    <td>
                      <Form.Check
                        checked={checkedPosts.some((e) => e === post._id)}
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckedPosts((old) => [...old, post._id]);
                          } else {
                            setCheckedPosts((old) =>
                              old.filter((e) => e !== post._id)
                            );
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{post.name}</td>
                    <td>{post.description}</td>
                    <td>{post.genres.join(", ")}</td>
                    <td>{post.text}</td>
                  </tr>
                </Link>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};
export default ProfilePage;