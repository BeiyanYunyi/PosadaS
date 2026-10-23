-- Disposable CI fixture only. This is not a production migration.
CREATE SCHEMA posadas;
CREATE TABLE posadas."topicList" (
  title text, "authorID" text, "authorName" text, reply integer,
  "lastReplyTime" bigint, "topicID" text PRIMARY KEY, "isElite" boolean,
  content text, "lastFetchTime" bigint, "createTime" bigint, "deleteTime" bigint
);
CREATE TABLE posadas.reply (
  "replyID" text PRIMARY KEY, "topicID" text, "authorID" text,
  "authorName" text, "isPoster" boolean, "replyTime" bigint,
  quoting boolean, "quotingImage" text, "quotingText" text,
  "quotingAuthorID" text, "quotingAuthorName" text, image text, content text, votes integer DEFAULT 0
);

INSERT INTO posadas."topicList" ("topicID", title, "authorID", "authorName", reply, "lastReplyTime", "isElite", content, "createTime")
VALUES ('00000000-0000-4000-8000-000000000001', 'Container test 字体测试', 'test-author', 'CI', 1, 1700000000, true, 'Synthetic container fixture', 1700000000);
INSERT INTO posadas.reply ("replyID", "topicID", "authorID", "authorName", "isPoster", "replyTime", content, votes)
VALUES ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'test-author', 'CI', true, 1700000000, 'Synthetic reply', 1);
