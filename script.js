document.getElementById('attendanceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const totalClasses = parseInt(document.getElementById('totalClasses').value);
    const attendedClasses = parseInt(document.getElementById('attendedClasses').value);
    const desiredAttendance = parseFloat(document.getElementById('desiredAttendance').value) / 100;

    const attendancePercentage = (attendedClasses / totalClasses) * 100;
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = ''; // Clear previous results

    if (isNaN(attendancePercentage)) {
        resultDiv.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <p>Please enter valid numbers for total classes and attended classes.</p>
            </div>
        `;
        return;
    }

    if (attendancePercentage < 0 || attendancePercentage > 100) {
        resultDiv.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <p>Attendance percentage must be between 0 and 100.</p>
            </div>
        `;
        return;
    }

    let resultMessage = '';
    if (attendancePercentage < desiredAttendance * 100) {
        const requiredClasses = Math.ceil((desiredAttendance * totalClasses - attendedClasses) / (1 - desiredAttendance));
        resultMessage = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <p>Your attendance is ${attendancePercentage.toFixed(2)}%</p>
                <p>You need to attend ${requiredClasses} more classes to reach ${desiredAttendance * 100}% attendance.</p>
            </div>
        `;
    } else {
        const maxMissableClasses = Math.floor(attendedClasses / desiredAttendance - totalClasses);
        resultMessage = `
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <p>Your attendance is ${attendancePercentage.toFixed(2)}%</p>
                <p>You can miss ${maxMissableClasses} more classes and still maintain ${desiredAttendance * 100}% attendance.</p>
            </div>
        `;
    }

    // Save attendance calculation to local storage
    const attendanceData = {
        totalClasses: totalClasses,
        attendedClasses: attendedClasses,
        desiredAttendance: desiredAttendance,
        attendancePercentage: attendancePercentage.toFixed(2)
    };
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

    resultDiv.innerHTML = resultMessage;
});

// Load stored attendance data on page load
window.addEventListener('load', function() {
    const storedAttendanceData = localStorage.getItem('attendanceData');
    if (storedAttendanceData) {
        const attendanceData = JSON.parse(storedAttendanceData);
        const resultDiv = document.getElementById('result');
        const resultMessage = `
            <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                <p>Your previous attendance calculation:</p>
                <p>Total Classes: ${attendanceData.totalClasses}</p>
                <p>Attended Classes: ${attendanceData.attendedClasses}</p>
                <p>Desired Attendance: ${(attendanceData.desiredAttendance * 100).toFixed(2)}%</p>
                <p>Your attendance is ${attendanceData.attendancePercentage}%</p>
            </div>
        `;
        resultDiv.innerHTML = resultMessage;
    }
});



document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('navbar-search').classList.toggle('hidden');
});
document.getElementById('search-toggle').addEventListener('click', function() {
    document.getElementById('mobile-search-input').classList.toggle('hidden');
});

function highlightText(searchText, content) {
    if (!searchText) {
        return content;
    }
    const regex = new RegExp(`(${searchText})`, 'gi');
    return content.replace(regex, '<span class="highlight">$1</span>');
}

function searchHandler(inputId) {
    const searchInput = document.getElementById(inputId);
    const searchContent = document.querySelectorAll('.search-content');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        searchContent.forEach((element) => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                element.innerHTML = highlightText(query, element.textContent);
                element.style.display = '';
            } else {
                element.innerHTML = element.textContent;
                element.style.display = 'none';
            }
        });
    });
}

searchHandler('search-input');
searchHandler('mobile-search-input');
