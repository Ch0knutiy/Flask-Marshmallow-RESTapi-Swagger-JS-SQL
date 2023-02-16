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
        let response = await fetch("/api/country", options);
        let data = await response.json();
        return data;
    }

    async readOne(country_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/country/${country_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(country) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(country)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/country`, options);
        let data = await response.json();
        return data;
    }

    async update(country) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(country)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/country`, options);
        let data = await response.json();
        return data;
    }

    async delete(country_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/country/${country_id}`, options);
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
        this.table = document.querySelector(".countries table");
        this.error = document.querySelector(".error");
        this.country_id = document.getElementById("country_id");
        this.country = document.getElementById("country");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.country_id.textContent = "";
        this.country.value = "";
        this.country.focus();
    }

    updateEditor(country) {
        this.country_id.textContent = country.country_id;
        this.country.value = country.country;
        this.country.focus();
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

    buildTable(country) {
        let tbody,
            html = "";

        // Iterate over the country and build the table
        country.forEach((country) => {
            html += `
            <tr data-country_id="${country.id}" data-country="${country.country}">
                <td class="country">${country.country}</td>
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
            let urlcountry_id = +document.getElementById("url_country_id").value,
                country = await this.model.read();

            this.view.buildTable(country);

            // Did we navigate here with a country selected?
            if (urlcountry_id) {
                let country = await this.model.readOne(urlcountry_id);
                this.view.updateEditor(country);
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
                country_id = target.getAttribute("data-country_id"),
                country = target.getAttribute("data-country")

            this.view.updateEditor({
                country_id: country_id,
                country: country

            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let country = document.getElementById("country").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    id: 0,
                    country: country
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let country_id = +document.getElementById("country_id").textContent,
                country = document.getElementById("country").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    id: country_id,
                    country: country
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let country_id = +document.getElementById("country_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(country_id);
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
