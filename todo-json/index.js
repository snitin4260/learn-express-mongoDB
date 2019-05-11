const shortid = require('shortid')
const addTaskItemInput = document.querySelector('.additem-input')
const listContainer = document.querySelector('.list-container')
const filterContainer = document.querySelector('.filter')
const overlay = document.querySelector('.overlay')
let tabActiveContent = ''
let itemCount = 0
let activeTabElement
let activeModalId

const createDomElement = tag => document.createElement(tag)

const setElementAttibutes = (element, attributes) => {
  Object.keys(attributes).forEach(key => {
    element.setAttribute(key, attributes[key])
  })
  return element
}

const appendMultipleChild = (...args) => {
  const parent = args.shift()
  args.forEach(element => {
    parent.appendChild(element)
  })
}

const onCheckBoxClick = e => {
  let taskCheckBox = e.currentTarget;
  let taskList = taskCheckBox.parentNode;
  let taskPara = taskCheckBox.nextElementSibling;
  let taskTickButton = taskCheckBox.querySelector(".list__tick");
  if (taskCheckBox.dataset.checked === "true") {
    editDataInServer([taskList.id, "checked", "false"]).then(() => {
      taskCheckBox.dataset.checked = "false"; // active task
      if (tabActiveContent === "Completed") filter(null, "Completed", true);
      taskPara.classList.toggle("taskdone");
      taskTickButton.classList.toggle("hide");
    });
  } else {
    editDataInServer([taskList.id, "checked", "true"]).then(() => {
      taskCheckBox.dataset.checked = "true";
      if (tabActiveContent === "Active") filter(null, "Active", true);
      taskPara.classList.toggle("taskdone");
      taskTickButton.classList.toggle("hide");
    });
  }
};

const filter = (e, text, artificialClick = false) => {
  let buttonContent = text || e.target.textContent
  // for preventing  handler executing clicks on filterContainer
  if (!text && !e.target.classList.contains('filter__item')) return
  tabActiveContent = buttonContent
  let childrenArray = Array.from(listContainer.children)
  if (!artificialClick) {
    if (activeTabElement) activeTabElement.classList.remove('tabstyle')
    e.target.classList.add('tabstyle')
    activeTabElement = e.target
  }
  switch (buttonContent) {
    case 'All':
      for (let item of childrenArray) {
        if (item.classList.contains('hide')) {
          item.classList.remove('hide')
        }
      }
      break
    case 'Active':
      for (let item of childrenArray) {
        let checkBox = item.querySelector('.list__checkbox')
        if (checkBox.dataset.checked === 'true') {
          item.classList.add('hide')
        } else {
          item.classList.remove('hide')
        }
      }
      break
    case 'Completed':
      for (let item of childrenArray) {
        let checkBox = item.querySelector('.list__checkbox')
        if (checkBox.dataset.checked === 'false') {
          item.classList.add('hide')
        } else {
          item.classList.remove('hide')
        }
      }
      break
  }
}

const createTickButton = (elem, checked) => {
  let tickButton = createDomElement('div')
  tickButton.innerHTML = '&#10003'
  if (checked === 'true') {
    tickButton.setAttribute('class', 'list__tick')
  } else {
    tickButton.setAttribute('class', 'list__tick hide')
  }
  elem.appendChild(tickButton)
}

const saveHelper = (editInput, prevText, taskItem, flag) => {
  const taskCheckBox = taskItem.querySelector('.list__checkbox')
  const taskDelete = taskItem.querySelector('.list__deleteButton')
  const taskPara = taskItem.querySelector('.list__task')
  const taskNoteButton = taskItem.querySelector('.note')
  let paraText = editInput.value
  if (flag === 1) paraText = prevText;
  editDataInServer([taskItem.id, 'text', paraText]).then(()=>{
      taskPara.innerText = paraText;
      taskPara.classList.toggle("hide");
      taskDelete.classList.toggle("hide");
      taskCheckBox.classList.toggle("hide");
      taskNoteButton.classList.toggle("hide");
      taskItem.removeChild(editInput);
  })

}

const SaveAfterEdit = (e, prevText, editInput) => {
  let element = e.target.closest('.list__edit')
  let flag = 0
  if (element) return
  if (editInput.value.trim() === '') flag = 1
  const taskItem = editInput.parentNode
  if (!taskItem) return
  saveHelper(editInput, prevText, taskItem, flag)
}

const afterEdit = (e, prevText) => {
  let flag = 0
  if (e.key !== 'Enter') return
  const editInput = e.target
  if (editInput.value.trim() === '') flag = 1
  const taskItem = editInput.parentNode
  saveHelper(editInput, prevText, taskItem, flag)
}

const editItem = e => {
  if (e.target.tagName !== 'P') return
  const taskList = e.target.parentNode
  const taskPara = e.target
  const taskCheckBox = taskList.querySelector('.list__checkbox')
  const taskDelete = taskList.querySelector('.list__deleteButton')
  const taskNoteButton = taskList.querySelector('.note')
  taskPara.classList.toggle('hide')
  taskDelete.classList.toggle('hide')
  taskCheckBox.classList.toggle('hide')
  taskNoteButton.classList.toggle('hide')
  const editInput = createDomElement('input')
  setElementAttibutes(editInput, {
    class: 'list__edit',
    value: taskPara.innerText,
    type: 'text'
  })

  taskList.appendChild(editInput)
  editInput.focus()
  let val = editInput.value // store the value of the element
  editInput.value = '' // clear the value of the element
  editInput.value = val
  editInput.addEventListener('keydown', e => afterEdit(e, val))
  document.addEventListener('click', e => SaveAfterEdit(e, val, editInput))
}

const editNote = e => {
  const modal = e.target.parentNode
  const editButton = e.target
  const saveButton = modal.querySelector('.modal__saveButton')
  const textAreaElement = modal.querySelector('.modal__textarea')
  const modalPara = modal.querySelector('.modal__text')
  textAreaElement.classList.remove('hide')
  textAreaElement.focus()
  textAreaElement.value = ''
  textAreaElement.value = modalPara.textContent
  saveButton.classList.remove('hide')
  modalPara.classList.add('hide')
  editButton.classList.add('hide')
}

const saveNote = e => {
  const modal = e.target.parentNode
  const taskItem = modal.parentNode.parentNode
  const saveButton = e.target
  const editButton = modal.querySelector('.modal__editButton')
  const textAreaElement = modal.querySelector('.modal__textarea')
  const modalPara = modal.querySelector('.modal__text')
  if (textAreaElement.value.trim() === '') return
  
  editDataInServer([taskItem.id, "note", textAreaElement.value])
    .then(() => {
      modalPara.textContent = textAreaElement.value;
      textAreaElement.classList.add("hide");
      saveButton.classList.add("hide");
      modalPara.classList.remove("hide");
      editButton.classList.remove("hide");
    })
    .catch(e => {
      alert("Could not edit note. Please retry");
    });

}

const openNoteModal = e => {
  const noteButton = e.target
  // to prevent event handler from executing clicks from its children
  if (!e.target.classList.contains('note')) return
  const modal = noteButton.querySelector('.modal')
  activeModalId = modal.id
  modal.classList.remove('hide')
  const textarea = modal.querySelector('.modal__textarea')
  if (!textarea.classList.contains('hide')) textarea.focus()
  overlay.classList.remove('hide')
}

const addNoteModalContent = (noteModal, noteContent) => {
  let [textAreaClass, saveClass, paraClass, editClass] = ['', '', '', '']
  if (noteContent === '') {
    paraClass = 'hide'
    editClass = 'hide'
  } else {
    textAreaClass = 'hide'
    saveClass = 'hide'
  }
  const modalTextArea = createDomElement('textarea')
  modalTextArea.setAttribute('class', `modal__textarea ${textAreaClass}`)
  const saveButton = createDomElement('button')
  saveButton.setAttribute(
    'class',
    `modal__button modal__saveButton ${saveClass}`
  )
  saveButton.textContent = 'SAVE'
  saveButton.addEventListener('click', saveNote)
  const editButton = createDomElement('button')
  editButton.setAttribute(
    'class',
    `modal__button modal__editButton ${editClass}`
  )
  editButton.textContent = 'EDIT'
  editButton.addEventListener('click', editNote)
  const modalTextPara = createDomElement('p')
  if (noteContent !== '') modalTextPara.textContent = noteContent
  modalTextPara.setAttribute('class', `modal__text ${paraClass}`)
  appendMultipleChild(
    noteModal,
    modalTextArea,
    modalTextPara,
    saveButton,
    editButton
  )
}

const createNoteModal = noteContent => {
  const noteModal = createDomElement('div')
  noteModal.setAttribute('class', 'modal hide')
  noteModal.setAttribute('id', shortid.generate())
  addNoteModalContent(noteModal, noteContent)
  return noteModal
}

const createNoteButton = noteContent => {
  const noteButton = createDomElement('div')
  noteButton.setAttribute('class', 'note')
  noteButton.innerText = '+'
  noteButton.addEventListener('click', openNoteModal)
  const noteModal = createNoteModal(noteContent)
  noteButton.appendChild(noteModal)
  return noteButton
}

const createTaskCheckBox = taskObj => {
  const taskCheckBox = createDomElement('div')
  taskCheckBox.dataset.checked = taskObj.checked
  setElementAttibutes(taskCheckBox, {
    class: 'list__checkbox'
  })
  createTickButton(taskCheckBox, taskObj.checked)
  taskCheckBox.addEventListener('click', onCheckBoxClick)
  return taskCheckBox
}

const createTaskPara = taskObj => {
  const taskPara = createDomElement('p')
  taskPara.innerText = taskObj.text
  let taskParaClass = 'list__task'
  if (taskObj.checked === 'true') taskParaClass += ' taskdone'
  setElementAttibutes(taskPara, {
    class: taskParaClass
  })
  return taskPara
}

const createTaskDeleteButton = taskItem => {
  const deleteButton = createDomElement('div')
  deleteButton.innerHTML = '&#9747'
  setElementAttibutes(deleteButton, {
    class: 'list__deleteButton'
  })
  deleteButton.addEventListener('click', () => {
    deleteFromServer(taskItem.id).then(() => {
      listContainer.removeChild(taskItem)
      itemCount--
      if (itemCount === 0) {
        filterContainer.classList.add('hide')
      }
    }).catch((e)=> {
      alert(`delete failed ${e}`)
    })
  })
  return deleteButton
}

const createTaskElement = taskObj => {
  const taskItem = createDomElement('li')
  setElementAttibutes(taskItem, {
    class: 'list',
    id: taskObj.id
  })
  const taskCheckBox = createTaskCheckBox(taskObj)
  const taskPara = createTaskPara(taskObj)
  const deleteButton = createTaskDeleteButton(taskItem)
  const noteButton = createNoteButton(taskObj.note)
  taskItem.addEventListener('dblclick', editItem)
  appendMultipleChild(
    taskItem,
    taskCheckBox,
    taskPara,
    noteButton,
    deleteButton
  )
  listContainer.appendChild(taskItem)
  itemCount++
  if (filterContainer.classList.contains('hide')) {
    filterContainer.classList.remove('hide')
  }
}

const addTaskItem = e => {
  if (e.key !== 'Enter') return
  let text = addTaskItemInput.value
  if (text.trim() === '') return
  addTaskItemInput.value = ''
  const taskObj = { text, checked: 'false', id: shortid.generate(), note: '' }

  addItemToServer(taskObj).then(() => {
    createTaskElement(taskObj)
    // item is added when completed tab is active
    if (tabActiveContent === 'Completed') filter(null, 'Completed', true)
  }).catch((e) => alert(`add task failed with error ${e}`))
}

const removeModal = e => {
  const modal = document.getElementById(activeModalId)
  const overlay = e.target
  modal.classList.add('hide')
  overlay.classList.add('hide')
}

const editDataInServer = arr => {
  return fetch('data/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(arr)
  })
}

const addItemToServer = taskObj => {
  return fetch('/data/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskObj)
  })
}

const deleteFromServer = id => {
  return fetch('/data/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  })
}

const getDataFromServer = () => {
  return fetch('/data')
}

getDataFromServer()
  .then(resp => resp.json())
  .then(file => {
    let data = file.data;
    data.forEach(task => createTaskElement(task));
  });

overlay.addEventListener('click', removeModal)
filterContainer.addEventListener('click', filter)
addTaskItemInput.addEventListener('keydown', addTaskItem)
