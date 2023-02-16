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
        let response = await fetch("/api/hotel", options);
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
        let response = await fetch(`/api/hotel/${id}`, options);
        let data = await response.json();
        return data;
    }

    async create(hotel) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(hotel)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/hotel`, options);
        let data = await response.json();
        return data;
    }

    async update(hotel) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(hotel)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/hotel`, options);
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
        let response = await fetch(`/api/hotel/${id}`, options);
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
        this.table = document.querySelector(".hotel table");
        this.error = document.querySelector(".error");
        this.hotel_id = document.getElementById("hotel_id");
        this.hotel_name = document.getElementById("name");
        this.hotel_class = document.getElementById("class");
        this.hotel_categories = document.getElementById("categories");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.hotel_id.textContent = "";
        this.hotel_name.value = "";
        this.hotel_class.value = 0;
        this.hotel_categories.value = "";
    }

    updateEditor(hotel) {
        this.hotel_id.textContent = hotel.hotel_id;
        this.hotel_name.value = hotel.hotel_name;
        this.hotel_class.value = hotel.hotel_class;
        this.hotel_categories.value = hotel.hotel_categories;
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

    buildTable(hotel) {
        let tbody,
            html = "";

        // Iterate over the hotel and build the table
        hotel.forEach((hotel) => {
            html += `
            <tr data-hotel_id="${hotel.id}" data-hotel_name="${hotel.name}" data-hotel_class="${hotel.clazz}" data-hotel_categories="${hotel.categories}">
                <td class="hotel_name">${hotel.name}</td>
                <td class="class">${hotel.clazz}</td>
                <td class="categories">${hotel.categories}</td>
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
            let urlhotel_id = +document.getElementById("url_hotel_id").value,
                hotel = await this.model.read();

            this.view.buildTable(hotel);

            // Did we navigate here with a hotel selected?
            if (urlhotel_id) {
                let hotel = await this.model.readOne(urlhotel_id);
                this.view.updateEditor(hotel);
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
        document.querySelector(".hotel table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                hotel_id = target.getAttribute("data-hotel_id"),
                name = target.getAttribute("data-hotel_name"),
                clazz = +target.getAttribute("data-hotel_class"),
                categories = target.getAttribute("data-hotel_categories")

            this.view.updateEditor({
                hotel_id: hotel_id,
                hotel_name: name,
                hotel_class: clazz,
                hotel_categories: categories

            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let name = document.getElementById("name").value,
                clazz = +document.getElementById("class").value,
                categories = document.getElementById("categories").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    id: 0,
                    name: name,
                    clazz: clazz,
                    categories: categories
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let hotel_id = +document.getElementById("hotel_id").textContent,
                name = document.getElementById("name").value,
                clazz = +document.getElementById("class").value,
                categories = document.getElementById("categories").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    id: hotel_id,
                    name: name,
                    clazz: clazz,
                    categories: categories
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let hotel_id = +document.getElementById("hotel_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(hotel_id);
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
