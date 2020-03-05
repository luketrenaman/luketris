window.onload = function() {
    let colors = ["#ffffff", "#42ebf4", "#415ff4", "#f7c922", "#f7f321", "#48f721", "#aa1efc", "#fc1e1e"];
    let previewColors = ["#ffffff", "#b2f7fb", "#b1befb", "#fbe595", "#fbf994", "#a7fb94", "#d693fe", "#fe9393"];
    class tetrimino {
        constructor(x, y, c) {
            this.c = c;
            this.parts = [];
            this.futureParts = [new tetrim(0,0,0), new tetrim(0,0,0), new tetrim(0,0,0), new tetrim(0,0,0)];
            this.x = x;
            this.y = y;
            //facing up 0
            //facing right 1
            //facing down 2
            //facing left 3

            switch (c) {

                case 1:
                    this.parts.push(new tetrim(x, y, c));
                    this.parts.push(new tetrim(x + 1, y, c));
                    this.parts.push(new tetrim(x + 2, y, c));
                    this.parts.push(new tetrim(x + 3, y, c));
                    break;
                case 2:
                    this.parts.push(new tetrim(x, y, c));
                    this.parts.push(new tetrim(x, y + 1, c));
                    this.parts.push(new tetrim(x + 1, y + 1, c));
                    this.parts.push(new tetrim(x + 2, y + 1, c));
                    break;
                case 3:
                    this.parts.push(new tetrim(x + 2, y, c));
                    this.parts.push(new tetrim(x, y + 1, c));
                    this.parts.push(new tetrim(x + 1, y + 1, c));
                    this.parts.push(new tetrim(x + 2, y + 1, c));
                    break;
                case 4:
                    this.parts.push(new tetrim(x, y, c));
                    this.parts.push(new tetrim(x + 1, y, c));
                    this.parts.push(new tetrim(x, y + 1, c));
                    this.parts.push(new tetrim(x + 1, y + 1, c));
                    break;
                case 5:
                    this.parts.push(new tetrim(x + 1, y, c));
                    this.parts.push(new tetrim(x + 2, y, c));
                    this.parts.push(new tetrim(x, y + 1, c));
                    this.parts.push(new tetrim(x + 1, y + 1, c));
                    break;
                case 6:
                    this.parts.push(new tetrim(x + 1, y + 1, c));
                    this.parts.push(new tetrim(x + 2, y + 1, c));
                    this.parts.push(new tetrim(x, y, c));
                    this.parts.push(new tetrim(x + 1, y, c));
                    break;

                case 7:

                    this.parts.push(new tetrim(x + 1, y, c));
                    this.parts.push(new tetrim(x, y + 1, c));
                    this.parts.push(new tetrim(x + 1, y + 1, c));
                    this.parts.push(new tetrim(x + 2, y + 1, c));
                    break;
            }
            if (!this.parts.every(function(val) {
                    return 0 === grid[val.y][val.x];
                })) {
                game = false;
            }

        }
        move(x, y) {
            if (this.parts.every(function(val) {
                    return val.future(x, y);
                })) {
                for (let i = 3; i >= 0; i--) {
                    this.parts[i].move(x, y);
                }
                if(y > 0){
                    score++;
                }
                this.x = this.x + x;
                this.y = this.y + y;
                return true;
            } else if (y != 0) {
                active.parts.forEach(function(val) {
                    grid[val.y][val.x] = val.c;
                })
                let ln = 0;
                grid.forEach(function(val, index) {
                    if (val.every(function(cell) {
                            return cell !== 0;
                        })) {
                        ln++;
                        grid.splice(index, 1);
                        grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                    }
                })
                score += [0,40,100,300,1200][ln];
                lines += ln;

                for (let i = 0; i < 24; i++) {
                    for (let j = 0; j < 10; j++) {
                        ctx.fillStyle = colors[grid[i][j]];
                        ctx.fillRect(j * 20 + 2, i * 20 + 2, 18, 18);
                    }
                    //active = new tetrimino(0, 0, 1)
                }
                active = nextPc[0];
                next();
                return false;

            }
        }
        showFuture(){
            let counter = 0;
            while(this.parts.every(function(val) {
                return val.future(0, counter);
            })){
                counter++;
            }
            this.futureParts.forEach(function(val){
                ctx.fillStyle = colors[0];
                ctx.fillRect(val.x * 20 + 2, val.y * 20 + 2, 18, 18);
            })
            for (let i = 0; i < this.parts.length; i++) {
                this.futureParts[i].x = this.parts[i].x;
                this.futureParts[i].c = this.parts[i].c;
                this.futureParts[i].y = this.parts[i].y + counter - 1;
            }
        }
        drop(){
            let ascore = score;
            while(this.move(0,1)){
                
            }
            score += (score - ascore);
        }
        check(n) {
            let a = this;
            //Check if rotation is possible with offset of n
            if (this.parts.every(function(val) {
                    if (grid[val.ny] === undefined) return false;
                    return grid[val.ny][val.nx + n] === 0;
                })) {
                this.parts.forEach(function(val) {
                    val.x = val.nx + n;
                    val.y = val.ny;
                })
                a.x += n;
                return true;
            }
            return false;
        }
        rotate(d) {
            let a = this;
            a.cx = a.x + 1;
            a.cy = a.y + 1;
            if (a.c === 1) {
                a.cx += .5;
                a.cy += .5;
            }
            if (a.c === 4) {
                return true;
            }
            //rotating right
            if (d === 1) {
                this.parts.forEach(function(val) {
                    ctx.fillStyle = colors[0];
                    ctx.fillRect(val.x * 20 + 2, val.y * 20 + 2, 18, 18);
                    let y = val.y;
                    let x = val.x;
                    val.nx = (y - a.cy) * -1 + a.cx;
                    val.ny = (x - a.cx) + a.cy;
                })
                if (!a.check(0)) {
                    if (!a.check(-1)) {
                        a.check(1);
                    }
                }
            }
            /*if (d === -1) {

            }*/
        }
    }

    class tetrim {
        constructor(x, y, c) {
            this.x = x;
            this.y = y;
            this.c = c;
        }
        move(x, y) {
            ctx.fillStyle = colors[0]
            ctx.fillRect(this.x * 20 + 2, this.y * 20 + 2, 18, 18);
            grid[this.y][this.x] = 0;
            this.x = this.x + x;
            this.y = this.y + y;
            //grid[this.x][this.y] =  
        }
        future(x, y) {
            if (grid[this.y + y] === undefined) return false;
            return grid[this.y + y][this.x + x] === 0;
        }
    }
    //10x24
    var c = document.getElementById("cynthiaisdum");
    var ctx = c.getContext("2d");
    //Generate grid
    let grid, score, lines, active, cd, rotate, hardDrop, kcd, key, game, nextPc, pause, allowPause;
    function drawGrid(){
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 10; j++) {
                ctx.rect(j * 20 + 1, i * 20 + 1, 20, 20);
                ctx.stroke();
            }
        }
        ctx.rect(11 * 20 + 1, 25 * 20 + 1, 20, 20); //Fix gray error
        ctx.stroke();
    }
    function reset(){
        ctx.clearRect(0, 0, c.width, c.height);

        grid = [];
        for (let i = 0; i < 24; i++) {
            grid.push([]);
            for (let j = 0; j < 10; j++) {
                grid[i].push(0);
            }
        }
        drawGrid();
    score = 0;
    lines = 0;
    active = new tetrimino(3, 0, Math.floor(Math.random() * 6) + 1);
    cd = 30*17;
    rotate = true;
    hardDrop = true;
    kcd = 0;
    key = [];
    game = true;
    nextPc = [];

    pause = false;
    allowPause = true;
    for(i = 0; i < 3;i++){
        nextPc.push(new tetrimino(3, 0, Math.floor(Math.random() * 6) + 1));
    }
    }
    function draw() {
        active.showFuture();
        active.futureParts.forEach(function(val){
            ctx.fillStyle = previewColors[val.c];
            ctx.fillRect(val.x * 20 + 2, val.y * 20 + 2, 18, 18);
        })
        active.parts.forEach(function(val) {
            ctx.fillStyle = colors[val.c];
            ctx.fillRect(val.x * 20 + 2, val.y * 20 + 2, 18, 18);
        })
        for(let i = 0; i < 3;i++){
            ctx.fillStyle = colors[nextPc[i].c];
            nextPc[i].parts.forEach(function(part){
                ctx.fillRect((part.x-3) * 10 + 10 * 20 + 20, part.y * 10 + i * 40, 10, 10);
            })
        }
    }

    function next(){
        for(i = 0; i < 3;i++){
            ctx.fillStyle = colors[0];
            nextPc[i].parts.forEach(function(part){
                ctx.fillRect((part.x-3) * 10 + 10 * 20 + 20, part.y * 10 + i * 40, 10, 10);
            })
        }
        nextPc.shift();
        nextPc.push(new tetrimino(3, 0, Math.floor(Math.random() * 6) + 1));
    }
    function togglePause(){
        pause = !pause;
        if(pause){
            document.getElementById("cynthiaisdum").style = "filter:blur(4px)";
            document.getElementById("pause").textContent = "Unpause";
        }
        if(!pause){
            document.getElementById("cynthiaisdum").style = "filter:blur(0px)";
            document.getElementById("pause").textContent = "Pause";
            requestAnimationFrame(loop);
        }
    }
    drawGrid();
    document.body.onkeydown = function(e) {
        if(e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 32)
        e.preventDefault();

        if(!game){
            return;
        }
        if(e.keyCode === 80 && allowPause){
            togglePause();
        }
        if(pause){
            return;
        }

        if (rotate && (e.keyCode === 38 || e.keyCode === 87)) {
            rotate = false;
            active.rotate(1);
            draw();
            kcd = 4;
        }
        if(hardDrop && e.keyCode === 32){
            hardDrop = false;
            active.drop();
            draw();

        }

        if (key.indexOf(e.keyCode) == -1) {
            key.push(e.keyCode);
            kcd = 0;
        }

    };
    document.body.onkeyup = function(e) {
        if(!game || pause){
            return;
        }
        if(e.keyCode === 80){
            allowPause = true;
        }
        if (e.keyCode === 38 || e.keyCode === 87) {
            rotate = true;
        }
        if (e.keyCode === 32) {
            hardDrop = true;
        }
        key.splice(key.indexOf(e.keyCode), 1);
        kcd = 0;
    }

    function gameOver() {
        /*for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 10; j++) {
                ctx.fillStyle = "rgb(" + 180 + "," + 180 + "," + 244 + ")";
                ctx.fillRect(j * 20, i * 20, 20, 20);
            }

        }
        */  
    }
    let then = Date.now();
    let now = Date.now();
    function loop() {
        now = Date.now();
        let delta = now-then;
        cd -= delta;
        kcd -= delta;
        then = Date.now();
        if (kcd <= 0) {
            if (key.indexOf(37) != -1 || key.indexOf(65) != -1) {
                active.move(-1, 0);
                draw();
                kcd = 10*17;
            }
            if (key.indexOf(39) != -1 || key.indexOf(68) != -1) {
                active.move(1, 0);
                draw();
                kcd = 10*17;
            }
            if (key.indexOf(40) != -1 || key.indexOf(83) != -1) {
                active.move(0, 1);
                draw();
                cd = 20*17;
                kcd = 7*17;
            }

        }
        if (cd <= 0) {
            active.move(0, 1);
            draw();
            cd = 20*17;
        }
        document.getElementById("score").textContent = score;
        document.getElementById("lines").textContent = lines;
        if (game) {
            if(!pause){
                requestAnimationFrame(loop);
            }
        } else {
            requestAnimationFrame(gameOver);
        }
    }
    document.getElementById("start").onclick = function(){
        document.getElementById("start").textContent = "Restart";
            document.getElementById("cynthiaisdum").style = "filter:blur(0px)";
            reset();
            requestAnimationFrame(loop);
            draw();
    }
    document.getElementById("pause").onclick = togglePause;
}
