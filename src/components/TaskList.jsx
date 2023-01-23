import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { AuthContext } from "../context/AuthContext";

export default function TaskList() {
  const [checked, setChecked] = useState([]);
  const [taskData, setTaskData] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [successFlag, setSuccessFlag] = useState(false);
  const { authData } = useContext(AuthContext);

  console.log("AUTH DATA: ", authData);

  // iterate all taskData
  // if status === 1 push the id to checked

  const handleToggle = async (data) => {
    const currentIndex = checked.indexOf(data._id); // current index of clicked item
    const newStatus = currentIndex === -1 ? 1 : 0; // if current index is -1 meaning the id of checkbox data is inside the array (checked)
    const newChecked = [...checked]; // clone list of checked items
    // UPDATE STATUS
    try {
      await fetch(`http://localhost:3000/api/tasks/${data._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((result) => {
          if (currentIndex === -1) {
            newChecked.push(result._id);
          } else {
            newChecked.splice(currentIndex, 1);
          }
          setChecked(newChecked); // set new checklist
        });
    } catch (err) {
      console.log(err);
    }
  };

  // submit function
  const handleAddTask = async (event) => {
    event.preventDefault();
    try {
      await fetch("http://localhost:3000/api/tasks/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: taskInput,
          author: authData.userId,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((result) => {
          // Update the Task List by adding the result inside taskData state
          setTaskData((prevTaskList) => {
            return prevTaskList.concat(result);
          });
          setTaskInput(""); // clear input field
          setSuccessFlag(true); // set success flag to true so that alert box will show
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Handle Text Input
  const handleInput = (event) => {
    setTaskInput(event.target.value);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const clonedTaskData = [...taskData]; // clone the original taskData state
    // remove the ID of the selected delete task
    const deletedTaskData = clonedTaskData.filter((task) => {
      return task._id !== id;
    });
    try {
      await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((result) => {
          console.log(result);
          setTaskData(deletedTaskData); // set the original taskData state into the filtered data without the deleted id
        });
    } catch (err) {
      console.log(err);
    }
  };

  //   FETCH LIST
  useEffect(() => {
    try {
      fetch(`http://localhost:3000/api/tasks/${authData.userId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          setTaskData(data);
          const completed_status_array = [];
          // get all completed status
          const completed_status = data.filter((val) => {
            return val.status === 1;
          });
          // push the ids of completed status
          completed_status.map((data2) => {
            completed_status_array.push(data2._id);
          });
          // set the checked to pushed ids from completed status
          setChecked(completed_status_array);
        });
    } catch (err) {
      console.log(err);
    }
  }, [authData]);

  return (
    <>
      {/* ALERT WARNING */}
      {successFlag && (
        <Alert
          severity="success"
          sx={{ marginBottom: "10px;" }}
          onClose={() => {
            setSuccessFlag(false);
          }}
        >
          <AlertTitle>Success</AlertTitle>
          Task added — <strong>SUCCESSFULLY!</strong>
        </Alert>
      )}
      {authData === null && (
        <Alert severity="warning">
          <AlertTitle>WARNING</AlertTitle>
          Please login First
        </Alert>
      )}
      {authData && (
        <div>
          <Box
            onSubmit={handleAddTask}
            component="form"
            noValidate
            autoComplete="off"
          >
            <TextField
              label="New Task"
              id="textfield"
              sx={{ width: "100%" }}
              onInput={handleInput}
              onFocus={() => {
                setSuccessFlag(false);
              }}
              value={taskInput}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="submit" variant="contained">
                      Add
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {/* LIST */}
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {taskData !== null &&
              taskData.map((value) => {
                const labelId = `checkbox-list-label-${value._id}`;

                return (
                  <ListItem
                    key={value._id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={() => handleDelete(value._id)}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    }
                    disablePadding
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={() => handleToggle(value)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(value._id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={value.description} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </div>
      )}
    </>
  );
}
