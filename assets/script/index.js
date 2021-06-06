const maze_el = document.querySelector('div.maze')
const restart_button = document.querySelector('button.info__restart')
// Random number between min and max (inclusive)
const rand_in_range = (min, max) => Math.floor(Math.random() * (max + 1)) + min
const format_num = n => n < 10 ? `0${n}` : n


let first_move = true
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
            "W WWWWW W WWWWW W W W",
            "W       W       W   W",
            "WWWWWWWWWWWWWWWWWWWWW",
        ],
        start: {},
        end: {},
        create_map() {
            maze.textures.wall.wall_set = rand_in_range(0, maze.textures.wall.path.length - 1)
            this.path.forEach((row, i) => {
                const maze_row = document.createElement('div')
                
                row.split('').forEach((letter, j) => {
                    const maze_item = document.createElement('div')
            
                    maze_item.classList.add('row__item')
                    // Wall
                    if (letter === 'W') {
                        maze_item.classList.add('row__item--wall')
                        maze.textures.set_wall_texture(maze_item)
                    }
                    // Blank
                    else if(letter === ' ') {
                        maze_item.classList.add('row__item--blank')
                        maze.textures.set_black_texture(maze_item)
                    }
                    // Start
                    else if (letter === 'S') {
                        const new_row = maze.map.path[i].split('')

                        this.start = {
                            x:j, 
                            y:i
                        }
                        maze.player.create_player()
                        maze_item.classList.add('row__item--start') 
                        maze.textures.set_black_texture(maze_item)   
                        new_row[j] = 'W'
                        maze.map.path[i] = new_row.join('')                     
                    }
                    // End
                    else {
                        const new_row = maze.map.path[i].split('')

                        this.end = {
                            x:j, 
                            y:i
                        }
                        maze_item.classList.add('row__item--end') 
                        maze_item.style.backgroundImage = "url('assets/img/walls/end.png')"
                        new_row[j] = 'W'
                        maze.map.path[i] = new_row.join('')
                    }
                    maze_row.appendChild(maze_item)
                })
                maze_row.classList.add('maze__row')
                maze_el.appendChild(maze_row)
            })
            maze.key.create_key()
            maze.gems.create_geams()
        }, 
        reset() {
            const maze_map = document.querySelector('div.maze')

            maze_map.innerHTML = ''
            this.path = this.path.map((row, j) => row.split('').map((l, i) => {
                if (i === this.end.x && j === this.end.y) return 'F'
                else if (i === this.start.x && j === this.start.y) return 'S'
                else if (l !== ' ' && l !== 'W') return ' '
                else return l
            }).join(''))
        }
    },
    textures: {
        blank: [
            'assets/img/blank/rocks_1.png',
            'assets/img/blank/rocks_2.png',
            'assets/img/blank/rocks_3.png'
        ],
        wall: {
            wall_set: null,
            path: [
                [
                    'assets/img/walls/w_1_7.png',
                    'assets/img/walls/w_1_1.png', 
                    'assets/img/walls/w_1_2.png',
                    'assets/img/walls/w_1_7.png',
                    'assets/img/walls/w_1_3.png',
                    'assets/img/walls/w_1_4.png',
                    'assets/img/walls/w_1_7.png',
                    'assets/img/walls/w_1_5.png',
                    'assets/img/walls/w_1_6.png',
                    'assets/img/walls/w_1_7.png'
                ],
                [
                    'assets/img/walls/w_2_1.png', 
                    'assets/img/walls/w_2_2.png',
                    'assets/img/walls/w_2_3.png',
                    'assets/img/walls/w_2_4.png',
                    'assets/img/walls/w_2_1.png',
                    'assets/img/walls/w_2_5.png',
                    'assets/img/walls/w_2_6.png'
                ],
                [
                    'assets/img/walls/w_3_1.png',
                    'assets/img/walls/w_3_2.png', 
                    'assets/img/walls/w_3_3.png',
                    'assets/img/walls/w_3_5.png',
                    'assets/img/walls/w_3_8.png',
                    'assets/img/walls/w_3_9.png',
                    'assets/img/walls/w_3_11.png',
                    'assets/img/walls/w_3_12.png', 
                    'assets/img/walls/w_3_13.png',
                    'assets/img/walls/w_3_14.png',
                    'assets/img/walls/w_3_15.png',
                    'assets/img/walls/w_3_16.png',
                    'assets/img/walls/w_3_17.png',
                    'assets/img/walls/w_3_18.png'
                ]
            ]
        },
        set_black_texture(el) {
            el.style.backgroundImage = `url('${this.blank[rand_in_range(0, this.blank.length - 1)]}')`
        },
        set_wall_texture(el) {
            el.style.backgroundImage = `url('${this.wall.path[this.wall.wall_set][rand_in_range(0, this.wall.path[this.wall.wall_set].length - 1)]}')`
        },
        gems: [
            'assets/img/gems/gem_1.gif',
            'assets/img/gems/gem_2.gif',
            'assets/img/gems/gem_3.gif'
        ]
    },
    player: {
        x: 0,
        y: 0,
        cool_down: false,
        facing: 'right',
        won: false,
        score: 0,
        create_player() {
            const player_el = document.createElement('div')

            this.x = maze.map.start.x
            this.y = maze.map.start.y
            player_el.classList.add('maze__player')
            player_el.style.top = `${this.y * maze.maze_item_size}px`
            player_el.style.left = `${this.x * maze.maze_item_size}px`
            document.addEventListener('keydown', evt => this.move_player(evt.key))
            maze_el.appendChild(player_el)
        },
        reset_player() {
            this.x = maze.map.start.x
            this.y = maze.map.start.y
            this.render_player()
        },
        move_player(key) {
            let valid_move = true

            if (!this.cool_down && !this.won)
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
            if (valid_move && !this.cool_down && !this.won) {
                if (first_move) {
                    first_move = false
                    maze.timer.start()
                }
                this.render_player()
                this.cool_down = true
                setTimeout( _ => this.cool_down = false, 100)
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
            // key
            if (this.x === maze.key.x && this.y === maze.key.y && !maze.key.found) {
                const key_el = document.querySelector('div.maze__key')
                const key_inv = document.createElement('div')
                const inventory = document.querySelector('div.info__item--inventory__storage')
                const end_el = document.querySelector('div.row__item--end')
                let new_row = maze.map.path[maze.map.end.y].split('')

                maze.key.found = true
                new_row[maze.map.end.x] = ' '
                maze.map.path[maze.map.end.y] = new_row.join('')
                key_el.remove()
                key_inv.classList.add('inventory__item')
                inventory.appendChild(key_inv)
                end_el.style.backgroundImage = "url('assets/img/blank/rocks_1.png')"
            }
            // Gem
            maze.gems.gems_arr.every(gem => {
                if (this.x === gem.x && this.y === gem.y && gem.active) {
                    const gem_el = document.getElementById(`gem_${gem.id}`)

                    this.score += 1000
                    gem_el.remove()
                    maze.score.render_score()
                    gem.active = false
                    return false
                }
                return true
            })
            // Win
            if (this.x === maze.map.end.x && this.y === maze.map.end.y) {
                const win_are = document.querySelector('div.win')

                clearInterval(maze.timer.id)
                win_are.classList.toggle('hidden')
                this.won = true
                setTimeout( _ => {
                    win_are.classList.toggle('hidden')
                    maze.reset()
                }, 8000)
            }
            
        }, 
        reset() {
            this.x = 0
            this.y = 0
            this.cool_down = false
            this.facing = 'right'
            this.won = false
            this.score = 0
        }
    },
    key: {
        found: false,
        x: null,
        y: null,
        create_key() {
            const key_el = document.createElement('div')

            key_el.classList.add('maze__key')
            key_el.style.backgroundImage = "url('assets/img/key/key.png')"
            this.generate_position()
            this.render_key(key_el)
            maze_el.appendChild(key_el)
        },
        render_key(el) {
            el.style.top = `${this.y * maze.maze_item_size}px`
            el.style.left = `${this.x * maze.maze_item_size}px`
        },
        generate_position() {
            this.y = rand_in_range(1, maze.map.path.length - 3)
            let possible_x = maze.map.path[this.y].split('').map((l, i) => [l, i]).filter(t => t[0] === ' ')
            this.x = rand_in_range(0, possible_x.length - 1)
            this.x = possible_x[this.x][1]
            let new_row = maze.map.path[this.y].split('')
            new_row[this.x] = 'K'
            maze.map.path[this.y] = new_row.join('')
        },
        reset() {
            this.found = false
            this.x = null
            this.y = null
        }
    },
    animation: {
        cur_name: null,
        cur_id: null,
        name(face) {
            if (face === 'top') return 'player__facing--top'
            else if (face === 'bottom') return 'player__facing--bottom'
            else return 'player__facing--l_or_r'
        },
        reset() {
            this.cur_name = null
            this.cur_id = null
        }
    },
    timer: {
        hour: 0,
        min: 0,
        sec: 0,
        id: null,
        start() {
            const timer_area = document.querySelector('p.info__item--timer')
            this.min = this.sec = this.hour = 0
        
            this.id = setInterval( _ => {    
                if (++(this.sec) === 60) {
                    this.min += 1
                    this.sec = 0
                }
            
                if (this.min === 60) {
                    this.min = 0
                    this.hour += 1
                }
                timer_area.innerText = `${format_num(this.hour)}:${format_num(this.min)}:${format_num(this.sec)}`
            }, 1000)
        },
        reset() {
            clearInterval(this.id)
            this.id = null
        }
    },
    gems: {
        max: 12,
        min: 5,
        amount: null,
        gems_arr: [],
        start() {
            this.amount = rand_in_range(this.min, this.max)
        },
        create_gem(x, y, id) {
            const new_gem = {
                x,
                y,
                id,
                active: true
            }

            this.gems_arr.push(new_gem)
        },
        create_geams() { 
            let created_geams = 0

            this.start()
            while (created_geams !== this.amount) {
                const y = rand_in_range(1, maze.map.path.length - 3)
                let row = maze.map.path[y].split('').map((l, i) => [l, i]).filter(t => t[0] === ' ')

                if (row.length) {
                    let x = rand_in_range(0, row.length - 1)
                    let new_row = maze.map.path[y].split('')
                    
                    x = row[x][1]
                    new_row[x] = 'G'
                    maze.map.path[y] = new_row.join('')
                    this.create_gem(x, y, created_geams)
                    created_geams++
                }
            }
            this.render_gems()
        },
        render_gems() {
            this.gems_arr.forEach(gem => {
                const gem_el = document.createElement('div')
                const gem_texture = rand_in_range(0, maze.textures.gems.length - 1)

                gem_el.classList.add('gem')
                gem_el.setAttribute('id', `gem_${gem.id}`)
                gem_el.style.top = `${maze.maze_item_size * gem.y}px`
                gem_el.style.left = `${maze.maze_item_size * gem.x}px`
                gem_el.style.backgroundImage = `url('${maze.textures.gems[gem_texture]}')`
                maze_el.appendChild(gem_el)
            })
        },
        reset() {
            this.max = 12
            this.min = 5
            this.amount = null
            this.gems_arr = []
        }
    },
    score: {
        render_score() {
            const score_area = document.querySelector('p.info__item--score__val')

            score_area.innerText = this.parse_score(String(maze.player.score))
        },
        parse_score(n) {
            if (n.length < 7) {
                n = n.split('')
                for (let i = 0; i <= 7 - n.length + 1; i++)
                    n.unshift('0')
                n = n.join('')
            }
            return n
        }
    },
    reset() {
        const timer_area = document.querySelector('p.info__item--timer')
        const score_area = document.querySelector('p.info__item--score__val') 
        const inventory_area = document.querySelector('div.info__item--inventory__storage')

        timer_area.innerText = '00:00:00'
        score_area.innerText = '0000000'
        inventory_area.innerHTML = ''
        this.timer.reset()
        this.animation.reset()
        this.key.reset()
        this.player.reset()
        this.map.reset()
        this.gems.reset()
        first_move = true 
        maze.map.create_map()  
    }
}

maze.map.create_map()

restart_button.addEventListener('click', _ => maze.reset())