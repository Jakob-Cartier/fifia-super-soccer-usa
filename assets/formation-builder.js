(() => {
  const formationSelect = document.querySelector("#formation-select");
  const slotSelects = document.querySelector("#builder-slot-selects");
  const playerLayer = document.querySelector("#builder-player-layer");
  const warning = document.querySelector("#builder-warning");
  const resetButton = document.querySelector("#formation-reset");
  if (!formationSelect || !slotSelects || !playerLayer || !warning || !resetButton) return;

  const players = [
    { id: "kayden", name: "Kayden", role: "CM", number: "05", image: "/assets/players/kayden.png" },
    { id: "brycen", name: "Brycen", role: "RW · Captain", number: "10", image: "/assets/players/brycen.png" },
    { id: "tessa", name: "Tessa", role: "LW", number: "09", image: "/assets/players/tessa.png" },
    { id: "ruffles", name: "Ruffles", role: "Attacking substitute", number: "06", image: "/assets/players/ruffles.png" }
  ];

  const formations = {
    "2-1": {
      label: "2–1 · Wide attack",
      slots: [
        { id: "left", label: "Left forward", x: 25, y: 24, defaultPlayer: "tessa" },
        { id: "right", label: "Right forward", x: 75, y: 24, defaultPlayer: "brycen" },
        { id: "middle", label: "Central midfielder", x: 50, y: 55, defaultPlayer: "kayden" }
      ]
    },
    "1-2": {
      label: "1–2 · Midfield support",
      slots: [
        { id: "top", label: "Central forward", x: 50, y: 22, defaultPlayer: "brycen" },
        { id: "left", label: "Left midfielder", x: 27, y: 52, defaultPlayer: "tessa" },
        { id: "right", label: "Right midfielder", x: 73, y: 52, defaultPlayer: "kayden" }
      ]
    },
    "1-1-1": {
      label: "1–1–1 · Balanced",
      slots: [
        { id: "top", label: "Forward", x: 50, y: 20, defaultPlayer: "brycen" },
        { id: "middle", label: "Central midfielder", x: 50, y: 43, defaultPlayer: "kayden" },
        { id: "bottom", label: "Support midfielder", x: 50, y: 65, defaultPlayer: "tessa" }
      ]
    }
  };

  let selectedFormation = "2-1";
  let assignments = {};

  function createPlayerOption(player, selectedId) {
    const option = document.createElement("option");
    option.value = player.id;
    option.textContent = player.name + (player.id === "ruffles" ? " · Substitute" : "");
    option.selected = player.id === selectedId;
    return option;
  }

  function renderSelects() {
    const template = formations[selectedFormation];
    slotSelects.replaceChildren();
    template.slots.forEach((slot) => {
      const wrapper = document.createElement("label");
      wrapper.className = "builder-slot-field";
      wrapper.textContent = slot.label;

      const select = document.createElement("select");
      select.id = "builder-player-" + slot.id;
      select.dataset.slot = slot.id;
      select.setAttribute("aria-label", slot.label);
      players.forEach((player) => select.append(createPlayerOption(player, assignments[slot.id] || slot.defaultPlayer)));
      select.addEventListener("change", () => {
        assignments[slot.id] = select.value;
        syncDisabledOptions();
        renderPlayers();
      });
      wrapper.append(select);
      slotSelects.append(wrapper);
    });
    syncDisabledOptions();
  }

  function syncDisabledOptions() {
    const selects = Array.from(slotSelects.querySelectorAll("select"));
    selects.forEach((select) => {
      const otherValues = new Set(selects.filter((other) => other !== select).map((other) => other.value));
      Array.from(select.options).forEach((option) => {
        option.disabled = otherValues.has(option.value);
      });
    });
    const values = selects.map((select) => select.value);
    const hasDuplicate = new Set(values).size !== values.length;
    warning.textContent = hasDuplicate
      ? "A player is assigned to more than one position. Choose a different player for each slot."
      : "Formation preview updated. Mark remains the goalkeeper.";
    warning.classList.toggle("is-warning", hasDuplicate);
  }

  function renderPlayers() {
    const template = formations[selectedFormation];
    playerLayer.replaceChildren();
    template.slots.forEach((slot) => {
      const select = slotSelects.querySelector('[data-slot="' + slot.id + '"]');
      const player = players.find((entry) => entry.id === (select ? select.value : slot.defaultPlayer));
      if (!player) return;

      const card = document.createElement("div");
      card.className = "builder-player";
      card.style.left = slot.x + "%";
      card.style.top = slot.y + "%";

      const image = document.createElement("img");
      image.src = player.image;
      image.alt = "";
      const name = document.createElement("strong");
      name.textContent = player.name;
      const role = document.createElement("small");
      role.textContent = player.number + " · " + player.role;
      card.append(image, name, role);
      playerLayer.append(card);
    });
  }

  function loadFormation(resetAssignments = false) {
    const template = formations[selectedFormation];
    if (resetAssignments) assignments = {};
    const nextAssignments = {};
    template.slots.forEach((slot) => {
      const requested = assignments[slot.id] || slot.defaultPlayer;
      nextAssignments[slot.id] = players.some((player) => player.id === requested) ? requested : slot.defaultPlayer;
    });
    assignments = nextAssignments;
    renderSelects();
    renderPlayers();
  }

  formationSelect.addEventListener("change", () => {
    selectedFormation = formationSelect.value;
    loadFormation(false);
  });
  resetButton.addEventListener("click", () => {
    selectedFormation = "2-1";
    formationSelect.value = selectedFormation;
    loadFormation(true);
  });

  formationSelect.value = selectedFormation;
  loadFormation(true);
})();
