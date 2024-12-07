class Game {
    constructor() {
        this.inventory = [];
        this.maxInventorySize = 8;
        this.stats = {
            health: 100,
            maxHealth: 100,
            attack: 10,
            defense: 5,
            level: 1,
            exp: 0,
            expNeeded: 100,
            reputation: 0,
            friends: 0
        };
        this.updateStats(); // Initialize stats display
    }

    // Add this new method to update all stats display
    updateStats() {
        document.getElementById('level').textContent = this.stats.level;
        document.getElementById('health').textContent = this.stats.health;
        document.getElementById('maxHealth').textContent = this.stats.maxHealth;
        document.getElementById('attack').textContent = this.stats.attack;
        document.getElementById('defense').textContent = this.stats.defense;
        document.getElementById('exp').textContent = this.stats.exp;
        document.getElementById('expNeeded').textContent = this.stats.expNeeded;
        
        // Add visual feedback for EXP progress
        const expPercentage = (this.stats.exp / this.stats.expNeeded) * 100;
        const expBar = document.getElementById('exp-bar');
        if (expBar) {
            expBar.style.width = `${expPercentage}%`;
        }
    }

    useItem(item) {
        switch(item.type) {
            case 'healing':
                this.stats.health = Math.min(100, this.stats.health + item.value);
                document.getElementById('health').textContent = this.stats.health;
                this.addToStory(`Used ${item.name} and recovered ${item.value} health!`);
                break;
            case 'tool':
                // Special handling for smartphone
                if (item.name === "Smartphone") {
                    this.stats.reputation += 5;
                    this.addToStory("The smartphone helps you understand human culture better!");
                }
                break;
        }
        
        // Remove used item from inventory
        const itemIndex = this.inventory.indexOf(item);
        if (itemIndex > -1) {
            this.inventory.splice(itemIndex, 1);
            this.updateInventoryDisplay();
        }
    }

    updateInventoryDisplay() {
        const inventoryDiv = document.getElementById('inventory-slots');
        inventoryDiv.innerHTML = '';
        
        this.inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            
            // Add item name
            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name;
            
            // Add item description
            const descSpan = document.createElement('span');
            descSpan.className = 'item-description';
            switch(item.type) {
                case 'healing':
                    descSpan.textContent = `Heals ${item.value} HP`;
                    break;
                case 'tool':
                    descSpan.textContent = 'Useful item';
                    break;
            }
            
            // Add use button
            const useButton = document.createElement('button');
            useButton.textContent = 'Use';
            useButton.onclick = (e) => {
                e.stopPropagation();
                this.useItem(item);
            };
            
            itemDiv.appendChild(nameSpan);
            itemDiv.appendChild(descSpan);
            itemDiv.appendChild(useButton);
            inventoryDiv.appendChild(itemDiv);
        });
    }

    addToStory(text) {
        const storyText = document.getElementById('story-text');
        storyText.textContent += '\n\n' + text;
    }

    // Modify loadScene to check health and add consequences
    loadScene(sceneIndex) {
        // Check if health is too low
        if (this.stats.health <= 0) {
            sceneIndex = 'game_over';
        }

        if (sceneIndex === 'game_over') {
            const scene = {
                text: "Your health has dropped to zero. You collapse from exhaustion...",
                choices: [
                    { text: "Try Again", nextScene: 'restart' }
                ]
            };
            // ... handle scene display
            return;
        }

        const scenes = {
            0: {
                text: "You open your eyes to find yourself in a strange place. The last thing you remember was raiding a human village with your goblin tribe. Now you're... in what appears to be a modern city?!",
                choices: [
                    { text: "Hide in a nearby alley", nextScene: 1 },
                    { text: "Try to understand where you are", nextScene: 2 }
                ]
            },
            1: {
                text: "You duck into a dark alley. You find a discarded health potion!",
                choices: [
                    { text: "Take the potion", nextScene: 2, action: () => this.addToInventory({
                        name: "Health Potion",
                        type: "healing",
                        value: 20
                    })},
                    { text: "Leave it and continue exploring", nextScene: 2 }
                ]
            },
            2: {
                text: "People scream as they see you. You realize you're still a goblin, but in a world that's never seen one before!",
                choices: [
                    { text: "Try to communicate peacefully", nextScene: 3 },
                    { text: "Run away", nextScene: 4 }
                ]
            },
            3: {
                text: "You raise your hands in a peaceful gesture. A brave child approaches you, curious rather than afraid.",
                choices: [
                    { text: "Smile and wave", nextScene: 5 },
                    { text: "Slowly back away", nextScene: 4 }
                ]
            },
            4: {
                text: "You run away and find shelter in an abandoned building. At least you're safe... for now.",
                choices: [
                    { text: "Rest here", nextScene: 6 },
                    { text: "Look for supplies", nextScene: 7 },
                    { text: "Investigate strange noise", nextScene: 'combat_rat' }
                ]
            },
            5: {
                text: "The child giggles and waves back. Other people start to relax, seeing this peaceful interaction.",
                choices: [
                    { text: "Try to learn their language", nextScene: 8 },
                    { text: "Make friends with the child", nextScene: 9 }
                ]
            },
            6: {
                text: "You rest in the abandoned building. The quiet gives you time to think about your situation.",
                choices: [
                    { text: "Search for food", nextScene: 10 },
                    { text: "Try to sleep", nextScene: 11 },
                    { text: "Explore dark corner", nextScene: 'combat_rat' }
                ]
            },
            7: {
                text: "While looking for supplies, you find a smartphone. Its screen glows with strange symbols.",
                choices: [
                    { text: "Try to use it", nextScene: 12 },
                    { text: "Take it with you", nextScene: 13, action: () => this.addToInventory({
                        name: "Smartphone",
                        type: "tool",
                        value: 1
                    })}
                ]
            },
            8: {
                text: "Over time, you learn to communicate with humans. Your unique perspective and willingness to learn impresses them.",
                choices: [
                    { text: "Apply for a job", nextScene: 14 },
                    { text: "Start a YouTube channel", nextScene: 15 }
                ]
            },
            9: {
                text: "The child, named Sarah, becomes your first real friend. Her family is initially wary but gradually accepts you.",
                choices: [
                    { text: "Become their house guest", nextScene: 16 },
                    { text: "Keep your distance but stay friendly", nextScene: 17 }
                ]
            },
            10: {
                text: "In a nearby convenience store, you find food, but the shopkeeper spots you!",
                choices: [
                    { text: "Offer to work for food", nextScene: 18 },
                    { text: "Grab what you can and run", nextScene: 19 },
                    { text: "Fight the thug blocking your path", nextScene: 'combat_thug' }
                ]
            },
            11: {
                text: "Your sleep is interrupted by police sirens. They've found your hideout!",
                choices: [
                    { text: "Surrender peacefully", nextScene: 20 },
                    { text: "Try to escape", nextScene: 21 }
                ]
            },
            // Good endings
            14: {
                text: "Against all odds, you become the world's first goblin employee! Your success story inspires others and changes how humans view fantasy creatures.",
                choices: [
                    { text: "GOOD ENDING: Corporate Goblin", nextScene: 'restart' }
                ]
            },
            15: {
                text: "Your channel 'Life of a Modern Goblin' becomes a viral sensation. You use your platform to bridge the gap between humans and fantasy creatures.",
                choices: [
                    { text: "GOOD ENDING: Internet Celebrity", nextScene: 'restart' }
                ]
            },
            16: {
                text: "Sarah's family officially adopts you. You find happiness in this new world, proving that family isn't about species but about love.",
                choices: [
                    { text: "GOOD ENDING: Found Family", nextScene: 'restart' }
                ]
            },
            18: {
                text: "The shopkeeper, impressed by your honesty, gives you a chance. You become the store's night manager and a respected member of the community.",
                choices: [
                    { text: "GOOD ENDING: Honest Work", nextScene: 'restart' }
                ]
            },
            // Bad endings
            19: {
                text: "You're caught by police while running. Your actions confirm their worst fears about goblins, and you're imprisoned as a dangerous creature.",
                choices: [
                    { text: "BAD ENDING: Behind Bars", nextScene: 'restart' }
                ]
            },
            20: {
                text: "You're taken to a government facility. Scientists study you endlessly, treating you more like a specimen than a sentient being.",
                choices: [
                    { text: "BAD ENDING: Lab Subject", nextScene: 'restart' }
                ]
            },
            21: {
                text: "During your escape attempt, you're shot with a tranquilizer. You wake up in a zoo exhibit labeled 'Fantasy Creature'.",
                choices: [
                    { text: "BAD ENDING: Zoo Attraction", nextScene: 'restart' }
                ]
            },
            // Neutral endings
            17: {
                text: "You maintain a careful balance between human interaction and independence. While never fully integrated, you find your own way in this new world.",
                choices: [
                    { text: "NEUTRAL ENDING: Independent Life", nextScene: 'restart' }
                ]
            },
            // New branch: Smartphone path
            12: {
                text: "You figure out how to use the smartphone. To your surprise, you can understand the language through it! It seems to have some kind of translation magic.",
                choices: [
                    { text: "Use it to learn about this world", nextScene: 22 },
                    { text: "Try to contact other goblins", nextScene: 23 }
                ]
            },
            13: {
                text: "You find a hidden community of other isekai'd fantasy creatures! A friendly orc offers to help you adjust to this new world.",
                choices: [
                    { text: "Join their community", nextScene: 24 },
                    { text: "Share their location with humans", nextScene: 25 }
                ]
            },
            22: {
                text: "Through the smartphone, you discover humans have many stories about goblins - mostly negative. But you also find online communities interested in fantasy creatures.",
                choices: [
                    { text: "Start a blog about real goblin culture", nextScene: 26 },
                    { text: "Join fantasy discussion forums", nextScene: 27 }
                ]
            },
            23: {
                text: "You discover other goblins through social media! They've been hiding in plain sight, working regular jobs with magical disguises.",
                choices: [
                    { text: "Ask them for help", nextScene: 28 },
                    { text: "Expose their secret", nextScene: 29 }
                ]
            },
            24: {
                text: "The fantasy creature community welcomes you. They have a whole underground network helping newcomers adapt to modern life.",
                choices: [
                    { text: "Help expand the network", nextScene: 30 },
                    { text: "Focus on personal growth", nextScene: 31 }
                ]
            },
            25: {
                text: "You tell the authorities about the fantasy creatures, hoping to bridge both worlds officially.",
                choices: [
                    { text: "Negotiate peace terms", nextScene: 32 },
                    { text: "Demand equal rights", nextScene: 33 }
                ]
            },
            26: {
                text: "Your blog goes viral! Humans are fascinated by your authentic goblin perspective and cultural insights.",
                choices: [
                    { text: "Write a book", nextScene: 34 },
                    { text: "Become a cultural ambassador", nextScene: 35 }
                ]
            },
            27: {
                text: "In the forums, you meet a group of sympathetic humans who want to help fantasy creatures integrate into society.",
                choices: [
                    { text: "Form an advocacy group", nextScene: 36 },
                    { text: "Create a support network", nextScene: 37 }
                ]
            },
            28: {
                text: "The goblin community offers you a magical disguise and a job at their tech startup.",
                choices: [
                    { text: "Accept and blend in", nextScene: 38 },
                    { text: "Suggest going public", nextScene: 39 }
                ]
            },
            // Additional endings
            30: {
                text: "Your work with the fantasy creature network creates a thriving underground society. You become a respected leader in the community.",
                choices: [
                    { text: "GOOD ENDING: Underground Leader", nextScene: 'restart' }
                ]
            },
            31: {
                text: "You master both magic and technology, becoming a valuable bridge between old and new worlds.",
                choices: [
                    { text: "GOOD ENDING: Modern Mage", nextScene: 'restart' }
                ]
            },
            32: {
                text: "Through careful diplomacy, you help establish the first official human-fantasy creature relations office.",
                choices: [
                    { text: "GOOD ENDING: Peace Ambassador", nextScene: 'restart' }
                ]
            },
            33: {
                text: "Your demands spark protests and conflict. The fantasy creatures are forced deeper into hiding.",
                choices: [
                    { text: "BAD ENDING: Failed Revolution", nextScene: 'restart' }
                ]
            },
            34: {
                text: "Your book 'From Raid to Reddit: A Goblin's Tale' becomes an international bestseller.",
                choices: [
                    { text: "GOOD ENDING: Bestselling Author", nextScene: 'restart' }
                ]
            },
            35: {
                text: "You become the first officially recognized goblin diplomat, speaking at the UN about fantasy creature rights.",
                choices: [
                    { text: "GOOD ENDING: World Diplomat", nextScene: 'restart' }
                ]
            },
            36: {
                text: "Your advocacy group successfully lobbies for fantasy creature protection laws.",
                choices: [
                    { text: "GOOD ENDING: Rights Activist", nextScene: 'restart' }
                ]
            },
            37: {
                text: "Your support network helps hundreds of fantasy creatures adapt to modern life.",
                choices: [
                    { text: "GOOD ENDING: Community Builder", nextScene: 'restart' }
                ]
            },
            38: {
                text: "You live a comfortable double life, using your unique perspective to innovate in tech.",
                choices: [
                    { text: "NEUTRAL ENDING: Secret Success", nextScene: 'restart' }
                ]
            },
            39: {
                text: "The public reveal of goblin-run companies causes panic in the stock market. Your community faces backlash.",
                choices: [
                    { text: "BAD ENDING: Market Crash", nextScene: 'restart' }
                ]
            },
            29: {
                text: "Exposing the goblin network leads to chaos. Many lose their jobs and homes, including you.",
                choices: [
                    { text: "BAD ENDING: Community Betrayer", nextScene: 'restart' }
                ]
            },
            // Add combat scenes directly
            'combat_rat': {
                text: "A giant rat emerges from the shadows!",
                choices: [
                    { 
                        text: "Fight the rat", 
                        action: () => {
                            const result = this.battle({...enemies.rat});
                            return result ? 'post_rat_victory' : 'game_over';
                        }
                    },
                    { text: "Try to run away", nextScene: 4 }
                ]
            },
            'combat_thug': {
                text: "A street thug spots you and approaches menacingly!",
                choices: [
                    { 
                        text: "Stand your ground and fight", 
                        action: () => {
                            const result = this.battle({...enemies.thug});
                            return result ? 'post_thug_victory' : 'game_over';
                        }
                    },
                    { text: "Try to talk it out", nextScene: 8 }
                ]
            }
        };

        // Handle restart
        if (sceneIndex === 'restart') {
            this.stats = {
                health: 100,
                maxHealth: 100,
                attack: 10,
                defense: 5,
                level: 1,
                exp: 0,
                expNeeded: 100,
                reputation: 0,
                friends: 0
            };
            this.inventory = [];
            this.updateInventoryDisplay();
            sceneIndex = 0;
        }

        const scene = scenes[sceneIndex];
        if (!scene) {
            console.log("Scene not found:", sceneIndex);
            return;
        }

        document.getElementById('story-text').textContent = scene.text;
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        
        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.onclick = () => {
                if (choice.action) choice.action();
                this.loadScene(choice.nextScene);
            };
            choicesDiv.appendChild(button);
        });
    }

    addToInventory(item) {
        if (this.inventory.length < this.maxInventorySize) {
            this.inventory.push(item);
            this.updateInventoryDisplay();
            this.addToStory(`Added ${item.name} to inventory!`);
        } else {
            this.addToStory("Inventory is full!");
        }
    }

    // Add these new methods for combat and leveling
    battle(enemy) {
        this.addToStory(`\nA ${enemy.name} appears! (Level ${enemy.level})`);
        
        while (this.stats.health > 0 && enemy.health > 0) {
            // Player's turn
            const playerDamage = Math.max(1, this.stats.attack - enemy.defense);
            enemy.health -= playerDamage;
            this.addToStory(`You deal ${playerDamage} damage to ${enemy.name}`);

            // Enemy's turn if still alive
            if (enemy.health > 0) {
                const enemyDamage = Math.max(1, enemy.attack - this.stats.defense);
                this.stats.health -= enemyDamage;
                this.addToStory(`${enemy.name} deals ${enemyDamage} damage to you`);
                document.getElementById('health').textContent = this.stats.health;
            }
        }

        if (this.stats.health > 0) {
            // Victory
            this.addToStory(`You defeated the ${enemy.name}!`);
            this.gainExp(enemy.exp);
            
            // Random loot
            if (enemy.loot && Math.random() < 0.7) { // 70% chance for loot
                const loot = enemy.loot[Math.floor(Math.random() * enemy.loot.length)];
                this.addToInventory(loot);
            }
            return true;
        } else {
            this.addToStory(`You were defeated by the ${enemy.name}...`);
            return false;
        }
    }

    gainExp(amount) {
        this.stats.exp += amount;
        this.addToStory(`Gained ${amount} EXP!`);
        
        while (this.stats.exp >= this.stats.expNeeded) {
            this.levelUp();
        }
        
        this.updateStats();
    }

    levelUp() {
        this.stats.level++;
        this.stats.exp -= this.stats.expNeeded;
        this.stats.expNeeded = Math.floor(this.stats.expNeeded * 1.5);
        
        // Stat increases
        this.stats.maxHealth += 20;
        this.stats.health = this.stats.maxHealth;
        this.stats.attack += 3;
        this.stats.defense += 2;
        
        this.addToStory(`\n🎉 Level Up! You are now level ${this.stats.level}!`);
        this.addToStory(`Health +20, Attack +3, Defense +2`);
        
        // Visual and sound feedback
        this.showLevelUpEffect();
        this.updateStats();
    }

    showLevelUpEffect() {
        // Create and show level up animation
        const levelUpEffect = document.createElement('div');
        levelUpEffect.className = 'level-up-effect';
        levelUpEffect.textContent = 'LEVEL UP!';
        document.body.appendChild(levelUpEffect);
        
        // Remove after animation
        setTimeout(() => {
            levelUpEffect.remove();
        }, 2000);
    }
}

// Add these enemy definitions at the top of your file
const enemies = {
    rat: {
        name: "Giant Rat",
        level: 1,
        health: 30,
        attack: 8,
        defense: 2,
        exp: 20,
        loot: [
            { name: "Rat Fang", type: "material", value: 1 },
            { name: "Small Healing Potion", type: "healing", value: 20 }
        ]
    },
    thug: {
        name: "Street Thug",
        level: 3,
        health: 50,
        attack: 12,
        defense: 5,
        exp: 40,
        loot: [
            { name: "Brass Knuckles", type: "weapon", attack: 5 },
            { name: "Leather Jacket", type: "armor", defense: 3 }
        ]
    },
    securityGuard: {
        name: "Security Guard",
        level: 5,
        health: 70,
        attack: 15,
        defense: 8,
        exp: 60,
        loot: [
            { name: "Security Baton", type: "weapon", attack: 8 },
            { name: "Guard Uniform", type: "armor", defense: 5 }
        ]
    }
};

// Create instance and start game
const game = new Game();
document.addEventListener('DOMContentLoaded', () => game.loadScene(0)); 