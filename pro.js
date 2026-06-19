const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const fileGrid = document.getElementById("fileGrid");
const statusMessage = document.getElementById("statusMessage");
const fileCount = document.getElementById("fileCount");
const totalBooks = document.getElementById("totalBooks");
const totalSize = document.getElementById("totalSize");
const searchInput = document.getElementById("searchInput");
const shareLink = document.getElementById("shareLink");
const copyLinkBtn = document.getElementById("copyLinkBtn");

let library = JSON.parse(localStorage.getItem("studyVault")) || [];

shareLink.value = window.location.href;

copyLinkBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(shareLink.value);
    alert("Link copied!");
});

uploadBtn.addEventListener("click", () => {
    const files = fileInput.files;

    if(files.length === 0){
        statusMessage.textContent = "Please select file(s) first.";
        return;
    }

    Array.from(files).forEach(file => {
        const reader = new FileReader();

        reader.onload = function(e){
            library.push({
                name: file.name,
                size: file.size,
                data: e.target.result
            });

            localStorage.setItem(
                "studyVault",
                JSON.stringify(library)
            );

            renderLibrary();
        };

        reader.readAsDataURL(file);
    });

    statusMessage.textContent =
        `${files.length} file(s) uploaded successfully.`;

    fileInput.value = "";
});

function renderLibrary(searchTerm = ""){
    fileGrid.innerHTML = "";

    const filtered = library.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if(filtered.length === 0){
        fileGrid.innerHTML = `
        <div class="empty-msg">
            <span class="empty-icon">📚</span>
            No materials found.
        </div>`;
    }

    filtered.forEach((file,index) => {

        const card = document.createElement("div");
        card.className = "file-card";

        card.innerHTML = `
            <h4>${file.name}</h4>
            <p>${formatSize(file.size)}</p>

            <div class="file-actions">
                <button onclick="openFile(${index})">
                    Open
                </button>

                <button class="delete-btn"
                onclick="deleteFile(${index})">
                    Delete
                </button>
            </div>
        `;

        fileGrid.appendChild(card);
    });

    updateStats();
}

function updateStats(){
    fileCount.textContent = library.length;
    totalBooks.textContent = library.length;

    let size = library.reduce(
        (sum,file)=>sum + file.size,0
    );

    totalSize.textContent = formatSize(size);
}

function formatSize(bytes){
    if(bytes < 1024){
        return bytes + " B";
    }

    if(bytes < 1024 * 1024){
        return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function openFile(index){
    const file = library[index];

    const link = document.createElement("a");
    link.href = file.data;
    link.target = "_blank";
    link.download = file.name;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function deleteFile(index){
    if(confirm("Delete this file?")){
        library.splice(index,1);

        localStorage.setItem(
            "studyVault",
            JSON.stringify(library)
        );

        renderLibrary();
    }
}

searchInput.addEventListener("input",(e)=>{
    renderLibrary(e.target.value);
});

renderLibrary();