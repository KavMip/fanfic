import React from "react";
import {
  Container,
  ListGroup,
  Row,
  Col,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Plus, Trash, Pen } from "react-bootstrap-icons";

const SortableItem = SortableElement(
  ({ value, deleteChapter, editChapter }) => (
    <ListGroup.Item className="item-row">
      <style jsx global>
        {`
          .item-icon-group {
            visibility: hidden;
            opacity: 0;
            transition: 0.2s ease-in-out;
          }
          .item-row:hover .item-icon-group {
            visibility: visible;
            opacity: 1;
          }
        `}
      </style>
      <Container fluid>
        <Row>
          <Col>
            {value.number + 1}. {value.title}
          </Col>
          <Col xs="auto">
            <ButtonGroup className={"item-icon-group"}>
              <Button
                variant="outline-secondary"
                onClick={() => editChapter(value.number)}
              >
                <Pen style={{ pointerEvents: "none" }} />
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => deleteChapter(value.number)}
              >
                <Trash style={{ pointerEvents: "none" }} />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  )
);

const SortableList = SortableContainer(
  ({ items, deleteChapter, editChapter }) => {
    return (
      <ListGroup>
        {items.map((value, index) => (
          <SortableItem
            key={`${index}-${value.title}`}
            index={index}
            value={value}
            deleteChapter={deleteChapter}
            editChapter={editChapter}
          />
        ))}
      </ListGroup>
    );
  }
);

const TableOfContents = ({ content, setContent, setSelectionRange }) => {
  const tableOfContents = [...content.matchAll(/^## (.+)$/gm)].map(
    (match, index, arr) => ({
      startIndex: match.index,
      endIndex: index < arr.length - 1 ? arr[index + 1].index : content.length,
      match: match[0],
      title: match[1],
      number: index,
    })
  );

  const handleSort = (sort) => {
    const oldStartIndex = tableOfContents[sort.oldIndex].startIndex;
    const oldEndIndex = tableOfContents[sort.oldIndex].endIndex;
    const newStartIndex = tableOfContents[sort.newIndex].startIndex;
    const newEndIndex = tableOfContents[sort.newIndex].endIndex;

    if (sort.newIndex > sort.oldIndex) {
      let oldString = content.substring(oldEndIndex, newEndIndex);
      if (oldString[oldString.length - 1] !== "\n") {
        oldString += "\n";
      }
      const parts = [
        content.substring(0, oldStartIndex),
        oldString,
        content.substring(oldStartIndex, oldEndIndex),
        content.substring(newEndIndex, content.length),
      ];
      const newContent = parts.join("");
      setContent(newContent);
    } else if (sort.newIndex < sort.oldIndex) {
      let oldString = content.substring(oldStartIndex, oldEndIndex);
      if (oldString[oldString.length - 1] !== "\n") {
        oldString += "\n";
      }
      const parts = [
        content.substring(0, newStartIndex),
        oldString,
        content.substring(newStartIndex, oldStartIndex),
        content.substring(oldEndIndex, content.length),
      ];
      const newContent = parts.join("");
      setContent(newContent);
    }
  };
  const createChapter = () => {
		const addString = "\n## New chapter";
		setContent(content + addString);
  };
  const deleteChapter = (index) => {
    setContent(
      content.substring(0, tableOfContents[index].startIndex) +
        content.substring(tableOfContents[index].endIndex, content.length)
    );
  };
  const editChapter = (index) => {
    const startIndex = tableOfContents[index].startIndex;
    const length = tableOfContents[index].match.length;
    setSelectionRange && setSelectionRange(startIndex, startIndex + length);
  };

  return (
    <Container fluid>
      <Row>
        <Col>Chapters</Col>
        <Col xs="auto">
          <Button
            variant="outline-primary"
            style={{ padding: 0 }}
            onClick={createChapter}
          >
            <Plus size={25} />
          </Button>
        </Col>
      </Row>
      <SortableList
        items={tableOfContents}
        onSortEnd={handleSort}
        deleteChapter={deleteChapter}
        editChapter={editChapter}
      />
    </Container>
  );
};
export default TableOfContents;