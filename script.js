// Get form and table body elements from the DOM
const form = document.getElementById('registrationForm');
const tableBody = document.querySelector('#studentTable tbody');

// Retrieve student records from local storage or initialize with an empty array
let students = JSON.parse(localStorage.getItem('students')) || [];

// This variable keeps track of the index of the student being edited
let editIndex = null;

// Function to render student records into the table
function renderStudents() {
  tableBody.innerHTML = '';
  students.forEach((student, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.id}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td class="actions">
        <button class="edit" onclick="editStudent(${index})">Edit</button>
        <button class="delete" onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Function to validate input fields using regular expressions and simple checks
function validateInput(name, id, email, contact) {
  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    nameRegex.test(name) &&
    !isNaN(id) &&
    emailRegex.test(email) &&
    !isNaN(contact)
  );
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('studentName').value.trim();
  const id = document.getElementById('studentID').value.trim();
  const email = document.getElementById('email').value.trim();
  const contact = document.getElementById('contact').value.trim();

  if (!name || !id || !email || !contact) {
    alert('Please fill out all fields.');
    return;
  }

  if (!validateInput(name, id, email, contact)) {
    alert('Invalid input. Please check your entries.');
    return;
  }

  const newStudent = { name, id, email, contact };

  // If editing, update the existing student record; else add a new one
  if (editIndex !== null) {
    students[editIndex] = newStudent;
    editIndex = null;
  } else {
    students.push(newStudent);
  }

  // Save updated list to local storage
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
  form.reset();
});

// Functions for existing data editing
window.editStudent = function (index) {
  const student = students[index];
  document.getElementById('studentName').value = student.name;
  document.getElementById('studentID').value = student.id;
  document.getElementById('email').value = student.email;
  document.getElementById('contact').value = student.contact;
  editIndex = index;
};

// Function to delete a student record
window.deleteStudent = function (index) {
  if (confirm('Are you sure you want to delete this record?')) {
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
  }
};

// Initial render
renderStudents();
