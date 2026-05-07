const socket = io("http://localhost:5000");

const fileInput =
    document.getElementById("fileInput");

const uploadBtn =
    document.getElementById("uploadBtn");

const fileList =
    document.getElementById("fileList");

const toast =
    document.getElementById("toast");

function showToast(message){

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 4000);
}


// REALTIME SOCKET EVENT
socket.on("new-notification", (data) => {

    showToast(data.message);

    loadNotifications();

});


// UPLOAD
uploadBtn.addEventListener("click", async () => {

    const files = fileInput.files;

    if(files.length === 0){

        return alert("Select files");

    }

    showToast(
        `Processing ${files.length} file(s)...`
    );

    // FIFO Upload Queue
    for(let file of files){

        await uploadSingleFile(file);

    }

    showToast(
        `${files.length} file(s) uploaded successfully`
    );

    loadDocuments();

});
// LOAD DOCUMENTS
async function loadDocuments(){

    const tbody =
        document.querySelector(
            "#documentTable tbody"
        );

    tbody.innerHTML = "";

    const response =
        await axios.get(
            "http://localhost:5000/api/upload/documents"
        );

    response.data.forEach((doc) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${doc.filename}</td>
            <td>${doc.filesize}</td>
            <td>${doc.filetype}</td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteFile(${doc.id})"
                >
                    Delete
                </button>
            </td>
        `;

        tbody.appendChild(row);

    });

}


// DELETE FILE
async function deleteFile(id){

    await axios.delete(
        `http://localhost:5000/api/upload/${id}`
    );

    showToast("File deleted");

    loadDocuments();

}

document
  .getElementById("clearNotificationsBtn")
  .addEventListener("click", async () => {

    // 1. Clear UI immediately
    document.getElementById("notificationList").innerHTML = "";

    // 2. Optional: Clear from backend (recommended)
    try {
        await axios.delete("http://localhost:5000/api/notifications");
        showToast("Notifications cleared successfully");
    } catch (err) {
        console.log("Error clearing notifications", err);
    }
});

// LOAD NOTIFICATIONS
async function loadNotifications(){

    const notificationList =
        document.getElementById(
            "notificationList"
        );

    notificationList.innerHTML = "";

    const response =
        await axios.get(
            "http://localhost:5000/api/upload/notifications"
        );

    response.data.forEach((notification) => {

        const div =
            document.createElement("div");

        div.classList.add(
            "notification-item"
        );

        div.innerHTML = `
            <strong>
                ${notification.message}
            </strong>

            <p>
                ${new Date(
                    notification.created_at
                ).toLocaleString()}
            </p>
        `;

        notificationList.appendChild(div);

    });

}

loadDocuments();
loadNotifications();