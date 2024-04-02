export const gameClasses = [
  "Warrior",
  "Assassin",
  "Mage",
  "Archer",
  "Thief",
] as const;

export const mappedGameClasses = gameClasses.map((gameClass) => {
  return { name: gameClass, value: gameClass };
});
