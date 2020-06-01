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
