import {
  saveTodosIntoLocalStorage,
  getTodosIntoLocalStorage,
  getDateRepresentation
} from "./scripts/utils.js"

const addTodoInput = document.querySelector("[data-add-todo-input]")
const addTodoBtn = document.querySelector("[data-add-todo-btn]")
const todosContainer = document.querySelector("[data-todo-container]")
const todoTemplate = document.querySelector("[data-todo-template]")
const searchTodoInput = document.querySelector("[data-search-todo-input]")

let todoList = getTodosIntoLocalStorage();
let filteredTodosList = [];

addTodoBtn.addEventListener("click", () => {
  if (addTodoInput.value.trim()) {
    const newTodo = {
      id: Date.now(),
      text: addTodoInput.value.trim(),
      completed: false,
      createdAt: getDateRepresentation(new Date()),
    }
    todoList.push(newTodo);
    addTodoInput.value = ""
    saveTodosIntoLocalStorage(todoList);
    renderTodos();
  }
})

addTodoInput.addEventListener("input", () => {
  if (searchTodoInput.value.trim()) {
    searchTodoInput.value = ""
    renderTodos()
  }
})

searchTodoInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.trim();

  filterAndRenderFilteredTodos(searchValue)
})

addTodoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodoBtn.click()
  }
})

const filterAndRenderFilteredTodos = (searchValue) => {
  filteredTodosList = todoList.filter((t) => {
    return t.text.includes(searchValue)
  })

  renderFilteredTodos()
}

const createTodoLayout = (todo) => {
  const todoElement = document.importNode(todoTemplate.content, true)

  const checkbox = todoElement.querySelector("[data-todo-checkbox]")
  checkbox.checked = todo.completed

  const todoText = todoElement.querySelector("[data-todo-text]")
  todoText.textContent = todo.text

  const todoCreatedDate = todoElement.querySelector("[data-todo-date]")
  todoCreatedDate.textContent = todo.createdAt

  const removeTodoBtn = todoElement.querySelector("[data-remove-todo-btn]")
  removeTodoBtn.disabled = !todo.completed;

  checkbox.addEventListener("change", (e) => {
    todoList = todoList.map((t) => {
      if (t.id === todo.id) {
        t.completed = e.target.checked
      }
      return t;
    })

    saveTodosIntoLocalStorage(todoList)

    if (searchTodoInput.value.trim()) {
      filterAndRenderFilteredTodos(searchTodoInput.value.trim())

    } else {
      renderTodos()
    }


  })
  removeTodoBtn.addEventListener("click", () => {
    todoList = todoList.filter((t) => {
      if (t.id !== todo.id) {
        return t;
      }
    })

    saveTodosIntoLocalStorage(todoList)

    if (searchTodoInput.value.trim()) {
      filterAndRenderFilteredTodos(searchTodoInput.value.trim())

    } else {
      renderTodos()
    }

  })

  return todoElement
}

const renderFilteredTodos = () => {
  todosContainer.innerHTML = ""

  if (filteredTodosList.length === 0) {
    todosContainer.innerHTML = "<h3>No Todos found...</h3>"
    return;
  }

  filteredTodosList.forEach((todo) => {
    const todoElement = createTodoLayout(todo)
    todosContainer.append(todoElement)
  })
}

const renderTodos = () => {
  todosContainer.innerHTML = ""

  if (todoList.length === 0) {
    todosContainer.innerHTML = "<h3>No Todos...</h3>"
    return;
  }

  todoList.forEach((todo) => {
    const todoElement = createTodoLayout(todo)
    todosContainer.append(todoElement)
  })
}

renderTodos()