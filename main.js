var globalBalls = [];

var unknownGroup = new Group();
var normalGroup = new Group();
var heavyGroup = new Group();
var lightGroup = new Group();

var gourpA = new Group();
var gourpB = new Group();

var weightFun;

var deductionPath = [];

$(document).ready(function(){
  init();
});

function fireBug(message) {
  console.trace(message);
}

// Ball class
function Ball(id, type) {
  this.type = type;
  this.id = id;
}
Ball.prototype.toHtml = function () {
  var elem = $('<div class="ball ' + this.type + '>' + id + '</div>');
  elem.on('click', function () {
    $(this).elem.toggleCss('selected');
  });
  return elem;
};

// Ball group class
function Group() {
  this.balls = {};
}
Group.prototype.putBalls = function (id) {
  var balls = this.balls;
  if (!$.isArray(id)) {
    balls[id] = true;
  } else {
    for (var i = 0; i < id.length; i++) {
      balls[id[i]] = true;
    }
  }
};
Group.prototype.removeNBalls = function (count) {
  var balls = this.balls;
  var keys = Object.keys(balls);
  var res = [], c = 0;
  for (var i = 0; i < keys.length && c < count; i++) {
    res.push(keys[i]);
    delete balls[keys[i]];
    c++;
  }
  return res;
};
Group.prototype.removeBallById = function (id) {
  var balls = this.balls;
  var tmp = balls[id];
  delete balls[id];
  return tmp;
};
Group.prototype.containsBall = function (id) {
  var balls = this.balls;
  return !!balls[id];
};
Group.prototype.getBalls = function (count) {
  var balls = this.balls;
  var keys = Object.keys(balls);
  if (keys.length < count) {
    fireBug('get more balls than expected');
    return;
  }
  return keys.slice(0, count);
};
Group.prototype.getLength = function () {
  var balls = this.balls;
  return Object.keys(balls);
};

// Deduction area class
function Deduction() {
  var groupA, groupB, future;

  switch (deductionPath) {
    case []:
      // choose 4 balls for both group
      future = chooseBall([1,2,3,4,5,6], 4).then(function (res) {
        groupA = res;
        return chooseBall([7,8,9,10,11,12], 4);
      }).then(function (res) {
        groupB = res;
        return {A: groupA,B: groupB};
      });
      break;
    case [true]:
      
      future = chooseBall(unknownGroup, 3).then(function (res) {
        groupA = res;
        groupB = normalGroup.getBalls(3);
        return {A: groupA,B: groupB};
      });
      break;
    case [false]:
      future = chooseBall(heavyGroup, 4).then(function (res) {
        groupA = res;
        return chooseBall(lightGroup, 1);
      }).then(function (res) {
        // A = 3 heavy + 1 light, B = 3 normal + 1 heavy
        groupB = new Group();
        groupB.putBalls(normalGroup.getBalls(3));
        group.putBalls(groupA.removeNBalls(1));
        groupA.putBalls(res.getBalls(1));
        return {
          A: groupA,
          B: groupB
        };
      });
      break;
  }
}


function chooseBall(from, count) {
  var container = $('<div class="choose"></div>');
  var actionButton = $('<button>select</button>');
  var deferred = Q.deferred();
  for (var i = 0; i < from.length; i++) {
    container.append(globalBalls[from[i]].toHtml());
  }
  container.append(actionButton);
  actionButton.on('click', function () {
    var selectedBall = container.find('.ball.selected');
    if (selectedBall.length != count) {
      alert('Please pick ' + count + ' balls');
      return;
    }
    var selectedGroup = new Group();
    selectedBall.each(function (index, element) {
      selectedGroup.putBalls(elem.val());
    });
    deferred.resolve(selectedGroup);
  });
  return deferred.promise;
}

function init() {
  $('.initialSetup button').on('click', function () {
    var badId = $('#badBall').val();
    if (!badId || badId < 1 || badId > 12) {
      alert('wrong bad ball selection');
      $('#badBall').val('');
      return;
    }
    var badHeavy = $('#weight').val();
    if (badHeavy === null) {
      alert('you must tell if bad ball is heavy');
      return;
    }
    weightFun = function (leftGroup, rightGroup) {
      var leftBad = leftGroup.containsBall(badId);
      var rightBad = rightGroup.containsBall(badId);
      if ((leftBad && badHeavy) || (rightBad && !badHeavy)) {
        return 'left';
      }
      if ((leftBad && !badHeavy) || (rightBad && badHeavy)) {
        return 'right';
      }
      return 'equal';
    };
  });
  for (var i = 1; i <= 12; i++) {
    globalBalls.push(new Ball(i, 'unknown'));
    unknownGroup.putBalls(i);
  }
}

function setupListener() {
}
