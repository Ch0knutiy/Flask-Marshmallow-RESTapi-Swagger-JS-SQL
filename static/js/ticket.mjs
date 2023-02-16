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
        let response = await fetch("/api/ticket", options);
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

    async readClients() {
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
        let response = await fetch(`/api/ticket/${id}`, options);
        let data = await response.json();
        return data;
    }

    async create(ticket) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(ticket)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/ticket`, options);
        let data = await response.json();
        return data;
    }

    async update(ticket) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(ticket)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/ticket`, options);
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
        let response = await fetch(`/api/ticket/${id}`, options);
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
        this.table = document.querySelector(".ticket table");
        this.select_client = document.getElementById("client_select");
        this.select_flight = document.getElementById("flight_select");
        this.error = document.querySelector(".error");
        this.ticket_id = document.getElementById("ticket_id");
        //this.ticket_id_client = document.getElementById("id_client");
        this.ticket_seat = document.getElementById("ticket_seat");
        //this.ticket_flight_num = document.getElementById("flight_num");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.ticket_id.textContent = "";
        this.select_client.value = null;
        this.select_flight.value = null;
        this.ticket_seat.value = "";
    }

    updateEditor(ticket) {
        this.ticket_id.textContent = ticket.ticket_id;
        //this.select_client.value = ticket.ticket_name;
        //this.select_flight.value = ticket.flight_num;
        this.ticket_seat.value = ticket.ticket_seat;
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

    buildTable(ticket, flights, clients) {
        let tbody,
            html = "",
            select_client_html = "",
            select_flight_html = "";

        for (let client of clients)
            select_client_html += `<option value=${client.id}>${client.surname}</option>`
        this.select_client.innerHTML = select_client_html;

        for (let flight of flights)
            select_flight_html += `<option value=${flight.num}>${flight.num}</option>`
        this.select_flight.innerHTML = select_flight_html;
        // Iterate over the ticket and build the table
        ticket.forEach((ticket) => {
            let client_surname, flight_num;
            for (let client of clients){
                if (client.id == ticket.id_client){
                    client_surname = client.surname; 
                }
            }   
            for (let flight of flights){
                if (flight.num == ticket.flight_num){
                    flight_num = flight.num; 
                }
            }   
            html += `
            <tr data-id="${ticket.id}" data-select_client="${client_surname}" data-select_flight="${flight_num}" data-seat="${ticket.seat}">
                
            <td class="id_client">${client_surname}</td>
            <td class="flight_num">${flight_num}</td>
            <td class="seat">${ticket.seat}</td>
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
            let urlticket_id = +document.getElementById("url_ticket_id").value,
                ticket = await this.model.read(),
                clients = await this.model.readClients(),
                flights = await this.model.readFlights();

            this.view.buildTable(ticket, flights, clients);

            // Did we navigate here with a ticket selected?
            if (urlticket_id) {
                let ticket = await this.model.readOne(urlticket_id);
                this.view.updateEditor(ticket);
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
        document.querySelector(".ticket table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                ticket_id = target.getAttribute("data-id"),
                seat = target.getAttribute("data-seat");

            this.view.updateEditor({
                ticket_id: ticket_id,
                ticket_seat: seat

            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let 
            ticket_seat = +document.getElementById("ticket_seat").value,
            select_client = +document.getElementById("client_select").value,
            select_flight = document.getElementById("flight_select").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    id: 0,
                    id_client: select_client,
                    flight_num: select_flight,
                    seat: ticket_seat
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let ticket_id = +document.getElementById("ticket_id").textContent,
                ticket_seat = +document.getElementById("ticket_seat").value,
                select_client = +document.getElementById("client_select").value,
                select_flight = document.getElementById("flight_select").value;


            evt.preventDefault();
            try {
                await this.model.update({
                    id: ticket_id,
                    id_client: select_client,
                    flight_num: select_flight,
                    seat: ticket_seat
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let ticket_id = +document.getElementById("ticket_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(ticket_id);
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
