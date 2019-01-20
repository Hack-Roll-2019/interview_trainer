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

INSERT INTO user VALUES("1", "Matthew")
INSERT INTO question VALUES ("1", "Tell a bit about yourself");
INSERT INTO question VALUES ("2", "Why are you interested in working for our company?");
INSERT INTO sessiontable VALUES("1", "1", "0.1", "0.7");
INSERT INTO answer VALUES("1", "1", "1", "link", "transcript", "0.2", "0.7");
INSERT INTO answer VALUES("2", "1", "2", "link2", "transcript", "0.0", "0.7");
