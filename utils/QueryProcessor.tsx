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
    const base = BigInt(power[1]);
    const exp = BigInt(power[2]);
    if (exp < 0n) return "";
    let result = 1n;
    let b = base;
    let e = exp;
    while (e > 0n) {
      if (e & 1n) result *= b;
      b *= b;
      e >>= 1n;
    }
    return result.toString();
  }

  const whatIs = q.match(/^what is (.+)\??$/);
  if (whatIs) {
    const expr = whatIs[1];

    if (expr.includes("plus") || expr.includes("minus") || expr.includes("multiplied by")) {
      const tokens: (bigint | "+" | "-" | "*")[] = [];
      const parts = expr.split(" ");

      let i = 0;
      while (i < parts.length) {
        const w = parts[i];

        if (/^-?\d+$/.test(w)) {
          tokens.push(BigInt(w));
          i += 1;
          continue;
        }

        if (w === "plus") {
          tokens.push("+");
          i += 1;
          continue;
        }

        if (w === "minus") {
          tokens.push("-");
          i += 1;
          continue;
        }

        if (w === "multiplied" && i + 1 < parts.length && parts[i + 1] === "by") {
          tokens.push("*");
          i += 2;
          continue;
        }

        i += 1;
      }

      if (tokens.length > 0) {
        if (tokens[0] === "+" || tokens[0] === "-" || tokens[0] === "*") return "";

        const output: (bigint | "+" | "-" | "*")[] = [];
        const ops: ("+" | "-" | "*")[] = [];

        const prec = (op: "+" | "-" | "*"): number => (op === "*" ? 2 : 1);

        for (const t of tokens) {
          if (typeof t === "bigint") {
            output.push(t);
          } else {
            while (ops.length > 0 && prec(ops[ops.length - 1]) >= prec(t)) {
              output.push(ops.pop() as "+" | "-" | "*");
            }
            ops.push(t);
          }
        }
        while (ops.length > 0) output.push(ops.pop() as "+" | "-" | "*");

        const st: bigint[] = [];
        for (const t of output) {
          if (typeof t === "bigint") {
            st.push(t);
          } else {
            if (st.length < 2) return "";
            const b = st.pop() as bigint;
            const a = st.pop() as bigint;
            if (t === "+") st.push(a + b);
            else if (t === "-") st.push(a - b);
            else st.push(a * b);
          }
        }

        if (st.length === 1) return st[0].toString();
      }
    }
  }

  const largest = q.match(/^which of the following numbers is the largest: (.+)\??$/);
  if (largest) {
    const nums =
      largest[1]
        .match(/-?\d+/g)
        ?.map((s) => parseInt(s, 10))
        .filter((n) => !Number.isNaN(n)) ?? [];
    if (nums.length === 0) return "";
    let best = nums[0];
    for (let i = 1; i < nums.length; i++) if (nums[i] > best) best = nums[i];
    return String(best);
  }

  const primes = q.match(/^which of the following numbers are primes: (.+)\??$/);
  if (primes) {
    const nums =
      primes[1]
        .match(/-?\d+/g)
        ?.map((s) => parseInt(s, 10))
        .filter((n) => !Number.isNaN(n)) ?? [];

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

    return nums.filter(isPrime).join(", ");
  }

  const sqCube = q.match(
    /^which of the following numbers is both a square and a cube: (.+)\??$/
  );
  if (sqCube) {
    const nums =
      sqCube[1]
        .match(/-?\d+/g)
        ?.map((s) => parseInt(s, 10))
        .filter((n) => Number.isFinite(n) && n >= 0) ?? [];

    const isPerfectSixthPower = (n: number): boolean => {
      if (n === 0 || n === 1) return true;
      const r = Math.round(Math.pow(n, 1 / 6));
      let p = 1;
      for (let i = 0; i < 6; i++) p *= r;
      return p === n;
    };

    return nums.filter(isPerfectSixthPower).join(", ");
  }

  return "";
}