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
  "quotingAuthorID" text, image text, content text, votes integer DEFAULT 0
);
