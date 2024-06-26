import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { createPopupWindow, closePopupWindow } from "./popup";
import tippy from "tippy.js";
import { contextMenu, delContextMenu } from "./context_menu";
import { formatHDate } from "./text_formatting";
import { note, reserved } from "./note_utils";
import { editor } from "../main";
import { updateAndSaveNotesLocally } from "./dom_formatting";
import { attemptRemoval, eid } from "./dom_utils";

export {
  initializeTodo,
  showTodo,
  clearTaskTippys,
  events,
  pastEvents,
  datePicker,
  calendar,
  deleteCalendar,
};

// instance of fullcalendar, air date picker and command pal for later destruction
let calendar = null;
let datePicker = null;

let taskTippys = [];
// active and completed events for todo
let events;
let pastEvents;

function deleteCalendar() {
  if (calendar) {
    calendar.destroy();
    calendar = null;
  }
  if (datePicker) {
    datePicker.destroy();
    datePicker = null;
  }
}

function clearTaskTippys() {
  taskTippys = taskTippys.reduce((arr, e) => {
    e.destroy();
    return arr;
  }, []);
}

function showTodo(hereForInsertion) {
  if (hereForInsertion && reserved(note.name)) {
    notyf.error("Reserved notebooks are read only");
    return;
  }

  const bookDiffContent = createPopupWindow();

  const todoContainer = document.createElement("div");
  todoContainer.id = "todoContainer";

  const addTaskContainer = document.createElement("div");
  addTaskContainer.id = "addTaskContainer";
  todoContainer.appendChild(addTaskContainer);

  const calendarContainer = document.createElement("div");
  todoContainer.appendChild(calendarContainer);

  const eventClick = hereForInsertion
    ? (info) => {
        editor.insert(`:cal[${info.event.id}]`);
        updateAndSaveNotesLocally();
        closePopupWindow();
      }
    : (info) => {
        const evInList = eid(`task__${info.event.id}`);
        if (evInList) {
          evInList.addEventListener(
            "animationend",
            () => evInList.classList.remove("taskFlashes"),
            {
              once: true,
            }
          );
          evInList.classList.add("taskFlashes");
          evInList.scrollIntoView();
        }
      };

  calendar = new Calendar(calendarContainer, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    events: events,
    eventClick,
  });

  const taskName = document.createElement("input");
  taskName.placeholder = "Name";
  addTaskContainer.appendChild(taskName);
  const taskCategory = document.createElement("input");
  taskCategory.placeholder = "Category";
  addTaskContainer.appendChild(taskCategory);

  const taskDesc = document.createElement("textarea");
  taskDesc.placeholder = "Description";
  addTaskContainer.appendChild(taskDesc);

  const dp = document.createElement("input");
  dp.id = "datePicker";
  dp.readOnly = true;
  dp.placeholder = "Due Date";
  addTaskContainer.appendChild(dp);

  const submit = document.createElement("input");
  submit.setAttribute("type", "button");
  submit.id = "addTask";
  submit.value = "+ Add Task";
  submit.addEventListener("click", () => {
    if (dp.value && taskName.value) {
      const exactDate = Date.now();
      const eventObj = {
        id: exactDate,
        title: taskName.value,
        start: dp.value,
        extendedProps: {
          category: taskCategory.value.split(" ")[0] || "misc",
          description: taskDesc.value,
        },
      };
      calendar.addEvent(eventObj);
      events.push(eventObj);
      saveTodo();

      taskName.value, taskDesc.value, taskCategory.value, (dp.value = "");

      renderTaskList(false, taskList);
    }
  });

  addTaskContainer.appendChild(submit);

  const taskList = document.createElement("div");
  taskList.id = "taskList";
  addTaskContainer.appendChild(taskList);

  const seePast = document.createElement("input");
  seePast.id = "seePast";
  seePast.setAttribute("type", "button");
  seePast.value = "View Completed Tasks";
  seePast.addEventListener("click", function () {
    this.hasAttribute("data-enabled")
      ? renderTaskList(false, taskList)
      : renderTaskList(true, taskList);
    taskName.focus();
  });

  addTaskContainer.appendChild(seePast);
  bookDiffContent.appendChild(todoContainer);

  datePicker = new AirDatepicker("#datePicker", {
    locale: {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      today: "Today",
      clear: "Clear",
      dateFormat: "yyyy-MM-dd",
      timeFormat: "hh:mm aa",
      firstDay: 0,
    },
  });
  calendar.render();
  renderTaskList(false, taskList);
}

async function initializeTodo() {
  // Todo data is stored in an inaccessible notebook. The active tasks are stored in the 'content' and the completed tasks are stored in the 'date'
  const response = await fetch("/api/get/notebooks/todo__list");
  if (response.ok) {
    let json = await response.json();
    events = JSON.parse(json["data"]["content"][0]);
    pastEvents = JSON.parse(json["data"]["date"]);
  } else if (response.status === 404) {
    events = [];
    pastEvents = [];
  } else {
    notyf.error("An error occurred when loading your calendar events");
  }
}

async function saveTodo() {
  const response = await fetch("/api/save/notebooks/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "todo__list",
      content: [JSON.stringify(events)],
      date: JSON.stringify(pastEvents),
    }),
  });
  if (!response.ok) {
    notyf.error("An error occurred when saving the to-do list");
  }
}

function renderTaskList(lookingAtPast, taskList, constraint) {
  taskTippys = taskTippys.reduce((arr, e) => {
    e.destroy();
    return arr;
  }, []);

  while (taskList.firstChild) {
    taskList.firstChild.remove();
  }
  // this isn't good honestly
  if (lookingAtPast) {
    eid("seePast").setAttribute("data-enabled", "");
    eid("seePast").value = "View Active Tasks";
  } else {
    eid("seePast").removeAttribute("data-enabled");
    eid("seePast").value = "View Completed Tasks";
  }
  const lookAt = lookingAtPast ? pastEvents : events;
  const arr = !constraint
    ? lookAt
    : lookAt.filter((e) => e.extendedProps.category === constraint);
  if (!lookingAtPast) {
    arr.sort((a, b) => {
      const date1 = a.start;
      const date2 = b.start;
      if (date1 < date2) {
        return 1;
      }
      if (date1 > date1) {
        return -1;
      }
      return;
    });
  }
  arr.forEach((task) => {
    const event = document.createElement("div");
    event.classList.add("task");
    event.id = `task__${task.id}`;

    event.addEventListener("contextmenu", (e) =>
      contextMenu(e, [
        {
          text: `Delete Event`,
          click: function () {
            this.innerText = "Confirm";
            this.classList.add("rios");
            this.addEventListener(
              "click",
              function () {
                events = events.filter((e) => e.id !== task.id);
                pastEvents = pastEvents.filter((e) => e.id !== task.id);
                calendar.getEventById(task.id).remove();
                saveTodo();
                attemptRemoval([eid(`task__${task.id}`)]);
                delContextMenu();
              },
              { once: true }
            );
          },
          appearance: "ios",
        },
      ])
    );

    const eventTop = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (lookingAtPast) {
      checkbox.setAttribute("checked", "checked");
    }
    checkbox.setAttribute("data-id", task.id);
    if (lookingAtPast) {
      checkbox.addEventListener(
        "change",
        function () {
          this.parentElement.parentElement.remove();
          calendar.addEvent(task);
          events.push(pastEvents.filter((e) => e.id === task.id)[0]);
          pastEvents = pastEvents.filter((e) => e.id !== task.id);
          saveTodo();
        },
        { once: true }
      );
    } else {
      checkbox.addEventListener(
        "change",
        function () {
          const audio = new Audio("/assets/ding.mp3");
          audio.play();
          this.classList.add("fade");
          this.addEventListener(
            "animationend",
            function () {
              this.parentElement.parentElement.remove();
              calendar.getEventById(task.id).remove();
              pastEvents.push(events.filter((e) => e.id === task.id)[0]);
              events = events.filter((e) => e.id !== task.id);
              saveTodo();
            },
            { once: true }
          );
        },
        { once: true }
      );
    }
    const label = document.createElement("span");
    label.innerText = task.title;
    label.classList.add("taskTitle");
    label.contentEditable = true;
    label.spellcheck = false;
    label.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        this.blur();
      }
    });
    label.addEventListener("blur", function () {
      if (
        this.innerText.replaceAll("\n", "") &&
        this.innerText.replaceAll("\n", "") !== task.title
      ) {
        task.title = this.innerText.replaceAll("\n", "");
        saveTodo();
      } else {
        this.innerText = task.title;
      }
    });
    const moreInfo = document.createElement("span");
    moreInfo.innerText = "❓";
    moreInfo.classList.add("taskMoreInfo");
    taskTippys.push(
      tippy([moreInfo], {
        animation: "shift-toward-subtle",
        allowHTML: true,
        arrow: false,
        content: `
            <div class = "taskExtendedDesc">
              <h3 style = "margin: 5px;">📅 ${DOMPurify.sanitize(
                task.title
              )}</h3>
              <hr><b>Description:</b>
              "<i>${
                DOMPurify.sanitize(task.extendedProps.description) ||
                "No description was provided for this task."
              }</i>"
              <hr>
              <b>Due:</b> ${formatHDate(task.start)}
              <hr>
              <b>Category:</b> ${DOMPurify.sanitize(
                task.extendedProps.category
              )}
            </div>
          `,
        placement: "right",
      })[0]
    );

    eventTop.appendChild(checkbox);
    eventTop.appendChild(label);
    eventTop.appendChild(moreInfo);

    const eventBottom = document.createElement("div");
    let dueDate;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = `${yyyy}-${mm}-${dd}`;

    if (task.start === today) {
      dueDate = `<b>${task.start}</b>`;
    } else if (task.start < today) {
      dueDate = `<b><i>${task.start}</i></b>`;
    } else {
      dueDate = task.start;
    }
    const taskCategory = document.createElement("span");
    taskCategory.classList.add("taskCategory");
    taskCategory.innerText = task.extendedProps.category;
    const taskDueDate = document.createElement("span");
    taskDueDate.classList.add("taskDueDate");
    taskDueDate.innerHTML = dueDate;
    eventBottom.appendChild(taskCategory);
    eventBottom.appendChild(taskDueDate);
    eventBottom.classList.add("eventBottom");
    if (lookingAtPast) {
      eventBottom.addEventListener(
        "click",
        () => renderTaskList(true, taskList, task.extendedProps.category),
        { once: true }
      );
    } else {
      eventBottom.addEventListener(
        "click",
        () => renderTaskList(false, taskList, task.extendedProps.category),
        { once: true }
      );
    }
    event.appendChild(eventTop);
    event.appendChild(eventBottom);

    taskList.prepend(event);
  });

  if (!taskList.innerHTML) {
    taskList.classList.add("grid");
    taskList.innerHTML =
      "<i style = 'margin-bottom: auto; opacity: .5;'>Tasks will appear here.</i>";
  } else {
    taskList.classList.remove("grid");
  }

  if (constraint) {
    const div = document.createElement("s");
    div.classList.add("filter");
    div.innerText = `Category: ${constraint}`;
    taskList.prepend(div);
    if (lookingAtPast) {
      div.addEventListener("click", () => renderTaskList(true, taskList), {
        once: true,
      });
    } else {
      div.addEventListener("click", () => renderTaskList(false, taskList), {
        once: true,
      });
    }
  }
}
