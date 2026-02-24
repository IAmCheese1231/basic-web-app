export default function QueryProcessor(query: string): string {
  const raw = query.trim();
  const q = raw.toLowerCase().replace(/\s+/g, " ");

  if (q.includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (q === "what is your andrew id?" || q === "what is your andrew id") {
    return "ezhang2";
  }

  if (q === "what is your name?" || q === "what is your name") {
    return "Ethan";
  }

  const power = q.match(/^what is (-?\d+) to the power of (-?\d+)\??$/);
  if (power) {
    const a = BigInt(power[1]);
    const b = BigInt(power[2]);
    if (b < 0n) return "";
    return (a ** b).toString();
  }

  const mult = q.match(/^what is (-?\d+) multiplied by (-?\d+)\??$/);
  if (mult) {
    const a = parseInt(mult[1], 10);
    const b = parseInt(mult[2], 10);
    return String(a * b);
  }

  const minus = q.match(/^what is (-?\d+) minus (-?\d+)\??$/);
  if (minus) {
    const a = parseInt(minus[1], 10);
    const b = parseInt(minus[2], 10);
    return String(a - b);
  }

  const multiPlus = q.match(/^what is (.+)\??$/);
  if (multiPlus && q.includes("plus")) {
    const nums = multiPlus[1]
      .split("plus")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
    if (nums.length > 0) {
      let sum = 0;
      for (let i = 0; i < nums.length; i++) sum += nums[i];
      return String(sum);
    }
  }

  const largest = q.match(
    /^which of the following numbers is the largest: (.+)\??$/
  );
  if (largest) {
    const nums = largest[1]
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
    if (nums.length === 0) return "";
    let best = nums[0];
    for (let i = 1; i < nums.length; i++) if (nums[i] > best) best = nums[i];
    return String(best);
  }

  const primes = q.match(
    /^which of the following numbers are primes: (.+)\??$/
  );
  if (primes) {
    const nums = primes[1]
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));

    const isPrime = (n: number): boolean => {
      if (n < 2) return false;
      if (n % 2 === 0) return n === 2;
      let d = 3;
      while (d * d <= n) {
        if (n % d === 0) return false;
        d += 2;
      }
      return true;
    };

    const ps = nums.filter(isPrime);
    return ps.join(", ");
  }

  const sqCube = q.match(
    /^which of the following numbers is both a square and a cube: (.+)\??$/
  );
  if (sqCube) {
    const nums = sqCube[1]
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n) && n >= 0);

    const isPerfectSixthPower = (n: number): boolean => {
      if (n === 0 || n === 1) return true;
      const r = Math.round(Math.pow(n, 1 / 6));
      let p = 1;
      for (let i = 0; i < 6; i++) p *= r;
      return p === n;
    };

    const hits = nums.filter(isPerfectSixthPower);
    return hits.join(", ");
  }

  return "";
}