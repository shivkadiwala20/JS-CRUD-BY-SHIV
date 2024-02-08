document.forms[0].elements.birthday.max = new Date().toISOString().split('T')[0];

function initEmployeeApp() {

  const storageKey = "employeeData";

   function validateName(name) {
     const regex = /^[a-zA-Z0-9\s]{4,20}$/;
     const containsAlphabet = /[a-zA-Z]/.test(name)
     return regex.test(name) && containsAlphabet;
   }

   function validateEmail(email) {
     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return regex.test(email);
   }

   function validatePhone(phone) {
     const regex = /^\d{10}$/;
     return regex.test(phone);
   }

   function validateDOB(dob) {
     const currentDate = new Date();
     const inputDate = new Date(dob);
     return inputDate <= currentDate;
   }


   function generateUniqueId() {
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    return (
      "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> (c / 4)).toString(16)
      ) + "-" + data.length
    );
  }


  function addEmployee() {
    const form = document.forms.employeeForm;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();

    // Check if the record with the same name and email already exists
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    const isDuplicate = data.some((employee) => employee.name === name && employee.email === email);

    if (isDuplicate) {
      alert("Record with the same name and email already exists.");
      return;
    }

    const gender = form.elements.Gender.value;
    const dob = form.elements.birthday.value;
    const phone = form.elements.Phone.value.trim();
    const hobbies = Array.from(form.elements.sports)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value)
      .join(", ").toString();

    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const phoneValid = validatePhone(phone);
    const dobValid = validateDOB(dob);

    if (!name || !dob || !email || !phone) {
      form.elements.name.nextElementSibling.textContent = !name ? "Name is required." : "";
      form.elements.birthday.nextElementSibling.textContent = !dob ? "Date of birth is required." : "";
      form.elements.email.nextElementSibling.textContent = !email ? "Email is required." : "";
      form.elements.Phone.nextElementSibling.textContent = !phone ? "Phone number is required." : "";
      return;
    }

    form.elements.name.nextElementSibling.textContent = nameValid
      ? ""
      : "Name should be between 4 to 20 characters, including only alphanumeric characters.";
    form.elements.birthday.nextElementSibling.textContent = dobValid
      ? ""
      : "Future dates are not allowed.";
    form.elements.email.nextElementSibling.textContent = emailValid
      ? ""
      : "Invalid email format.";
    form.elements.Phone.nextElementSibling.textContent = phoneValid
      ? ""
      : "Phone should be a number field with 10 digits.";

    if (!nameValid || !emailValid || !phoneValid || !dobValid) {
      return;
    }

    const employee = {
      id: generateUniqueId(),
      name,
      gender,
      dob,
      email,
      phone,
      hobbies,
    };

    const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];
    existingData.push(employee);
    localStorage.setItem(storageKey, JSON.stringify(existingData));

    alert("Record has been added successfully.");
    form.reset();
    displayEmployees();
    location.reload();
    advanceTable();
  }

 function advanceTable(){




   const advanceTable = document.getElementById("displayAdvTable");
   const trs = advanceTable.getElementsByTagName('tr');
    const advanceChild=document.getElementById("advanceChild")

   const arr = JSON.parse(localStorage.getItem(storageKey)) || [];


   if (arr.length === 0) {
     advanceTable.style.display = "none";
     advanceChild.style.display="none"
     return;
   }


   const dummyData = Object.keys(arr[0])

       for (let i = 0; i < 8; i++) {



     const tr = document.createElement('tr')
     for (let x in arr ) {
       const td = document.createElement('td')

      console.log(Number(x))
       if(i === 7){
        const editButton = document.createElement("button");

            editButton.textContent = "Edit";
            td.appendChild(editButton)
            editButton.addEventListener("click", () => editEmployee(arr[x].id))


            const deleteButton = document.createElement("button");
            console.log(deleteButton)
            deleteButton.textContent = "Delete";
            td.appendChild(deleteButton)
          deleteButton.addEventListener("click", () => {

              const permission =confirm("Are you sure??")
              if(permission){

            deleteEmployee(arr[x].id)

              }
          });


       }
       else{




        td.innerText = i === 0 ? Number(x) + 1 : arr[x][dummyData[i]]
        // console.log(x)

       }


       trs[i].appendChild(td)
     }



   }
  }

  function displayEmployees() {
    const basicTable = document.getElementById("displayTable");
    const basicChild=document.getElementById("basicChild")
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (data.length === 0) {
      basicTable.style.display = "none";
      basicChild.style.display="none"
      return;
    }

    // basicTable.style.display = "table";
    basicTable.innerHTML = "<tr id='tableHeaders'><th>Index</th><th>Name</th><th>Gender</th><th>Date of Birth</th><th>Email</th><th>Phone</th><th>Hobbies</th><th>Actions</th></tr>";
    basicChild.style.display="basicChild"

    data.forEach((employee, index) => {
      const rowId = `employeeRow_${employee.id}`;
      let existingRow = document.getElementById(rowId);

      if (!existingRow) {
        existingRow = document.createElement("tr");
        existingRow.setAttribute("id", rowId);
        basicTable.appendChild(existingRow);
      } else {
        existingRow.innerHTML = ""; // Clear existing content
      }

      const indexCell = document.createElement("td");
      indexCell.textContent = index+1;
      console.log(indexCell)
      existingRow.appendChild(indexCell);

      Object.keys(employee).forEach((key, columnIndex) => {
        if (key === "id") {
          return; // Skip the 'id' column
        }

        const cell = document.createElement("td");
        cell.textContent = columnIndex === 0 ? index : employee[key];
        console.log(cell)
        existingRow.appendChild(cell);
      });

      const actionsCell = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editEmployee(employee.id));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        const permission = confirm("Are you sure?");
        if (permission) {
          deleteEmployee(employee.id);
        }
      });

      actionsCell.appendChild(editButton);
      actionsCell.appendChild(deleteButton);
      existingRow.appendChild(actionsCell);
    });
  }


   function editEmployee(employeeId) {
     const form = document.forms.employeeForm;
     const data = JSON.parse(localStorage.getItem(storageKey)) || [];
     const employee = data.find((e) => e.id === employeeId);

     form.elements.name.value = employee.name;
     form.elements.Gender.value = employee.gender;
     form.elements.birthday.value = employee.dob;
     form.elements.email.value = employee.email;
     form.elements.Phone.value = employee.phone;
     document.getElementsByClassName("employeeForm")[0].scrollIntoView();

     const checkboxes = form.elements.sports;
     checkboxes.forEach((checkbox) => {
       checkbox.checked = employee.hobbies.includes(checkbox.value);
     });

     document.getElementById("submit").style.display = "none";
     document.getElementById("update").style.display = "inline-block";
     document.getElementById("cancel").style.display = "inline-block";


     document.getElementById("update").removeEventListener("click", handleUpdate);
     document.getElementById("cancel").removeEventListener("click", handleCancel);

     document.getElementById("update").addEventListener("click", handleUpdate);
     document.getElementById("cancel").addEventListener("click", handleCancel);




     function handleUpdate(event) {
       event.stopPropagation();
       if (validateUpdatedEmployee()) {
         updateEmployee(employeeId);
         cleanupListeners();
       }
     }

     function handleCancel() {
       form.reset();
       document.getElementById("submit").style.display = "inline-block";
       document.getElementById("update").style.display = "none";
       document.getElementById("cancel").style.display = "none";
       cleanupListeners();
     }

     function cleanupListeners() {
       // Remove event listeners after update or cancel
       document.getElementById("update").removeEventListener("click", handleUpdate);
       document.getElementById("cancel").removeEventListener("click", handleCancel);
     }
   }
   function validateUpdatedEmployee() {
     const form = document.forms.employeeForm;
     const name = form.elements.name.value.trim();
     const dob = form.elements.birthday.value;
     const email = form.elements.email.value.trim();
     const phone = form.elements.Phone.value.trim();

     const nameValid = validateName(name);
     const emailValid = validateEmail(email);
     const phoneValid = validatePhone(phone);
     const dobValid = validateDOB(dob);

     form.elements.name.nextElementSibling.textContent = nameValid
       ? ""
       : "Name should be between 4 to 20 characters, including only alphanumeric characters.";
     form.elements.birthday.nextElementSibling.textContent = dobValid
       ? ""
       : "Future dates are not allowed.";
     form.elements.email.nextElementSibling.textContent = emailValid
       ? ""
       : "Invalid email format.";
     form.elements.Phone.nextElementSibling.textContent = phoneValid
       ? ""
       : "Phone should be a number field with 10 digits.";

     return nameValid && emailValid && phoneValid && dobValid;
   }

   function updateEmployee(employeeId) {
    const form = document.forms.employeeForm;
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    const updatedEmployee = {
      id: employeeId,
      name: form.elements.name.value,
      gender: form.elements.Gender.value,
      dob: form.elements.birthday.value,
      email: form.elements.email.value,
      phone: form.elements.Phone.value,
      hobbies: Array.from(form.elements.sports)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value),
    };

    const isDuplicate = data.some((employee) => {
      return (
        employee.id !== employeeId &&
        employee.email === updatedEmployee.email

      );
    });

    if (isDuplicate) {
      alert("Record with the same name and email already exists.");
      form.reset();

      return;
    }

    const indexToUpdate = data.findIndex((e) => e.id === employeeId);
    data[indexToUpdate] = updatedEmployee;

    localStorage.setItem(storageKey, JSON.stringify(data));


    form.reset();
    document.getElementById("submit").style.display = "inline-block";
    document.getElementById("update").style.display = "none";
    document.getElementById("cancel").style.display = "none";

    location.reload();
    displayEmployees();

    alert("Record has been updated successfully.");
  }




   function deleteEmployee(employeeId) {
     const data = JSON.parse(localStorage.getItem(storageKey)) || [];
     const newData = data.filter((e) => e.id !== employeeId);
     localStorage.setItem(storageKey, JSON.stringify(newData));

     location.reload();
     displayEmployees();
   }


   function validateField(event) {
     const fieldName = event.target.name;
     const fieldValue = event.target.value.trim();

     switch (fieldName) {
       case "name":
         form.elements.name.nextElementSibling.textContent = validateName(fieldValue)
           ? ""
           : "Name should be between 4 to 20 characters, including only alphanumeric characters.";
         break;
       case "birthday":
         form.elements.birthday.nextElementSibling.textContent = validateDOB(fieldValue)
           ? ""
           : "Future dates are not allowed.";
         break;
       case "email":
         form.elements.email.nextElementSibling.textContent = validateEmail(fieldValue)
           ? ""
           : "Invalid email format.";
         break;
       case "Phone":
         form.elements.Phone.nextElementSibling.textContent = validatePhone(fieldValue)
           ? ""
           : "Phone should be a number field with 10 digits.";
         break;
     }
   }




   const form = document.forms.employeeForm;
   const formFields = form.elements;

   Array.from(formFields).forEach((field) => {
     if (field.type !== "checkbox") {
       field.addEventListener("input", validateField);
     }
   });

   form.addEventListener("submit", function (event) {
     event.preventDefault();
     addEmployee();
   });

   displayEmployees();

   advanceTable()

 }

 if (document.readyState === 'complete') {
   initEmployeeApp();
 } else {
   window.onload = initEmployeeApp;
 }






