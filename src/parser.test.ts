import { expect, suite, describe, test, beforeAll } from "vitest";

import parse_sql, { sanitise_string } from "./parser";

const test_basic_sql = `//qwerqweqweqwe 
select * from tbl_user`;

suite("sql parser", () => {
  describe("parse_sql function", () => {
    let sql_result_unknown: {
      _sql?: unknown;
      _normalised?: unknown;
    };

    beforeAll(() => {
      sql_result_unknown = parse_sql(test_basic_sql);
      console.log(sql_result_unknown);
    });

    test("can take a sql string as input", () => {
      expect(sql_result_unknown).toBeTypeOf("object");
    });

    test("output returns previously input string", () => {
      expect(sql_result_unknown._sql).toStrictEqual(sql_result_unknown._sql);
    });

    test("normalised output", () => {
      expect(sql_result_unknown._normalised).toBeTypeOf("string");
    });
  });

  describe("sanitise_string", () => {
    test("sanitise string words removes any amounts of whitespace", () => {
      const string = " i am a stupid string   ";
      const output = sanitise_string(string);

      const start_char = output.charAt(0) === " ";
      const end_char = output.charAt(output.length - 1) === " ";

      expect(start_char).toBeFalsy();
      expect(end_char).toBeFalsy();
    });

    test("sanitise string words does not trim words that aren't whitespace", () => {
      const string = "/+i am a stupid string  =";
      const output = sanitise_string(string);

      const start_char = output.charAt(0) === "/";
      const end_char = output.charAt(output.length - 1) === "=";

      expect(start_char).toBeTruthy();
      expect(end_char).toBeTruthy();
    });
  });
});
