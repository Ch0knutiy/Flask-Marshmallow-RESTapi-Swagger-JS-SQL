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
        let response = await fetch("/api/transfer", options);
        let data = await response.json();
        return data;
    }

    async readOne(transfer_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/transfer/${transfer_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(transfer) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(transfer)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/transfer`, options);
        let data = await response.json();
        return data;
    }

    async update(transfer) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(transfer)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/transfer`, options);
        let data = await response.json();
        return data;
    }

    async delete(transfer_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/transfer/${transfer_id}`, options);
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
        this.table = document.querySelector(".transfer table");
        this.error = document.querySelector(".error");
        this.transfer_id = document.getElementById("transfer_id");
        this.transfer_num = document.getElementById("transfer_num");
        this.transfer_post = document.getElementById("transfer_post");
        this.transfer_reason = document.getElementById("transfer_reason");
        this.transfer_date = document.getElementById("transfer_date");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");


    }

    reset() {
        this.transfer_id.textContent = "";
        this.transfer_num.value = "";
        this.transfer_post.value = "";
        this.transfer_reason.value = "";
        this.transfer_date.value = "";
    }

    updateEditor(transfer) {
        this.transfer_id.textContent = transfer.transfer_id;
        this.transfer_num.value = transfer.transfer_num;
        this.transfer_post.value = transfer.transfer_post;
        this.transfer_reason.value = transfer.transfer_reason;
        this.transfer_date.value = transfer.transfer_date;
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

    buildTable(transfer) {
        let tbody,
            html = "";

        // Iterate over the transfer and build the table
        transfer.forEach((transfer) => {
            html += `
            <tr data-id="${transfer.id}" data-num="${transfer.num}" data-post="${transfer.post}" 
            data-reason="${transfer.reason}" data-date="${transfer.date}" >
            <td class="num">${transfer.num}</td>
            <td class="post">${transfer.post}</td>
            <td class="reason">${transfer.reason}</td>
            <td class="date">${transfer.date}</td>
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
            let urltransfer_id = +document.getElementById("url_transfer_id").value,
                transfer = await this.model.read();
            this.view.buildTable(transfer);


            // Did we navigate here with a transfer selected?
            if (urltransfer_id) {
                let transfer = await this.model.readOne(urltransfer_id);
                this.view.updateEditor(transfer);
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
        document.querySelector(".transfer table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                transfer_id = target.getAttribute("data-id"),

                transfer_num = target.getAttribute("data-num"),
                transfer_post = target.getAttribute("data-post"),
                transfer_reason = target.getAttribute("data-reason"),
                transfer_date = target.getAttribute("data-date");


            this.view.updateEditor({
                transfer_id: transfer_id,
                transfer_num: transfer_num,
                transfer_post: transfer_post,
                transfer_reason: transfer_reason,
                transfer_date: transfer_date
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });

    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let 
                transfer_num = +document.getElementById("transfer_num").value,
                transfer_post = document.getElementById("transfer_post").value,
                transfer_reason = document.getElementById("transfer_reason").value,
                transfer_date = document.getElementById("transfer_date").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    id: 0,
                    num: transfer_num,
                    post: transfer_post,
                    reason: transfer_reason,
                    date: transfer_date
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let transfer_id = +document.getElementById("transfer_id").textContent,
            transfer_num = +document.getElementById("transfer_num").value,
            transfer_post = document.getElementById("transfer_post").value,
            transfer_reason = document.getElementById("transfer_reason").value,
            transfer_date = document.getElementById("transfer_date").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    id: transfer_id,
                    num: transfer_num,
                    post: transfer_post,
                    reason: transfer_reason,
                    date: transfer_date
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let transfer_id = +document.getElementById("transfer_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(transfer_id);
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
