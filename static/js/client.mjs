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
        let response = await fetch("/api/client", options);
        let data = await response.json();
        return data;
    }

    async readRoute() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/route", options);
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
        let response = await fetch(`/api/route/${id}`, options);
        let data = await response.json();
        return data;
    }

    async create(client) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(client)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/client`, options);
        let data = await response.json();
        return data;
    }

    async update(client) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(client)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/client`, options);
        let data = await response.json();
        return data;
    }

    async delete(client_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/client/${client_id}`, options);
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
        this.table = document.querySelector(".client table");
        this.select = document.getElementById("route_select");
        //this.tableRoute = document.querySelector(".route table");
        this.error = document.querySelector(".error");
        this.client_id = document.getElementById("client_id");
        this.client_surname = document.getElementById("client_surname");
        this.client_name = document.getElementById("client_name");
        this.client_patronymic = document.getElementById("client_patronymic");
        this.client_phone = document.getElementById("client_phone");
        this.client_date = document.getElementById("client_date");
        this.client_time = document.getElementById("client_time");

        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
        //this.routes = document.getElementById("route");

    }

    reset() {
        this.client_id.textContent = "";
        this.client_surname.value = "";
        this.client_name.value = "";
        this.client_patronymic.value = "";
        this.client_phone.value = "";
        this.client_date.value = "";
        this.client_time.value = "";
        this.select.value = null;
    }

    updateEditor(client) {
        this.client_id.textContent = client.client_id;
        this.client_surname.value = client.client_surname;
        this.client_name.value = client.client_name;
        this.client_patronymic.value = client.client_patronymic;
        this.client_phone.value = client.client_phone;
        this.client_date.value = client.client_date;
        this.client_time.value = client.client_time;
        this.select.value = client.client_route_id;

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

    buildTable(clients, routes) {
        let tbody,
            html = "",
            select_html = "";

        for (let route of routes)
                select_html += `<option value=${route.id}>${route.name}</option>`
        this.select.innerHTML = select_html;


        // Iterate over the client and build the table
        clients.forEach((client) => {
            let route_name, route_id;
            for (let route of routes){
                if (route.id == client.route_id){
                    route_name = route.name; 
                    route_id = route.id;
                }
            }   
            html += `
            <tr data-id="${client.id}" data-surname="${client.surname}" data-name="${client.name}" 
            data-patronymic="${client.patronymic}" data-phone="${client.phone}" data-date="${client.date_of_buy}" data-time="${client.time_of_buy}"
            data-route_id="${route_name}" data-select="${route_id}">

            <td class="client_surname">${client.surname}</td>
            <td class="client_name">${client.name}</td>
            <td class="client_patronymic">${client.patronymic}</td>
            <td class="client_phone">${client.phone}</td>
            <td class="client_date">${client.date_of_buy}</td>    
            <td class="client_time">${client.time_of_buy}</td>
            <td class="route_id">${route_name}</td>
            <td class="selectval" visibility: hidden>${route_id}</td>
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
            let urlclient_id = +document.getElementById("url_client_id").value,
                client = await this.model.read(),
                route = await this.model.readRoute()
            this.view.buildTable(client, route);
            

            // Did we navigate here with a client selected?
            if (urlclient_id) {
                let client = await this.model.readOne(urlclient_id);
                this.view.updateEditor(client);
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
        document.querySelector(".client table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                client_id = target.getAttribute("data-id"),
                client_surname = target.getAttribute("data-surname"),
                client_name = target.getAttribute("data-name"),
                client_patronymic = target.getAttribute("data-patronymic"),
                client_phone = target.getAttribute("data-phone"),
                client_date = target.getAttribute("data-date"),
                client_time = target.getAttribute("data-time");
            this.view.updateEditor({
                client_id: client_id,
                client_surname: client_surname,
                client_name: client_name,
                client_patronymic: client_patronymic,
                client_phone: client_phone,
                client_date: client_date,
                client_time: client_time
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });

    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let
                client_surname = document.getElementById("client_surname").value,
                client_name = document.getElementById("client_name").value,
                client_patronymic = document.getElementById("client_patronymic").value,
                client_phone = document.getElementById("client_phone").value,
                client_date = document.getElementById("client_date").value,
                client_time = document.getElementById("client_time").value,
                select = +document.getElementById("route_select").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    id: 0,
                    surname: client_surname,
                    name: client_name,
                    patronymic: client_patronymic,
                    phone: client_phone,
                    date_of_buy: client_date,
                    time_of_buy: client_time,
                    route_id: select
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let client_id = +document.getElementById("client_id").textContent,
                client_surname = document.getElementById("client_surname").value,
                client_name = document.getElementById("client_name").value,
                client_patronymic = document.getElementById("client_patronymic").value,
                client_phone = document.getElementById("client_phone").value,
                client_date = document.getElementById("client_date").value,
                client_time = document.getElementById("client_time").value,
                select = +document.getElementById("route_select").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    id: client_id,
                    surname: client_surname,
                    name: client_name,
                    patronymic: client_patronymic,
                    phone: client_phone,
                    date_of_buy: client_date,
                    time_of_buy: client_time,
                    route_id: select
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let client_id = +document.getElementById("client_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(client_id);
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
