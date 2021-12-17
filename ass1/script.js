var loadedEvents;
window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelector("#search_form").onsubmit = filterResults;
  loadEvents();

  document.querySelector('#radio_selector').onchange = (event) => {
    event.preventDefault();
    let date_select = document.querySelector('#date_select'),
    date_range = document.querySelector('#date_range');
    if(date_range.classList.contains("hide")) {
      date_select.classList.add("hide")
      date_range.classList.remove("hide")
    } else {
      date_range.classList.add("hide")
      date_select.classList.remove("hide")
    }
  }

});

const filterResults = (e) => {
  e.preventDefault();
  let selectFilter = document.querySelector("#date_select").value,
      minDateFilter = document.querySelector("#date_min").value,
      maxDateFilter = document.querySelector("#date_max").value,
      result = [], now = new Date();

  document.querySelectorAll(".division_list").forEach(async (div) => {
    if (minDateFilter && maxDateFilter) {
      result = loadedEvents[div.dataset.div]?.events.filter(
        (event) => (new Date(event.date)).toLocaleDateString() <= (new Date(maxDateFilter)).toLocaleDateString() && (new Date(event.date)).toLocaleDateString() >= (new Date(minDateFilter)).toLocaleDateString()
      );
    } else {
      if(selectFilter === "Yesterday"){
        now.setDate(now.getDate() - 1);
        result = loadedEvents[div.dataset.div]?.events.filter(
          (event) => (new Date(event.date)).toLocaleDateString() === now.toLocaleDateString()
        );
      } else if(selectFilter === "Last Week"){
        minDateFilter = maxDateFilter = now;
        minDateFilter.setDate(now.getDate() - 14);
        maxDateFilter.setDate(now.getDate() - 7);
        result = loadedEvents[div.dataset.div]?.events.filter(
          (event) => (new Date(event.date)).toLocaleDateString() >= minDateFilter.toLocaleDateString() && (new Date(event.date)).toLocaleDateString() <= maxDateFilter.toLocaleDateString()
        );
      } else if(selectFilter === "Last Month"){
        minDateFilter = maxDateFilter = now;
        minDateFilter.setDate(now.getMonth() - 2);
        maxDateFilter.setDate(now.getMonth() - 1);
        result = loadedEvents[div.dataset.div]?.events.filter(
          (event) => (new Date(event.date)).toLocaleDateString() >= minDateFilter.toLocaleDateString() && (new Date(event.date)).toLocaleDateString() <= maxDateFilter.toLocaleDateString()
        );
      } else return;
    }

    return renderEvents(div, result);
  });

  document.querySelector("#date_min").value = ""
  document.querySelector("#date_max").value = ""
};

const loadEvents = () => {
  fetch("https://www.gov.uk/bank-holidays.json")
  .then(res => res.json())
  .then(result => {
    loadedEvents = result;
    document
      .querySelectorAll(".division_list")
      .forEach(
        async (div) => renderEvents(div, result[div.dataset.div].events)
      );
  });
};

const renderEvents = (div, events) => {
  let listFragment = new DocumentFragment();

  if(events.length < 1) {
    div.innerHTML = "No Events Found!";
    return;
  }

  events.forEach((event) => {
    let card = document.createElement("li"),
      title = document.createElement("h4"),
      date = document.createElement("span"),
      notes = document.createElement("span"),
      bunting = document.createElement("span");

    title.textContent = event.title;
    date.textContent = event.date;
    notes.textContent = `Notes: ${event.notes ? event.notes : "NA"}`;
    bunting.textContent = `Bunting: ${event.bunting ? "Yes" : "No"}`;

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(notes);
    card.appendChild(bunting);

    card.className = "card";
    title.className = "card_title";
    date.className = "card_text";
    notes.className = "card_text";
    bunting.className = "card_text";

    listFragment.appendChild(card);
  });
  div.innerHTML="";

  div.appendChild(listFragment);
  
};
