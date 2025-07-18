const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});


function addTask() {
    if (inputBox.value === '') {
        alert("Debes escribir algo");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        li.setAttribute("draggable", "true"); // Hacer draggable
        li.classList.add("draggable"); 

        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        addDnDHandlers(li); 
    }
    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");

    // Reaplicar drag & drop a elementos recuperados
    const items = listContainer.querySelectorAll("li");
    items.forEach(item => {
        item.setAttribute("draggable", "true");
        addDnDHandlers(item);
    });
}
showTask();

// Drag and Drop
function addDnDHandlers(item) {
    item.addEventListener("dragstart", function (e) {
        draggedItem = this;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", this.outerHTML);
        this.classList.add("dragging");
    });

    item.addEventListener("dragend", function () {
        this.classList.remove("dragging");
        draggedItem = null;
        saveData(); // Guardar nueva posición
    });

    item.addEventListener("dragover", function (e) {
        e.preventDefault();
        this.classList.add("drag-over");
    });

    item.addEventListener("dragleave", function () {
        this.classList.remove("drag-over");
    });

    item.addEventListener("drop", function (e) {
        e.preventDefault();
        this.classList.remove("drag-over");

        if (draggedItem !== this) {
            // Insertar el ítem antes o después según posición
            const bounding = this.getBoundingClientRect();
            const offset = e.clientY - bounding.top;

            if (offset > bounding.height / 2) {
                this.after(draggedItem);
            } else {
                this.before(draggedItem);
            }

            saveData(); // Guardar nueva estructura
        }
    });
}
