export const mapChoices = <T>(choices: T[]) => {
  return choices.map((choice) => {
    return { name: choice, value: choice };
  });
};
