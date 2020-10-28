import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { SERVER_URL } from "../../constant";

import {
  calendarDay,
  calendarWeek,
  receiveCalendar,
  receiveCalendarError,
  requestCalendar,
} from "../../reducers/action";

// days of the week in the same format as fullcalendar
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
// week class object template
const newWeekClass = {
  _id: "",
  workout: "",
  comments: [],
  "02:00": {
    members: [],
  },
  "03:00": {
    members: [],
  },
  "04:00": {
    members: [],
  },
  "05:00": {
    members: [],
  },
  "06:00": {
    members: [],
  },
  "08:00": {
    members: [],
  },
  "09:00": {
    members: [],
  },
  "12:00": {
    members: [],
  },
  "13:00": {
    members: [],
  },
  "14:00": {
    members: [],
  },
  "15:00": {
    members: [],
  },
  "16:00": {
    members: [],
  },
};
// weekend class object template
const newWeekendClass = {
  _id: "",
  workout: "",
  comments: [],
  "04:00": {
    members: [],
  },
  "05:00": {
    members: [],
  },
  "06:00": {
    members: [],
  },
  "07:00": {
    members: [],
  },
  "08:00": {
    members: [],
  },
};
let newClass;

const Calendar = (props) => {
  const [show, setShow] = React.useState({ info: "", modal: false });
  const calendarState = useSelector((state) => state.calendar);
  const currentUser = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  // close modal
  const handleClose = () => {
    // empty modal info
    setShow({ info: "", modal: false });
  };

  // open modal
  const handleShow = (info) => {
    // set modal date/time info
    setShow({ info: info.el.fcSeg, modal: true });
  };

  // class booking
  const handleCalendarSubmit = (ev) => {
    ev.preventDefault();
    // string of that format '00:00'
    let classTime = show.info.start.toString().slice(16, 21);
    // create an _id from the date without the time
    let classId = Buffer.from(show.info.start.toString().slice(0, 15)).toString(
      "base64"
    );
    console.log(classId);
    // see if the class day is during the week or the weekend
    let weekDayConfirmation = weekDays.includes(
      show.info.start.toString().slice(0, 3)
    );

    // create newClass with weekday object
    if (weekDayConfirmation) {
      newClass = {
        ...newWeekClass,
        _id: classId,
        [classTime]: {
          members: [
            {
              _id: currentUser._id,
              fullname: currentUser.firstName + " " + currentUser.lastName,
              email: currentUser.email,
            },
          ],
        },
      };
      // create newClass with weekendday object
    } else {
      newClass = {
        ...newWeekendClass,
        _id: classId,
        [classTime]: {
          members: [
            {
              _id: currentUser._id,
              fullname: currentUser.firstName + " " + currentUser.lastName,
              email: currentUser.email,
            },
          ],
        },
      };
    }

    dispatch(requestCalendar());

    fetch(SERVER_URL + `/api/bookclass/${newClass._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newClass,
        classTime,
        currentUser,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          dispatch(receiveCalendar(data.calendar));
          localStorage.setItem("currentCalendarId", data.calendar._id);
        } else {
          dispatch(receiveCalendarError());
        }
      })
      .catch((err) => {
        dispatch(receiveCalendarError());
      });

    setShow({ info: "", modal: false });
  };

  // const handleMouseEnter = () => {
  //   console.log("enter");
  // };
  // const handleMouseLeave = () => {
  //   console.log("leave");
  // };

  // timeGridDay timeGridWeek dayGridMonth
  return (
    <StyledDiv>
      <div>
        <button
          disabled={
            calendarState.calendarDisplay === "timeGridDay" ? true : false
          }
          onClick={() => {
            dispatch(calendarDay());
            localStorage.setItem("calendarDisplay", "timeGridDay");
          }}
        >
          Day
        </button>
        <button
          disabled={
            calendarState.calendarDisplay === "timeGridWeek" ? true : false
          }
          onClick={() => {
            dispatch(calendarWeek());
            localStorage.setItem("calendarDisplay", "timeGridWeek");
          }}
        >
          Week
        </button>
      </div>

      <Modal show={show.modal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>my body</Modal.Body>
        <Modal.Footer>
          <button onClick={handleCalendarSubmit} variant={"secondary"}>
            Book
          </button>
          <button onClick={handleClose} variant={"primary"}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={calendarState.calendarDisplay}
        slotMinTime={"05:00:00"}
        slotMaxTime={"22:00:00"}
        slotDuration={"1:00"}
        contentHeight={800}
        expandRows={true}
        timeZone={"America/New_York"}
        eventClick={handleShow}
        // eventMouseEnter={handleMouseEnter}
        // eventMouseLeave={handleMouseLeave}
        events={[
          {
            title: "class",
            startTime: "6:00",
            endTime: "7:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "7:00",
            endTime: "8:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "8:00",
            endTime: "9:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "9:00",
            endTime: "10:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "open",
            startTime: "10:00",
            endTime: "12:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "12:00",
            endTime: "13:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "open",
            startTime: "13:00",
            endTime: "16:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "16:00",
            endTime: "17:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "17:00",
            endTime: "18:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "18:00",
            endTime: "19:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "19:00",
            endTime: "20:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "class",
            startTime: "20:00",
            endTime: "21:00",
            daysOfWeek: [1, 2, 3, 4, 5],
          },
          {
            title: "specialty",
            startTime: "8:00",
            endTime: "9:00",
            daysOfWeek: [0, 6],
          },
          {
            title: "class",
            startTime: "9:00",
            endTime: "10:00",
            daysOfWeek: [0, 6],
          },
          {
            title: "class",
            startTime: "10:00",
            endTime: "11:00",
            daysOfWeek: [0, 6],
          },
          {
            title: "class",
            startTime: "11:00",
            endTime: "12:00",
            daysOfWeek: [0, 6],
          },
          {
            title: "open",
            startTime: "12:00",
            endTime: "15:00",
            daysOfWeek: [0, 6],
          },
        ]}
      />
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  margin: 50px;
  border: 1px solid red;
`;

export default Calendar;
