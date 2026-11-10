(() => {
  const grid = document.querySelector("#calendar-grid");
  if (!grid) return;

  const monthLabel = document.querySelector("#calendar-month-label");
  const selectedLabel = document.querySelector("#selected-date-label");
  const selectedEvents = document.querySelector("#selected-day-events");
  const upcomingEvents = document.querySelector("#upcoming-events");
  const previousButton = document.querySelector("#calendar-prev");
  const nextButton = document.querySelector("#calendar-next");
  const todayButton = document.querySelector("#calendar-today");

  const dateKey = (date) => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");

  const parseDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
  };

  const events = (Array.isArray(window.USA_TEAM_EVENTS) ? window.USA_TEAM_EVENTS : [])
    .filter((event) => event && parseDate(event.date) && typeof event.title === "string" && event.title.trim())
    .map((event, index) => ({
      id: String(event.id || "team-event-" + index),
      date: event.date,
      title: event.title.trim(),
      time: typeof event.time === "string" ? event.time.trim() : "",
      type: typeof event.type === "string" && event.type.trim() ? event.type.trim() : "Team event",
      description: typeof event.description === "string" ? event.description.trim() : "",
      location: typeof event.location === "string" ? event.location.trim() : "",
      url: typeof event.url === "string" && /^https:\/\//i.test(event.url) ? event.url : ""
    }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));

  const eventsByDate = new Map();
  events.forEach((event) => {
    if (!eventsByDate.has(event.date)) eventsByDate.set(event.date, []);
    eventsByDate.get(event.date).push(event);
  });

  const today = new Date();
  const todayKey = dateKey(today);
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedKey = todayKey;

  const formatDate = (date, options = { weekday: "long", month: "long", day: "numeric", year: "numeric" }) =>
    date.toLocaleDateString(undefined, options);

  function makeEmpty(message) {
    const empty = document.createElement("div");
    empty.className = "calendar-empty";
    empty.textContent = message;
    return empty;
  }

  function makeEventCard(event) {
    const card = document.createElement("article");
    card.className = "calendar-event-card";

    const type = document.createElement("div");
    type.className = "calendar-event-meta";
    type.textContent = [event.type, event.time].filter(Boolean).join(" · ");

    const title = document.createElement("h3");
    title.textContent = event.title;
    card.append(type, title);

    if (event.description) {
      const description = document.createElement("p");
      description.textContent = event.description;
      card.append(description);
    }

    if (event.location) {
      const location = document.createElement("p");
      location.textContent = "Location: " + event.location;
      location.style.marginTop = "6px";
      card.append(location);
    }

    const actions = document.createElement("div");
    actions.className = "calendar-event-actions";

    if (event.url) {
      const link = document.createElement("a");
      link.href = event.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "EVENT DETAILS ↗";
      actions.append(link);
    }

    if (actions.childElementCount) card.append(actions);
    return card;
  }

  function renderSelectedDay() {
    const date = parseDate(selectedKey);
    selectedLabel.textContent = date ? formatDate(date) : "Selected day";
    selectedEvents.replaceChildren();
    const dayEvents = eventsByDate.get(selectedKey) || [];

    if (!dayEvents.length) {
      selectedEvents.append(makeEmpty("No events are scheduled for this date yet."));
      return;
    }

    dayEvents.forEach((event) => selectedEvents.append(makeEventCard(event)));
  }

  function renderUpcoming() {
    upcomingEvents.replaceChildren();
    const upcoming = events.filter((event) => event.date >= todayKey).slice(0, 6);

    if (!upcoming.length) {
      upcomingEvents.append(makeEmpty("No upcoming events have been announced. Check back when the team confirms a match or practice."));
      return;
    }

    upcoming.forEach((event) => {
      const wrapper = document.createElement("div");
      wrapper.append(makeEventCard(event));

      const dateLine = document.createElement("p");
      dateLine.className = "calendar-upcoming-date";
      dateLine.textContent = formatDate(parseDate(event.date), { weekday: "short", month: "short", day: "numeric", year: "numeric" });
      wrapper.prepend(dateLine);

      upcomingEvents.append(wrapper);
    });
  }

  function renderCalendar() {
    monthLabel.textContent = visibleMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    grid.replaceChildren();

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (let index = 0; index < cellCount; index += 1) {
      const date = new Date(year, month, index - firstDay + 1);
      const key = dateKey(date);
      const dayEvents = eventsByDate.get(key) || [];
      const dayButton = document.createElement("button");
      dayButton.type = "button";
      dayButton.className = "calendar-day";
      if (date.getMonth() !== month) dayButton.classList.add("is-outside");
      if (key === todayKey) dayButton.classList.add("is-today");
      if (key === selectedKey) dayButton.classList.add("is-selected");
      if (dayEvents.length) dayButton.classList.add("has-events");
      dayButton.setAttribute("aria-pressed", String(key === selectedKey));
      dayButton.setAttribute("aria-label", formatDate(date) + (dayEvents.length ? ", " + dayEvents.length + " event(s)" : ""));

      const number = document.createElement("span");
      number.className = "calendar-day-number";
      number.textContent = String(date.getDate());
      dayButton.append(number);

      if (dayEvents.length) {
        const eventLabels = document.createElement("span");
        eventLabels.className = "calendar-day-events";
        dayEvents.slice(0, 2).forEach((event) => {
          const pill = document.createElement("span");
          pill.className = "calendar-day-event";
          pill.textContent = event.title;
          eventLabels.append(pill);
        });
        if (dayEvents.length > 2) {
          const more = document.createElement("span");
          more.className = "calendar-more";
          more.textContent = "+" + (dayEvents.length - 2) + " more";
          eventLabels.append(more);
        }
        dayButton.append(eventLabels);
      }

      dayButton.addEventListener("click", () => {
        selectedKey = key;
        if (date.getMonth() !== visibleMonth.getMonth()) {
          visibleMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        }
        render();
      });

      grid.append(dayButton);
    }
  }

  function render() {
    renderCalendar();
    renderSelectedDay();
    renderUpcoming();
  }

  previousButton.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    selectedKey = dateKey(visibleMonth);
    render();
  });

  nextButton.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    selectedKey = dateKey(visibleMonth);
    render();
  });

  todayButton.addEventListener("click", () => {
    visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedKey = todayKey;
    render();
  });

  render();
})();
