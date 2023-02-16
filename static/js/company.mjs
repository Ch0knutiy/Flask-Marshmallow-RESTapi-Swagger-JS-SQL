/**
 * This is the model class which provides access to the server REST API
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
        let response = await fetch("/api/company", options);
        let data = await response.json();
        return data;
    }

    async readFlights() {
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


    async readOne(id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/company/${id}`, options);
        let data = await response.json();
        return data;
    }

    async create(company) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(company)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/company`, options);
        let data = await response.json();
        return data;
    }

    async update(company) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(company)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/company`, options);
        let data = await response.json();
        return data;
    }

    async delete(id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/company/${id}`, options);
        return response;
    }
}


/**
 * This is the view class which provides access to the DOM
 */
class View {
    constructor() {
        this.NEW_NOTE = 0;
        this.EXISTING_NOTE = 1;
        this.table = document.querySelector(".company table");
        this.tableFlights = document.querySelector(".flights table");
        this.error = document.querySelector(".error");
        this.company_id = document.getElementById("id");
        this.name = document.getElementById("name");
        this.flights_num = document.getElementById("flights_num");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
        this.flights = document.getElementById("flights");
    }

    reset() {
        this.company_id.textContent = "";
        this.name.value = "";
        this.flights_num.value = "";
        this.name.focus();
    }

    updateEditor(company) {
        this.company_id.textContent = company.company_id;
        this.name.value = company.name;
        this.flights_num.value = company.flights_num;
        this.company.focus();
    }

    updateEditorFlights(flights_id) {
        this.flights_id.textContent = flights_id;
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

    
    buildTableFlights(flights) {
        let tbody,
            html = "";

        // Iterate over the route and build the tableroute
        flights.forEach((flights) => {
            html += `
            <tr class="toSetRoute" data-route_id="${flights.id}">
            <td>${flights.num}</td>
            </tr>`;
        });
        // Is there currently a tbody in the tableroute?
        if (this.tableFlights.tBodies.length !== 0) {
            this.tableFlights.removeChild(this.tableFlights.getElementsByTagName("tbody")[0]);
        }
        // Update tbody with our new content
        tbody = this.tableFlights.createTBody();
        tbody.innerHTML = html;
    }


    buildTable(company) {
        let tbody,
            html = "";

        // Iterate over the company and build the table
        company.forEach((company) => {
            html += `
            <tr data-company_id="${company.company_id}" data-name="${company.name}" data-flights_num="${company.flights_num}">
                <td class="company_name">${company.name}</td>
                <td class="flights_num">${company.flights_num}</td>
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
        this.error.classList.remove("hidden");
        setTimeout(() => {
            this.error.classList.add("hidden");
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
            let urlcompany_id = +document.getElementById("url_company_id").value,
            company = await this.model.read();
            flights = await this.model.readFlights();

            this.view.buildTable(company);
            this.view.buildTableFlights(rouflightste);

            // Did we navigate here with a company selected?
            if (urlcompany_id) {
                let company = await this.model.readOne(urlcompany_id);
                this.view.updateEditor(company);
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
        document.querySelector("table tbody").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                company_id = target.getAttribute("data-company_id"),
                name = target.getAttribute("data-name")
                flights_num = target.getAttribute("data-flights_num")

            this.view.updateEditor({
                company_id: company_id,
                name: name,
                flights_num: flights_num
            
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
        document.querySelector(".flights table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
            flights_num = target.getAttribute("data-flights_num");

            this.view.updateEditorContract(flights_num);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let company = document.getElementById("company").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    company_id: 0,
                    name: name,
                    flights_num: flights_num
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let company_id = +document.getElementById("company_id").textContent,
            flights_num = document.getElementById("flights_num").value,
            name = document.getElementById("name").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    company_id: company_id,
                    name: name,
                    flights_num: flights_num
                });
                await this.initializeTable();
            } catch(err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let company_id = +document.getElementById("company_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(company_id);
                await this.initializeTable();
            } catch(err) {
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
