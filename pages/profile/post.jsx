import React, { useState, useEffect } from "react";
import { Form, Col, Button, Row, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import Loader from "../../components/loader";
import { getUrlFromDropFile } from "../../lib/helpers";
import TableOfContents from "../../components/tableOfContents";
import { useRef } from "react";

const genre = [
  "Hurt",
  "POV",
  "PWP",
  "Songfic",
  "Ангст",
  "Антиутопия",
  "Даркфик",
  "Детектив",
  "Драма",
  "Любовь",
  "Мистика",
  "Повседневность",
  "Психология",
  "Романтика",
  "Ужасы",
  "Фантастика",
  "Фэнтези",
];

const Post = () => {
  const [nameForm, setNameForm] = useState("");
  const [descriptionForm, setDescriptionForm] = useState("");
  const [genresForm, setGenresForm] = useState(
    genre.map((e) => ({ name: e, value: false }))
  );
  const [textForm, setTextForm] = useState("");

  const [errorMsg, setErrorMsg] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const postId = router.query.id;
  const userId = router.query.userId;
  const textFormRef = useRef();

  useEffect(() => {
    if (postId) {
      setLoading(true);
      axios
        .get("/api/user/posts", {
          params: {
            id: postId,
          },
        })
        .then((res) => {
          const post = res.data.post;
          setNameForm(post.name);
          setDescriptionForm(post.description);
          setGenresForm((old) =>
            old.map((e) => {
              if (post.genres.some((g) => g === e.name)) {
                return { ...e, value: true };
              }
              return e;
            })
          );
          setTextForm(post.text);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          router.replace(router.pathname);
        });
    }
  }, [postId]);

  const handleSubmitFanFic = async (e) => {
    e.preventDefault();
    const selectedGenres = genresForm
      .filter((e) => e.value === true)
      .map((e) => e.name);
    const body = {
      name: nameForm,
      description: descriptionForm,
      genres: selectedGenres,
      text: textForm,
		};
		if(userId){
			body.userId=userId;
		}
    setLoading(true);
    try {
      let res;
      if (postId) {
        res = await axios.put("/api/user/posts", { ...body, id: postId });
      } else {
        res = await axios.post("/api/user/posts", body);
      }
      if (res.status === 201) {
				router.back();
      }
    } catch (err) {
      setErrorMsg(err.response.data);
      setLoading(false);
    }
  };

  const handleDrop = (dataTransfer, cursorPosition = textForm.length) => {
    const uploadingText = "\n![Uploading....]()\n";
    setTextForm(
      (old) =>
        old.substring(0, cursorPosition) +
        uploadingText +
        old.substring(cursorPosition)
    );
    getUrlFromDropFile(dataTransfer)
      .then((url) => {
        setTextForm((old) => old.replace(uploadingText, url));
      })
      .catch(() => {
        setTextForm((old) => old.replace(uploadingText, ""));
      });
  };

  const setTextSelectionRange = (startIndex,endIndex) => {
    if (textFormRef && textFormRef.current) {
			textFormRef.current.blur()
			textFormRef.current.setSelectionRange(startIndex,endIndex)
			textFormRef.current.focus()
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="forms-wrapper">
      <Form onSubmit={handleSubmitFanFic}>
        {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={nameForm}
            onChange={(e) => setNameForm(e.target.value)}
            placeholder="Name"
            required
          />
        </Form.Group>

        <Form.Group controlId="exampleForm.Description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Description"
            value={descriptionForm}
            onChange={(e) => setDescriptionForm(e.target.value)}
            rows={3}
            required
          />
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={2}>
            Genre
          </Form.Label>
          <Col sm={10}>
            {genresForm.map((val, index) => (
              <Form.Check
                key={index}
                className="genre-element"
                inline
                type="checkbox"
                label={val.name}
                checked={val.value}
                onChange={() =>
                  setGenresForm((old) =>
                    old.map((e) => {
                      if (e.name === val.name) {
                        return { ...e, value: !e.value };
                      }
                      return e;
                    })
                  )
                }
              />
            ))}
          </Col>
        </Form.Group>
        <Form.Group controlId="exampleForm.Text" as={Row}>
				<Col>
            <TableOfContents
              content={textForm}
              setContent={setTextForm}
              setSelectionRange={setTextSelectionRange}
            />
          </Col>
          <Col>
            <Form.Label>Text</Form.Label>
            <Tabs defaultActiveKey="Write">
              <Tab eventKey="Write" title="Write">
                <Form.Control
                  as="textarea"
                  rows={10}
                  placeholder="Text"
                  value={textForm}
                  onChange={(e) => {
                    setTextForm(e.currentTarget.value);
                  }}
                  required
                  ref={textFormRef}
                  onDrop={(e) => {
                    e.preventDefault();
                    const cursorPosition = e.currentTarget.selectionStart;
                    handleDrop(e.dataTransfer, cursorPosition);
                  }}
                />
              </Tab>
              <Tab eventKey="Preview" title="Preview">
                <ReactMarkdown>
                  {textForm || "Nothing to preview"}
                </ReactMarkdown>
              </Tab>
            </Tabs>
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Post;