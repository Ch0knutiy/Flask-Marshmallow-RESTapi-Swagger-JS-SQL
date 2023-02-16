/**
 * This is the model class which provides access to the server REST API
 * @type {{}} 
 * */
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
        let response = await fetch("/api/cities", options);
        let data = await response.json();
        return data;
    }

    async readCountry() {
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

    async readOne(city_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/cities/${city_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(city) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(city)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/cities`, options);
        let data = await response.json();
        return data;
    }

    async update(city) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(city)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/cities`, options);
        let data = await response.json();
        return data;
    }

    async delete(city_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/cities/${city_id}`, options);
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
        this.table = document.querySelector(".cities table");
        this.select = document.getElementById("country_select");
        this.error = document.querySelector(".error");
        this.city_id = document.getElementById("city_id");
        this.city_name = document.getElementById("city_name");
        this.city_country = document.getElementById("city_country");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
        //this.countries = document.getElementById("country");
    }

    reset() {
        this.city_id.textContent = "";
        this.city_name.value = "";
        this.city_country.value = "";
        this.select.value = null;
    }

    updateEditor(city) {
        this.city_id.textContent = city.city_id;
        this.city_name.value = city.city_name;
        this.city_country.value = +city.city_country;
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


    buildTable(cities, countries) {
        let tbody,
            html = "",
            select_html = "";

        for (let country of countries)
            select_html += `<option value=${country.id}>${country.country}</option>`
        this.select.innerHTML = select_html;

        // Iterate over the cities and build the table
        cities.forEach((city) => {
            let country_name
            for (let country of countries)
                if (country.id == city.city_country)
                    country_name = country.country;
            html += `
            <tr data-city_id="${city.city_id}" data-city_name="${city.city_name}" data-city_country="${city.city_country}">
                <td class="city_name">${city.city_name}</td> 
                <td class="city_country">${country_name}</td>
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
        }, 20000);
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
            let urlcity_id = +document.getElementById("url_city_id").value,
                city = await this.model.read(),
                country = await this.model.readCountry();

            this.view.buildTable(city, country);


            // Did we navigate here with a city selected?
            if (urlcity_id) {
                let city = await this.model.readOne(urlcity_id);
                this.view.updateEditor(city);
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
        document.querySelector(".cities table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                city_id = target.getAttribute("data-city_id"),
                city_name = target.getAttribute("data-city_name"),
                city_country = target.getAttribute("data-city_country");

            this.view.updateEditor({
                city_id: city_id,
                city_name: city_name,
                city_country: city_country
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });


    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let city_name = document.getElementById("city_name").value,
                city_country = +document.getElementById("country_select").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    city_id: 0,
                    city_name: city_name,
                    city_country: city_country
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let city_id = +document.getElementById("city_id").textContent,
                city_name = document.getElementById("city_name").value,
                city_country = +document.getElementById("country_select").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    city_id: city_id,
                    city_name: city_name,
                    city_country: city_country
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let city_id = +document.getElementById("city_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(city_id);
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
