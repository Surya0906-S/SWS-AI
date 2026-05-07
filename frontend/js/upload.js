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

    if(files.length > 3){

        showToast(
            `Upload in progress — processing ${files.length} files in background`
        );

    }

    for(let file of files){

        const fileItem =
            document.createElement("div");

        fileItem.classList.add("file-item");

        fileItem.innerHTML = `
            <h3>${file.name}</h3>

            <p>
                ${(file.size / 1024).toFixed(2)} KB
            </p>

            <p>Status: Uploading...</p>

            <div class="progress-bar">
                <div class="progress"></div>
            </div>
        `;

        fileList.appendChild(fileItem);

        const progress =
            fileItem.querySelector(".progress");

        const formData = new FormData();

        formData.append("files", file);

        try{

            await axios.post(
                "http://localhost:5000/api/upload",
                formData,
                {

                    headers: {
                        "Content-Type":
                        "multipart/form-data"
                    },

                    onUploadProgress: (event) => {

                        const percent = Math.round(
                            (event.loaded * 100)
                            / event.total
                        );

                        progress.style.width =
                            percent + "%";
                    }

                }
            );

            progress.style.background = "green";

            fileItem.querySelector(
                "p:nth-child(3)"
            ).innerText =
            "Status: Complete";

        }
        catch(error){

            fileItem.querySelector(
                "p:nth-child(3)"
            ).innerText =
            "Status: Failed";

        }

    }

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