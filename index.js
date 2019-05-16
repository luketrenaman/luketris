window.onload = function() {
    colors = ["#ffffff", "#42ebf4", "#415ff4", "#f7c922", "#f7f321", "#48f721", "#aa1efc", "#fc1e1e"]
    class tetrimino {
        constructor(x, y, c) {
            this.c = c
            this.parts = [];
            this.x = x;
            this.y = y;
            //facing up 0
            //facing right 1
            //facing down 2
            //facing left 3
            console.log("YA:" + c)

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
                    this.parts.push(new tetrim(x + 1, y, c));
                    this.parts.push(new tetrim(x + 2, y, c));
                    this.parts.push(new tetrim(x, y + 1, c));
                    this.parts.push(new tetrim(x + 1, y + 1, c));
                    break;

                case 7:

                    this.parts.push(new tetrim(x + 1, y, c));
                    this.parts.push(new tetrim(x, y + 1, c));
                    this.parts.push(new tetrim(x + 1, y + 1, c));
                    this.parts.push(new tetrim(x + 2, y + 1, c));
                    break;
            }
            if (!this.parts.every(function(val) {
                    return 0 === grid[val.x][val.y]
                })) {
                console.log("GAME OVER")
            }

        }
        move(x, y) {
            if (this.parts.every(function(val) {
                    return val.future(x, y)
                })) {
                for (let i = 3; i >= 0; i--) {
                    this.parts[i].move(x, y)
                }
                this.x = this.x + x
                this.y = this.y + y
            } else if (y != 0) {
                active.parts.forEach(function(val) {
                    grid[val.y][val.x] = val.c;
                })
                console.log(grid[23]);
                grid.forEach(function(val, index) {
                    if (val.every(function(cell) {
                            return cell !== 0;
                        })) {
                        console.log("egg")
                        grid.splice(index, 1);
                        grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
                    }
                })

                for (let i = 0; i < 24; i++) {
                    for (let j = 0; j < 10; j++) {
                        ctx.fillStyle = colors[grid[i][j]];
                        ctx.fillRect(j * 20 + 1, i * 20 + 1, 18, 18);
                    }
                    //active = new tetrimino(0, 0, 1)
                }
                active = new tetrimino(0, 0, Math.floor(Math.random() * 6) + 1)

            }
        }
        check(n) {
            let a = this;
            //Check if rotation is possible with offset of n
            console.log(n);
            if (this.parts.every(function(val) {
                    if (grid[val.ny] === undefined) return false;
                    return grid[val.ny][val.nx + n] === 0;
                })) {
                this.parts.forEach(function(val) {
                    val.x = val.nx + n
                    val.y = val.ny
                })
                a.x += n;
                return true;
            }
            return false;
        }
        rotate(d) {
            let a = this;
            a.cx = a.x + 1
            a.cy = a.y + 1
            if (a.c === 1) {
                a.cx += .5
                a.cy += .5
            }
            if (a.c === 4) {
                return true;
            }
            //rotating right
            if (d === 1) {
                this.parts.forEach(function(val) {

                    ctx.fillStyle = colors[0]
                    ctx.fillRect(val.x * 20 + 1, val.y * 20 + 1, 18, 18);
                    let y = val.y
                    let x = val.x
                    val.nx = (y - a.cy) * -1 + a.cx
                    val.ny = (x - a.cx) + a.cy
                })
                if (!a.check(0)) {
                    if (!a.check(-1)) {
                        a.check(1)
                    }
                }
            }


            if (d === -1) {

            }
        }
    }

    class tetrim {
        constructor(x, y, c) {
            this.x = x
            this.y = y
            this.c = c
        }
        move(x, y) {
            ctx.fillStyle = colors[0]
            ctx.fillRect(this.x * 20 + 1, this.y * 20 + 1, 18, 18);
            grid[this.y][this.x] = 0
            this.x = this.x + x;
            this.y = this.y + y;
            //grid[this.x][this.y] =  

        }
        future(x, y) {
            if (grid[this.y + y] === undefined) return false;
            return grid[this.y + y][this.x + x] === 0
        }
    }
    //10x24
    var c = document.getElementById("cynthiaisdum");
    var ctx = c.getContext("2d");
    //Generate grid
    let grid = []
    for (let i = 0; i < 24; i++) {
        grid.push([])
        for (let j = 0; j < 10; j++) {
            grid[i].push(0)
        }
    }

    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 10; j++) {
            //ctx.fillStyle = colors[grid[i][j]];
            //ctx.fillRect(i * 20, j * 20, 20, 20);
            ctx.rect(j * 20, i * 20, 20, 20);
            ctx.stroke();
        }

        function draw() {

            active.parts.forEach(function(val) {
                ctx.fillStyle = colors[val.c]
                ctx.fillRect(val.x * 20 + 1, val.y * 20 + 1, 18, 18);
            })
        }
    }
    let active = new tetrimino(0, 0, Math.floor(Math.random() * 6))
    let cd = 30;
    let rotate = true;
    let kcd = 0;
    let key = [];
    document.body.onkeydown = function(e) {
        if (rotate && e.keyCode === 38) {
            rotate = false;
            active.rotate(1)
            draw()
            kcd = 4;
        }

        if (key.indexOf(e.keyCode) == -1) {
            key.push(e.keyCode)
            kcd = 0;
        }
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            return false;
        }

    };
    document.body.onkeyup = function(e) {
        if (e.keyCode === 38) {
            rotate = true;
        }
        key.splice(key.indexOf(e.keyCode), 1);
        kcd = 0;
    }

    function loop() {
        cd--
        kcd--
        if (kcd <= 0) {
            if (key.indexOf(37) != -1) {
                active.move(-1, 0)
                draw()
                kcd = 4;
            }
            if (key.indexOf(39) != -1) {
                active.move(1, 0)
                draw()
                kcd = 4;
            }
            if (key.indexOf(40) != -1) {
                active.move(0, 1)
                draw()
                cd = 20;
                kcd = 5;
            }

        }
        if (cd <= 0) {
            active.move(0, 1)
            draw()
            cd = 20;
        }
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)

    draw()

}
