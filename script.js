//book class
class Customer {
  constructor(name, email, number) {
    this.name = name;
    this.email = email;
    this.number = number;
  }
}
//ui class:handle UI tasks
class UI {
  static displayCustomers() {
    /*const StoredCustomers =
       [
      { name: "John", email: "", number: "23131" },
      { name: "Doe", email: "", number: "23131" },
    ];

    const customers = StoredCustomers;*/
    const customers = Store.getCustomers();
    customers.forEach((customer) => UI.addCustomerToList(customer));
  }
  static addCustomerToList(customer) {
    const list = document.querySelector("#customer-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${customer.name}</td>
    <td>${customer.email}</td>
    <td>${customer.number}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }
  static deleteCustomer(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static clearFields() {
    document.querySelector("#name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#number").value = "";
  }
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#customer-form");
    container.insertBefore(div, form);

    //vanish alert in 3 sec
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}
/*-----------store class:handles storage----------*/

class Store {
  static getCustomers() {
    let customers;
    if (localStorage.getItem("customers") === null) {
      customers = [];
    } else {
      customers = JSON.parse(localStorage.getItem("customers"));
    }
    return customers;
  }
  static addCustomer(customer) {
    const customers = Store.getCustomers();
    customers.push(customer);
    localStorage.setItem("customers", JSON.stringify(customers));
  }
  static removeCustomer(number) {
    const customers = Store.getCustomers();
    customers.forEach((customer, index) => {
      if (customer.number === number) {
        customers.splice(index, 1);
      }
    });
    localStorage.setItem("customers", JSON.stringify(customers));
  }
}

/*-------------display customer----------*/
document.addEventListener("DOMContentLoaded", UI.displayCustomers);

/*----add customer----------*/

document.querySelector("#customer-form").addEventListener("submit", (e) => {
  e.preventDefault();
  //getform values
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const number = document.querySelector("#number").value;

  //instantiate customer
  const customer = new Customer(name, email, number);

  //validate
  if (name === "" || email === "" || number === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    //add customer to UI
    UI.addCustomerToList(customer);

    //add Customer to store
    Store.addCustomer(customer);
    //show sucess message
    UI.showAlert("Customer Added", "success");

    //clear fields
    UI.clearFields();
  }
});
/*--------------remove customer--------*/

document.querySelector("#customer-list").addEventListener("click", (e) => {
  UI.deleteCustomer(e.target);

  //remvoe customer from store
  Store.removeCustomer(
    e.target.parentElement.previousElementSibling.textContent
  );

  //show messafe
  UI.showAlert("Customer removed", "success");
});
