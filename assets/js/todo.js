document.addEventListener('DOMContentLoaded', function() {
    //https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    //https://www.w3schools.com/jsref/prop_win_localstorage.asp

    // Elements 
    let totaltask = document.getElementById('totaltask');
    let complatedtask = document.getElementById('complatedtask');
    let remainingtask = document.getElementById('remainingtask');


    
    let taskAddinput = document.getElementById('taskAddinput');
    let taskAddBtn = document.getElementById('taskAddBtn');

    // Task Array 
    let tasks = JSON.parse(localStorage.getItem('Faik_tasks')) || [];
    console.log(tasks);



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



     function updateTaskCounts()
        {
            if (tasks.length === 0) {
                totaltask.textContent = '0';
                complatedtask.textContent = '0';
                remainingtask.textContent = '0';
            }
            else {
                totaltask.textContent = tasks.length;;
                complatedtask.textContent = tasks.filter(task => task.completed).length;
                remainingtask.textContent = tasks.filter(task => task.remaining).length;
            }
        }

         updateTaskCounts();

});