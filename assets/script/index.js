const body = document.querySelector('body')

// Random number between min and max (inclusive)
const rand_in_range = (min, max) => Math.floor(Math.random() * (max + 1)) + min

const maze = {
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
    maze_item_size: 50,
    player: {
        x: 0,
        y: 0,
        animation_id: null,
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
            let animation_name = ''

            player_el.style.top = `${this.y * maze.maze_item_size}px`
            player_el.style.left = `${this.x * maze.maze_item_size}px`
            if (this.facing === 'left') player_el.classList.add('player__facing--left')
            else if(this.facing === 'right') player_el.classList.remove('player__facing--left')
            
            if (this.facing === 'left' || this.facing === 'right') {
                animation_name = 'player__animation--l_or_r'
            }
            player_el.classList.add(animation_name)
            clearTimeout(this.animation_id)
            this.animation_id = setTimeout( _ => player_el.classList.remove(animation_name), 400)
            if (this.x === maze.map.end.x && this.y === maze.map.end.y) 
                console.log('WIN')
        }
    }
}

maze.map.create_map()