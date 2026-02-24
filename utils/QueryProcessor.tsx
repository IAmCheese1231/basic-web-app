export default function QueryProcessor(query: string): string {
  const q = query.trim();

  const lower = q.toLowerCase();

  if (lower.includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (lower === "what is your andrew id?") {
    return "ezhang2";
  }

  const plusMatch = lower.match(/^what is (-?\d+) plus (-?\d+)\?$/);
  if (plusMatch) {
    const a = parseInt(plusMatch[1], 10);
    const b = parseInt(plusMatch[2], 10);
    return String(a + b);
  }

  const multMatch = lower.match(/^what is (-?\d+) multiplied by (-?\d+)\?$/);
  if (multMatch) {
    const a = parseInt(multMatch[1], 10);
    const b = parseInt(multMatch[2], 10);
    return String(a * b);
  }

  const largestMatch = lower.match(
    /^which of the following numbers is the largest: (.+)\?$/
  );
  if (largestMatch) {
    const nums = largestMatch[1]
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
    if (nums.length === 0) return "";
    let best = nums[0];
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] > best) best = nums[i];
    }
    return String(best);
  }

  const squareAndCubeMatch = lower.match(
    /^which of the following numbers is both a square and a cube: (.+)\?$/
  );
  if (squareAndCubeMatch) {
    const nums = squareAndCubeMatch[1]
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n) && n >= 0);

    const isPerfectSixthPower = (n: number): boolean => {
      if (n === 0) return true;
      if (n === 1) return true;
      const r = Math.round(Math.pow(n, 1 / 6));
      let p = 1;
      for (let i = 0; i < 6; i++) p *= r;
      return p === n;
    };

    for (const n of nums) {
      if (isPerfectSixthPower(n)) return String(n);
    }
    return "";
  }

  return "";
}