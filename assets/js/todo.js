document.addEventListener('DOMContentLoaded', function() {
    //https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    //https://www.w3schools.com/jsref/prop_win_localstorage.asp

    // Elements 
    let totaltask = document.getElementById('totaltask');
    let completedtask = document.getElementById('completedtask');
    let remainingtask = document.getElementById('remainingtask');


    
    let taskAddinput = document.getElementById('taskAddinput');
    let taskAddBtn = document.getElementById('taskAddBtn');


    let activetask = document.getElementById('activetask');
    let taskstatus = document.getElementById('taskstatus');

    let taskEditInput = document.getElementById('taskEdit');
    let priorityHigh = document.getElementById('high');
    let priorityMedium = document.getElementById('medium');
    let priorityLow = document.getElementById('low');


    let FilterAll = document.getElementById('FilterAll');
    let FilterActive = document.getElementById('FilterActive');
    let FilterCompleted = document.getElementById('FilterCompleted');



    taskAddinput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            taskAddBtn.click();            
        }
    });  


    // Task Array 
    let tasks = JSON.parse(localStorage.getItem('Faik_tasks')) || [];

    taskAddBtn.addEventListener('click',function(){
        let tasktext = taskAddinput.value.trim();
        if (tasktext === "") {
            alert("Please write to task");
            return;
        }  
       
        if (document.getElementById('add-high').checked) {
            priority = 'High';
        } 
        else if (document.getElementById('add-medium').checked) {
            priority = 'Medium';
        } 
        else if (document.getElementById('add-low').checked) {
            priority = 'Low';
        }


        const isDuplicate = tasks.some(task => 
            task.text.toLowerCase() === tasktext.toLowerCase()
        );
        if (isDuplicate) {
            alert("This task already exists");
            return;
        }   

        let newTask = {
            id : Date.now(),
            text : tasktext,
            complete : false , 
            priority : priority,
        };

        tasks.push(newTask);

        localStorage.setItem('Faik_tasks', JSON.stringify(tasks));

        taskAddinput.value = "";

        alert("Task added successfully!");

        updateTaskCounts();
        
    });



    function listTasks() {
        const taskList = document.getElementById('tasklist'); 
        taskList.innerHTML = '';

        let filteredTasks = tasks;
        if (currentFilter === 'active') 
            filteredTasks = tasks.filter(t => !t.complete);
        else if (currentFilter === 'completed') 
            filteredTasks = tasks.filter(t => t.complete);



        filteredTasks.forEach(task => {
            console.log(`ID: ${task.id}, Text: ${task.text}, Completed: ${task.complete}, Priority: ${task.priority}`);
           
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.id = task.id; 
            li.innerHTML = `
                <div class="d-flex flex-wrap align-items-center gap-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" onclick="taskComplete(${task.id}, this.checked)" ${task.complete ? 'checked' : ''}>
                    </div>
                    
                    <div class="flex-grow-1">
                        <span class="${task.complete ? 'text-decoration-line-through text-muted' : ''}">
                            ${task.text}
                        </span>
                        <span class="badge bg-${task.complete ? 'success' : task.priority === 'High'? 'danger' : task.priority === 'Medium' ? 'warning' : 'secondary'}">
                            ${task.complete ? 'Completed' : task.priority + ' Priority'}
                        </span>
                    </div>
                    
                    <div class="text-nowrap">
                        <small class="text-muted">${new Date(task.id).toLocaleString()}</small>
                    </div>
                    
                    <div class="text-nowrap">
                        <button class="btn btn-outline-warning btn-sm me-1" data-bs-toggle="modal" data-bs-target="#editModal" onclick="editTask(${task.id})">Edit</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                </div>
            `;
            taskList.appendChild(li);        
            
        
        });
    }    


        window.taskComplete = function(taskId, isChecked) {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            task.complete = isChecked;
            localStorage.setItem('Faik_tasks', JSON.stringify(tasks));
            updateTaskCounts();
        };   

        let currentFilter = 'all'; // default
            
        FilterAll.classList.add('active');
        FilterActive.classList.remove('active');
        FilterCompleted.classList.remove('active');

        window.filterTasks = function(filter) {
            currentFilter = filter;
            
            if (filter === 'all') {
                FilterAll.classList.add('active');
                FilterActive.classList.remove('active');
                FilterCompleted.classList.remove('active');
            } else if (filter === 'active') {
                FilterAll.classList.remove('active');
                FilterActive.classList.add('active');
                FilterCompleted.classList.remove('active');
            } else if (filter === 'completed') {
                FilterAll.classList.remove('active');
                FilterActive.classList.remove('active');
                FilterCompleted.classList.add('active');
            }

            updateTaskCounts(); 
        };

        window.editTask = function(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            //alert(`task: ${task.text} ID: ${task.id}`);
            currentEditId = task.id;
            
            taskEditInput.value = task.text;

            if (task.priority === 'High') 
                priorityHigh.checked = true;
            else if (task.priority === 'Medium') 
                priorityMedium.checked = true;
            else 
                priorityLow.checked = true;
        }

    window.updateTask = function(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        // new values
        const newText = document.getElementById('taskEdit').value;
        let newPriority = 'Low';
        if (document.getElementById('high').checked) 
            newPriority = 'High';
        else if (document.getElementById('medium').checked) 
            newPriority = 'Medium';
        else if (document.getElementById('low').checked) 
            newPriority = 'Low';


        //alert(`Task ID: ${task.id} Old Text: ${task.text} New Text: ${newText} Old Priority: ${task.priority} New Priority: ${newPriority}`);

        task.text = newText; 
        task.priority = newPriority; 
        
        localStorage.setItem('Faik_tasks', JSON.stringify(tasks));

        alert("Updated");
        updateTaskCounts();
    };

     window.deleteTask = function(taskId) {

        tasks = tasks.filter(t => t.id !== taskId); 
        localStorage.setItem('Faik_tasks', JSON.stringify(tasks));
        updateTaskCounts();
        alert('Task deleted.');
    }

    function updateTaskCounts()
        {
            if (tasks.length === 0) {
                totaltask.textContent = '0';
                completedtask.textContent = '0';
                remainingtask.textContent = '0';

                taskstatus.style.display = 'block';
            }
            else {
                totaltask.textContent = tasks.length;
                completedtask.textContent = tasks.filter(task => task.complete).length;
                remainingtask.textContent = tasks.length - tasks.filter(task => task.complete).length;

                taskstatus.style.display = 'none';
            }


            activetask.textContent = remainingtask.textContent + ' active tasks';

            listTasks();
        }

         updateTaskCounts();

    // I didnt use function clearAllTasks because we are in addeventslistener otherwise we cant use in html button
        window.clearAllTasks = function() {
                localStorage.clear();
                alert('All tasks deleted!');
            };

});