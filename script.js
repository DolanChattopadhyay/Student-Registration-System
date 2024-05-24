document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');  // Get the student form element
    const recordsContainer = document.getElementById('records'); // Get the container for displaying student records

    // Function to get students from local storage
    function getStudents() {
        return JSON.parse(localStorage.getItem('students')) || []; // Parse and return students from local storage or return an empty array if none exist
    }

    // Function to save students to local storage
    function saveStudents(students) {
        localStorage.setItem('students', JSON.stringify(students)); // Convert students array to JSON and save to local storage
    }

    // Function to display students in the table
    function displayStudents() {
        recordsContainer.innerHTML = ''; // Clear the current records
        const students = getStudents();  // Get the current list of students

        // Iterate over each student and create a table row for each
        students.forEach((student, index) => {
            const studentRow = document.createElement('tr');  // Create a new table row
            studentRow.innerHTML = `
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            recordsContainer.appendChild(studentRow); // Append the row to the table
        });

        // Add event listeners to all edit buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                editStudent(e.target.dataset.index); // Call editStudent function with the index of the student to edit
            });
        });

        // Add event listeners to all delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                deleteStudent(e.target.dataset.index); // Call deleteStudent function with the index of the student to delete
            });
        });
    }

    // Function to add a new student
    function addStudent(student) {
        const students = getStudents(); // Get the current list of students
        students.push(student); // Add the new student to the list
        saveStudents(students); // Save the updated list to local storage
        displayStudents(); // Update the displayed list
    }

    // Function to edit a student
    function editStudent(index) {
        const students = getStudents(); // Get the current list of students
        const student = students[index]; // Get the student to be edited

        // Populate the form with the student's current details
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentID').value = student.id;
        document.getElementById('emailID').value = student.email;
        document.getElementById('contactNo').value = student.contact;

        studentForm.dataset.editingIndex = index; // Set the editing index on the form
    }

    // Function to update a student's details
    function updateStudent(index, updatedStudent) {
        const students = getStudents(); // Get the current list of students
        students[index] = updatedStudent; // Update the student at the specified index
        saveStudents(students); // Save the updated list to local storage
        displayStudents(); // Update the displayed list
    }

    // Function to delete a student
    function deleteStudent(index) {
        const students = getStudents(); // Get the current list of students
        students.splice(index, 1); // Remove the student at the specified index
        saveStudents(students); // Save the updated list to local storage
        displayStudents(); // Update the displayed list
    }

    // Event listener for form submission
    studentForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Get values from the form fields
        const name = document.getElementById('studentName').value;
        const id = document.getElementById('studentID').value;
        const email = document.getElementById('emailID').value;
        const contact = document.getElementById('contactNo').value;

        // Input validation
        if (!name.match(/^[a-zA-Z\s]+$/) || !id.match(/^\d+$/) || !contact.match(/^\d+$/) || !email.match(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)) {
            alert('Please enter valid inputs.'); // Alert if inputs are not valid
            return;
        }

        if (name === '' || id === '' || email === '' || contact === '') {
            alert('All fields are required.'); // Alert if any field is empty
            return;
        }

        const student = { name, id, email, contact }; // Create a new student object

        // Check if the form is in editing mode
        if (studentForm.dataset.editingIndex) {
            updateStudent(studentForm.dataset.editingIndex, student); // Update the student
            studentForm.removeAttribute('data-editing-index'); // Remove the editing index from the form
        } else {
            addStudent(student); // Add a new student
        }

        studentForm.reset(); // Reset the form fields
    });

    displayStudents(); // Display students on initial load
});
