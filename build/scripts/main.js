'use strict';

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");

    function changeLocalStorage(storageKeyName, value) {
        localStorage.setItem(storageKeyName, JSON.stringify(value));
    }

    const TASK_STATUS = {
        default: 'pending',
        hold: 'hold',
        done: 'done',
        edit: 'edit',
        notFound: 'notFound',
    };

    let demoTaskList = [
        {
            id: 1,
            title: 'Go to the shop',
            description: `Need to buy: \n\t1. Bread \n\t2. Eggs \n\t3. Milk \n\t4. Cookies`,
            status: TASK_STATUS.default,
            found: true,
        },
        {
            id: 2,
            title: 'Go to the work',
            description: `1. Pretend you work \n2. Try not to fall asleep before dinner \n3. Ask to increase your salary \n4. In any case, leave the office an hour earlier`,
            status: TASK_STATUS.default,
            found: true,
        },
    ];

    if (localStorage.getItem('storageTaskList') === null) {
        changeLocalStorage('storageTaskList', demoTaskList);
    }

// Task manager object __________________________________________________________________________
    const taskManager = {

        storageTaskList: JSON.parse(localStorage.getItem('storageTaskList')),

        taskTemplate(taskId, title, desc, status) {
            return ` <div data-id="${taskId}" class="task-container__item">
                <div class="task task_${status}">
                    <div class="task__status task__status_${status}">${status}</div>
                    <div class="task__content">
                        <h4 class="task__title">${title}</h4>
                        <p class="task__desc">${desc}</p>
                    </div>

                    <div class="task__control">
                        <button class="main-btn main-btn_edit">
                            <span class="task__btn-sign">Edit</span> 
                            <i class="icon icon-edit"></i>
                        </button>
                        <button class="main-btn main-btn_delete">
                            <span class="task__btn-sign">Delete</span> 
                            <i class="icon icon-close"></i>
                        </button>
                        <button class="main-btn main-btn_hold hold-btn">
                            <span class="hold-btn__caption">
                                <span class="task__btn-sign">Hold</span> 
                                <i class="icon icon-lock"></i> 
                            </span>
                            <span class="hold-btn__caption hold-btn__caption_disabled">
                                <span class="task__btn-sign">Unhold</span> 
                                <i class="icon icon-unlock"></i>
                            </span>
                        </button>
                        <button class="main-btn main-btn_done">
                            <span class="task__btn-sign">Done</span> 
                            <i class="icon icon-success"></i>
                        </button>
                    </div>
                </div>

                <div class="task task-edit">
                    <div class="task__status task__status_edit">Edit</div>
                    <div class="task__content task-edit__content">
                        <textarea onkeyup="textAreaAdjust(this)" class="task__title task-edit__title">${title}</textarea>
                        <textarea onkeyup="textAreaAdjust(this)" class="task__desc task-edit__desc" >${desc}</textarea>
                    </div>

                    <div class="task__control">
                        <button class="main-btn main-btn_save">
                            <span class="task__btn-sign">Save</span> 
                            <i class="icon icon-success"></i>
                        </button>
                        <button class="main-btn main-btn_cancel">
                            <span class="task__btn-sign">Cancel</span> 
                            <i class="icon icon-close"></i>
                        </button>
                    </div>
                </div>
            </div>`
        },

        // TASK BULK ACTIONS ______________________________________________________________________
        holdAllTask() {
            this.storageTaskList.forEach(function (item) {
                if (item.status !== TASK_STATUS.done) {
                    item.status = TASK_STATUS.hold;
                }
            });
        },

        unholdAllTask() {
            this.storageTaskList.forEach(function (item) {
                if (item.status !== TASK_STATUS.done) {
                    item.status = TASK_STATUS.default;
                }
            });
        },

        doneAllTask() {
            this.storageTaskList.forEach(function (item) {
                if (item.status !== TASK_STATUS.hold) {
                    item.status = TASK_STATUS.done;
                }
            });
        },

        removeAllTask() {
            this.storageTaskList.splice(0, taskManager.storageTaskList.length);
        },

        // TASK SORT ACTIONS_________________________________________________________________________
        sortByTitle(arr) {
            arr.sort(function (first, second) {
                let firstTitle = first.title.toLowerCase();
                let secondTitle = second.title.toLowerCase();
                if (firstTitle > secondTitle)
                    return -1;
                if (firstTitle < secondTitle)
                    return 1;
                return 0;
            });
        },

        sortByStatus(arr) {
            arr.sort(function (first, second) {
                let firstStatus = first.status.toLowerCase();
                let secondStatus = second.status.toLowerCase();
                if (firstStatus < secondStatus)
                    return -1;
                if (firstStatus > secondStatus)
                    return 1;
                return 0;
            });
        },

        // TASK CONTROL BUTTON ACTIONS _________________________________________________________________
        openTaskEdit(taskItem) {
            let titleHeight = getComputedStyle(taskItem.querySelector('.task__title')).height;
            let descHeight = getComputedStyle(taskItem.querySelector('.task__desc')).height;
            let editTitle = taskItem.querySelector('.task-edit__title');
            let editDesc = taskItem.querySelector('.task-edit__desc');

            editTitle.style.height = titleHeight;
            editDesc.style.height = descHeight;

            taskItem.classList.add('task-container__item_edit');
        },

        saveTaskChanges(taskItem) {
            let newTitle = taskItem.querySelector('.task-edit__title').value;
            let newDesc = taskItem.querySelector('.task-edit__desc').value;
            let taskItemID = +taskItem.getAttribute('data-id');

            this.storageTaskList.forEach(function (item) {
                if (item.id === taskItemID) {
                    item.title = newTitle;
                    item.description = newDesc;
                    taskItem.classList.remove('task-container__item_edit');
                    taskItem.querySelector('.task__title').innerHTML = newTitle;
                    taskItem.querySelector('.task__desc').innerHTML = newDesc;
                }
            });
        },

        cancelTaskEdit(taskItem) {
            taskItem.classList.remove('task-container__item_edit');
        },

        deleteTask(id) {
            this.storageTaskList.forEach(function (item, index) {
                if (item.id === id) {
                    taskManager.storageTaskList.splice(index, 1);
                }
            });
        },

        holdTask(id) {
            this.storageTaskList.forEach(function (item, index) {
                if (item.id === id) {
                    if (taskManager.storageTaskList[index].status === TASK_STATUS.hold) {
                        taskManager.storageTaskList[index].status = TASK_STATUS.default
                    } else taskManager.storageTaskList[index].status = TASK_STATUS.hold;
                }
            });
        },

        doneTask(id) {
            this.storageTaskList.forEach(function (item, index) {
                if (item.id === id) {
                    taskManager.storageTaskList[index].status = TASK_STATUS.done;
                }
            });
        },

        // states of buttons___________________________________________________________________________
        enableOnlyOneBtn(buttonList, activeBtn) {
            buttonList.forEach(function (btn) {
                if (!btn.classList.contains(`main-btn_${activeBtn}`)) {
                    btn.setAttribute('disabled', 'disabled');
                }
            })
        },

        changeBtnSign(btn, btnName) {
            let btnCaptions = btn.querySelectorAll(`.${btnName}-btn__caption`);

            btnCaptions.forEach(function (item) {

                if (item.classList.contains(`${btnName}-btn__caption_disabled`)) {
                    item.classList.remove(`${btnName}-btn__caption_disabled`)

                } else if (!item.classList.contains(`${btnName}-btn__caption_disabled`)) {
                    item.classList.add(`${btnName}-btn__caption_disabled`)
                }
            })
        },

        // METHODS FOR BASE MANAGER ACTIONS______________________________________________________________
        openDropdownConfig(element) {
            element.classList.toggle('dropdown-config_active');
        },

        closeDropdownConfig(element) {
            element.classList.remove('dropdown-config_active');
        },

        openActionList(item, content) {
            item.classList.toggle('task-actions__item_open');
            content.classList.toggle('task-actions__content_active');
        },

        addTask(title, desc) {
            this.storageTaskList.push({
                id: this.storageTaskList.length + 1,
                title: title,
                description: desc,
                status: TASK_STATUS.default,
                found: true,
            });
        },

        changeTaskId(array, storage) {
            array.forEach(function (item, index) {
                item.id = index + 1;
            });
            changeLocalStorage(storage, array)
        },

        createSearchOptions(searchValue, titleValue, optionContainer) {
            if (titleValue.toLowerCase().includes(searchValue.toLowerCase())) {

                if (optionContainer.hasChildNodes()) {
                    let taskSearchOptions = optionContainer.querySelectorAll('option');
                    let hasOption;

                    taskSearchOptions.forEach(function (option) {
                        if (option.value === titleValue) {
                            hasOption = true;
                        }
                    });

                    if (!hasOption) {
                        optionContainer.insertAdjacentHTML('afterbegin', `<option value="${titleValue}"></option>`);
                    }

                } else optionContainer.insertAdjacentHTML('afterbegin', `<option value="${titleValue}"></option>`);
            }
        },

        clearSearchFilter(storageTaskList) {
            storageTaskList.forEach(function (item) {
                item.found = true;
            });
        },

        changeSearchStatus(item, itemTitle, searchValue) {
            if (!itemTitle.toLowerCase().includes(searchValue.toLowerCase())) {
                item.found = false;
            } else {
                item.found = true;
            }
        },

        removeAllContent(item) {
            while (item.firstChild) {
                item.firstChild.remove();
            }
        },

        showItem(item) {
            item.classList.remove('d-none');
        },

        hideItem(item) {
            item.classList.add('d-none');
        },

        changeLoaderState(container, state) {
            if (state === 'on') {
                container.classList.remove('loaded');
            } else if (state === 'off') {
                container.classList.add('loaded');
            }
        },

        // STATIC LISTENERS _______________________________________________________________________
        setStaticListeners() {
            let configButtons = document.querySelectorAll('.main-btn_config');
            let configCloseButtons = document.querySelectorAll('.dropdown-config__close-btn');
            let addNewTaskBtn = document.querySelector('.task-add__btn-add');

            let taskSearchField = document.querySelector('.taskSearchField');
            let taskSearchBtn = document.querySelector('.taskSearchBtn');
            let clearSearchFieldBtn = document.querySelector('.clearSearchFieldBtn');
            let taskSearchOptionList = document.querySelector('#taskSearchList');


            let actionButtonTitles = document.querySelectorAll('.action__title');

            let removeAllBtn = document.querySelector('.remove-all');
            let holdAllBtn = document.querySelector('.hold-all');
            let unholdAllBtn = document.querySelector('.unhold-all');
            let doneAllBtn = document.querySelector('.done-all');

            let sortStatusBtn = document.querySelector('.sort-status');
            let sortTitleBtn = document.querySelector('.sort-title');


            configButtons.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let configDropdownItem = item.parentNode.querySelector('.dropdown-config');
                    let configDropdownItemActive = document.querySelectorAll('.dropdown-config_active');

                    taskManager.openDropdownConfig(configDropdownItem);

                    if (configDropdownItemActive.length) {
                        configDropdownItemActive.forEach(function (item) {
                            taskManager.closeDropdownConfig(item);
                        });
                    }
                });
            });

            configCloseButtons.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let configDropdownItem = item.parentNode;
                    taskManager.closeDropdownConfig(configDropdownItem);
                })
            });

            addNewTaskBtn.addEventListener('click', function (event) {
                event.preventDefault();
                let newTaskTitle = document.querySelector('#newTaskTitle').value;
                let newTaskDesc = document.querySelector('#newTaskDesc').value;

                taskManager.addTask(newTaskTitle, newTaskDesc);
                taskManager.clearSearchFilter(taskManager.storageTaskList);
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();

                document.querySelector('#newTaskTitle').value = '';
                document.querySelector('#newTaskDesc').value = '';
            });

            actionButtonTitles.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let actionItem = item.parentNode;
                    let actionList = actionItem.querySelector('.task-actions__content');
                    taskManager.openActionList(actionItem, actionList);
                });
            });

            removeAllBtn.addEventListener('click', function (event) {
                event.preventDefault();
                taskManager.removeAllTask();
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();
            });

            holdAllBtn.addEventListener('click', function (event) {
                event.preventDefault();
                taskManager.holdAllTask();
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();
            });

            unholdAllBtn.addEventListener('click', function (event) {
                event.preventDefault();
                taskManager.unholdAllTask();
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();
            });

            doneAllBtn.addEventListener('click', function (event) {
                event.preventDefault();
                taskManager.doneAllTask();
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();
            });

            sortStatusBtn.addEventListener('click', function (event) {
                event.preventDefault();
                taskManager.sortByTitle(taskManager.storageTaskList);
                taskManager.sortByStatus(taskManager.storageTaskList);
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();
            });

            sortTitleBtn.addEventListener('click', function (event) {
                event.preventDefault();
                taskManager.sortByTitle(taskManager.storageTaskList);
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();
            });

            taskSearchField.addEventListener('input', function (event) {
                event.preventDefault();
                let searchValue = taskSearchField.value;

                taskManager.storageTaskList.forEach(function (item) {
                    taskManager.createSearchOptions(searchValue, item.title, taskSearchOptionList);
                });

                if (taskSearchField.value === '') {
                    taskManager.clearSearchFilter(taskManager.storageTaskList);
                    changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                    taskManager.renderTaskList();
                }
            });

            taskSearchBtn.addEventListener('click', function (event) {
                event.preventDefault();
                let searchValue = taskSearchField.value;
                taskManager.storageTaskList.forEach(function (item) {
                    taskManager.changeSearchStatus(item, item.title, searchValue)
                });
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();
            });

            clearSearchFieldBtn.addEventListener('click', function (event) {
                event.preventDefault();
                taskSearchField.value = '';
                taskManager.clearSearchFilter(taskManager.storageTaskList);
                changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                taskManager.renderTaskList();
            })
        },

        // DYNAMIC LISTENERS (FOR TASK CONTROL BUTTONS) _____________________________________________________
        setDynamicListeners() {
            let taskEditButtons = document.querySelectorAll('.main-btn_edit');
            let taskSaveButtons = document.querySelectorAll('.main-btn_save');
            let taskCancelButtons = document.querySelectorAll('.main-btn_cancel');
            let taskDeleteButtons = document.querySelectorAll('.main-btn_delete');
            let taskHoldButtons = document.querySelectorAll('.hold-btn');
            let taskDoneButtons = document.querySelectorAll('.main-btn_done');


            taskEditButtons.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let taskItem = item.parentNode.parentNode.parentNode;

                    taskManager.openTaskEdit(taskItem);
                })
            });

            taskSaveButtons.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let taskItem = item.parentNode.parentNode.parentNode;

                    taskManager.saveTaskChanges(taskItem);
                    changeLocalStorage('storageTaskList', taskManager.storageTaskList);

                    setTimeout(function () {
                        taskManager.silentRender();
                    }, 500);
                })
            });

            taskCancelButtons.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let taskItem = item.parentNode.parentNode.parentNode;

                    taskManager.cancelTaskEdit(taskItem);
                });
            });

            taskDeleteButtons.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let taskItem = item.parentNode.parentNode.parentNode;
                    let taskItemID = +taskItem.getAttribute('data-id');

                    taskManager.deleteTask(taskItemID);
                    changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                    taskManager.renderTaskList();
                })
            });

            taskHoldButtons.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let taskItem = item.parentNode.parentNode.parentNode;
                    let taskItemID = +taskItem.getAttribute('data-id');

                    taskManager.holdTask(taskItemID);
                    changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                    taskManager.silentRender();
                })
            });

            taskDoneButtons.forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    let taskItem = item.parentNode.parentNode.parentNode;
                    let taskItemID = +taskItem.getAttribute('data-id');

                    taskManager.doneTask(taskItemID);
                    changeLocalStorage('storageTaskList', taskManager.storageTaskList);
                    taskManager.silentRender();
                })
            });
        },

        // MAIN TASK RENDER __________________________________________________________________________________________
        renderTaskList() {
            let loaderWrap = document.querySelector('.task-manager__content');
            taskManager.changeLoaderState(loaderWrap, 'on');
            taskManager.changeTaskId(taskManager.storageTaskList, 'storageTaskList');

            setTimeout(function () {
                let optionalDesc = document.querySelector('.optional-desc');
                const taskContainer = document.querySelector('.task-container');
                taskManager.removeAllContent(taskContainer);

                if (taskManager.storageTaskList.length) {
                    taskManager.hideItem(optionalDesc);

                    taskManager.storageTaskList.forEach(function (item) {
                        if (!item.found) return;
                        taskContainer.insertAdjacentHTML('afterbegin', taskManager.taskTemplate(item.id, item.title, item.description, item.status));
                    });

                    let taskStatus = document.querySelectorAll('.task__status');
                    taskStatus.forEach(function (item) {
                        let taskItem = item.parentNode;
                        let controlButtons = taskItem.querySelectorAll('button');

                        if (item.classList.contains(`task__status_${TASK_STATUS.done}`)) {
                            taskManager.enableOnlyOneBtn(controlButtons, 'delete');
                        } else if (item.classList.contains(`task__status_${TASK_STATUS.hold}`)) {
                            let holdBtn = taskItem.querySelector('.hold-btn');
                            taskManager.enableOnlyOneBtn(controlButtons, 'hold');
                            taskManager.changeBtnSign(holdBtn, 'hold');
                        }
                    });

                    taskManager.setDynamicListeners();
                } else {
                    taskManager.showItem(optionalDesc);
                }
                taskManager.changeLoaderState(loaderWrap, 'off');
            }, 500);
        },

        // render without usage loader
        silentRender() {
            let optionalDesc = document.querySelector('.optional-desc');
            const taskContainer = document.querySelector('.task-container');
            taskManager.removeAllContent(taskContainer);
            taskManager.changeTaskId(taskManager.storageTaskList, 'storageTaskList');

            if (taskManager.storageTaskList.length) {
                taskManager.hideItem(optionalDesc);

                taskManager.storageTaskList.forEach(function (item) {
                    if (!item.found) return;
                    taskContainer.insertAdjacentHTML('afterbegin', taskManager.taskTemplate(item.id, item.title, item.description, item.status));
                });

                let taskStatus = document.querySelectorAll('.task__status');
                taskStatus.forEach(function (item) {
                    let taskItem = item.parentNode;
                    let controlButtons = taskItem.querySelectorAll('button');

                    if (item.classList.contains(`task__status_${TASK_STATUS.done}`)) {
                        taskManager.enableOnlyOneBtn(controlButtons, 'delete');
                    } else if (item.classList.contains(`task__status_${TASK_STATUS.hold}`)) {
                        let holdBtn = taskItem.querySelector('.hold-btn');
                        taskManager.enableOnlyOneBtn(controlButtons, 'hold');
                        taskManager.changeBtnSign(holdBtn, 'hold');
                    }
                });

                taskManager.setDynamicListeners();
            } else {
                taskManager.showItem(optionalDesc);
            }
        },

        init() {
            this.setStaticListeners();
            this.renderTaskList();
        }
    };

    taskManager.init();

});

function textAreaAdjust(o) {
    o.style.height = (o.scrollHeight) + "px";
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiRE9NIGZ1bGx5IGxvYWRlZCBhbmQgcGFyc2VkXCIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNoYW5nZUxvY2FsU3RvcmFnZShzdG9yYWdlS2V5TmFtZSwgdmFsdWUpIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzdG9yYWdlS2V5TmFtZSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBUQVNLX1NUQVRVUyA9IHtcclxuICAgICAgICBkZWZhdWx0OiAncGVuZGluZycsXHJcbiAgICAgICAgaG9sZDogJ2hvbGQnLFxyXG4gICAgICAgIGRvbmU6ICdkb25lJyxcclxuICAgICAgICBlZGl0OiAnZWRpdCcsXHJcbiAgICAgICAgbm90Rm91bmQ6ICdub3RGb3VuZCcsXHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBkZW1vVGFza0xpc3QgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgdGl0bGU6ICdHbyB0byB0aGUgc2hvcCcsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgTmVlZCB0byBidXk6IFxcblxcdDEuIEJyZWFkIFxcblxcdDIuIEVnZ3MgXFxuXFx0My4gTWlsayBcXG5cXHQ0LiBDb29raWVzYCxcclxuICAgICAgICAgICAgc3RhdHVzOiBUQVNLX1NUQVRVUy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBmb3VuZDogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDIsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnR28gdG8gdGhlIHdvcmsnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogYDEuIFByZXRlbmQgeW91IHdvcmsgXFxuMi4gVHJ5IG5vdCB0byBmYWxsIGFzbGVlcCBiZWZvcmUgZGlubmVyIFxcbjMuIEFzayB0byBpbmNyZWFzZSB5b3VyIHNhbGFyeSBcXG40LiBJbiBhbnkgY2FzZSwgbGVhdmUgdGhlIG9mZmljZSBhbiBob3VyIGVhcmxpZXJgLFxyXG4gICAgICAgICAgICBzdGF0dXM6IFRBU0tfU1RBVFVTLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGZvdW5kOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc3RvcmFnZVRhc2tMaXN0JykgPT09IG51bGwpIHtcclxuICAgICAgICBjaGFuZ2VMb2NhbFN0b3JhZ2UoJ3N0b3JhZ2VUYXNrTGlzdCcsIGRlbW9UYXNrTGlzdCk7XHJcbiAgICB9XHJcblxyXG4vLyBUYXNrIG1hbmFnZXIgb2JqZWN0IF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXHJcbiAgICBjb25zdCB0YXNrTWFuYWdlciA9IHtcclxuXHJcbiAgICAgICAgc3RvcmFnZVRhc2tMaXN0OiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzdG9yYWdlVGFza0xpc3QnKSksXHJcblxyXG4gICAgICAgIHRhc2tUZW1wbGF0ZSh0YXNrSWQsIHRpdGxlLCBkZXNjLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGAgPGRpdiBkYXRhLWlkPVwiJHt0YXNrSWR9XCIgY2xhc3M9XCJ0YXNrLWNvbnRhaW5lcl9faXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2sgdGFza18ke3N0YXR1c31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFza19fc3RhdHVzIHRhc2tfX3N0YXR1c18ke3N0YXR1c31cIj4ke3N0YXR1c308L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFza19fY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJ0YXNrX190aXRsZVwiPiR7dGl0bGV9PC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0YXNrX19kZXNjXCI+JHtkZXNjfTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2tfX2NvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1haW4tYnRuIG1haW4tYnRuX2VkaXRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGFza19fYnRuLXNpZ25cIj5FZGl0PC9zcGFuPiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBpY29uLWVkaXRcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwibWFpbi1idG4gbWFpbi1idG5fZGVsZXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRhc2tfX2J0bi1zaWduXCI+RGVsZXRlPC9zcGFuPiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBpY29uLWNsb3NlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1haW4tYnRuIG1haW4tYnRuX2hvbGQgaG9sZC1idG5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaG9sZC1idG5fX2NhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRhc2tfX2J0bi1zaWduXCI+SG9sZDwvc3Bhbj4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uIGljb24tbG9ja1wiPjwvaT4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImhvbGQtYnRuX19jYXB0aW9uIGhvbGQtYnRuX19jYXB0aW9uX2Rpc2FibGVkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0YXNrX19idG4tc2lnblwiPlVuaG9sZDwvc3Bhbj4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uIGljb24tdW5sb2NrXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1haW4tYnRuIG1haW4tYnRuX2RvbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGFza19fYnRuLXNpZ25cIj5Eb25lPC9zcGFuPiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbiBpY29uLXN1Y2Nlc3NcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2sgdGFzay1lZGl0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2tfX3N0YXR1cyB0YXNrX19zdGF0dXNfZWRpdFwiPkVkaXQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFza19fY29udGVudCB0YXNrLWVkaXRfX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG9ua2V5dXA9XCJ0ZXh0QXJlYUFkanVzdCh0aGlzKVwiIGNsYXNzPVwidGFza19fdGl0bGUgdGFzay1lZGl0X190aXRsZVwiPiR7dGl0bGV9PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG9ua2V5dXA9XCJ0ZXh0QXJlYUFkanVzdCh0aGlzKVwiIGNsYXNzPVwidGFza19fZGVzYyB0YXNrLWVkaXRfX2Rlc2NcIiA+JHtkZXNjfTwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrX19jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJtYWluLWJ0biBtYWluLWJ0bl9zYXZlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRhc2tfX2J0bi1zaWduXCI+U2F2ZTwvc3Bhbj4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImljb24gaWNvbi1zdWNjZXNzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm1haW4tYnRuIG1haW4tYnRuX2NhbmNlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0YXNrX19idG4tc2lnblwiPkNhbmNlbDwvc3Bhbj4gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImljb24gaWNvbi1jbG9zZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIFRBU0sgQlVMSyBBQ1RJT05TIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cclxuICAgICAgICBob2xkQWxsVGFzaygpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yYWdlVGFza0xpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uc3RhdHVzICE9PSBUQVNLX1NUQVRVUy5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGF0dXMgPSBUQVNLX1NUQVRVUy5ob2xkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1bmhvbGRBbGxUYXNrKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JhZ2VUYXNrTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5zdGF0dXMgIT09IFRBU0tfU1RBVFVTLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9IFRBU0tfU1RBVFVTLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRvbmVBbGxUYXNrKCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JhZ2VUYXNrTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5zdGF0dXMgIT09IFRBU0tfU1RBVFVTLmhvbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXR1cyA9IFRBU0tfU1RBVFVTLmRvbmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJlbW92ZUFsbFRhc2soKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZVRhc2tMaXN0LnNwbGljZSgwLCB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QubGVuZ3RoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBUQVNLIFNPUlQgQUNUSU9OU19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cclxuICAgICAgICBzb3J0QnlUaXRsZShhcnIpIHtcclxuICAgICAgICAgICAgYXJyLnNvcnQoZnVuY3Rpb24gKGZpcnN0LCBzZWNvbmQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmaXJzdFRpdGxlID0gZmlyc3QudGl0bGUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZWNvbmRUaXRsZSA9IHNlY29uZC50aXRsZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0VGl0bGUgPiBzZWNvbmRUaXRsZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RUaXRsZSA8IHNlY29uZFRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNvcnRCeVN0YXR1cyhhcnIpIHtcclxuICAgICAgICAgICAgYXJyLnNvcnQoZnVuY3Rpb24gKGZpcnN0LCBzZWNvbmQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmaXJzdFN0YXR1cyA9IGZpcnN0LnN0YXR1cy50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlY29uZFN0YXR1cyA9IHNlY29uZC5zdGF0dXMudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmIChmaXJzdFN0YXR1cyA8IHNlY29uZFN0YXR1cylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RTdGF0dXMgPiBzZWNvbmRTdGF0dXMpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gVEFTSyBDT05UUk9MIEJVVFRPTiBBQ1RJT05TIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXHJcbiAgICAgICAgb3BlblRhc2tFZGl0KHRhc2tJdGVtKSB7XHJcbiAgICAgICAgICAgIGxldCB0aXRsZUhlaWdodCA9IGdldENvbXB1dGVkU3R5bGUodGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2tfX3RpdGxlJykpLmhlaWdodDtcclxuICAgICAgICAgICAgbGV0IGRlc2NIZWlnaHQgPSBnZXRDb21wdXRlZFN0eWxlKHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrX19kZXNjJykpLmhlaWdodDtcclxuICAgICAgICAgICAgbGV0IGVkaXRUaXRsZSA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWVkaXRfX3RpdGxlJyk7XHJcbiAgICAgICAgICAgIGxldCBlZGl0RGVzYyA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWVkaXRfX2Rlc2MnKTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRUaXRsZS5zdHlsZS5oZWlnaHQgPSB0aXRsZUhlaWdodDtcclxuICAgICAgICAgICAgZWRpdERlc2Muc3R5bGUuaGVpZ2h0ID0gZGVzY0hlaWdodDtcclxuXHJcbiAgICAgICAgICAgIHRhc2tJdGVtLmNsYXNzTGlzdC5hZGQoJ3Rhc2stY29udGFpbmVyX19pdGVtX2VkaXQnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzYXZlVGFza0NoYW5nZXModGFza0l0ZW0pIHtcclxuICAgICAgICAgICAgbGV0IG5ld1RpdGxlID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stZWRpdF9fdGl0bGUnKS52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IG5ld0Rlc2MgPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcudGFzay1lZGl0X19kZXNjJykudmFsdWU7XHJcbiAgICAgICAgICAgIGxldCB0YXNrSXRlbUlEID0gK3Rhc2tJdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdG9yYWdlVGFza0xpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IHRhc2tJdGVtSUQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnRpdGxlID0gbmV3VGl0bGU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5kZXNjcmlwdGlvbiA9IG5ld0Rlc2M7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza0l0ZW0uY2xhc3NMaXN0LnJlbW92ZSgndGFzay1jb250YWluZXJfX2l0ZW1fZWRpdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrX190aXRsZScpLmlubmVySFRNTCA9IG5ld1RpdGxlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YXNrX19kZXNjJykuaW5uZXJIVE1MID0gbmV3RGVzYztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2FuY2VsVGFza0VkaXQodGFza0l0ZW0pIHtcclxuICAgICAgICAgICAgdGFza0l0ZW0uY2xhc3NMaXN0LnJlbW92ZSgndGFzay1jb250YWluZXJfX2l0ZW1fZWRpdCcpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRlbGV0ZVRhc2soaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yYWdlVGFza0xpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmlkID09PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnN0b3JhZ2VUYXNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBob2xkVGFzayhpZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3JhZ2VUYXNrTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2tNYW5hZ2VyLnN0b3JhZ2VUYXNrTGlzdFtpbmRleF0uc3RhdHVzID09PSBUQVNLX1NUQVRVUy5ob2xkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnN0b3JhZ2VUYXNrTGlzdFtpbmRleF0uc3RhdHVzID0gVEFTS19TVEFUVVMuZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3RbaW5kZXhdLnN0YXR1cyA9IFRBU0tfU1RBVFVTLmhvbGQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRvbmVUYXNrKGlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZVRhc2tMaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3RbaW5kZXhdLnN0YXR1cyA9IFRBU0tfU1RBVFVTLmRvbmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIHN0YXRlcyBvZiBidXR0b25zX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXHJcbiAgICAgICAgZW5hYmxlT25seU9uZUJ0bihidXR0b25MaXN0LCBhY3RpdmVCdG4pIHtcclxuICAgICAgICAgICAgYnV0dG9uTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChidG4pIHtcclxuICAgICAgICAgICAgICAgIGlmICghYnRuLmNsYXNzTGlzdC5jb250YWlucyhgbWFpbi1idG5fJHthY3RpdmVCdG59YCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBidG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNoYW5nZUJ0blNpZ24oYnRuLCBidG5OYW1lKSB7XHJcbiAgICAgICAgICAgIGxldCBidG5DYXB0aW9ucyA9IGJ0bi5xdWVyeVNlbGVjdG9yQWxsKGAuJHtidG5OYW1lfS1idG5fX2NhcHRpb25gKTtcclxuXHJcbiAgICAgICAgICAgIGJ0bkNhcHRpb25zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoYCR7YnRuTmFtZX0tYnRuX19jYXB0aW9uX2Rpc2FibGVkYCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoYCR7YnRuTmFtZX0tYnRuX19jYXB0aW9uX2Rpc2FibGVkYClcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFpdGVtLmNsYXNzTGlzdC5jb250YWlucyhgJHtidG5OYW1lfS1idG5fX2NhcHRpb25fZGlzYWJsZWRgKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZChgJHtidG5OYW1lfS1idG5fX2NhcHRpb25fZGlzYWJsZWRgKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIE1FVEhPRFMgRk9SIEJBU0UgTUFOQUdFUiBBQ1RJT05TX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cclxuICAgICAgICBvcGVuRHJvcGRvd25Db25maWcoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2Ryb3Bkb3duLWNvbmZpZ19hY3RpdmUnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjbG9zZURyb3Bkb3duQ29uZmlnKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wZG93bi1jb25maWdfYWN0aXZlJyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb3BlbkFjdGlvbkxpc3QoaXRlbSwgY29udGVudCkge1xyXG4gICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC50b2dnbGUoJ3Rhc2stYWN0aW9uc19faXRlbV9vcGVuJyk7XHJcbiAgICAgICAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LnRvZ2dsZSgndGFzay1hY3Rpb25zX19jb250ZW50X2FjdGl2ZScpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFkZFRhc2sodGl0bGUsIGRlc2MpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yYWdlVGFza0xpc3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5zdG9yYWdlVGFza0xpc3QubGVuZ3RoICsgMSxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBUQVNLX1NUQVRVUy5kZWZhdWx0LFxyXG4gICAgICAgICAgICAgICAgZm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNoYW5nZVRhc2tJZChhcnJheSwgc3RvcmFnZSkge1xyXG4gICAgICAgICAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5pZCA9IGluZGV4ICsgMTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNoYW5nZUxvY2FsU3RvcmFnZShzdG9yYWdlLCBhcnJheSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjcmVhdGVTZWFyY2hPcHRpb25zKHNlYXJjaFZhbHVlLCB0aXRsZVZhbHVlLCBvcHRpb25Db250YWluZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRpdGxlVmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hWYWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25Db250YWluZXIuaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhc2tTZWFyY2hPcHRpb25zID0gb3B0aW9uQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBoYXNPcHRpb247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tTZWFyY2hPcHRpb25zLmZvckVhY2goZnVuY3Rpb24gKG9wdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uLnZhbHVlID09PSB0aXRsZVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNPcHRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzT3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbkNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgPG9wdGlvbiB2YWx1ZT1cIiR7dGl0bGVWYWx1ZX1cIj48L29wdGlvbj5gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIG9wdGlvbkNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgPG9wdGlvbiB2YWx1ZT1cIiR7dGl0bGVWYWx1ZX1cIj48L29wdGlvbj5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNsZWFyU2VhcmNoRmlsdGVyKHN0b3JhZ2VUYXNrTGlzdCkge1xyXG4gICAgICAgICAgICBzdG9yYWdlVGFza0xpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5mb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNoYW5nZVNlYXJjaFN0YXR1cyhpdGVtLCBpdGVtVGl0bGUsIHNlYXJjaFZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICghaXRlbVRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVtb3ZlQWxsQ29udGVudChpdGVtKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChpdGVtLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZmlyc3RDaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNob3dJdGVtKGl0ZW0pIHtcclxuICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBoaWRlSXRlbShpdGVtKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnZC1ub25lJyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2hhbmdlTG9hZGVyU3RhdGUoY29udGFpbmVyLCBzdGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAoc3RhdGUgPT09ICdvbicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gJ29mZicpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIFNUQVRJQyBMSVNURU5FUlMgX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19cclxuICAgICAgICBzZXRTdGF0aWNMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgICAgIGxldCBjb25maWdCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1haW4tYnRuX2NvbmZpZycpO1xyXG4gICAgICAgICAgICBsZXQgY29uZmlnQ2xvc2VCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWNvbmZpZ19fY2xvc2UtYnRuJyk7XHJcbiAgICAgICAgICAgIGxldCBhZGROZXdUYXNrQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2stYWRkX19idG4tYWRkJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGFza1NlYXJjaEZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2tTZWFyY2hGaWVsZCcpO1xyXG4gICAgICAgICAgICBsZXQgdGFza1NlYXJjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrU2VhcmNoQnRuJyk7XHJcbiAgICAgICAgICAgIGxldCBjbGVhclNlYXJjaEZpZWxkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsZWFyU2VhcmNoRmllbGRCdG4nKTtcclxuICAgICAgICAgICAgbGV0IHRhc2tTZWFyY2hPcHRpb25MaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Rhc2tTZWFyY2hMaXN0Jyk7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IGFjdGlvbkJ1dHRvblRpdGxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY3Rpb25fX3RpdGxlJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmVtb3ZlQWxsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlbW92ZS1hbGwnKTtcclxuICAgICAgICAgICAgbGV0IGhvbGRBbGxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG9sZC1hbGwnKTtcclxuICAgICAgICAgICAgbGV0IHVuaG9sZEFsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51bmhvbGQtYWxsJyk7XHJcbiAgICAgICAgICAgIGxldCBkb25lQWxsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRvbmUtYWxsJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgc29ydFN0YXR1c0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb3J0LXN0YXR1cycpO1xyXG4gICAgICAgICAgICBsZXQgc29ydFRpdGxlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNvcnQtdGl0bGUnKTtcclxuXHJcblxyXG4gICAgICAgICAgICBjb25maWdCdXR0b25zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb25maWdEcm9wZG93bkl0ZW0gPSBpdGVtLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLWNvbmZpZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb25maWdEcm9wZG93bkl0ZW1BY3RpdmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24tY29uZmlnX2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5vcGVuRHJvcGRvd25Db25maWcoY29uZmlnRHJvcGRvd25JdGVtKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZ0Ryb3Bkb3duSXRlbUFjdGl2ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnRHJvcGRvd25JdGVtQWN0aXZlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLmNsb3NlRHJvcGRvd25Db25maWcoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbmZpZ0Nsb3NlQnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29uZmlnRHJvcGRvd25JdGVtID0gaXRlbS5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLmNsb3NlRHJvcGRvd25Db25maWcoY29uZmlnRHJvcGRvd25JdGVtKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYWRkTmV3VGFza0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdUYXNrVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3VGFza1RpdGxlJykudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3VGFza0Rlc2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3VGFza0Rlc2MnKS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5hZGRUYXNrKG5ld1Rhc2tUaXRsZSwgbmV3VGFza0Rlc2MpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIuY2xlYXJTZWFyY2hGaWx0ZXIodGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZUxvY2FsU3RvcmFnZSgnc3RvcmFnZVRhc2tMaXN0JywgdGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnJlbmRlclRhc2tMaXN0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ld1Rhc2tUaXRsZScpLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3VGFza0Rlc2MnKS52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFjdGlvbkJ1dHRvblRpdGxlcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aW9uSXRlbSA9IGl0ZW0ucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aW9uTGlzdCA9IGFjdGlvbkl0ZW0ucXVlcnlTZWxlY3RvcignLnRhc2stYWN0aW9uc19fY29udGVudCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLm9wZW5BY3Rpb25MaXN0KGFjdGlvbkl0ZW0sIGFjdGlvbkxpc3QpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVtb3ZlQWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIucmVtb3ZlQWxsVGFzaygpO1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlTG9jYWxTdG9yYWdlKCdzdG9yYWdlVGFza0xpc3QnLCB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIucmVuZGVyVGFza0xpc3QoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBob2xkQWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIuaG9sZEFsbFRhc2soKTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZUxvY2FsU3RvcmFnZSgnc3RvcmFnZVRhc2tMaXN0JywgdGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnJlbmRlclRhc2tMaXN0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdW5ob2xkQWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIudW5ob2xkQWxsVGFzaygpO1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlTG9jYWxTdG9yYWdlKCdzdG9yYWdlVGFza0xpc3QnLCB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIucmVuZGVyVGFza0xpc3QoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBkb25lQWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIuZG9uZUFsbFRhc2soKTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZUxvY2FsU3RvcmFnZSgnc3RvcmFnZVRhc2tMaXN0JywgdGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnJlbmRlclRhc2tMaXN0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc29ydFN0YXR1c0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnNvcnRCeVRpdGxlKHRhc2tNYW5hZ2VyLnN0b3JhZ2VUYXNrTGlzdCk7XHJcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5zb3J0QnlTdGF0dXModGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZUxvY2FsU3RvcmFnZSgnc3RvcmFnZVRhc2tMaXN0JywgdGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnJlbmRlclRhc2tMaXN0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc29ydFRpdGxlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIuc29ydEJ5VGl0bGUodGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZUxvY2FsU3RvcmFnZSgnc3RvcmFnZVRhc2tMaXN0JywgdGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnJlbmRlclRhc2tMaXN0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGFza1NlYXJjaEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlYXJjaFZhbHVlID0gdGFza1NlYXJjaEZpZWxkLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnN0b3JhZ2VUYXNrTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuY3JlYXRlU2VhcmNoT3B0aW9ucyhzZWFyY2hWYWx1ZSwgaXRlbS50aXRsZSwgdGFza1NlYXJjaE9wdGlvbkxpc3QpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRhc2tTZWFyY2hGaWVsZC52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5jbGVhclNlYXJjaEZpbHRlcih0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUxvY2FsU3RvcmFnZSgnc3RvcmFnZVRhc2tMaXN0JywgdGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5yZW5kZXJUYXNrTGlzdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRhc2tTZWFyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc2VhcmNoVmFsdWUgPSB0YXNrU2VhcmNoRmllbGQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLmNoYW5nZVNlYXJjaFN0YXR1cyhpdGVtLCBpdGVtLnRpdGxlLCBzZWFyY2hWYWx1ZSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlTG9jYWxTdG9yYWdlKCdzdG9yYWdlVGFza0xpc3QnLCB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIucmVuZGVyVGFza0xpc3QoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjbGVhclNlYXJjaEZpZWxkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdGFza1NlYXJjaEZpZWxkLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5jbGVhclNlYXJjaEZpbHRlcih0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlTG9jYWxTdG9yYWdlKCdzdG9yYWdlVGFza0xpc3QnLCB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgdGFza01hbmFnZXIucmVuZGVyVGFza0xpc3QoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBEWU5BTUlDIExJU1RFTkVSUyAoRk9SIFRBU0sgQ09OVFJPTCBCVVRUT05TKSBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xyXG4gICAgICAgIHNldER5bmFtaWNMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgICAgIGxldCB0YXNrRWRpdEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFpbi1idG5fZWRpdCcpO1xyXG4gICAgICAgICAgICBsZXQgdGFza1NhdmVCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1haW4tYnRuX3NhdmUnKTtcclxuICAgICAgICAgICAgbGV0IHRhc2tDYW5jZWxCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1haW4tYnRuX2NhbmNlbCcpO1xyXG4gICAgICAgICAgICBsZXQgdGFza0RlbGV0ZUJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWFpbi1idG5fZGVsZXRlJyk7XHJcbiAgICAgICAgICAgIGxldCB0YXNrSG9sZEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaG9sZC1idG4nKTtcclxuICAgICAgICAgICAgbGV0IHRhc2tEb25lQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tYWluLWJ0bl9kb25lJyk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGFza0VkaXRCdXR0b25zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrSXRlbSA9IGl0ZW0ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLm9wZW5UYXNrRWRpdCh0YXNrSXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRhc2tTYXZlQnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGFza0l0ZW0gPSBpdGVtLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5zYXZlVGFza0NoYW5nZXModGFza0l0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUxvY2FsU3RvcmFnZSgnc3RvcmFnZVRhc2tMaXN0JywgdGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnNpbGVudFJlbmRlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRhc2tDYW5jZWxCdXR0b25zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrSXRlbSA9IGl0ZW0ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLmNhbmNlbFRhc2tFZGl0KHRhc2tJdGVtKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRhc2tEZWxldGVCdXR0b25zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrSXRlbSA9IGl0ZW0ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhc2tJdGVtSUQgPSArdGFza0l0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLmRlbGV0ZVRhc2sodGFza0l0ZW1JRCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlTG9jYWxTdG9yYWdlKCdzdG9yYWdlVGFza0xpc3QnLCB0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnJlbmRlclRhc2tMaXN0KCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRhc2tIb2xkQnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGFza0l0ZW0gPSBpdGVtLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrSXRlbUlEID0gK3Rhc2tJdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5ob2xkVGFzayh0YXNrSXRlbUlEKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VMb2NhbFN0b3JhZ2UoJ3N0b3JhZ2VUYXNrTGlzdCcsIHRhc2tNYW5hZ2VyLnN0b3JhZ2VUYXNrTGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuc2lsZW50UmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRhc2tEb25lQnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGFza0l0ZW0gPSBpdGVtLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrSXRlbUlEID0gK3Rhc2tJdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5kb25lVGFzayh0YXNrSXRlbUlEKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VMb2NhbFN0b3JhZ2UoJ3N0b3JhZ2VUYXNrTGlzdCcsIHRhc2tNYW5hZ2VyLnN0b3JhZ2VUYXNrTGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuc2lsZW50UmVuZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBNQUlOIFRBU0sgUkVOREVSIF9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1xyXG4gICAgICAgIHJlbmRlclRhc2tMaXN0KCkge1xyXG4gICAgICAgICAgICBsZXQgbG9hZGVyV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLW1hbmFnZXJfX2NvbnRlbnQnKTtcclxuICAgICAgICAgICAgdGFza01hbmFnZXIuY2hhbmdlTG9hZGVyU3RhdGUobG9hZGVyV3JhcCwgJ29uJyk7XHJcbiAgICAgICAgICAgIHRhc2tNYW5hZ2VyLmNoYW5nZVRhc2tJZCh0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QsICdzdG9yYWdlVGFza0xpc3QnKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9wdGlvbmFsRGVzYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcHRpb25hbC1kZXNjJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXNrQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2stY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5yZW1vdmVBbGxDb250ZW50KHRhc2tDb250YWluZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuaGlkZUl0ZW0ob3B0aW9uYWxEZXNjKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuc3RvcmFnZVRhc2tMaXN0LmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmZvdW5kKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tDb250YWluZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgdGFza01hbmFnZXIudGFza1RlbXBsYXRlKGl0ZW0uaWQsIGl0ZW0udGl0bGUsIGl0ZW0uZGVzY3JpcHRpb24sIGl0ZW0uc3RhdHVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0YXNrU3RhdHVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhc2tfX3N0YXR1cycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tTdGF0dXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGFza0l0ZW0gPSBpdGVtLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9sQnV0dG9ucyA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGB0YXNrX19zdGF0dXNfJHtUQVNLX1NUQVRVUy5kb25lfWApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5lbmFibGVPbmx5T25lQnRuKGNvbnRyb2xCdXR0b25zLCAnZGVsZXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoYHRhc2tfX3N0YXR1c18ke1RBU0tfU1RBVFVTLmhvbGR9YCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBob2xkQnRuID0gdGFza0l0ZW0ucXVlcnlTZWxlY3RvcignLmhvbGQtYnRuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5lbmFibGVPbmx5T25lQnRuKGNvbnRyb2xCdXR0b25zLCAnaG9sZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuY2hhbmdlQnRuU2lnbihob2xkQnRuLCAnaG9sZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnNldER5bmFtaWNMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuc2hvd0l0ZW0ob3B0aW9uYWxEZXNjKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLmNoYW5nZUxvYWRlclN0YXRlKGxvYWRlcldyYXAsICdvZmYnKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyByZW5kZXIgd2l0aG91dCB1c2FnZSBsb2FkZXJcclxuICAgICAgICBzaWxlbnRSZW5kZXIoKSB7XHJcbiAgICAgICAgICAgIGxldCBvcHRpb25hbERlc2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3B0aW9uYWwtZGVzYycpO1xyXG4gICAgICAgICAgICBjb25zdCB0YXNrQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2stY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnJlbW92ZUFsbENvbnRlbnQodGFza0NvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIHRhc2tNYW5hZ2VyLmNoYW5nZVRhc2tJZCh0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QsICdzdG9yYWdlVGFza0xpc3QnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXNrTWFuYWdlci5zdG9yYWdlVGFza0xpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0YXNrTWFuYWdlci5oaWRlSXRlbShvcHRpb25hbERlc2MpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnN0b3JhZ2VUYXNrTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtLmZvdW5kKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza0NvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCB0YXNrTWFuYWdlci50YXNrVGVtcGxhdGUoaXRlbS5pZCwgaXRlbS50aXRsZSwgaXRlbS5kZXNjcmlwdGlvbiwgaXRlbS5zdGF0dXMpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0YXNrU3RhdHVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhc2tfX3N0YXR1cycpO1xyXG4gICAgICAgICAgICAgICAgdGFza1N0YXR1cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhc2tJdGVtID0gaXRlbS5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250cm9sQnV0dG9ucyA9IHRhc2tJdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoYHRhc2tfX3N0YXR1c18ke1RBU0tfU1RBVFVTLmRvbmV9YCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuZW5hYmxlT25seU9uZUJ0bihjb250cm9sQnV0dG9ucywgJ2RlbGV0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoYHRhc2tfX3N0YXR1c18ke1RBU0tfU1RBVFVTLmhvbGR9YCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhvbGRCdG4gPSB0YXNrSXRlbS5xdWVyeVNlbGVjdG9yKCcuaG9sZC1idG4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuZW5hYmxlT25seU9uZUJ0bihjb250cm9sQnV0dG9ucywgJ2hvbGQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza01hbmFnZXIuY2hhbmdlQnRuU2lnbihob2xkQnRuLCAnaG9sZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnNldER5bmFtaWNMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhc2tNYW5hZ2VyLnNob3dJdGVtKG9wdGlvbmFsRGVzYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRpY0xpc3RlbmVycygpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclRhc2tMaXN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0YXNrTWFuYWdlci5pbml0KCk7XHJcblxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHRleHRBcmVhQWRqdXN0KG8pIHtcclxuICAgIG8uc3R5bGUuaGVpZ2h0ID0gKG8uc2Nyb2xsSGVpZ2h0KSArIFwicHhcIjtcclxufVxyXG4iXX0=
