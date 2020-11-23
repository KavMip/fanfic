import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouterUser } from "../../lib/hooks";
import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import Axios from "axios";
import Loader from "../../components/loader";

const ProfilePage = () => {
  const routerUser = useRouterUser();
  const [checkedPosts, setCheckedPosts] = useState([]);
  const [routerUserPost, setrouterUserPost] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (routerUser) {
      Axios.get("/api/user/posts", { params: { userId: routerUser._id } })
        .then((res) => {
          setrouterUserPost(res.data.posts);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [routerUser]);

  const handleDelete = async () => {
    setLoading(true);
    const res = await Axios.delete("/api/user/posts", {
      data: { id: checkedPosts },
    });
    setrouterUserPost((old) =>
      old.filter((e) => checkedPosts.every((postId) => postId !== e._id))
    );
    setCheckedPosts([]);
    setLoading(false);
  };

  if (loading || !routerUser) {
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
        <section>
          <div>
            <h2>{routerUser.name}</h2>
            <Link href={"/profile/edit/" + routerUser._id}>
              <button type="button">Edit</button>
            </Link>
          </div>
          {/* Bio
          <p>{bio}</p> */}
          Email
          <p>{routerUser.email}</p>
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
                    routerUserPost.length > 0 &&
                    routerUserPost.every((post) =>
                      checkedPosts.some((checkId) => post._id === checkId)
                    )
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedPosts(routerUserPost.map((post) => post._id));
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
            {routerUserPost.map((post, index) => {
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