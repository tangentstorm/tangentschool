CREATE TABLE course (
  ID SERIAL,
  "name" VARCHAR(64)
);

-- dummy data, just for now:
INSERT INTO course (name) VALUES ('Course A101'), ('Course B102'), ('Course C103');
