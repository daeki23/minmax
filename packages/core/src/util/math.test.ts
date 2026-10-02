import { describe, expect, it } from "vitest";
import { groupThousands } from "./math.js";

describe("groupThousands", () => {
  it("groups digits without an Intl dependency", () => {
    expect(groupThousands(0)).toBe("0");
    expect(groupThousands(999)).toBe("999");
    expect(groupThousands(8420)).toBe("8,420");
    expect(groupThousands(1234567.6)).toBe("1,234,568");
    expect(groupThousands(-10000)).toBe("-10,000");
  });
});
