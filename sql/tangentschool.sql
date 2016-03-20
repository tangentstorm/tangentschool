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

