
// ==========================
// 🔹 LOGIN FUNCTION
// ==========================
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://employee-management-rr8y.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
  
        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Login Successful");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid Credentials");
        }

    } catch (error) {
        console.error(error);
        alert("Server Error");
    }
}


// ==========================
// 🔹 LOAD EMPLOYEES
// ================
async function loadEmployees() {
    const token = localStorage.getItem("token");

    const response = await fetch("https://employee-management-rr8y.onrender.com/api/employees", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const employees = await response.json();

    const list = document.getElementById("employeeList");
    list.innerHTML = "";

    // Update Total Count
    document.getElementById("totalEmployees").innerText = employees.length;

    // Department Count
    const deptCount = {};

    employees.forEach(emp => {

        // Build employee list
        const li = document.createElement("li");
        li.innerHTML = `
            ${emp.name} - ${emp.department} - ₹${emp.salary}
            <button onclick="editEmployee('${emp._id}', '${emp.name}', '${emp.department}', '${emp.salary}')">Edit</button>
            <button onclick="deleteEmployee('${emp._id}')">Delete</button>
        `;
        list.appendChild(li);

        // Count departments
        if (deptCount[emp.department]) {
            deptCount[emp.department]++;
        } else {
            deptCount[emp.department] = 1;
        }
    });

    // Create Chart
    const ctx = document.getElementById('deptChart').getContext('2d');

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(deptCount),
            datasets: [{
                label: 'Employees per Department',
                data: Object.values(deptCount),
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0']
            }]
        }
    });
}

// ==========================
// 🔹 ADD EMPLOYEE
// ==========================
async function addEmployee() {
    const token = localStorage.getItem("token");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    const salary = document.getElementById("salary").value;

    try {
        const response = await fetch("https://employee-management-rr8y.onrender.com/api/employees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name,
                email,
                department,
                salary
            })
        });

        if (response.ok) {
            alert("Employee Added Successfully");
            loadEmployees();
        } else {
            alert("Failed to Add Employee");
        }

    } catch (error) {
        console.error(error);
        alert("Error Adding Employee");
    }
}


// ==========================
// 🔹 DELETE EMPLOYEE
// ==========================
async function deleteEmployee(id) {
    const token = localStorage.getItem("token");

    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    try {
        await fetch(`https://employee-management-rr8y.onrender.com/api/employees/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        loadEmployees();

    } catch (error) {
        console.error(error);
        alert("Error Deleting Employee");
    }
}


// ==========================
// 🔹 EDIT EMPLOYEE
// ==========================
async function editEmployee(id, oldName, oldDept, oldSalary) {
    const newName = prompt("Enter new name:", oldName);
    const newDept = prompt("Enter new department:", oldDept);
    const newSalary = prompt("Enter new salary:", oldSalary);

    const token = localStorage.getItem("token");

    try {
        await fetch(`https://employee-management-rr8y.onrender.com/api/employees/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name: newName,
                department: newDept,
                salary: newSalary
            })
        });

        loadEmployees();

    } catch (error) {
        console.error(error);
        alert("Error Updating Employee");
    }
}


// ==========================
// 🔹 LOGOUT
// ==========================
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

async function searchEmployee() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();

    const token = localStorage.getItem("token");

    const response = await fetch("https://employee-management-rr8y.onrender.com/api/employees", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const employees = await response.json();

    const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchValue)
    );

    const list = document.getElementById("employeeList");
    list.innerHTML = "";

    filtered.forEach(emp => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${emp.name} - ${emp.department} - ₹${emp.salary}
        `;
        list.appendChild(li);
    });
}
