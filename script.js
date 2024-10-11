let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];
let xpLevel = 1;
let xpThreshold = 9;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const xpLevelText = document.querySelector("#levelText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 },
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".',
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to cave"],
    "button functions": [goTown, goTown, goCave],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to cave", "Go to secret game"],
    "button functions": [goTown, goCave, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
];

let skills = {
  heal: { unlocked: false, cooldown: 0, maxCooldown: 5 }, // unlocked at level 3
  doubleAttack: { unlocked: false, cooldown: 0, maxCooldown: 3 }, // unlocked at level 5
};

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";

  let buttonTexts = location["button text"];
  let uniqueButtonTexts = [...new Set(buttonTexts)];

  button1.innerText = uniqueButtonTexts[0];
  button1.onclick =
    location["button functions"][buttonTexts.indexOf(uniqueButtonTexts[0])];

  if (uniqueButtonTexts.length > 1) {
    button2.style.display = "inline-block";
    button2.innerText = uniqueButtonTexts[1];
    button2.onclick =
      location["button functions"][buttonTexts.indexOf(uniqueButtonTexts[1])];
  } else {
    button2.style.display = "none";
  }

  if (uniqueButtonTexts.length > 2) {
    button3.style.display = "inline-block";
    button3.innerText = uniqueButtonTexts[2];
    button3.onclick =
      location["button functions"][buttonTexts.indexOf(uniqueButtonTexts[2])];
  } else {
    button3.style.display = "none";
  }

  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
  button1.style.display = "inline-block";
  button2.style.display = "inline-block";
  document.querySelector("#doubleAttackButton").style.display = "none";
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory.join(", ");
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory.join(", ");
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;

  if (skills.doubleAttack.unlocked) {
    document.querySelector("#doubleAttackButton").style.display =
      "inline-block";
  }
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";

  let attackBonus = getAttackBonus();
  health -= getMonsterAttackValue(monsters[fighting].level);

  if (isMonsterHit()) {
    let damage =
      (weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1) *
      (1 + attackBonus / 100);
    monsterHealth -= damage;
    text.innerText += " You dealt " + Math.floor(damage);
  } else {
    text.innerText += " You miss.";
  }

  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }

  reduceCooldowns();

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  checkLevelUp();

  document.querySelector("#doubleAttackButton").style.display = "none";

  if (Math.random() <= 0.3) {
    update(locations[8]);
  } else {
    update(locations[4]);
  }
}

function lose() {
  update(locations[5]);
  document.querySelector("#healButton").style.display = "none";
  document.querySelector("#doubleAttackButton").style.display = "none";
}

function winGame() {
  update(locations[6]);
  document.querySelector("#healButton").style.display = "none";
  document.querySelector("#doubleAttackButton").style.display = "none";
}

function restart() {
  xp = 0;
  xpLevel = 1;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  xpLevelText.innerText = xpLevel;
  xpThreshold = 10;
  skills.heal.unlocked = false;
  skills.heal.cooldown = 0;
  document.querySelector("#healButton").style.display = "none";
  skills.doubleAttack.unlocked = false;
  skills.doubleAttack.cooldown = 0;
  document.querySelector("#doubleAttackButton").style.display = "none";
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }

  button1.style.display = "none";
  button2.style.display = "none";
}

function checkLevelUp() {
  if (xp > xpThreshold) {
    xpLevel++;
    xpThreshold += 10;
    text.innerText = "You leveled up! You are now level " + xpLevel + ".";
    xpLevelText.innerText = xpLevel;

    if (xpLevel === 3) {
      skills.heal.unlocked = true;
      text.innerText += " You unlocked the Heal skill!";
      document.querySelector("#healButton").style.display = "inline-block";
    }

    if (xpLevel === 5) {
      skills.doubleAttack.unlocked = true;
      text.innerText += " You unlocked the Double Attack skill!";
      document.querySelector("#doubleAttackButton").style.display =
        "inline-block";
    }
  }
}

function getAttackBonus() {
  let bonus = 0;

  if (xpLevel === 1) {
    bonus = 0;
  } else if (xpLevel >= 2 && xpLevel <= 5) {
    bonus = 3 + xpLevel * 2; // Increases by 2%
  } else if (xpLevel > 5) {
    bonus = 13 + (xpLevel - 5); // Increases by 1% per level after level 5
  }

  return bonus > 50 ? 50 : bonus; // Cap the bonus at 50%
}

function useHeal() {
  if (skills.heal.unlocked && skills.heal.cooldown === 0) {
    health += 20;
    healthText.innerText = health;
    text.innerText = "You used Heal and restored 20 health.";
    skills.heal.cooldown = skills.heal.maxCooldown;
    updateSkillCooldowns();
  } else {
    text.innerText = "Heal is on cooldown";
  }
}

function useDoubleAttack() {
  if (skills.doubleAttack.unlocked && skills.doubleAttack.cooldown === 0) {
    text.innerText = "You use Double Attack";
    attack();

    if (monsterHealth > 0) {
      attack();
    }

    skills.doubleAttack.cooldown = skills.doubleAttack.maxCooldown;
    updateSkillCooldowns();
  } else {
    text.innerText = "Double Attack is on cooldown";
  }
}

function reduceCooldowns() {
  if (skills.heal.cooldown > 0) {
    skills.heal.cooldown--;
  }

  if (skills.doubleAttack.cooldown > 0) {
    skills.doubleAttack.cooldown--;
  }
  updateSkillCooldowns();
}

function updateSkillCooldowns() {
  document.querySelector("#healCooldown").innerText =
    skills.heal.cooldown > 0 ? skills.heal.cooldown : "Ready";
  document.querySelector("#doubleAttackCooldown").innerText =
    skills.doubleAttack.cooldown > 0 ? skills.doubleAttack.cooldown : "Ready";
}
