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
        let response = await fetch("/api/route", options);
        let data = await response.json();
        return data;
    }

    async readCity() {
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

    async readHotel() {
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

    async readCompany() {
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

    async readEmployee() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/employee", options);
        let data = await response.json();
        return data;
    }

    async readOne(route_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/route/${route_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(route) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(route)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/route`, options);
        let data = await response.json();
        return data;
    }

    async update(route) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(route)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/route`, options);
        let data = await response.json();
        return data;
    }

    async delete(route_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/route/${route_id}`, options);
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
        this.table = document.querySelector(".route table");

        this.error = document.querySelector(".error");
        this.route_id = document.getElementById("id");
        this.route_name = document.getElementById("name");
        this.route_city_id = document.getElementById("city_select");
        this.route_duration = document.getElementById("duration");
        this.route_hotel_id = document.getElementById("hotel_select");
        this.route_company_id = document.getElementById("company_select");
        this.route_employee_id = document.getElementById("employee_select");

        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.route_id.textContent = "";
        this.route_name.value = "";
        this.route_city_id.value = null;
        this.route_duration.value = "";
        this.route_hotel_id.value = null;
        this.route_company_id.value = null
        this.route_employee_id.value = null;
    }

    updateEditor(route) {
        this.route_id.textContent = route.route_id;
        this.route_name.value = route.route_name;
        this.route_duration.value = route.route_duration;

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

    buildTable(route, cities, hotels, companies, employees) {
        let tbody,
            html = "",
            select1_html = "",
            select2_html = "",
            select3_html = "",
            select4_html = "";

        for (let city of cities)
            select1_html += `<option value=${city.city_id}>${city.city_name}</option>`
        this.route_city_id.innerHTML = select1_html;

        for (let hotel of hotels)
            select2_html += `<option value=${hotel.id}>${hotel.name}</option>`
        this.route_hotel_id.innerHTML = select2_html;

        for (let company of companies)
            select3_html += `<option value=${company.id}>${company.name}</option>`
        this.route_company_id.innerHTML = select3_html;

        for (let employee of employees)
            select4_html += `<option value=${employee.id}>${employee.surname}</option>`
        this.route_employee_id.innerHTML = select4_html;

        // Iterate over the route and build the table
        route.forEach((route) => {
            let city_name;
            for (let city of cities) {
                if (city.city_id == route.city_id) {
                    city_name = city.city_name;
                }
            }
            let hotel_name;
            for (let hotel of hotels) {
                if (hotel.id == route.hotel_id) {
                    hotel_name = hotel.name;
                }
            }
            let company_name;
            for (let company of companies) {
                if (company.id == route.company_id) {
                    company_name = company.name;
                }
            }
            let employee_name;
            for (let employee of employees) {
                if (employee.id == route.employee_id) {
                    employee_name = employee.surname;
                }
            }
            html += `
            <tr data-route_id="${route.id}" data-route_name="${route.name}" 
            data-route_city_id="${city_name}" data-route_duration="${route.duration}" 
            data-hotel_id="${hotel_name}" data-company_id="${company_name}"
            data-route_employee_id="${employee_name}">

            <td class="name">${route.name}</td>
            <td class="city_id">${city_name}</td>
            <td class="duration">${route.duration}</td>
            <td class="hotel_id">${hotel_name}</td>
            <td class="company_id">${company_name}</td>    
            <td class="employee_id">${employee_name}</td>
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
            let urlroute_id = +document.getElementById("url_route_id").value,
                route = await this.model.read(),
                city = await this.model.readCity(),
                hotel = await this.model.readHotel(),
                company = await this.model.readCompany(),
                employee = await this.model.readEmployee();

            this.view.buildTable(route, city, hotel, company, employee);

            // Did we navigate here with a route selected?
            if (urlroute_id) {
                let route = await this.model.readOne(urlroute_id);
                this.view.updateEditor(route);
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
        document.querySelector(".route table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                route_id = target.getAttribute("data-route_id"),
                route_name = target.getAttribute("data-route_name"),
                route_duration = target.getAttribute("data-route_duration");

            this.view.updateEditor({
                route_id: route_id,
                route_name: route_name,
                route_duration: route_duration
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });

    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let
                route_name = document.getElementById("name").value,
                route_city_id = +document.getElementById("city_select").value,
                route_duration = document.getElementById("duration").value,
                route_hotel_id = +document.getElementById("hotel_select").value,
                route_company_id = +document.getElementById("company_select").value,
                route_employee_id = +document.getElementById("employee_select").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    id: 0,
                    name: route_name,
                    city_id: route_city_id,
                    duration: route_duration,
                    hotel_id: route_hotel_id,
                    company_id: route_company_id,
                    employee_id: route_employee_id
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let route_id = +document.getElementById("id").textContent,
                route_name = document.getElementById("name").value,
                route_city_id = +document.getElementById("city_select").value,
                route_duration = document.getElementById("duration").value,
                route_hotel_id = +document.getElementById("hotel_select").value,
                route_company_id = +document.getElementById("company_select").value,
                route_employee_id = +document.getElementById("employee_select").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    id: route_id,
                    name: route_name,
                    city_id: route_city_id,
                    duration: route_duration,
                    hotel_id: route_hotel_id,
                    company_id: route_company_id,
                    employee_id: route_employee_id
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let route_id = +document.getElementById("id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(route_id);
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
