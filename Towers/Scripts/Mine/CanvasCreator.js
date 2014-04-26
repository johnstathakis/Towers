var windowWidth = $(window).width();
var windowHeight = $(window).height();
var startTime = $.now();

var enemies = new Array();
var towers = new Array();
var bullets = new Array();
var towerTypes = new Array(type1 = ({
                                        height: 50,
                                        width: 15,
                                        shape: 'rectangle',
                                        color: '#2e2e2e',
                                        radius: '100',
                                    }),
                            type2 = ({
                                        height: 70,
                                        width: 30,
                                        shape: 'rectangle',
                                        color: '#5485ff',
                                        radius: '100',
                                    }),
                            type3 = ({
                                        height: 60,
                                        width: 20,
                                        shape: 'rectangle',
                                        color: '#55a535',
                                        radius: '100',
                            }),
                            type4 = ({
                                        height: 35,
                                        width: 10,
                                        shape: 'rectangle',
                                        color: '#fca353',
                                        radius: '100',
                            })
);

var enemyTypes = new Array(type1 = ({
                                        height: 100,
                                        width: 50,
                                        shape: 'rectangle',
                                        color: '#FF0000',
                                        speed: 15,
                                    }),
                            type2 = ({
                                        height: 20,
                                        width: 20,
                                        shape: 'rectangle',
                                        color: '#bd280d',
                                        speed: 60,
                                    })
                            );
var bulletTypes = new Array(
                            type1 = ({
                                height: 15,
                                width: 15,
                                shape: 'rectangle',
                                color: '#000000',
                                speed: 1,
                            })
);

enemyPath = "M0,418 L136,418 A1,1 0 0,1 457,418 A1,1 0 0,1 136,418 A1,1 0 0,1 457,418 L523,418 A1,1 0 0,0 1016,419 A1,1 0 0,0 523,418 A1,1 0 0,0 1016,419 L1080, 418 A1,1 0 0,1 1401,419 A1,1 0 0,1 1080,419 A1,1 0 0,1 1401,419 L1399,442 L1396,462 L1390,478 L1377,505 L1360,527 L1341,544 L1318,560 L1295,571 L1269,577 L1243,580 L1243,860 L0,860"


var enemiesExist = false;

function SVG(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function paintAndAddTower(left, top, type) {
    var newTower = createTower(left, top, type);
    newTower.attr('class', 'tower1');
    newTower.css('-webkit-transform-origin-x', (left + parseInt(newTower.attr('width'))/2) + 'px');
    newTower.css('-webkit-transform-origin-y', (top + parseInt(newTower.attr('height'))/2) + 'px');
    towers.push({
        tower: newTower,
        offset: newTower.offset(),
    });
}

function paintAndAddEnemy(type) {
    var newEnemy = createEnemy(type);
    newEnemy.attr('id', 'enemy' + enemies.length);
    var newAnimation = createAnimation(newEnemy, type.speed, enemyPath);
    newAnimation.attr('id', 'animation' + enemies.length);
    //document.getElementById('animation' + enemies.length).setAttribute('repeatCount', 'indefinite');
    enemies.push(newEnemy);
}

function paintAndAddBullet(type, bulletPath) {
    var newBullet = createBullet(type);
    newBullet.attr('id', 'bullet' + bullets.length);
    var newAnimation = createAnimation(newBullet, type.speed, bulletPath);
    newAnimation.attr('id', 'animation' + bullets.length);
    //document.getElementById('animation' + enemies.length).setAttribute('repeatCount', 'indefinite');
    bullets.push(newBullet);
}

function createTower(left, top, type) {
    var newTower = $(SVG('rect'))
            .attr('x', left)
            .attr('y', top)
            .attr('width', type.width)
            .attr('height', type.height)
            .attr('fill', type.color)
            .appendTo("#new-svg-object");
    return newTower;
}

function createEnemy(type) {
    var newEnemy = $(SVG('rect'))
            .attr('x', -(type.width/2))
            .attr('y', -(type.height/2))
            .attr('width', type.width)
            .attr('height', type.height)
            .attr('fill', type.color)
            .appendTo("#new-svg-object");
    return newEnemy;
}
function createBullet(type) {
    var newBullet = $(SVG('rect'))
            .attr('x', -(type.width / 2))
            .attr('y', -(type.height / 2))
            .attr('width', type.width)
            .attr('height', type.height)
            .attr('fill', type.color)
            .appendTo("#new-svg-object");
    return newBullet;
}

function createBulletPath() {
    var tower_center_x = towers[0].offset.left + parseInt(towers[0].tower.attr('width'));
    var tower_center_y = towers[0].offset.top + parseInt(towers[0].tower.attr('height'));

    var enemy_center_x = getEnemyLocations().x;
    var enemy_center_y = getEnemyLocations().y;

    var towerLocation = 'M' + tower_center_x + ',' + tower_center_y;
    var enemyLocation = 'L' + enemy_center_y + ',' + enemy_center_y;
    
    var bulletPath = towerLocation + " " + enemyLocation;
    return bulletPath;
}

function createAnimation(parent, dur, path) {
    var newAnimation = $(SVG('animateMotion'))
            .attr('begin', (($.now() - startTime) / 1000) + 's')
            .attr('dur', (dur))
            .attr('path', path)
            .attr('rotate', 'auto')
            .appendTo(parent);
    return newAnimation;
}

$( "#go-button" ).click(function() {
    makeWave(1, enemyTypes[1]);
});

function makeWave(waveNumber, type) {
    var counter = 0;
    var i = setInterval(function () {
        enemiesExist = true;
        paintAndAddEnemy(type);
        counter++;
        if (counter === 50) {
            clearInterval(i);
        }
    }, 425);
}

function enemyInFirst() {
    var enemy = enemies[0].attr('id');

    return enemy;
}

function getEnemyLocations() {
    var enemy = document.getElementById('' + enemyInFirst());
    var matrix = enemy.getCTM();
    var position = document.getElementById('new-svg-object').createSVGPoint();
    return position = position.matrixTransform(matrix);
}

function updateTowers(enemyLocation) {
    if(towers.length){
        for (var i = 0; i < towers.length; i++) {
            var center_x = towers[i].offset.left + parseInt(towers[i].tower.attr('width'));
            var center_y = towers[i].offset.top + parseInt(towers[i].tower.attr('height'));
            var radians = Math.atan2(center_y - enemyLocation.y, enemyLocation.x - center_x);
            var degree = -radians * 180 / Math.PI;
            var css = 'rotate(' + (degree + 90) + 'deg)';
            towers[i].tower.css({
                '-moz-transform': css,
                '-webkit-transform': css,
                '-o-transform': css,
                '-ms-transform': css,
            });
        }
    }
}

window.setInterval(function () {
    if(enemiesExist){
        updateTowers(getEnemyLocations());
    }
    }, 5);

var bulletButton = $('#bullet-button');
bulletButton.click(function () {
        createBulletPath(getEnemyLocations());
        paintAndAddBullet(bulletTypes[0], createBulletPath);
});

var tower1Button = $('#tower-1-button');
var tower2Button = $('#tower-2-button');
var tower3Button = $('#tower-3-button');
var tower4Button = $('#tower-4-button');

var tower1ButtonPressed = 0;
var tower2ButtonPressed = 0;
var tower3ButtonPressed = 0;
var tower4ButtonPressed = 0;

tower1Button.mousedown(function () {
    tower1ButtonPressed = 1;
});
tower2Button.mousedown(function () {
    tower2ButtonPressed = 1;
});
tower3Button.mousedown(function () {
    tower3ButtonPressed = 1;
});
tower4Button.mousedown(function () {
    tower4ButtonPressed = 1;
});

$(document).mouseup(function (e) {
    if(tower1ButtonPressed === 1){
        paintAndAddTower(e.pageX, e.pageY, towerTypes[0]);
    }
    if (tower2ButtonPressed === 1) {
        paintAndAddTower(e.pageX, e.pageY, towerTypes[1]);
    }
    if (tower3ButtonPressed === 1) {
        paintAndAddTower(e.pageX, e.pageY, towerTypes[2]);
    }
    if (tower4ButtonPressed === 1) {
        paintAndAddTower(e.pageX, e.pageY, towerTypes[3]);
    }
    tower1ButtonPressed = 0;
    tower2ButtonPressed = 0;
    tower3ButtonPressed = 0;
    tower4ButtonPressed = 0;
});