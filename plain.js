// Var -- initial card array
var initCard = {task: "Welcome!", descrip: "Forgotodo is a responsive webapp to help you remember those oft-forgotten tasks/chores/good intentions. Stuff like calling your Mom, doing the laundry and putting on pants." , fresh:9};

// Colors for card backgrounds and fonts based on how often user has ignored card
var freshArr = ["black", "#3CE0A7", "#69E7BB", "#95EECF", "#C1F5E3", "#EDFCF7"];
var freshFont = ["#F7F7F7", "#F7F7F7", "darkslategray", "darkslategray", "#1111111", "#111111"];

// Initial card deck array
var binderArray = [];
// User scope based on which card is currently on top of pile.
var currScope = 0;
var currArray = [];
var todayArray = [];
var forgottenArray = [];
var todayCount;
var todayScope =[];
// Grab user's browser height/width
var allHeight = window.innerHeight;
var allWidth = window.innerWidth;

var taskTotal = document.getElementById('tasktotal');
var todayTotal = document.getElementById('todaytotal');
var addCard = document.getElementById('add');
var swipeEle = document.getElementById('swipeable');

//Anima.js initializer
var world = anima.world();
var aniTotal = world.add(document.getElementById('tasktotal'));
var aniToday = world.add(document.getElementById('tasktoday'));
var aniSwipe;
// Anima item updater -- only updates if cards array is not 0
function updateAni(){
    if (binderArray.length > 0){
        aniSwipe = world.add(document.getElementById('card'+currArray[0]));
    }
}
// Add hammer.js item 
var hamSwipe = new Hammer(swipeEle);

//Updating cards/tasks for left swipe/clicks
function leftSwipeupdate(){
    if (currArray.length == 0){
        //do nothing if length == 0 to keep anima from crashing
    } else {
        skipCard();
        //animates card off screen and runs a function to remove child afterwards
        aniSwipe.animate({
            translate: [-450, 0, 0],
            duration: 300
        }).on('end',function(){
            var v = document.getElementById('card'+currArray[0]);
            v.parentNode.removeChild(v);
            currArray.shift();
            if (currArray.length == 0){
            }else{
                updateAni();
            }
        });
    }
}
// Updating cards/tasks for right swipe/click
function rightSwipeupdate(){
    if (currArray.length == 0){
    }else{
        takeCard();
        aniSwipe.animate({
            translate: [450, 0, 0],
            duration: 300
        }).on('end',function(){
            var v = document.getElementById('card'+currArray[0]);
            v.parentNode.removeChild(v);
            currArray.shift();
            if (currArray.length == 0){
            }else{
                updateAni();
            }
        });
    }
}
//hammer.js swipe setters
hamSwipe.on('swipeleft', leftSwipeupdate);
hamSwipe.on('swiperight', rightSwipeupdate);
    
// left and right arrow key functionality to mimic swipe
document.addEventListener('keydown', function(event){
    if (event.keyCode == 37){
        leftSwipeupdate();
    }
});
document.addEventListener('keydown', function(event){
    if (event.keyCode == 39){
        rightSwipeupdate();
    }
});

//Sets top buttons with no of tasks in each scope
document.getElementById('tasktotal').innerHTML = "Leftover Tasks: "+(binderArray.length+forgottenArray.length);
document.getElementById('tasktoday').innerHTML = "Today's Tasks: "+todayArray.length;

// Clicking top button will display all tasks that have been added to today's agenda/array and will hide the unclaimed tasks
document.getElementById('tasktoday').addEventListener('click', function(event){
    todayCard();
    document.getElementById('swipeable').style.display = 'none';
    document.getElementById('swipeablebuttons').style.display = 'none';
    document.getElementById('typeable').style.display = 'none';
    addVis = false;
    document.getElementById('listable').style.display = 'block';
});
// Will hide today's tasks and show the unclaimed ones as well as check if the deck should be shuffled
document.getElementById('tasktotal').addEventListener('click', function(event) { 
    removeTodays();                                                     
    binderCheck();                                                         
    document.getElementById('swipeable').style.display = 'block';
    document.getElementById('swipeablebuttons').style.display = 'block';
    document.getElementById('listable').style.display = 'none';
});
// Creates a task card when player submits with at least a title, and deals on top
function createCard(){
    var t = document.getElementById('taskin').value; 
    var u = document.getElementById('descripa').value;
    if (t !== ""){
        binderArray.push({task: t, descrip: u, fresh: 5});
        dealNew();
    } else {
    }
}
// Checks to see if the unclaimed and ignored tasks are empty and adds a message
function binderCheck(){
    if(binderArray.length == 0 && forgottenArray.length == 0){
        document.getElementById('sysmsgt').innerHTML = 'No Cards!';
        document.getElementById('sysmsgu').innerHTML = 'Why not add some new ones?';   
    } else if (binderArray.length == 0) {
        document.getElementById('sysmsgt').innerHTML = 'Out of Cards!';
        document.getElementById('sysmsgu').innerHTML = 'Click here to deal again!';
        var v = document.getElementById('sysmsgu');
        checkEmpty(); 
        v.addEventListener('click', function _shuffle(event){
            dealCard();
            updateAni();
            this.removeEventListener('click',_shuffle);
        });
    }
}

// Checks if the binder is empty and reshuffles if so
function checkEmpty(){
    if (binderArray.length == 0){
        shuffle(forgottenArray);
        forgottenArray.forEach(function(v,i){
            binderArray.push(forgottenArray[i]);
        })
        forgottenArray = [];
    }    
}

// Adds event listener for onscreen buttons
document.getElementById('cardbuttonsleft').addEventListener('click', function(event){
    leftSwipeupdate();
});
document.getElementById('cardbuttonsright').addEventListener('click', function(event){
    rightSwipeupdate();
});

// Skips the current card shifting it to a different array and checks for a system card (like initcard)
function skipCard(){
    if (binderArray[[binderArray.length-1]].fresh == 9){
        binderArray.pop();
        binderCheck();
        document.getElementById('tasktotal').innerHTML = "Leftover Tasks: "+(binderArray.length+forgottenArray.length);
    }else{
        forgottenArray.push(binderArray[binderArray.length-1]);
        binderArray.pop();
        binderCheck();
        checkEmpty();
    }
}
// Takes the card/object and shifts it to the today array
function takeCard(){
    if (binderArray[binderArray.length-1].fresh == 9){
        binderArray.pop();
        binderCheck();
        document.getElementById('tasktotal').innerHTML = "Leftover Tasks: "+(binderArray.length+forgottenArray.length);
    }else{
        todayArray.push(binderArray[binderArray.length-1]);
        document.getElementById('tasktoday').innerHTML = "Today's Tasks: "+todayArray.length;
        binderArray.pop();
        binderCheck();
        checkEmpty();
        document.getElementById('tasktotal').innerHTML = "Leftover Tasks: "+(binderArray.length+forgottenArray.length);
        //Checks for mobile / tablet view to determine whether today cards are shown on screen or held within a button.
        if (allWidth > 400){
            removeTodays();
            todayCard();  
        };
    };
}

//Event listener for enter button on keyboards
document.getElementById('inputcontain').addEventListener('keydown', function(){
    if (event.keyCode == 13){
        createCard();
        document.getElementById('typeable').style.display = 'none';
        addVis = false;
        clearVal();
        document.getElementById('tasktotal').innerHTML = "Leftover Tasks: "+(binderArray.length+forgottenArray.length);
    };
});

// Hides and shows the add new task card
var addVis = false;
document.getElementById('add').addEventListener('click', function(event){
    if (addVis == false){
        document.getElementById('typeable').style.display = 'block';
        addVis = true;
    }else{
        document.getElementById('typeable').style.display = 'none';
        addVis = false;
    }
});

// Clears values for add new task card after user submits
function clearVal(){
    document.getElementById('taskin').value = "";
    document.getElementById('descripa').value = "";
};

// Hides add new task card if user cancels
document.getElementById('cancel').addEventListener('click', function(){
    document.getElementById('typeable').style.display = 'none';
    addVis = false;
    clearVal();
});
// Submit button for add new task and updates totals
document.getElementById('submit').addEventListener('click', function(){
    createCard();
    document.getElementById('typeable').style.display = 'none';
    addVis = false;
    clearVal();
    document.getElementById('tasktotal').innerHTML = "Leftover Tasks: "+(binderArray.length+forgottenArray.length);
});

// Checks for width of device to set responsive elements, adds system card and deals any existing cards.
window.onload = function(){
    document.body.style.width = allWidth+"px";
    if (allWidth > 400){
        document.getElementById('background').style.height = allHeight+"px";
        document.getElementById('deskbar').style.height = allHeight+"px";
    };
    shuffle(binderArray);
    welcCard();
    dealCard();
    getView();
};
// Pushes welcome card to user's array
function welcCard(){
    binderArray.push(initCard);
    document.getElementById('tasktotal').innerHTML = "Leftover Tasks: "+(binderArray.length+forgottenArray.length);
}
//Sets height to user's device
function getView(){
    allHeight = window.innerHeight;
    document.getElementById('body').style.height = allHeight+"px";
}
// Knuth shuffle function
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

// Displays claimed tasks creating them on the fly from the array.
function todayCard(){
    todayArray.forEach(function(v,i){
    var widthCheck;
    if (allWidth > 400){
        widthCheck = 'desklist';
    } else {
        widthCheck = 'listable';
    };
    var listable = document.getElementById(widthCheck);
    var card = document.createElement('div');
    listable.appendChild(card);
    card.className = 'listable';
    card.id = 'today'+i;
    todayScope.push(card.id);
    var t = document.createElement('div');
    var u = document.createElement('div');
    var v = document.createElement('div');
    card.appendChild(t);
    card.appendChild(u);
    card.appendChild(v);
    t.id = 'task';
    u.id = 'descrip';
    v.className = 'donebutt';
    v.id = 'donebutt'+i;
    t.innerHTML = todayArray[i].task;
    u.innerHTML = todayArray[i].descrip;
    v.innerHTML = 'Return to Deck';
    var click = v.id;
    document.getElementById(click).addEventListener('click', function _returns(event){
    var d = document.getElementById(widthCheck);
    var e = document.getElementById(card.id);
    var begone = d.removeChild(e);
    todayScope.forEach(function(v,i){
       if (todayScope[i] == card.id){
            todayScope.splice(i, 1);
           var gone = todayArray.splice(i, 1);
           forgottenArray.push(gone[0]);
           document.getElementById('tasktotal').innerHTML = "Leftover Tasks: "+(binderArray.length+forgottenArray.length);
           document.getElementById('tasktoday').innerHTML = "Today's Tasks: "+(todayArray.length);
       }
    });
        this.removeEventListener('click', _returns);
    });
        if (allWidth > 400){
            card.style.zIndex = 50+1;   //sets cards just above the background on tablet/desktop
        };
    });
    binderCheck();
}

// Removes all today cards in DOM to redraw when array updates
function removeTodays(){
    var widthCheck;
    if (allWidth > 400){
        widthCheck = 'desklist';
    } else {
        widthCheck = 'listable';
    };
    var lists = document.getElementById(widthCheck);
    while (lists.firstChild) {
        lists.removeChild(lists.firstChild);   
    };
    todayScope = [];
};

// Random number to shift cards to look like they're stacked loosely
function randPixels(){
    var negaplier = Math.random() < 0.5 ? -1 : 1;
    var math = Math.floor(Math.random() * 10);
    return (negaplier * math);
}

// Adds new task to pile when user adds task
function dealNew(){
    var swipeable = document.getElementById('swipeable');
    var card = document.createElement('div');
    var newId = (binderArray.length + forgottenArray.length + todayArray.length);
    card.id = 'card'+newId;
    currArray.unshift(newId);
    card.className = 'swipeable';
    card.style.position = 'absolute';
    card.style.top = randPixels()+"px";
    card.style.marginLeft = randPixels()+"px";
    swipeable.appendChild(card);
    var t = document.createElement('div');
    var u = document.createElement('div');
    card.appendChild(t);
    card.appendChild(u);
    var arr = binderArray[binderArray.length-1];
    card.style.zIndex = binderArray.length - 1;
    card.style.backgroundColor = freshArr[binderArray[binderArray.length-1].fresh];
    t.id = 'task';
    u.id = 'descrip';
    t.style.color = freshFont[arr.fresh];
    u.style.color = freshFont[arr.fresh];
    t.innerHTML = arr.task;
    u.innerHTML = arr.descrip;
    updateAni();
}
// Deals all cards in unclaimed array
function dealCard(){
    binderArray.forEach(function(v,i){
        var swipeable = document.getElementById('swipeable');
        var card = document.createElement('div');
        card.id = 'card'+i;
        currArray.push(i);
        card.className = 'swipeable';
        card.style.position = 'absolute';
        card.style.top = randPixels()+"px";
        card.style.marginLeft = randPixels()+"px";
        swipeable.appendChild(card);
        var t = document.createElement('div');
        var u = document.createElement('div');
        card.appendChild(t);
        card.appendChild(u);
        var arr = binderArray[[binderArray.length-1]-i];
        card.style.zIndex = binderArray.length - i;
        card.style.backgroundColor = freshArr[binderArray[[binderArray.length-1]-i].fresh];
        t.id = 'task';
        u.id = 'descrip';
        t.style.color = freshFont[arr.fresh];
        u.style.color = freshFont[arr.fresh];
        t.innerHTML = arr.task;
        u.innerHTML = arr.descrip;
    });
    updateAni();
}