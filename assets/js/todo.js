document.addEventListener('DOMContentLoaded', function() {
    //https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    //https://www.w3schools.com/jsref/prop_win_localstorage.asp

    // Elements 
    let totaltask = document.getElementById('totaltask');
    let complatedtask = document.getElementById('complatedtask');
    let remainingtask = document.getElementById('remainingtask');


    
    let taskAddinput = document.getElementById('taskAddinput');
    let taskAddBtn = document.getElementById('taskAddBtn');


    let activetask = document.getElementById('activetask');
    let taskstatus = document.getElementById('taskstatus');

    // Task Array 
    let tasks = JSON.parse(localStorage.getItem('Faik_tasks')) || [];



    taskAddBtn.addEventListener('click',function(){
        let tasktext = taskAddinput.value.trim();
        if (tasktext === "") {
            alert("Please write to task");
            return;
        }

        let newTask = {
            id : Date.now(),
            text : tasktext,
            complete : false , 
            priority : 'Low' ,
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
        tasks.forEach(task => {
            console.log(`ID: ${task.id}, Text: ${task.text}, Completed: ${task.complete}, Priority: ${task.priority}`);
           
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.id = task.id; 
            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" ${task.complete ? 'checked' : ''}>
                    </div>
                    <div class="flex-grow-1">
                        <span class="${task.complete ? 'text-decoration-line-through text-muted' : ''}">
                            ${task.text}
                        </span>
                        <span class="badge bg-${task.complete ? 'success' : task.priority === 'High'? 'danger' : task.priority === 'Medium' ? 'warning' : 'secondary'}">
                            ${task.complete ? 'Completed' : task.priority + ' Priority'}
                        </span>
                    </div>
                    <button class="btn btn-outline-warning btn-sm" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                    <button class="btn btn-outline-danger btn-sm">Delete</button>
                </div>
            `;
            taskList.appendChild(li);        
            
        
        });
    }    


    function updateTaskCounts()
        {
            if (tasks.length === 0) {
                totaltask.textContent = '0';
                complatedtask.textContent = '0';
                remainingtask.textContent = '0';

                taskstatus.style.display = 'block';
            }
            else {
                totaltask.textContent = tasks.length;
                complatedtask.textContent = tasks.filter(task => task.complete).length;
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