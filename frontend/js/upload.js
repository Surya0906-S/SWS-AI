const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const fileList = document.getElementById("fileList");

uploadBtn.addEventListener("click", async () => {

    const files = fileInput.files;

    if(files.length === 0){
        alert("Please select files");
        return;
    }

    fileList.innerHTML = "";

    for(let file of files){

        const fileItem = document.createElement("div");
        fileItem.classList.add("file-item");

        fileItem.innerHTML = `
            <h3>${file.name}</h3>

            <p>Size: ${(file.size / 1024).toFixed(2)} KB</p>

            <p>Status: Uploading...</p>

            <div class="progress-bar">
                <div class="progress"></div>
            </div>
        `;

        fileList.appendChild(fileItem);

        const progress = fileItem.querySelector(".progress");

        const formData = new FormData();

        formData.append("files", file);

        try{

            await axios.post(
                "http://localhost:5000/api/upload",
                formData,
                {

                    headers: {
                        "Content-Type": "multipart/form-data"
                    },

                    onUploadProgress: (progressEvent) => {

                        const percent = Math.round(
                            (progressEvent.loaded * 100)
                            / progressEvent.total
                        );

                        progress.style.width = percent + "%";
                    }

                }
            );

            fileItem.querySelector("p:nth-child(3)")
                .innerText = "Status: Complete";

        }
        catch(error){

            fileItem.querySelector("p:nth-child(3)")
                .innerText = "Status: Failed";

        }

    }

});