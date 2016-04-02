CREATE TABLE course (
  ID SERIAL PRIMARY KEY,
  "name" VARCHAR(64)
);



CREATE TABLE lesson (
  ID SERIAL PRIMARY KEY,
  "name" VARCHAR(64) UNIQUE
);

-- track dependencies between lessons: x is needed for y
CREATE TABLE prereq (
  id SERIAL PRIMARY KEY,
  cid INTEGER REFERENCES course,
  x INTEGER REFERENCES lesson,
  y INTEGER REFERENCES lesson,
  UNIQUE (cid, x, y)
);

CREATE VIEW course_lessons AS
  SELECT cid, x AS lid FROM prereq
  UNION
  SELECT cid, y from prereq;


-- dummy data, just for now:
INSERT INTO course (name)
VALUES ('Intro'), ('Course A101'), ('Course B102'), ('Course C103');

CREATE FUNCTION link(c INTEGER, xval VARCHAR, yval VARCHAR) RETURNS VOID AS $$
  BEGIN
    INSERT INTO lesson (name) VALUES (xval), (yval) ON CONFLICT DO NOTHING;
    INSERT INTO prereq (cid, x, y)
      SELECT c, (SELECT ID FROM lesson WHERE name=xval),
                (SELECT ID FROM lesson WHERE name=yval);
END;
$$ LANGUAGE plpgsql;

-- example graph for the intro lessons
select
  link(1, 'bits', 'bit vectors'),
  link(1, 'bit vectors', 'decision path'),
  link(1, 'decision path', 'fetch'),
  link(1, 'fetch', 'instruction pointer'),
  link(1, 'bit vectors', 'binary numbers'),
  link(1, 'binary numbers', 'counter'),
  link(1, 'bit vectors', 'truth tables'),
  link(1, 'truth tables', 'XOR'),
  link(1, 'XOR', 'half adder'),
  link(1, 'half adder', 'increment'),
  link(1, 'increment', 'counter'),
  link(1, 'counter', 'instruction pointer'),
  link(1, 'truth tables', 'AND'),
  link(1, 'AND', 'half adder'),
  link(1, 'bits', 'signals'),
  link(1, 'signals', 'logic gate'),
  link(1, 'logic gate', 'XOR'),
  link(1, 'logic gate', 'AND'),
  link(1, 'signals', 'feedback'),
  link(1, 'feedback', 'flip-flop'),
  link(1, 'feedback', 'oscillator'),
  link(1, 'oscillator', 'counter'),
  link(1, 'flip-flop', 'register'),
  link(1, 'register', 'ram'),
  link(1, 'ram', 'fetch');



-- this table is just for reference
CREATE TABLE opcode (id INTEGER PRIMARY KEY, opcode VARCHAR(8), sig TEXT, docs TEXT);
INSERT INTO opcode (id, opcode, sig, docs) VALUES
  (1, '___', '-', 'marks start of new screen'),
  (2, 'say', 's-', 'display text'),
  (3, 'ask', '-s', 'show text box with question. push answer s to stack.'),
  (4, 'chk', '(key|pos|neg) ans - bit', 'test answer against given key');

-- steps table
CREATE TABLE step (
  id SERIAL PRIMARY KEY,
  lid INTEGER NOT NULL REFERENCES lesson,
  seq INTEGER NOT NULL,
  op INTEGER NOT NULL REFERENCES opcode,
  arg TEXT,
  UNIQUE (lid, seq));


-- dummy steps for a first "lesson":
INSERT INTO step (lid, seq, op, arg) VALUES
  (1, 1, 2, 'hello world'),
  (1, 2, 2, 'this is a lesson about bits'),
  (1, 3, 1, ''),
  (1, 4, 2, 'A bit is the smallest unit of information. It represents a distinction between 2 choices.'),
  (1, 5, 1, ''),
  (1, 6, 3, 'How many choices can a single bit designate at once?'),
  (1, 7, 4, '2|Very good!|Try again.');


CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(32) UNIQUE);
INSERT INTO "user" VALUES (0, 'admin'), (1, 'guest');

CREATE TABLE user_lesson (
  id SERIAL PRIMARY KEY,
  uid INTEGER NOT NULL REFERENCES "user",
  lid INTEGER NOT NULL REFERENCES "lesson",
  started TIMESTAMP,
  finished TIMESTAMP,
  status TEXT,
  UNIQUE (uid, lid));

CREATE TABLE user_answer (
  id SERIAL PRIMARY KEY,
  ts TIMESTAMP WITHOUT TIME ZONE
    DEFAULT (now() AT TIME ZONE 'utc'),
  uid INTEGER NOT NULL REFERENCES "user",
  sid INTEGER NOT NULL REFERENCES "step",
  answer TEXT);
