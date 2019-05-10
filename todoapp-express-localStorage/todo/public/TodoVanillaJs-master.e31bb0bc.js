// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/shortid/lib/random/random-from-seed.js":[function(require,module,exports) {
'use strict';

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};

},{}],"node_modules/shortid/lib/alphabet.js":[function(require,module,exports) {
'use strict';

var randomFromSeed = require('./random/random-from-seed');

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

module.exports = {
    get: get,
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};

},{"./random/random-from-seed":"node_modules/shortid/lib/random/random-from-seed.js"}],"node_modules/shortid/lib/random/random-byte-browser.js":[function(require,module,exports) {
'use strict';

var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

var randomByte;

if (!crypto || !crypto.getRandomValues) {
    randomByte = function(size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(Math.floor(Math.random() * 256));
        }
        return bytes;
    };
} else {
    randomByte = function(size) {
        return crypto.getRandomValues(new Uint8Array(size));
    };
}

module.exports = randomByte;

},{}],"node_modules/nanoid/format.js":[function(require,module,exports) {
/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {generator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * const format = require('nanoid/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 * @function
 */
module.exports = function (random, alphabet, size) {
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  var step = Math.ceil(1.6 * mask * size / alphabet.length)

  var id = ''
  while (true) {
    var bytes = random(step)
    for (var i = 0; i < step; i++) {
      var byte = bytes[i] & mask
      if (alphabet[byte]) {
        id += alphabet[byte]
        if (id.length === size) return id
      }
    }
  }
}

/**
 * @callback generator
 * @param {number} bytes The number of bytes to generate.
 * @return {number[]} Random bytes.
 */

},{}],"node_modules/shortid/lib/generate.js":[function(require,module,exports) {
'use strict';

var alphabet = require('./alphabet');
var random = require('./random/random-byte');
var format = require('nanoid/format');

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(random, alphabet.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = generate;

},{"./alphabet":"node_modules/shortid/lib/alphabet.js","./random/random-byte":"node_modules/shortid/lib/random/random-byte-browser.js","nanoid/format":"node_modules/nanoid/format.js"}],"node_modules/shortid/lib/build.js":[function(require,module,exports) {
'use strict';

var generate = require('./generate');
var alphabet = require('./alphabet');

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate(version);
    str = str + generate(clusterWorkerId);
    if (counter > 0) {
        str = str + generate(counter);
    }
    str = str + generate(seconds);
    return str;
}

module.exports = build;

},{"./generate":"node_modules/shortid/lib/generate.js","./alphabet":"node_modules/shortid/lib/alphabet.js"}],"node_modules/shortid/lib/is-valid.js":[function(require,module,exports) {
'use strict';
var alphabet = require('./alphabet');

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

module.exports = isShortId;

},{"./alphabet":"node_modules/shortid/lib/alphabet.js"}],"node_modules/shortid/lib/util/cluster-worker-id-browser.js":[function(require,module,exports) {
'use strict';

module.exports = 0;

},{}],"node_modules/shortid/lib/index.js":[function(require,module,exports) {
'use strict';

var alphabet = require('./alphabet');
var build = require('./build');
var isValid = require('./is-valid');

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = require('./util/cluster-worker-id') || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;

},{"./alphabet":"node_modules/shortid/lib/alphabet.js","./build":"node_modules/shortid/lib/build.js","./is-valid":"node_modules/shortid/lib/is-valid.js","./util/cluster-worker-id":"node_modules/shortid/lib/util/cluster-worker-id-browser.js"}],"node_modules/shortid/index.js":[function(require,module,exports) {
'use strict';
module.exports = require('./lib/index');

},{"./lib/index":"node_modules/shortid/lib/index.js"}],"index.js":[function(require,module,exports) {
var shortid = require('shortid');

var addTaskItemInput = document.querySelector('.additem-input');
var listContainer = document.querySelector('.list-container');
var filterContainer = document.querySelector('.filter');
var overlay = document.querySelector('.overlay');
var tabActiveContent = '';
var itemCount = 0;
var activeTabElement;
var activeModalId;

var createDomElement = function createDomElement(tag) {
  return document.createElement(tag);
};

var setElementAttibutes = function setElementAttibutes(element, attributes) {
  Object.keys(attributes).forEach(function (key) {
    element.setAttribute(key, attributes[key]);
  });
  return element;
};

var appendMultipleChild = function appendMultipleChild() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var parent = args.shift();
  args.forEach(function (element) {
    parent.appendChild(element);
  });
};

var onCheckBoxClick = function onCheckBoxClick(e) {
  var taskCheckBox = e.currentTarget;
  var taskList = taskCheckBox.parentNode;
  var taskPara = taskCheckBox.nextElementSibling;
  var taskTickButton = taskCheckBox.querySelector('.list__tick');

  if (taskCheckBox.dataset.checked === 'true') {
    taskCheckBox.dataset.checked = 'false'; // active task

    editLocalStorageItem(taskList.id, 'checked', 'false');
    if (tabActiveContent === 'Completed') filter(null, 'Completed', true);
  } else {
    taskCheckBox.dataset.checked = 'true';
    editLocalStorageItem(taskList.id, 'checked', 'true');
    if (tabActiveContent === 'Active') filter(null, 'Active', true);
  }

  taskPara.classList.toggle('taskdone');
  taskTickButton.classList.toggle('hide');
};

var filter = function filter(e, text) {
  var artificialClick = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var buttonContent = text || e.target.textContent; // for preventing  handler executing clicks on filterContainer

  if (!text && !e.target.classList.contains('filter__item')) return;
  tabActiveContent = buttonContent;
  var childrenArray = Array.from(listContainer.children);

  if (!artificialClick) {
    if (activeTabElement) activeTabElement.classList.remove('tabstyle');
    e.target.classList.add('tabstyle');
    activeTabElement = e.target;
  }

  switch (buttonContent) {
    case 'All':
      for (var _i = 0, _childrenArray = childrenArray; _i < _childrenArray.length; _i++) {
        var item = _childrenArray[_i];

        if (item.classList.contains('hide')) {
          item.classList.remove('hide');
        }
      }

      break;

    case 'Active':
      for (var _i2 = 0, _childrenArray2 = childrenArray; _i2 < _childrenArray2.length; _i2++) {
        var _item = _childrenArray2[_i2];

        var checkBox = _item.querySelector('.list__checkbox');

        if (checkBox.dataset.checked === 'true') {
          _item.classList.add('hide');
        } else {
          _item.classList.remove('hide');
        }
      }

      break;

    case 'Completed':
      for (var _i3 = 0, _childrenArray3 = childrenArray; _i3 < _childrenArray3.length; _i3++) {
        var _item2 = _childrenArray3[_i3];

        var _checkBox = _item2.querySelector('.list__checkbox');

        if (_checkBox.dataset.checked === 'false') {
          _item2.classList.add('hide');
        } else {
          _item2.classList.remove('hide');
        }
      }

      break;
  }
};

var createTickButton = function createTickButton(elem, checked) {
  var tickButton = createDomElement('div');
  tickButton.innerHTML = '&#10003';

  if (checked === 'true') {
    tickButton.setAttribute('class', 'list__tick');
  } else {
    tickButton.setAttribute('class', 'list__tick hide');
  }

  elem.appendChild(tickButton);
};

var editLocalStorageItem = function editLocalStorageItem(id, property, value) {
  var tasksObj = JSON.parse(localStorage.getItem('tasks'));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tasksObj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item.id === id) {
        item[property] = value;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasksObj));
};

var addLocalStorageItem = function addLocalStorageItem(item) {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([item]));
    return;
  }

  var taskObj = JSON.parse(localStorage.getItem('tasks'));
  taskObj.push(item);
  localStorage.setItem('tasks', JSON.stringify(taskObj));
};

var deleteLocalStorageItem = function deleteLocalStorageItem(id) {
  var taskObj = JSON.parse(localStorage.getItem('tasks'));
  var newTaskObj = taskObj.filter(function (item) {
    return item.id !== id;
  });
  localStorage.setItem('tasks', JSON.stringify(newTaskObj));
};

var saveHelper = function saveHelper(editInput, prevText, taskItem, flag) {
  var taskCheckBox = taskItem.querySelector('.list__checkbox');
  var taskDelete = taskItem.querySelector('.list__deleteButton');
  var taskPara = taskItem.querySelector('.list__task');
  var taskNoteButton = taskItem.querySelector('.note');
  taskPara.innerText = editInput.value;
  if (flag === 1) taskPara.innerText = prevText;
  editLocalStorageItem(taskItem.id, 'text', taskPara.innerText);
  taskPara.classList.toggle('hide');
  taskDelete.classList.toggle('hide');
  taskCheckBox.classList.toggle('hide');
  taskNoteButton.classList.toggle('hide');
  taskItem.removeChild(editInput);
};

var SaveAfterEdit = function SaveAfterEdit(e, prevText, editInput) {
  var element = e.target.closest('.list__edit');
  var flag = 0;
  if (element) return;
  if (editInput.value.trim() === '') flag = 1;
  var taskItem = editInput.parentNode;
  if (!taskItem) return;
  saveHelper(editInput, prevText, taskItem, flag);
};

var afterEdit = function afterEdit(e, prevText) {
  var flag = 0;
  if (e.key !== 'Enter') return;
  var editInput = e.target;
  if (editInput.value.trim() === '') flag = 1;
  var taskItem = editInput.parentNode;
  saveHelper(editInput, prevText, taskItem, flag);
};

var editItem = function editItem(e) {
  if (e.target.tagName !== 'P') return;
  var taskList = e.target.parentNode;
  var taskPara = e.target;
  var taskCheckBox = taskList.querySelector('.list__checkbox');
  var taskDelete = taskList.querySelector('.list__deleteButton');
  var taskNoteButton = taskList.querySelector('.note');
  taskPara.classList.toggle('hide');
  taskDelete.classList.toggle('hide');
  taskCheckBox.classList.toggle('hide');
  taskNoteButton.classList.toggle('hide');
  var editInput = createDomElement('input');
  setElementAttibutes(editInput, {
    class: 'list__edit',
    value: taskPara.innerText,
    type: 'text'
  });
  taskList.appendChild(editInput);
  editInput.focus();
  var val = editInput.value; // store the value of the element

  editInput.value = ''; // clear the value of the element

  editInput.value = val;
  editInput.addEventListener('keydown', function (e) {
    return afterEdit(e, val);
  });
  document.addEventListener('click', function (e) {
    return SaveAfterEdit(e, val, editInput);
  });
};

var editNote = function editNote(e) {
  var modal = e.target.parentNode;
  var editButton = e.target;
  var saveButton = modal.querySelector('.modal__saveButton');
  var textAreaElement = modal.querySelector('.modal__textarea');
  var modalPara = modal.querySelector('.modal__text');
  textAreaElement.classList.remove('hide');
  textAreaElement.focus();
  textAreaElement.value = '';
  textAreaElement.value = modalPara.textContent;
  saveButton.classList.remove('hide');
  modalPara.classList.add('hide');
  editButton.classList.add('hide');
};

var saveNote = function saveNote(e) {
  var modal = e.target.parentNode;
  var taskItem = modal.parentNode.parentNode;
  var saveButton = e.target;
  var editButton = modal.querySelector('.modal__editButton');
  var textAreaElement = modal.querySelector('.modal__textarea');
  var modalPara = modal.querySelector('.modal__text');
  if (textAreaElement.value.trim() === '') return;
  modalPara.textContent = textAreaElement.value;
  editLocalStorageItem(taskItem.id, 'note', modalPara.textContent);
  textAreaElement.classList.add('hide');
  saveButton.classList.add('hide');
  modalPara.classList.remove('hide');
  editButton.classList.remove('hide');
};

var openNoteModal = function openNoteModal(e) {
  var noteButton = e.target; // to prevent event handler from executing clicks from its children

  if (!e.target.classList.contains('note')) return;
  var modal = noteButton.querySelector('.modal');
  activeModalId = modal.id;
  modal.classList.remove('hide');
  var textarea = modal.querySelector('.modal__textarea');
  if (!textarea.classList.contains('hide')) textarea.focus();
  overlay.classList.remove('hide');
};

var addNoteModalContent = function addNoteModalContent(noteModal, noteContent) {
  var textAreaClass = '',
      saveClass = '',
      paraClass = '',
      editClass = '';

  if (noteContent === '') {
    paraClass = 'hide';
    editClass = 'hide';
  } else {
    textAreaClass = 'hide';
    saveClass = 'hide';
  }

  var modalTextArea = createDomElement('textarea');
  modalTextArea.setAttribute('class', "modal__textarea ".concat(textAreaClass));
  var saveButton = createDomElement('button');
  saveButton.setAttribute('class', "modal__button modal__saveButton ".concat(saveClass));
  saveButton.textContent = 'SAVE';
  saveButton.addEventListener('click', saveNote);
  var editButton = createDomElement('button');
  editButton.setAttribute('class', "modal__button modal__editButton ".concat(editClass));
  editButton.textContent = 'EDIT';
  editButton.addEventListener('click', editNote);
  var modalTextPara = createDomElement('p');
  if (noteContent !== '') modalTextPara.textContent = noteContent;
  modalTextPara.setAttribute('class', "modal__text ".concat(paraClass));
  appendMultipleChild(noteModal, modalTextArea, modalTextPara, saveButton, editButton);
};

var createNoteModal = function createNoteModal(noteContent) {
  var noteModal = createDomElement('div');
  noteModal.setAttribute('class', 'modal hide');
  noteModal.setAttribute('id', shortid.generate());
  addNoteModalContent(noteModal, noteContent);
  return noteModal;
};

var createNoteButton = function createNoteButton(noteContent) {
  var noteButton = createDomElement('div');
  noteButton.setAttribute('class', 'note');
  noteButton.innerText = '+';
  noteButton.addEventListener('click', openNoteModal);
  var noteModal = createNoteModal(noteContent);
  noteButton.appendChild(noteModal);
  return noteButton;
};

var createTaskCheckBox = function createTaskCheckBox(taskObj) {
  var taskCheckBox = createDomElement('div');
  taskCheckBox.dataset.checked = taskObj.checked;
  setElementAttibutes(taskCheckBox, {
    class: 'list__checkbox'
  });
  createTickButton(taskCheckBox, taskObj.checked);
  taskCheckBox.addEventListener('click', onCheckBoxClick);
  return taskCheckBox;
};

var createTaskPara = function createTaskPara(taskObj) {
  var taskPara = createDomElement('p');
  taskPara.innerText = taskObj.text;
  var taskParaClass = 'list__task';
  if (taskObj.checked === 'true') taskParaClass += ' taskdone';
  setElementAttibutes(taskPara, {
    class: taskParaClass
  });
  return taskPara;
};

var createTaskDeleteButton = function createTaskDeleteButton(taskItem) {
  var deleteButton = createDomElement('div');
  deleteButton.innerHTML = '&#9747';
  setElementAttibutes(deleteButton, {
    class: 'list__deleteButton'
  });
  deleteButton.addEventListener('click', function () {
    deleteLocalStorageItem(taskItem.id);
    listContainer.removeChild(taskItem);
    itemCount--;

    if (itemCount === 0) {
      filterContainer.classList.add('hide');
    }
  });
  return deleteButton;
};

var createTaskElement = function createTaskElement(taskObj) {
  var taskItem = createDomElement('li');
  setElementAttibutes(taskItem, {
    class: 'list',
    id: taskObj.id
  });
  var taskCheckBox = createTaskCheckBox(taskObj);
  var taskPara = createTaskPara(taskObj);
  var deleteButton = createTaskDeleteButton(taskItem);
  var noteButton = createNoteButton(taskObj.note);
  taskItem.addEventListener('dblclick', editItem);
  appendMultipleChild(taskItem, taskCheckBox, taskPara, noteButton, deleteButton);
  listContainer.appendChild(taskItem);
  itemCount++;

  if (filterContainer.classList.contains('hide')) {
    filterContainer.classList.remove('hide');
  }
};

var addTaskItem = function addTaskItem(e) {
  if (e.key !== 'Enter') return;
  var text = addTaskItemInput.value;
  if (text.trim() === '') return;
  addTaskItemInput.value = '';
  var taskObj = {
    text: text,
    checked: 'false',
    id: shortid.generate(),
    note: ''
  };
  createTaskElement(taskObj); // item is added when completed tab is active

  if (tabActiveContent === 'Completed') filter(null, 'Completed', true);
  addLocalStorageItem(taskObj);
};

var removeModal = function removeModal(e) {
  var modal = document.getElementById(activeModalId);
  var overlay = e.target;
  modal.classList.add('hide');
  overlay.classList.add('hide');
};

var addItemsFromLocalStorage = function addItemsFromLocalStorage() {
  if (!localStorage.getItem('tasks')) return;
  var taskItems = JSON.parse(localStorage.getItem('tasks'));
  taskItems.forEach(function (task) {
    return createTaskElement(task);
  });
};

addItemsFromLocalStorage();
overlay.addEventListener('click', removeModal);
filterContainer.addEventListener('click', filter);
addTaskItemInput.addEventListener('keydown', addTaskItem);
},{"shortid":"node_modules/shortid/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51353" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/TodoVanillaJs-master.e31bb0bc.js.map