//App Singleton Controller
var MyTaskListApp = function () {

    //private data of the controller
    var tasks = [];
    var TASKS_KEY = "time_capture_tasks";
    var currentTaskIndex = -1;

    //private methods
    var loadTasks = function () {
        if (localStorage) {
            var storedTasks = localStorage[TASKS_KEY];
            if (!storedTasks) {
                syncStorage();
            }
            else {
                tasks = JSON.parse(storedTasks);
            }
        }
    };

    var syncStorage = function () {
        localStorage[TASKS_KEY] = JSON.stringify(tasks);
    };

    var updateCurrentTask = function () {
        var currentTask = tasks[currentTaskIndex];
        currentTask.title = $('#taskName').val();
        currentTask.description = $('#taskDescription').val();
        currentTask.done = ($('#taskCompleted').val() === "yes");
        currentTask.dueDate = $('#taskDate').val();
        currentTask.logNum = $('#taskLogNum').val();
        currentTask.timeSpent = $('#taskEstimation').val();
    };


    var displayTasks = function () {
        var list = $('#taskList');
        var index = 0;
        var count = 0;
        var task = null;
        var newLI = null;
        list.empty();

        var createTapHandler = function (index) {
            return function () {
                console.log(index);
                MyTaskListApp.setCurrentTaskIndex(index);
                $.mobile.changePage('form.html');
            };
        };

        //count = tasks.lenght on following line "caches" the length because JavaScript recalculates the length with every iteration

        for (index = 0, count = tasks.length; index < count; ++index) {
            task = tasks[index];
            newLI = $('<li>');
            newLI.on('tap', createTapHandler(index));
            newLI.append(task.title);
            list.append(newLI);
        }

        //many objects need refresh at the end to display them correctly
        list.listview('refresh');
    };

    var fillForm = function () {
        var currentTask = tasks[currentTaskIndex];
        $('#taskName').val(currentTask.title);
        $('#taskDescription').val(currentTask.description);
        $('#taskDate').val(currentTask.dueDate);
        $('#taskLogNum').val(currentTask.logNum);
        $('#taskEstimation').val(currentTask.timeSpent);

        var slider = $('#taskCompleted');
        var value = (currentTask.done) ? 1 : 0;
        slider[0].selectedIndex = value;
        slider.slider('refresh');
    };


    //public interface of the controller
    return {
        init: function () {
            loadTasks();
        },

        Task: function () {
            this.done = false;
            this.title = "New Task";
            this.description = "No description";
            this.dueDate = new Date();
            this.logNum = "";
            this.timeSpent = 1;
        },

        addTask: function (task) {
            console.log('adding a task');
            currentTaskIndex = tasks.length;
            tasks.push(task); //add item to the array
            syncStorage();
        },

        refreshTasks: function () {
            displayTasks();
        },

        saveCurrentTask: function () {
            updateCurrentTask();
            syncStorage();
            $.mobile.changePage('index.html');
        },

        displayTask: function () {
            fillForm();
        },

        setCurrentTaskIndex: function (index) {
            currentTaskIndex = index;
        },

        deleteCurrentTask: function () {
            tasks.splice(currentTaskIndex, 1);
            syncStorage();
            $.mobile.changePage('index.html');
        }
    };
} ();


// jQueryMobile events
$('#indexPage').live('pageinit', function () {
    MyTaskListApp.init();

    //add event to task button
    $('#addTaskButon').on('tap', function () {
        var newTask = new MyTaskListApp.Task(); // somehow create a task
        MyTaskListApp.addTask(newTask);
    });
});


$('#indexPage').live('pageshow', function () {
    MyTaskListApp.refreshTasks();
});

$('#formPage').live('pageinit', function () {
    $('#saveButton').on('tap', function () {
        MyTaskListApp.saveCurrentTask();
    });
});

$('#formPage').live('pagebeforeshow', function () {
    MyTaskListApp.displayTask();
});

$('#deletePage').live('pageinit', function () {
    $('#deleteButton').on('tap', function () {
        MyTaskListApp.deleteCurrentTask();
    });
});