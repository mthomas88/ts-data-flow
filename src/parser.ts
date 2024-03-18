const keywords = {
  insert_into: "INSERT INTO",
  update: "UPDATE",
  from: "FROM",
  delete_from: "DELETE FROM",
  create_table: "CREATE TABLE",
  alter_table: "ALTER TABLE",
  drop_table: "DROP TABLE",
  join: "JOIN",
  inner_join: "INNER JOIN",
  left_join: "LEFT JOIN",
  right_join: "RIGHT JOIN",
  full_join: "FULL JOIN",
  select: "SELECT",
  where: "WHERE",
  group_by: "GROUP BY",
  having: "HAVING",
  order_by: "ORDER BY",
  distinct: "DISTINCT",
  as: "AS",
  case: "CASE",
  when: "WHEN",
  then: "THEN",
  else: "ELSE",
  end: "END",
  create_index: "CREATE INDEX",
  drop_index: "DROP INDEX",
  union: "UNION",
} as const;

const possible_terminations = [
  // keywords.group_by,
  // keywords.order_by,
  keywords.from,
  // keywords.full_join,
  // keywords.inner_join,
  // keywords.right_join,
  // keywords.full_join,
  // keywords.delete_from,
  // keywords.where,
];

const find_termination_keyword = (
  search_val: string,
  keyword: string,
  known_start = 0
) => {
  const pos = search_val.indexOf(keyword, known_start);
  return pos > -1;
};

export const create_keyword_struct = (search_val: string, keyword: string) => ({
  keyword: keyword,
  pos: search_val.indexOf(keyword),
});

export const sanitise_string = (s: string) => {
  return s.trim().toLowerCase();
};

export const find_start = (search_val: string, s: string) => {
  const san_kwd_select = sanitise_string(keywords.select);

  return {
    keyword: san_kwd_select,
    pos: sanitise_string(search_val).indexOf(san_kwd_select),
  };
};

type KeywordSearchResult = {
  pos: number;
  keyword: string;
};

const find_end_values = (
  search_val: string,
  termination_candidates: string[],
  start_boundary = 0
) => {
  return termination_candidates
    .map((keyword) => create_keyword_struct(search_val, keyword))
    .filter((keyword) =>
      find_termination_keyword(search_val, keyword.keyword, start_boundary)
    )
    .reduce<Record<`keyword_${number}`, KeywordSearchResult>>(
      (end_struct, val, idx) => {
        return {
          ...end_struct,
          [`keyword_${idx}`]: {
            ...val,
          },
        };
      },
      {}
    );
};

const calculate_start_boundary = (start_val: KeywordSearchResult) => {
  return Math.round(start_val.pos + (start_val.keyword.length - 1) + 1);
};

const parse_sql = (sql: string) => {
  const normalised = sql.normalize();

  const sanitised_sql = sanitise_string(sql);

  const start_val = find_start(sanitised_sql, keywords.select);

  const start_boundary = calculate_start_boundary(start_val);

  const end_values = find_end_values(
    sanitised_sql,
    possible_terminations,
    start_boundary
  );

  return {
    _sql: sql,
    _normalised: normalised,
    _sanitised: sanitised_sql,
    _internal: {
      query_start_pos: start_val.pos,
      query_start_keyword: start_val.keyword,
      query_end_variants: { ...end_values },
    },
  };
};

export default parse_sql;
