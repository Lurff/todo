const todoList = document.getElementById("todo-list");
const todoInput = document.getElementById("todo-input");
const todoButton = document.getElementById("todo-button");
const todoFilter = document.getElementById("todo-filter");
const container = document.getElementById("container")

const getTodosFromStorage = () => {
    const storage = JSON.parse(localStorage.getItem("todos"))
    return (storage) ? storage : []
}

const getDonesFromStorage = () => {
    const storage = JSON.parse(localStorage.getItem("dones"))
    return (storage) ? storage : []
}

const todos = getTodosFromStorage()
const dones = getDonesFromStorage()

const getTodosToPage = () => {
    todos.forEach(todo => {
        createTodoItem(todo.text)
    })
}

const getDonesToPage = () => {
    dones.forEach(done => {
        createDoneItem(done.text)
    })
}

const saveTodoStorage = (todo,timestamps) => {

    const todoObj = {
        text: todo,
        time: timestamps
    }

    todos.push(todoObj)
    localStorage.setItem("todos",JSON.stringify(todos))
    createTodoItem(todo)
}

todoButton.addEventListener("click",() => {
    const input = todoInput.value;
    if (input) toggleTimeSettings(input) 
    todoInput.value = "";
})

const toggleTimeSettings = (input) => {

    const suAn = new Date();
    const ay = suAn.getMonth() + 1;   
    const gun = suAn.getDate();
    const yil = suAn.getFullYear();
    const saat = suAn.getHours();
    const dakika = suAn.getMinutes();

    const an = `${yil}-${ay}-${gun}T${saat}:${dakika}`

    const timedDiv = document.createElement("div")
    timedDiv.classList.add("timeDiv")
    timedDiv.id = "timeDiv"

    const title = document.createElement("h1")
    title.classList.add("timeTitle")
    title.textContent = "Zamanı Ayarla"

    const description = document.createElement("span")
    description.textContent = "Ayarladığınız saatte sizin için bir bildirim sesi çalıcaktır."

    const timeInput = document.createElement("div")
    timeInput.classList.add("timeInput")

    const toggleTimeInput = document.createElement("input")
    toggleTimeInput.type = "datetime-local"
    toggleTimeInput.id = "time"
    toggleTimeInput.min = `${an}`
    toggleTimeInput.required = true

    const timeSubmitButton = document.createElement("button")
    timeSubmitButton.id = "timeButton"
    timeSubmitButton.textContent = "Gönder"

    timeSubmitButton.addEventListener("click", () => {
        doneTime(input, toggleTimeInput.value)
    })

    timeInput.appendChild(toggleTimeInput)
    timeInput.appendChild(timeSubmitButton)

    timedDiv.appendChild(title)
    timedDiv.appendChild(description)
    timedDiv.appendChild(timeInput)

    container.appendChild(timedDiv)
}

const doneTime = (input, timestamps) => {

    if (timestamps == "") return;
    else {
        document.getElementById("timeDiv").remove()
        const time = new Date(timestamps).getTime()
        saveTodoStorage(input, time)
    }
}

const checkTime = () => {
    const currentDate = new Date().toLocaleString()
    
    todos.forEach(async todo => {

        const selectedDate = new Date(todo.time).toLocaleString()

        if(currentDate == selectedDate) await playNotifications()

    })
}

setInterval(checkTime, 1000)

const playNotifications = async () => {
    const song = new Audio(`./sound.mp3`)
    await song.play()
}

todoInput.addEventListener("keyup",(event) => {
    if(event.keyCode == 13) todoButton.click()
})

window.addEventListener("load",() => {
    getTodosToPage()
    getDonesToPage()
})

const removeTodo = (target) => {
    const todo = target.parentNode.childNodes[0].innerHTML;
    removeTodoFromStorage(todo);

    target.parentNode.classList.add("animate__animated","animate__slideOutLeft","animate__faster")

    target.parentNode.addEventListener("animationend",() => {
        target.parentNode.remove()
    })
}

const removeTodoFromStorage = (todo) => {
    const index = todos.indexOf(todo)
    if(index == -1) {
        todos.splice(index, 1)
        localStorage.setItem("todos",JSON.stringify(todos))
    }
}

const removeDoneFromStorage = (done) => {
    const index = dones.indexOf(done)

    if(index == -1) {
        dones.splice(index, 1)
        localStorage.setItem("dones",JSON.stringify(dones))
    }
}

const checkTodo = (target) => {
    const todo = target.parentNode.childNodes[0].innerHTML;
    moveTodoToDone(todo,target)
}

const moveTodoToDone = (todo,target) => {
    removeTodoFromStorage(todo)
    dones.push(todo)
    localStorage.setItem("dones",JSON.stringify(dones))
    makeItDone(target)
}

const moveDoneToTodos = (done,target) => {
    removeDoneFromStorage(done)
    todos.push(done)
    localStorage.setItem("todos",JSON.stringify(todos))
    makeItTodo(target)
}

const makeItDone = (target) => {
    const done = target.parentNode.classList.add("done")
    target.parentNode.classList.remove("todo")
    target.parentNode.childNodes[2].setAttribute("onclick","removeDone(this)")
    target.className = ""
    target.classList.add("fas","fa-check-square")
    target.setAttribute("onclick","unCheckDone(this)")
}

const makeItTodo = (target) => {
    target.parentNode.classList.remove("done")
    target.parentNode.classList.add("todo")
    target.parentNode.childNodes[2].setAttribute("onclick","removeTodo(this)")
    target.className = ""
    target.classList.add("far","fa-square")
    target.setAttribute("onclick","checkTodo(this)")
}

const unCheckDone = (target) => {
    const done = target.parentNode.childNodes[0].innerHTML;
    moveDoneToTodos(done,target)
}

const removeDone = (target) => {
    const done = target.parentNode.childNodes[0].innerHTML;

    removeDoneFromStorage(done)
    target.parentNode.classList.add("animate__animated","animate__slideOutLeft","animate__faster")

    target.parentNode.addEventListener("animationend",() => {
        target.parentNode.remove()
    })
}

const createTodoItem = (text) => {
    const todoItem = document.createElement("div")
    todoItem.classList.add("todo-item","todo")

    const todoItemLi = document.createElement("li")
    todoItemLi.innerHTML = text;

    const todoItemCheck = document.createElement("i")
    todoItemCheck.classList.add("far","fa-square")
    todoItemCheck.setAttribute("onclick","checkTodo(this)");

    const todoItemRemove = document.createElement("i")
    todoItemRemove.classList.add("fas","fa-trash-alt")
    todoItemRemove.setAttribute("onclick","removeTodo(this)")
    todoItem.appendChild(todoItemLi)
    todoItem.appendChild(todoItemCheck)
    todoItem.appendChild(todoItemRemove)
    todoList.appendChild(todoItem)
}

const createDoneItem = (text) => {
    const todoItem = document.createElement("div")
    todoItem.classList.add("todo-item","done")

    const todoItemLi = document.createElement("li")
    todoItemLi.innerHTML = text;

    const todoItemCheck = document.createElement("i")
    todoItemCheck.classList.add("fas","fa-check-square")
    todoItemCheck.setAttribute("onclick","unCheckDone(this)");

    const todoItemRemove = document.createElement("i")
    todoItemRemove.classList.add("fas","fa-trash-alt")
    todoItemRemove.setAttribute("onclick","removeDone(this)")
    todoItem.appendChild(todoItemLi)
    todoItem.appendChild(todoItemCheck)
    todoItem.appendChild(todoItemRemove)
    todoList.appendChild(todoItem)
}

todoFilter.addEventListener("click", () => {
    todoList.dataset.filter = (parseInt(todoList.dataset.filter) +1) %3

    listFilter()
})

const listFilter = () => {
    const items = todoList.getElementsByClassName("todo-item")
    let array = [].map.call(items, item => item)
    const filter = todoList.dataset.filter;
    array.forEach(item => {
        switch(filter) {
            case "0":
                todoFilter.className = ""
                todoFilter.classList.add("far","fa-square")
                item.style.display = "flex"
                break;
            case "1":
                todoFilter.className = ""
                todoFilter.classList.add("fas","fa-square")
                if(item.classList.contains("done")) item.style.display = "none"
                else item.style.display = "flex"
                break;
            case "2":
                todoFilter.className = ""
                todoFilter.classList.add("fas","fa-check-square")
                if(item.classList.contains("todo")) item.style.display = "none"
                else item.style.display = "flex"
                break;
            default:
        }
    })
}