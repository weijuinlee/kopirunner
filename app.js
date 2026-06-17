const drinkGroups = [
  {
    title: "Coffee with Condensed Milk",
    family: "Standard",
    drinks: [
      ["Kopi", "Hot coffee + condensed milk."],
      ["Kopi Siew Dai", "Hot coffee + condensed milk + less sugar."],
      ["Kopi Ga Dai", "Hot coffee + condensed milk + extra sugar."],
      ["Kopi Gao", "Strong hot coffee + condensed milk."],
      ["Kopi Gao Siew Dai", "Strong hot coffee + condensed milk + less sugar."],
      ["Kopi Po", "Diluted hot coffee + condensed milk."],
      ["Kopi Di Loh", "Pure coffee concentrate + condensed milk."],
      ["Kopi Peng", "Iced coffee + condensed milk."],
      ["Kopi Peng Siew Dai", "Iced coffee + condensed milk + less sugar."],
      ["Teh", "Hot tea + condensed milk."],
      ["Teh Siew Dai", "Hot tea + condensed milk + less sugar."],
      ["Teh Ga Dai", "Hot tea + condensed milk + extra sugar."],
      ["Teh Gao", "Strong hot tea + condensed milk."],
      ["Teh Gao Siew Dai", "Strong hot tea + condensed milk + less sugar."],
      ["Teh Po", "Diluted hot tea + condensed milk."],
      ["Teh Peng", "Iced tea + condensed milk."],
      ["Teh Peng Siew Dai", "Iced tea + condensed milk + less sugar."],
    ],
  },
  {
    title: 'Coffee and Tea with Evaporated Milk ("C")',
    family: "C",
    drinks: [
      ["Kopi C", "Hot coffee + evaporated milk + sugar."],
      ["Kopi C Siew Dai", "Hot coffee + evaporated milk + less sugar."],
      ["Kopi C Ga Dai", "Hot coffee + evaporated milk + extra sugar."],
      ["Kopi C Kosong", "Hot coffee + evaporated milk + no sugar."],
      ["Kopi C Gao", "Strong hot coffee + evaporated milk + sugar."],
      ["Kopi C Gao Kosong", "Strong hot coffee + evaporated milk + no sugar."],
      ["Kopi C Po", "Diluted hot coffee + evaporated milk + sugar."],
      ["Kopi C Di Loh", "Pure coffee concentrate + evaporated milk + sugar."],
      ["Kopi C Peng", "Iced coffee + evaporated milk + sugar."],
      ["Kopi C Peng Kosong", "Iced coffee + evaporated milk + no sugar."],
      ["Teh C", "Hot tea + evaporated milk + sugar."],
      ["Teh C Siew Dai", "Hot tea + evaporated milk + less sugar."],
      ["Teh C Ga Dai", "Hot tea + evaporated milk + extra sugar."],
      ["Teh C Kosong", "Hot tea + evaporated milk + no sugar."],
      ["Teh C Gao", "Strong hot tea + evaporated milk + sugar."],
      ["Teh C Gao Kosong", "Strong hot tea + evaporated milk + no sugar."],
      ["Teh C Po", "Diluted hot tea + evaporated milk + sugar."],
      ["Teh C Peng", "Iced tea + evaporated milk + sugar."],
      ["Teh C Peng Kosong", "Iced tea + evaporated milk + no sugar."],
    ],
  },
  {
    title: 'Coffee and Tea without Milk ("O")',
    family: "O",
    drinks: [
      ["Kopi O", "Hot black coffee + sugar."],
      ["Kopi O Siew Dai", "Hot black coffee + less sugar."],
      ["Kopi O Ga Dai", "Hot black coffee + extra sugar."],
      ["Kopi O Kosong", "Hot black coffee + no sugar."],
      ["Kopi O Gao", "Strong hot black coffee + sugar."],
      ["Kopi O Gao Kosong", "Strong hot black coffee + no sugar."],
      ["Kopi O Po", "Diluted hot black coffee + sugar."],
      ["Kopi O Di Loh", "Pure black coffee concentrate + sugar."],
      ["Kopi O Peng", "Iced black coffee + sugar."],
      ["Kopi O Kosong Peng", "Iced black coffee + no sugar."],
      ["Teh O", "Hot tea + sugar."],
      ["Teh O Siew Dai", "Hot tea + less sugar."],
      ["Teh O Ga Dai", "Hot tea + extra sugar."],
      ["Teh O Kosong", "Hot tea + no sugar."],
      ["Teh O Gao", "Strong hot tea + sugar."],
      ["Teh O Gao Kosong", "Strong hot tea + no sugar."],
      ["Teh O Po", "Diluted hot tea + sugar."],
      ["Teh O Peng", "Iced tea + sugar."],
      ["Teh O Kosong Peng", "Iced tea + no sugar."],
    ],
  },
];

const drinkCatalog = drinkGroups.flatMap((group) =>
  group.drinks.map(([name, description]) => ({
    name,
    description,
    family: group.family,
  })),
);

const storageKey = "kopi-runner-orders";
const rosterStorageKey = "kopi-runner-roster";
let orders = loadOrders();
let roster = loadRoster();

const orderForm = document.querySelector("#order-form");
const customerNameInput = document.querySelector("#customer-name");
const drinkSelect = document.querySelector("#drink-select");
const specialDrinkInput = document.querySelector("#special-drink");
const quantityInput = document.querySelector("#quantity");
const notesInput = document.querySelector("#notes");
const newRosterNameInput = document.querySelector("#new-roster-name");
const rosterInput = document.querySelector("#roster-input");
const rosterCount = document.querySelector("#roster-count");
const rosterChips = document.querySelector("#roster-chips");
const savedNames = document.querySelector("#saved-names");
const ordersList = document.querySelector("#orders-list");
const summaryList = document.querySelector("#summary-list");
const summaryOutput = document.querySelector("#summary-output");
const addRosterNameButton = document.querySelector("#add-roster-name");
const saveRosterButton = document.querySelector("#save-roster");
const clearDataButton = document.querySelector("#clear-data");
const clearOrdersButton = document.querySelector("#clear-orders");
const copySummaryButton = document.querySelector("#copy-summary");
const orderItemTemplate = document.querySelector("#order-item-template");
const summaryItemTemplate = document.querySelector("#summary-item-template");
const referenceGroups = document.querySelector("#reference-groups");

populateDrinkSelect();
renderRoster();
renderReference();
render();

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const customerName = customerNameInput.value.trim();
  const drinkName = drinkSelect.value;
  const specialDrinkName = specialDrinkInput.value.trim();
  const quantity = Number.parseInt(quantityInput.value, 10);
  const notes = notesInput.value.trim();
  const drink = specialDrinkName
    ? { name: specialDrinkName, description: "Special drink request." }
    : drinkCatalog.find((item) => item.name === drinkName);

  if (!customerName || !drink || Number.isNaN(quantity) || quantity < 1) {
    return;
  }

  orders.push({
    id: createOrderId(),
    customerName,
    drinkName: drink.name,
    description: drink.description,
    quantity,
    notes,
  });

  persistOrders();
  render();
  orderForm.reset();
  quantityInput.value = "1";
  customerNameInput.focus();
});

saveRosterButton.addEventListener("click", () => {
  saveRosterFromTextarea();
});

addRosterNameButton.addEventListener("click", () => {
  addRosterName(newRosterNameInput.value);
});

newRosterNameInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  addRosterName(newRosterNameInput.value);
});

clearDataButton.addEventListener("click", () => {
  if (!orders.length && !roster.length) {
    return;
  }

  orders = [];
  roster = [];
  orderForm.reset();
  quantityInput.value = "1";
  newRosterNameInput.value = "";
  window.localStorage.removeItem(storageKey);
  window.localStorage.removeItem(rosterStorageKey);
  renderRoster();
  render();
});

clearOrdersButton.addEventListener("click", () => {
  if (!orders.length) {
    return;
  }

  orders = [];
  persistOrders();
  render();
});

copySummaryButton.addEventListener("click", async () => {
  if (!summaryOutput.value.trim()) {
    return;
  }

  try {
    await navigator.clipboard.writeText(summaryOutput.value);
    copySummaryButton.textContent = "Copied";
    window.setTimeout(() => {
      copySummaryButton.textContent = "Copy";
    }, 1400);
  } catch {
    summaryOutput.focus();
    summaryOutput.select();
  }
});

function populateDrinkSelect() {
  drinkSelect.innerHTML = "";

  // Add a placeholder as the first option
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a drink…";
  placeholder.disabled = true;
  placeholder.selected = true;
  drinkSelect.append(placeholder);

  // Only show the short name for all drinks (no description or bullets)
  drinkCatalog.forEach(({ name }) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    drinkSelect.append(option);
  });
}

function saveRosterFromTextarea() {
  roster = normalizeRoster(parseRoster(rosterInput.value));
  persistRoster();
  renderRoster();
}

function addRosterName(rawName) {
  const cleanedName = cleanRosterLine(rawName);

  if (!cleanedName || !isLikelyPersonName(cleanedName)) {
    newRosterNameInput.focus();
    return;
  }

  roster = normalizeRoster([...roster, cleanedName]);
  persistRoster();
  renderRoster();
  newRosterNameInput.value = "";
  customerNameInput.value = cleanedName;
  customerNameInput.focus();
}

function renderRoster() {
  rosterInput.value = roster.join("\n");
  rosterCount.textContent = roster.length
    ? `${roster.length} saved ${roster.length === 1 ? "name" : "names"} ready to tap or search.`
    : "No saved names yet.";

  savedNames.innerHTML = "";
  rosterChips.innerHTML = "";

  if (!roster.length) {
    rosterChips.classList.add("empty-state");
    rosterChips.innerHTML = "<p>No saved names yet.</p>";
    return;
  }

  rosterChips.classList.remove("empty-state");

  roster.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    savedNames.append(option);

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = name;
    chip.addEventListener("click", () => {
      customerNameInput.value = name;
      customerNameInput.focus();
    });

    rosterChips.append(chip);
  });
}

function renderReference() {
  referenceGroups.innerHTML = "";
  drinkGroups.forEach((group) => {
    const wrapper = document.createElement("section");
    wrapper.className = "reference-group";

    const heading = document.createElement("h3");
    heading.textContent = group.title;

    const list = document.createElement("ul");
    group.drinks.forEach(([name, description]) => {
      const item = document.createElement("li");
      item.textContent = `${name}: ${description}`;
      list.append(item);
    });
    wrapper.append(heading, list);
    referenceGroups.append(wrapper);
  });
}

function render() {
  renderOrders();
  renderSummary();
}

function renderOrders() {
  ordersList.innerHTML = "";

  if (!orders.length) {
    ordersList.classList.add("empty-state");
    const item = document.createElement("li");
    item.textContent = "No orders yet.";
    ordersList.append(item);
    return;
  }

  ordersList.classList.remove("empty-state");

  orders.forEach((order) => {
    const fragment = orderItemTemplate.content.cloneNode(true);
    const item = fragment.querySelector(".order-item");
    const nameNode = fragment.querySelector(".order-name");
    const drinkNode = fragment.querySelector(".order-drink");
    const removeButton = fragment.querySelector(".remove-button");

    nameNode.textContent = `${order.customerName} x${order.quantity}`;
    drinkNode.textContent = formatOrderLine(order);
    removeButton.addEventListener("click", () => removeOrder(order.id));

    item.dataset.orderId = order.id;
    ordersList.append(fragment);
  });
}

function renderSummary() {
  summaryList.innerHTML = "";

  if (!orders.length) {
    summaryList.classList.add("empty-state");
    summaryList.innerHTML = "<p>No drinks collated yet.</p>";
    summaryOutput.value = "";
    return;
  }

  summaryList.classList.remove("empty-state");

  const grouped = collateOrders();

  grouped.forEach((entry) => {
    const fragment = summaryItemTemplate.content.cloneNode(true);
    fragment.querySelector(".summary-title").textContent = entry.drinkName;
    fragment.querySelector(".summary-meta").textContent = entry.peopleLine;
    fragment.querySelector(".summary-qty").textContent = `${entry.totalQty}`;
    summaryList.append(fragment);
  });

  summaryOutput.value = buildSummaryText(grouped);
}

function collateOrders() {
  const grouped = new Map();

  orders.forEach((order) => {
    const key = order.notes ? `${order.drinkName}__${order.notes}` : order.drinkName;
    const existing = grouped.get(key);

    if (existing) {
      existing.totalQty += order.quantity;
      existing.contributors.set(
        order.customerName,
        (existing.contributors.get(order.customerName) || 0) + order.quantity,
      );
      return;
    }

    grouped.set(key, {
      drinkName: order.drinkName,
      notes: order.notes,
      totalQty: order.quantity,
      contributors: new Map([[order.customerName, order.quantity]]),
    });
  });

  return [...grouped.values()]
    .sort((left, right) => right.totalQty - left.totalQty || left.drinkName.localeCompare(right.drinkName))
    .map((entry) => {
      const contributorLine = [...entry.contributors.entries()]
        .map(([name, quantity]) => (quantity > 1 ? `${name} x${quantity}` : name))
        .join(", ");

      return {
        ...entry,
        contributorLine,
        peopleLine: `${contributorLine}${entry.notes ? `  ${String.fromCharCode(183)}  ${entry.notes}` : ""}`,
      };
    });
}

function buildSummaryText(grouped) {
  const totalCups = orders.reduce((sum, order) => sum + order.quantity, 0);
  const lines = [
    `Kopi run summary`,
    `Total orders: ${orders.length}`,
    `Total cups: ${totalCups}`,
    "",
    ...grouped.map((entry) =>
      `${entry.totalQty} x ${entry.drinkName}${entry.notes ? ` (${entry.notes})` : ""} - ${entry.contributorLine}`,
    ),
  ];

  return lines.join("\n");
}

function formatOrderLine(order) {
  return `${order.drinkName}${order.notes ? `  ${String.fromCharCode(183)}  ${order.notes}` : ""}`;
}

function parseRoster(rawValue) {
  const hasLineBreaks = /\r|\n/.test(rawValue);
  const segments = hasLineBreaks ? rawValue.split(/\r?\n+/) : rawValue.split(/,+/);

  return normalizeRoster(
    segments
      .map(cleanRosterLine)
      .filter((name) => name && isLikelyPersonName(name)),
  );
}

function cleanRosterLine(line) {
  return line
    .normalize("NFKC")
    .replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000]/gu, " ")
    .replace(/^\s*(?:[-*•‣▪·]|\d+\s*[\.\)])?\s*/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isLikelyPersonName(value) {
  if (!value) {
    return false;
  }

  if (/\d/.test(value) || /[:;@/]/.test(value)) {
    return false;
  }

  const words = value.split(" ").filter(Boolean);

  if (!words.length || words.length > 4) {
    return false;
  }

  if (!words.every((word) => /^[A-Za-z][A-Za-z'".-]*$/u.test(word))) {
    return false;
  }

  return true;
}

function normalizeRoster(names) {
  const seen = new Set();

  return names.filter((name) => {
    const key = name.trim().toLocaleLowerCase();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function createOrderId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `order-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function removeOrder(orderId) {
  orders = orders.filter((order) => order.id !== orderId);
  persistOrders();
  render();
}

function loadOrders() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadRoster() {
  try {
    const raw = window.localStorage.getItem(rosterStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((name) => typeof name === "string" && name.trim()) : [];
  } catch {
    return [];
  }
}

function persistOrders() {
  window.localStorage.setItem(storageKey, JSON.stringify(orders));
}

function persistRoster() {
  window.localStorage.setItem(rosterStorageKey, JSON.stringify(roster));
}
