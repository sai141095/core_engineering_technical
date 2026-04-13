
function sort(width, height, length, mass) {
  if (
    typeof width !== "number" ||
    typeof height !== "number" ||
    typeof length !== "number" ||
    typeof mass !== "number"
  ) {
    throw new TypeError("All arguments must be numbers.");
  }

  if (width <= 0 || height <= 0 || length <= 0 || mass <= 0) {
    throw new RangeError("All dimensions and mass must be greater than zero.");
  }

  const volume = width * height * length;

  const isBulky =
    volume >= 1_000_000 ||
    width >= 150 ||
    height >= 150 ||
    length >= 150;

  const isHeavy = mass >= 20;

  if (isBulky && isHeavy) return "REJECTED";
  if (isBulky || isHeavy) return "SPECIAL";
  return "STANDARD";
}


// ─── Tests ────────────────────────────────────────────────────────────────────

const tests = [
  // Standard packages
  { args: [10, 10, 10, 5],       expected: "STANDARD", desc: "small, light" },
  { args: [1, 1, 1, 1],          expected: "STANDARD", desc: "minimal dimensions and mass" },
  { args: [49, 49, 49, 19],      expected: "STANDARD", desc: "just under all thresholds (vol ~117k, mass 19)" },

  // Bulky only → SPECIAL
  { args: [100, 100, 100, 5],    expected: "SPECIAL",  desc: "volume exactly 1,000,000 (bulky, not heavy)" },
  { args: [150, 1, 1, 1],        expected: "SPECIAL",  desc: "one dimension exactly 150 (bulky, not heavy)" },
  { args: [200, 1, 1, 5],        expected: "SPECIAL",  desc: "one dimension > 150 (bulky, not heavy)" },
  { args: [1000, 1, 1, 10],      expected: "SPECIAL",  desc: "extreme length, light" },

  // Heavy only → SPECIAL
  { args: [10, 10, 10, 20],      expected: "SPECIAL",  desc: "mass exactly 20 (heavy, not bulky)" },
  { args: [10, 10, 10, 50],      expected: "SPECIAL",  desc: "very heavy, small package" },

  // Both bulky and heavy → REJECTED
  { args: [100, 100, 100, 20],   expected: "REJECTED", desc: "volume 1,000,000 and mass exactly 20" },
  { args: [150, 150, 150, 25],   expected: "REJECTED", desc: "all dimensions >= 150 and heavy" },
  { args: [200, 200, 200, 100],  expected: "REJECTED", desc: "massively bulky and heavy" },
  { args: [150, 1, 1, 20],       expected: "REJECTED", desc: "one dimension 150 and mass exactly 20" },

  // Edge cases — volume boundary
  { args: [99, 101, 100, 5],     expected: "SPECIAL",  desc: "volume = 999,900 but height > 99 — wait, 99*101*100=999900 not bulky by vol, height=101 not >=150 → STANDARD" },
  { args: [100, 100, 99, 5],     expected: "STANDARD", desc: "volume = 990,000, no dim >= 150, light" },
  { args: [100, 100, 100, 19],   expected: "SPECIAL",  desc: "volume exactly 1,000,000, mass 19 (bulky only)" },
];

// Fix the edge case desc above — 99*101*100 = 999900 < 1M, no dim >=150 → STANDARD
tests[13].expected = "STANDARD";

let passed = 0;
let failed = 0;

console.log("Running tests...\n");

for (const { args, expected, desc } of tests) {
  const result = sort(...args);
  const ok = result === expected;
  if (ok) {
    passed++;
    console.log(`  PASS  sort(${args}) → "${result}"  [${desc}]`);
  } else {
    failed++;
    console.log(`  FAIL  sort(${args}) → "${result}" (expected "${expected}")  [${desc}]`);
  }
}

// Input validation tests
console.log("\nValidation tests...\n");
const validationTests = [
  { fn: () => sort("10", 10, 10, 5),  desc: "string width → TypeError" },
  { fn: () => sort(10, 10, 10, -1),   desc: "negative mass → RangeError" },
  { fn: () => sort(0, 10, 10, 5),     desc: "zero width → RangeError" },
];

for (const { fn, desc } of validationTests) {
  try {
    fn();
    console.log(`  FAIL  No error thrown — [${desc}]`);
    failed++;
  } catch (e) {
    console.log(`  PASS  ${e.constructor.name}: ${e.message}  [${desc}]`);
    passed++;
  }
}

console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) console.log("All tests passed.");