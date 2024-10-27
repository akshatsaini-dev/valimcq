export function parseAnswers(answersString: string): string[][] {
  return answersString.split(";").map((answer) =>
    answer
      .split(".")[1]
      .trim()
      .split(",")
      .map((a) => a.trim())
  );
}
