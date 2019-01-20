CREATE TABLE users (
    userId VARCHAR(8) PRIMARY KEY,
    email VARCHAR(64)
);

CREATE TABLE sessionTable (
    sessionid VARCHAR(8),
    userid VARCHAR(8),
    grammarScore NUMERIC,
    facialScore NUMERIC,
    PRIMARY KEY (sessionid),
    FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE question (
    questionid VARCHAR(8) PRIMARY KEY,
    question VARCHAR(256)
);

CREATE TABLE answer (
    answerid VARCHAR(8) PRIMARY KEY,
    sessionid VARCHAR(8),
    questionid VARCHAR(256),
    video VARCHAR(256),
    transcript LONGTEXT,
    grammarScore NUMERIC,
    facialScore NUMERIC,
    FOREIGN KEY (sessionid) REFERENCES sessionTable(sessionid),
    FOREIGN KEY (questionid) REFERENCES question(questionid)
);
