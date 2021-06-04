const body = document.querySelector('body')

// Random number between min and max (inclusive)
const rand_in_range = (min, max) => Math.floor(Math.random() * (max + 1)) + min

const maze = {
    maze_item_size: 50,
    map: {
        path:[
            "WWWWWWWWWWWWWWWWWWWWW",
            "W   W     W     W W W",
            "W W W WWW WWWWW W W W",
            "W W W   W     W W   W",
            "W WWWWWWW W WWW W W W",
            "W         W     W W W",
            "W WWW WWWWW WWWWW W W",
            "W W   W   W W     W W",
            "W WWWWW W W W WWW W F",
            "S     W W W W W W WWW",
            "WWWWW W W W W W W W W",
            "W     W W W   W W W W",
            "W WWWWWWW WWWWW W W W",
            "W       W       W   W",
            "WWWWWWWWWWWWWWWWWWWWW",
        ],
        start: {},
        end: {},
        create_map() {
            this.path.forEach((row, i) => {
                const maze_row = document.createElement('div')
                
                row.split('').forEach((letter, j) => {
                    const maze_item = document.createElement('div')
            
                    maze_item.classList.add('row__item')
                    // Wall
                    if (letter === 'W') maze_item.classList.add('row__item--wall')
                    // Blank
                    else if(letter === ' ') {
                        maze_item.classList.add('row__item--blank')
                        maze.textures.set_texture('blank', maze_item)
                    }
                    // Start
                    else if (letter === 'S') {
                        this.start = {
                            x:j, 
                            y:i
                        }
                        maze.player.create_player()
                        maze_item.classList.add('row__item--start') 
                    }
                    // End
                    else {
                        this.end = {
                            x:j, 
                            y:i
                        }
                        maze_item.classList.add('row__item--end') 
                    }
                    maze_row.appendChild(maze_item)
                })
                maze_row.classList.add('maze__row')
                body.appendChild(maze_row)
            })
        }
    },
    textures: {
        blank: [
            'assets/img/blank/rocks_1.png',
            'assets/img/blank/rocks_2.png',
            'assets/img/blank/rocks_3.png'
        ],

        set_texture(area, el) {
            if (area === 'blank') {
                el.style.backgroundImage = `url('${this.blank[rand_in_range(0, this.blank.length - 1)]}')`
            }
        }
    },
    player: {
        x: 0,
        y: 0,
        cool_down: false,
        facing: 'right',
        create_player() {
            const player_el = document.createElement('div')

            this.x = maze.map.start.x
            this.y = maze.map.start.y
            player_el.classList.add('maze__player')
            player_el.style.top = `${this.y * maze.maze_item_size}px`
            player_el.style.left = `${this.x * maze.maze_item_size}px`
            document.addEventListener('keydown', evt => this.move_player(evt.key))
            body.appendChild(player_el)
        },
        reset_player() {
            this.x = maze.map.start.x
            this.y = maze.map.start.y
            this.render_player()
        },
        move_player(key) {
            let valid_move = true

            if (!this.cool_down)
                switch (key.toLowerCase()) {
                    case 'arrowup':
                    case 'w':
                        if (this.y && 
                            maze.map.path[this.y - 1][this.x] !== 'W') this.y--
                        this.facing = 'top'
                        break
                    case 'arrowright':
                    case 'd':
                        if (this.x < maze.map.path[0].length - 1 &&
                            maze.map.path[this.y][this.x + 1] !== 'W') this.x++
                        this.facing = 'right'
                        break
                    case 'arrowdown':
                    case 's':
                        if (this.y < maze.map.path.length - 1 &&
                            maze.map.path[this.y + 1][this.x] !== 'W') this.y++
                        this.facing = 'bottom'
                        break
                    case 'arrowleft':
                    case 'a':
                        if (this.x &&
                            maze.map.path[this.y][this.x - 1] !== 'W') this.x--
                        this.facing = 'left'
                        break
                    default:
                        valid_move = false
                }
            if (valid_move && !this.cool_down) {
                this.render_player()
                this.cool_down = true
                setTimeout( _ => this.cool_down = false, 210)
            }
        },
        render_player() {
            const player_el = document.querySelector('div.maze__player')
            const new_animation = maze.animation.name(this.facing)

            player_el.style.top = `${this.y * maze.maze_item_size}px`
            player_el.style.left = `${this.x * maze.maze_item_size}px`
            if(this.facing !== 'left') player_el.classList.remove('player__facing--left')
            else player_el.classList.add('player__facing--left')

            if (this.facing === 'bottom')
                player_el.style.backgroundImage = 'url(assets/img/moves/indi/move_bottom_1.png)'
            else if (this.facing === 'top')
                player_el.style.backgroundImage = 'url(assets/img/moves/indi/move_top_1.png)'
            else
                player_el.style.backgroundImage = 'url(assets/img/moves/indi/move_1.png)'
            
            if (maze.animation.cur_name !== new_animation) {
                player_el.classList.remove(maze.animation.cur_name)
                clearTimeout(maze.animation.cur_id)
            }
            maze.animation.cur_name = new_animation
            player_el.classList.add(maze.animation.cur_name)
            clearTimeout(maze.animation.cur_id)
            maze.animation.cur_id = setTimeout( _ => player_el.classList.remove(maze.animation.cur_name), 400)
            if (this.x === maze.map.end.x && this.y === maze.map.end.y) 
                console.log('WIN')
        }
    },
    animation: {
        cur_name: null,
        cur_id: null,
        name(face) {
            if (face === 'top') return 'player__facing--top'
            else if (face === 'bottom') return 'player__facing--bottom'
            else return 'player__facing--l_or_r'
        }
    }
}

maze.map.create_map()