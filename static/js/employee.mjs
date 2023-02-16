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
        let response = await fetch("/api/employee", options);
        let data = await response.json();
        return data;
    }

    async readTransfer() {
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

    async readOne(employee_id) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/employee/${employee_id}`, options);
        let data = await response.json();
        return data;
    }

    async create(employee) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(employee)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/employee`, options);
        let data = await response.json();
        return data;
    }

    async update(employee) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(employee)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/employee`, options);
        let data = await response.json();
        return data;
    }

    async delete(employee_id) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/employee/${employee_id}`, options);
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
        this.table = document.querySelector(".employee table");
        this.select = document.getElementById("transfer_select");
        this.error = document.querySelector(".error");
        this.employee_id = document.getElementById("employee_id");
        this.employee_surname = document.getElementById("employee_surname");
        this.employee_name = document.getElementById("employee_name");
        this.employee_patronymic = document.getElementById("employee_patronymic");
        this.employee_phone = document.getElementById("employee_phone");
        this.employee_address = document.getElementById("employee_address");
        this.employee_birth = document.getElementById("employee_birth");
        this.employee_post = document.getElementById("employee_post");
        this.employee_salary = document.getElementById("employee_salary");

        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
    }

    reset() {
        this.employee_id.textContent = "";
        this.employee_surname.value = "";
        this.employee_name.value = "";
        this.employee_patronymic.value = "";
        this.employee_phone.value = "";
        this.employee_address.value = "";
        this.employee_birth.value = "";
        this.employee_post.value = "";
        this.employee_salary.value = "";
        this.select.value = null;
    }

    updateEditor(employee) {
        this.employee_id.textContent = employee.employee_id;
        this.employee_surname.value = employee.employee_surname;
        this.employee_name.value = employee.employee_name;
        this.employee_patronymic.value = employee.employee_patronymic;
        this.employee_phone.value = employee.employee_phone;
        this.employee_address.value = employee.employee_address;
        this.employee_birth.value = employee.employee_birth;
        this.employee_post.value = employee.employee_post;
        this.employee_salary.value = employee.employee_salary;
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


    buildTable(employee, transfers) {

        let tbody,
            html = "",
            select_html = "";
        for (let transfer of transfers)
            select_html += `<option value=${transfer.id}>${transfer.num}</option>`
        this.select.innerHTML = select_html;
        // Iterate over the employee and build the table
        employee.forEach((employee) => {
            let transfer_num
            for (let transfer of transfers) {
                if (transfer.id == employee.transfer_id) {
                    transfer_num = transfer.num;
                }
            }
            html += `
            <tr data-id="${employee.id}" data-surname="${employee.surname}" data-name="${employee.name}" 
            data-patronymic="${employee.patronymic}" data-phone="${employee.phone}" 
            data-address="${employee.address}" data-birth="${employee.birth}"
            data-post="${employee.post}" data-salary="${employee.salary}"
            data-transfer_id="${transfer_num}">

            <td class="employee_surname">${employee.surname}</td>
            <td class="employee_name">${employee.name}</td>
            <td class="employee_patronymic">${employee.patronymic}</td>
            <td class="employee_phone">${employee.phone}</td>
            <td class="employee_address">${employee.address}</td>
            <td class="employee_birth">${employee.birth}</td>    
            <td class="employee_post">${employee.post}</td>
            <td class="employee_salary">${employee.salary}</td>
            <td class="transfer_id">${transfer_num}</td>
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
            let urlemployee_id = +document.getElementById("url_employee_id").value,
                employee = await this.model.read(),
                transfer = await this.model.readTransfer();

            this.view.buildTable(employee, transfer);


            // Did we navigate here with a employee selected?
            if (urlemployee_id) {
                let employee = await this.model.readOne(urlemployee_id);
                this.view.updateEditor(employee);
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
        document.querySelector(".employee table").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                employee_id = target.getAttribute("data-id"),
                employee_surname = target.getAttribute("data-surname"),
                employee_name = target.getAttribute("data-name"),
                employee_patronymic = target.getAttribute("data-patronymic"),
                employee_phone = target.getAttribute("data-phone"),
                employee_birth = target.getAttribute("data-birth"),
                employee_post = target.getAttribute("data-post"),
                employee_salary = target.getAttribute("data-salary"),
                employee_address = target.getAttribute("data-address");


            this.view.updateEditor({
                employee_id: employee_id,
                employee_surname: employee_surname,
                employee_name: employee_name,
                employee_patronymic: employee_patronymic,
                employee_phone: employee_phone,
                employee_birth: employee_birth,
                employee_post: employee_post,
                employee_salary: employee_salary,
                employee_address: employee_address,
            });
            this.view.setButtonState(this.view.EXISTING_NOTE);
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let
                employee_surname = document.getElementById("employee_surname").value,
                employee_name = document.getElementById("employee_name").value,
                employee_patronymic = document.getElementById("employee_patronymic").value,
                employee_phone = document.getElementById("employee_phone").value,
                employee_birth = document.getElementById("employee_birth").value,
                employee_post = document.getElementById("employee_post").value,
                employee_address = document.getElementById("employee_address").value,
                employee_salary = +document.getElementById("employee_salary").value,
                select = +document.getElementById("transfer_select").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    id: 0,
                    surname: employee_surname,
                    name: employee_name,
                    patronymic: employee_patronymic,
                    address: employee_address,
                    phone: employee_phone,
                    birth: employee_birth,
                    post: employee_post,
                    salary: employee_salary,
                    transfer_id: select
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let employee_id = +document.getElementById("employee_id").textContent,
                employee_surname = document.getElementById("employee_surname").value,
                employee_name = document.getElementById("employee_name").value,
                employee_patronymic = document.getElementById("employee_patronymic").value,
                employee_address = document.getElementById("employee_address").value,
                employee_phone = document.getElementById("employee_phone").value,
                employee_birth = document.getElementById("employee_birth").value,
                employee_post = document.getElementById("employee_post").value,
                employee_salary = +document.getElementById("employee_salary").value,
                select = +document.getElementById("transfer_select").value;

            evt.preventDefault();
            try {
                await this.model.update({
                    id: employee_id,
                    surname: employee_surname,
                    name: employee_name,
                    patronymic: employee_patronymic,
                    address: employee_address,
                    phone: employee_phone,
                    birth: employee_birth,
                    post: employee_post,
                    salary: employee_salary,
                    transfer_id: select
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let employee_id = +document.getElementById("employee_id").textContent;

            evt.preventDefault();
            try {
                await this.model.delete(employee_id);
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
