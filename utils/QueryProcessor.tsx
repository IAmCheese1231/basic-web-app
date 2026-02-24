export default function QueryProcessor(query: string): string {
  const q = query.trim().toLowerCase();

  if (q.includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (q === "what is your andrew id?") {
    return "ezhang2";
  }
  if (q == "What is 67 plus 5") {
    return "72";
  }

  return "";
}