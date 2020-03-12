window.onload = function() {
    function emulateKeycode(elem, keycode) {
        document.getElementById(elem).onclick = function() {
            var evt = new KeyboardEvent('keydown', {
                'keyCode': keycode,
                'which': keycode
            });
            document.dispatchEvent(evt);
            setTimeout(function() {
                var evt2 = new KeyboardEvent('keyup', {
                    'keyCode': keycode,
                    'which': keycode
                });
                document.dispatchEvent(evt2);
            }, 10)
        }
    }
    emulateKeycode("hold", 67);
    emulateKeycode("rotate", 38);
    emulateKeycode("pauseKey", 80);
    emulateKeycode("left", 37);
    emulateKeycode("down", 40);
    emulateKeycode("right", 39);
    emulateKeycode("space",32);
    if (/Mobi/.test(navigator.userAgent)) {
        document.getElementById("d-pad").style = "visibility:visible";
    }
    let colors = ["#ffffff", "#42ebf4", "#415ff4", "#f7c922", "#f7f321", "#48f721", "#aa1efc", "#fc1e1e"];
    let previewColors = ["#ffffff", "#b2f7fb", "#b1befb", "#fbe595", "#fbf994", "#a7fb94", "#d693fe", "#fe9393"];
    let preload = {};

    function add(src) {
        let image = new Image();
        image.src = src;
        preload[src] = image;
    }
    add("lukes/sq-bl.png");
    add("lukes/sq-br.png");
    add("lukes/sq-tl.png");
    add("lukes/sq-tr.png");
    add("lukes/l1-1.png");
    add("lukes/l1-2.png");
    add("lukes/l1-3.png");
    add("lukes/l1-4.png");
    add("lukes/l2-1.png");
    add("lukes/l2-2.png");
    add("lukes/l2-3.png");
    add("lukes/l2-4.png");
    add("lukes/t-1.png");
    add("lukes/t-2.png");
    add("lukes/t-3.png");
    add("lukes/t-4.png");
    add("lukes/w-1.png");
    add("lukes/w-2.png");
    add("lukes/w-3.png");
    add("lukes/w-4.png");
    add("lukes/z1-1.png");
    add("lukes/z1-2.png");
    add("lukes/z1-3.png");
    add("lukes/z1-4.png");
    add("lukes/z2-1.png");
    add("lukes/z2-2.png");
    add("lukes/z2-3.png");
    add("lukes/z2-4.png");
    class tetrimino {
        constructor(x, y, c) {
            this.c = c;
            this.parts = [];
            this.futureParts = [new tetrim(0, 0, 0), new tetrim(0, 0, 0), new tetrim(0, 0, 0), new tetrim(0, 0, 0)];
            this.x = x;
            this.y = y;
            //facing up 0
            //facing right 1
            //facing down 2
            //facing left 3

            switch (c) {

                case 1:
                    this.parts.push(new tetrim(x, y, c, "lukes/w-1.png"));
                    this.parts.push(new tetrim(x, y + 1, c, "lukes/w-2.png"));
                    this.parts.push(new tetrim(x, y + 2, c, "lukes/w-3.png"));
                    this.parts.push(new tetrim(x, y + 3, c, "lukes/w-4.png"));
                    break;
                case 2:
                    this.parts.push(new tetrim(x, y, c, "lukes/l2-1.png"));
                    this.parts.push(new tetrim(x + 1, y, c, "lukes/l2-2.png"));
                    this.parts.push(new tetrim(x, y + 1, c, "lukes/l2-3.png"));
                    this.parts.push(new tetrim(x, y + 2, c, "lukes/l2-4.png"));
                    break;
                case 3:
                    this.parts.push(new tetrim(x, y, c, "lukes/l1-1.png"));
                    this.parts.push(new tetrim(x + 1, y, c, "lukes/l1-2.png"));
                    this.parts.push(new tetrim(x + 1, y + 1, c, "lukes/l1-3.png"));
                    this.parts.push(new tetrim(x + 1, y + 2, c, "lukes/l1-4.png"));
                    break;
                case 4:
                    this.parts.push(new tetrim(x, y, c, "lukes/sq-tl.png"));
                    this.parts.push(new tetrim(x + 1, y, c, "lukes/sq-tr.png"));
                    this.parts.push(new tetrim(x, y + 1, c, "lukes/sq-bl.png"));
                    this.parts.push(new tetrim(x + 1, y + 1, c, "lukes/sq-br.png"));
                    break;
                case 5:
                    this.parts.push(new tetrim(x, y, c, "lukes/z1-1.png"));
                    this.parts.push(new tetrim(x, y + 1, c, "lukes/z1-2.png"));
                    this.parts.push(new tetrim(x + 1, y + 1, c, "lukes/z1-3.png"));
                    this.parts.push(new tetrim(x + 1, y + 2, c, "lukes/z1-4.png"));
                    break;
                case 6:
                    this.parts.push(new tetrim(x + 1, y, c, "lukes/z2-1.png"));
                    this.parts.push(new tetrim(x + 1, y + 1, c, "lukes/z2-2.png"));
                    this.parts.push(new tetrim(x, y + 1, c, "lukes/z2-3.png"));
                    this.parts.push(new tetrim(x, y + 2, c, "lukes/z2-4.png"));
                    break;

                case 7:

                    this.parts.push(new tetrim(x, y, c, "lukes/t-1.png"));
                    this.parts.push(new tetrim(x + 1, y, c, "lukes/t-2.png"));
                    this.parts.push(new tetrim(x + 2, y, c, "lukes/t-3.png"));
                    this.parts.push(new tetrim(x + 1, y + 1, c, "lukes/t-4.png"));
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
                if (y > 0) {
                    score++;
                }
                this.x = this.x + x;
                this.y = this.y + y;
                return true;
            } else if (y != 0) {
                active.parts.forEach(function(val) {
                    grid[val.y][val.x] = val;
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
                score += [0, 40, 100, 300, 1200][ln];
                lines += ln;

                for (let i = 0; i < 24; i++) {
                    for (let j = 0; j < 10; j++) {
                        //draw img at
                        //ctx.fillStyle = colors[grid[i][j]];
                        //ctx.fillRect(j * 26 + 2, i * 26 + 2, 24, 24);
                        if (grid[i][j]) {
                            grid[i][j].x = j;
                            grid[i][j].y = i;
                            drawImgAt(grid[i][j]);
                        } else {
                            ctx.fillStyle = colors[0];
                            ctx.fillRect(j * 26 + 2, i * 26 + 2, 24, 24);
                        }
                    }
                    //active = new tetrimino(0, 0, 1)
                }
                active = nextPc[0];
                next();
                allowHold = true;
                return false;

            }
        }
        showFuture() {
            let counter = 0;
            while (this.parts.every(function(val) {
                    return val.future(0, counter);
                })) {
                counter++;
            }
            clearParts(this.futureParts);
            for (let i = 0; i < this.parts.length; i++) {
                this.futureParts[i].x = this.parts[i].x;
                this.futureParts[i].c = this.parts[i].c;
                this.futureParts[i].y = this.parts[i].y + counter - 1;
                this.futureParts[i].rot = this.parts[i].rot;
                this.futureParts[i].img = this.parts[i].img;
            }
        }
        drop() {
            let ascore = score;
            while (this.move(0, 1)) {

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
                    val.rot += 1;
                    val.rot %= 4;
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
                a.cx -= .5;
                a.cy -= .5;
            }
            if (a.c === 7) {
                //a.cx -= .5;
                a.cy -= 1;
            }
            //rotating right
            if (d === 1) {
                clearParts(this.parts);
                this.parts.forEach(function(val) {
                    val.nx = (val.y - a.cy) * -1 + a.cx;
                    val.ny = (val.x - a.cx) + a.cy;
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
        constructor(x, y, c, img) {
            this.x = x;
            this.y = y;
            this.c = c;
            this.img = img;
            this.rot = 0;
        }
        move(x, y) {
            ctx.fillStyle = colors[0]
            ctx.fillRect(this.x * 26 + 2, this.y * 26 + 2, 24, 24);
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
    var c = document.getElementById("game");
    var ctx = c.getContext("2d");
    //Generate grid
    let grid, score, lines, active, cd, rotate, hardDrop, kcd, key, game, nextPc, pause, allowPause, heldPiece, allowHold;

    function drawGrid() {
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 10; j++) {
                ctx.rect(j * 26 + 1, i * 26 + 1, 26, 26);
                ctx.stroke();
            }
        }
        ctx.fillStyle = "#000000";
        ctx.font = "16px sans-serif";
        ctx.fillText("Held:", 10 * 26 + 30, 10 * 52);

    }

    function reset() {
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
        active = new tetrimino(3, 0, Math.floor(Math.random() * 7) + 1);
        cd = 30 * 17;
        rotate = true;
        hardDrop = true;
        kcd = 0;
        key = [];
        game = true;
        nextPc = [];

        pause = false;
        allowPause = true;

        heldPiece = null; //no piece is being held
        allowHold = true; //able after a new piece is dropped
        for (i = 0; i < 3; i++) {
            nextPc.push(new tetrimino(3, 0, Math.floor(Math.random() * 7) + 1));
        }
    }

    function drawImgAt(piece) {
        /*ctx.save();
        ctx.translate(c.width/2,c.height/2);

        let rad = piece.rot * 1/2 * Math.PI;
        ctx.rotate(rad);
        ctx.drawImage(piece.img ? preload[piece.img] : preload["lukes/sq-tr.png"],
        -c.width/2 + (piece.x * 26 + 2)*Math.cos(rad)-(piece.y * 26 + 2)*Math.sin(rad),
        -c.height/2 + (piece.x * 26 + 2)*Math.sin(rad)+(piece.y * 26 + 2)*Math.cos(rad));
        //ctx.fillRect(piece.x * 26 + 2, piece.y * 26 + 2, 24, 24);
        ctx.restore();*/
        let image = piece.img ? preload[piece.img] : preload["lukes/sq-tr.png"];
        let rad = piece.rot * 1 / 2 * Math.PI;

        let x = piece.x * 26 + 14;
        let y = piece.y * 26 + 14;
        let width = image.width;
        let height = image.height;

        ctx.translate(x, y);
        ctx.rotate(rad);
        ctx.drawImage(image, -width / 2, -height / 2, width, height);
        ctx.fillStyle = colors[piece.c];
        ctx.globalAlpha = 0.2;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.globalAlpha = 1;
        ctx.rotate(-rad);
        ctx.translate(-x, -y);
    }

    function draw() {
        active.showFuture();
        active.futureParts.forEach(function(val) {
            /*ctx.fillStyle = previewColors[val.c];
            //draw img at
            ctx.fillRect(val.x * 26 + 2, val.y * 26 + 2, 24, 24);*/
            ctx.globalAlpha = 0.6;
            drawImgAt(val);
            ctx.globalAlpha = 1;

        })
        active.parts.forEach(function(val) {
            //ctx.fillStyle = colors[val.c];
            //draw img at
            drawImgAt(val);
        })
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = colors[nextPc[i].c];
            nextPc[i].parts.forEach(function(part) {
                ctx.fillRect((part.x - 3) * 10 + 10 * 26 + 26, part.y * 10 + i * 52, 10, 10);
            })
        }
    }

    function next() {
        for (i = 0; i < 3; i++) {
            ctx.fillStyle = colors[0];
            nextPc[i].parts.forEach(function(part) {
                ctx.fillRect((part.x - 3) * 10 + 10 * 26 + 26, part.y * 10 + i * 52, 10, 10);
            })
        }
        nextPc.shift();
        nextPc.push(new tetrimino(3, 0, Math.floor(Math.random() * 7) + 1));
    }

    function clearParts(parts) {
        parts.forEach(function(val) {
            ctx.fillStyle = colors[0];
            ctx.fillRect(val.x * 26 + 2, val.y * 26 + 2, 24, 24);
        })
    }

    function togglePause() {
        pause = !pause;
        if (pause) {
            document.getElementById("game").style = "filter:blur(4px)";
            document.getElementById("pause").textContent = "Unpause";
            aud.pause();
            audio = false;
        }
        if (!pause) {
            document.getElementById("game").style = "filter:blur(0px)";
            document.getElementById("pause").textContent = "Pause";
            requestAnimationFrame(loop);
            aud.play();
            audio = true;
        }
    }
    drawGrid();
    drawGrid();
    document.addEventListener("keydown", function(e) {
        if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 32)
            e.preventDefault(); //prevent scrolling

        if (!game) {
            return;
        }
        if (e.keyCode === 80 && allowPause) {
            togglePause(); //if pressing key to pause, and pausing is allowed, inverse pause condition
        }
        if (pause) {
            return;
        }

        if (rotate && (e.keyCode === 38 || e.keyCode === 87)) { //Rotate using W and up
            rotate = false;
            active.rotate(1);
            draw();
            kcd = 4;
        }
        if (hardDrop && e.keyCode === 32) { //Hard drop using space
            hardDrop = false;
            active.drop();
            draw();

        }
        if (allowHold && e.keyCode === 67) {
            clearParts(active.parts);
            clearParts(active.futureParts);
            let type = active.c;
            if (heldPiece) {
                ctx.fillStyle = colors[0];
                heldPiece.parts.forEach(function(part) {
                    ctx.fillRect((part.x - 3) * 10 + 10 * 26 + 26, part.y * 10 + 14 * 40, 10, 10);
                })
                active = heldPiece;
            } else {
                active = nextPc[0];
            }
            heldPiece = new tetrimino(3, 0, type);
            ctx.fillStyle = colors[type];
            heldPiece.parts.forEach(function(part) {
                ctx.fillRect((part.x - 3) * 10 + 10 * 26 + 26, part.y * 10 + 14 * 40, 10, 10);
            });
            next();
            allowHold = false;
            cd = 0;
        }

        if (key.indexOf(e.keyCode) == -1) {
            key.push(e.keyCode);
            kcd = 0;
        }

    });
    document.addEventListener("keyup", function(e) {
        if (!game || pause) {
            return;
        }
        if (e.keyCode === 80) {
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
    })

    function gameOver() {
        aud.pause();
        aud = false;
        /*for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 10; j++) {
                ctx.fillStyle = "rgb(" + 180 + "," + 180 + "," + 244 + ")";
                ctx.fillRect(j * 26, i * 26, 26, 26);
            }

        }
        */
    }
    let then = Date.now();
    let now = Date.now();

    function loop() {
        now = Date.now();
        let delta = now - then;
        cd -= delta;
        kcd -= delta;
        then = Date.now();
        if (kcd <= 0) {
            if (key.indexOf(37) != -1 || key.indexOf(65) != -1) {
                active.move(-1, 0);
                draw();
                kcd = 10 * 17;
            }
            if (key.indexOf(39) != -1 || key.indexOf(68) != -1) {
                active.move(1, 0);
                draw();
                kcd = 10 * 17;
            }
            if (key.indexOf(40) != -1 || key.indexOf(83) != -1) {
                active.move(0, 1);
                draw();
                cd = 20 * 17;
                kcd = 7 * 17;
            }

        }
        if (cd <= 0) {
            active.move(0, 1);
            draw();
            cd = 20 * 17;
        }
        document.getElementById("score").textContent = score;
        document.getElementById("lines").textContent = lines;
        if (game) {
            if (!pause) {
                requestAnimationFrame(loop);
            }
        } else {
            requestAnimationFrame(gameOver);
        }
    }
    let audio = false;
    var aud = document.getElementById("audio");
    document.getElementById("start").onclick = function() {
        if(!audio){
            audio = true;
            aud.play();
        }
        document.getElementById("start").textContent = "Restart";
        document.getElementById("game").style = "filter:blur(0px)";
        reset();
        requestAnimationFrame(loop);
        draw();
    }
    document.getElementById("start2").onclick = document.getElementById("start").onclick
    document.getElementById("pause").onclick = togglePause;
    document.getElementById("pause2").onclick = togglePause;
}