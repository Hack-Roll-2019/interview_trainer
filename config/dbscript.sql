CREATE TABLE users (
    userId VARCHAR(8) PRIMARY KEY,
    email VARCHAR(64)
);

CREATE TABLE sessionTable (
    sessionid VARCHAR(8),
    userid VARCHAR(8),
    time VARCHAR(8),
    grammarScore NUMERIC,
    facialScore NUMERIC,
    PRIMARY KEY sessionid,
    FOREIGN KEY (userid) REFERENCES users(userid),
);

CREATE TABLE question (
    questionid VARCHAR(8),
    question VARCHAR(256)
);

CREATE TABLE answer (
    sessionid VARCHAR(8) REFERENCES users,
    questionid VARCHAR(256) REFERENCES question,
    video VARCHAR(256),
    transcript VARCHAR,
    grammarScore NUMERIC,
    facialScore NUMERIC
);
