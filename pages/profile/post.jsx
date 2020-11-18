import React, { useState } from "react";
import { Form, Col, Button, Row, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

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

const AddElement = () => {
    const [genres, setGenres] = useState(
        genre.map((e) => ({ name: e, value: false }))
    );
    const [errorMsg, setErrorMsg] = useState();
    const [textForm, setTextForm] = useState("");
    const router = useRouter();

    const handleSubmitFanFic = async (e) => {
        e.preventDefault();
        const selectedGenres = genres
            .filter((e) => e.value === true)
            .map((e) => e.name);
        const body = {
            name: e.currentTarget.nameFanfic.value,
            description: e.currentTarget.description.value,
            genres: selectedGenres,
            text: textForm,
        };
        try {
            const res = await axios.post("/api/user/posts", body);
            if (res.status === 201) {
                router.back();
            }
        } catch (err) {
            setErrorMsg(err.response.data);
        }
    };

    return (
        <div className="forms-wrapper">
            <Form onSubmit={handleSubmitFanFic}>
                {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="nameFanfic" placeholder="Name" required />
                </Form.Group>

                <Form.Group controlId="exampleForm.Description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Description"
                        name="description"
                        rows={3}
                        required
                    />
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label as="legend" column sm={2}>
                        Genre
          </Form.Label>
                    <Col sm={10}>
                        {genres.map((val) => (
                            <Form.Check 
                            required
                                key={val.name}
                                className="genre-element"
                                inline
                                type="checkbox"
                                label={val.name}
                                value={val.value}
                                onChange={() =>
                                    setGenres((old) =>
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
                <Form.Group controlId="exampleForm.Text">
                    <Form.Label>Text</Form.Label>
                    <Tabs defaultActiveKey="Write">
                        <Tab eventKey="Write" title="Write">
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Text"
                                value={textForm}
                                onChange={(e) => setTextForm(e.currentTarget.value)}
                                required
                            />
                        </Tab>
                        <Tab eventKey="Preview" title="Preview">
                            <ReactMarkdown>{textForm || "Nothing to preview"}</ReactMarkdown>
                        </Tab>
                    </Tabs>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
        </Button>
            </Form>
        </div>
    );
};

export default AddElement;