/**
 * This is the model class which provnumes access to the server REST API
 * @type {{}}
 */
class Model {
    async read() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/flights", options);
        let data = await response.json();
        return data;
    }

    async readOne(flights_num) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/flights/${flights_num}`, options);
        let data = await response.json();
        return data;
    }

    async create(flights) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(flights)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/flights`, options);
        let data = await response.json();
        return data;
    }

    async update(flights) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(flights)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/flights`, options);
        let data = await response.json();
        return data;
    }

    async delete(flights_num) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/flights/${flights_num}`, options);
        return response;
    }
}


/**
 * This is the view class which provnumes access to the DOM
 */
class View {
    constructor() {
        this.NEW_NOTE = 0;
        this.EXISTING_NOTE = 1;
        this.table = document.querySelector(".flights table");

        this.error = document.querySelector(".error");
        this.flights_num = document.getElementById("flights_num");
        this.flights_date = document.getElementById("date");
        this.flights_time = document.getElementById("time");
        this.flights_class = document.getElementById("class");
        this.flights_aircraft = document.getElementById("aircraft");
        this.flights_free = document.getElementById("free");

        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.flights_num.value = "";
        this.flights_date.value = "";
        this.flights_time.value = "";
        this.flights_class.value = "";
        this.flights_aircraft.value = "";
        this.flights_free.value = 0;

    }

    updateEditor(flights) {
        this.flights_num.value = flights.flights_num;
        this.flights_date.value = flights.flights_date;
        this.flights_time.value = flights.flights_time;
        this.flights_class.value = flights.flights_class;
        this.flights_aircraft.value = flights.flights_aircraft;
        this.flights_free.value = flights.flights_free;


    }

    setButtonState(state) {
        if (state === this.NEW_NOTE) {
            this.createButton.disabled = false;
            this.updateButton.disabled = true;
            this.deleteButton.disabled = true;
        } else if (state === this.EXISTING_NOTE) {
            this.createButton.disabled = true;
            this.updateButton.disabled = false;
            this.deleteButton.disabled = false;
        }
    }

    buildTable(flights) {
        let tbody,
            html = "";

        // Iterate over the flights and build the table
        flights.forEach((flights) => {
            html += `
            <tr data-flights_num="${flights.num}" data-flights_date="${flights.date}" data-flights_time="${flights.time}" 
            data-flights_class="${flights.clazz}" data-flights_aircraft="${flights.aircraft}" 
            data-flights_free="${flights.free}">
            <td class="flights_num">${flights.num}</td>
            <td class="date">${flights.date}</td>
            <td class="time">${flights.time}</td>
            <td class="class">${flights.clazz}</td>    
            <td class="aircraft">${flights.aircraft}</td>
            <td class="free">${flights.free}</td>

            </tr>`;
        });
        // Is there currently a tbody in the table?
        if (this.table.tBodies.length !== 0) {
            this.table.removeChild(this.table.getElementsByTagName("tbody")[0]);
        }
        // Update tbody with our new content
        tbody = this.table.createTBody();
        tbody.innerHTML = html;
    }

    errorMessage(message) {
        this.error.innerHTML = message;
        this.error.classList.add("visible");
        this.error.classList.remove("hnumden");
        setTimeout(() => {
            this.error.classList.add("hnumden");
            this.error.classList.remove("visible");
        }, 2000);
    }
}


/**
 * This is the controller class for the user interaction
 */
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.initialize();
    }

    async initialize() {
        await this.initializeTable();
        this.initializeTableEvents();
        this.initializeCreateEvent();
        this.initializeUpdateEvent();
        this.initializeDeleteEvent();
        this.initializeResetEvent();
    }

    async initializeTable() {
        try {
            let urlflights_num = +document.getElementById("url_flights_num").value,
                flights = await this.model.read()

            this.view.buildTable(flights);

            // Dnum we navigate here with a flights selected?
            if (urlflights_num) {
                let flights = await this.model.readOne(urlflights_num);
                this.view.updateEditor(flights);
                this.view.setButtonState(this.view.EXISTING_NOTE);

                // Otherwise, nope, so leave the editor blank
            } else {
                this.view.reset();
                this.view.setButtonState(this.view.NEW_NOTE);
            }
            this.initializeTableEvents();
        } catch (err) {
            this.view.errorMessage(err);
        }
    }

    initializeTableEvents() {
        document.querySelector(".flights table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                flights_num = target.getAttribute("data-flights_num"),

                flights_date = target.getAttribute("data-flights_date"),
                flights_time = target.getAttribute("data-flights_time"),
                flights_class = target.getAttribute("data-flights_class"),
                flights_aircraft = target.getAttribute("data-flights_aircraft"),
                flights_free = +target.getAttribute("data-flights_free");

            this.view.updateEditor({
                flights_num: flights_num,
                flights_date: flights_date,
                flights_time: flights_time,
                flights_class: flights_class,
                flights_aircraft: flights_aircraft,
                flights_free: flights_free

            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });

    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let flights_num = document.getElementById("flights_num").value,
                flights_date = document.getElementById("date").value,
                flights_time = document.getElementById("time").value,
                flights_class = document.getElementById("class").value,
                flights_aircraft = document.getElementById("aircraft").value,
                flights_free = +document.getElementById("free").value


            evt.preventDefault();
            try {
                await this.model.create({
                    num: flights_num,
                    date: flights_date,
                    time: flights_time,
                    clazz: flights_class,
                    aircraft: flights_aircraft,
                    free: flights_free

                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let flights_num = document.getElementById("flights_num").value,
                flights_date = document.getElementById("date").value,
                flights_time = document.getElementById("time").value,
                flights_class = document.getElementById("class").value,
                flights_aircraft = document.getElementById("aircraft").value,
                flights_free = parseInt(document.getElementById("free").value);

            evt.preventDefault();
            try {
                await this.model.update({
                    num: flights_num,
                    date: flights_date,
                    time: flights_time,
                    clazz: flights_class,
                    aircraft: flights_aircraft,
                    free: flights_free

                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let flights_num = document.getElementById("flights_num").value;

            evt.preventDefault();
            try {
                await this.model.delete(flights_num);
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeResetEvent() {
        document.getElementById("reset").addEventListener("click", async (evt) => {
            evt.preventDefault();
            this.view.reset();
            this.view.setButtonState(this.view.NEW_NOTE);
        });
    }
}

// Create the MVC components
const model = new Model();
const view = new View();
const controller = new Controller(model, view);

// export the MVC components as the default
export default {
    model,
    view,
    controller
};
