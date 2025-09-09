import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

function CreateArea(props) {
  const [note, setNote] = useState({
    id: "",
    title: "",
    content: "",
  });

  const [titleClick, setTitleClick] = useState(false);

  function handleTitleClick() {
    setTitleClick(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      const noteId  = uuidv4();
      return {
        ...prevNote,
        [name]: value,
        id: noteId
      };
    });
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      id: "",
      title: "",
      content: "",
    });
    event.preventDefault();
    setTitleClick(false);
  }

  return (
    <div>
      {titleClick ? (
        <form className="create-note">
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
          <textarea
            name="content"
            onChange={handleChange}
            value={note.content}
            placeholder="Take a note..."
            rows="3"
          />
          <Zoom in={true}>
            <Fab onClick={submitNote}>
              <AddIcon />
            </Fab>
          </Zoom>
        </form>
      ) : (
        <form className="create-note">
          <textarea
            name="content"
            onChange={handleChange}
            value={note.content}
            placeholder="Take a note..."
            rows="1"
            onClick={handleTitleClick}
          />
        </form>
      )}
    </div>
  );
}

export default CreateArea;
