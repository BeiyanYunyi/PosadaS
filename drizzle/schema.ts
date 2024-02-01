import schemaName from '@/app/utils/schemaName';
import {
  bigint,
  bigserial,
  boolean,
  customType,
  index,
  integer,
  pgSchema,
  text,
  unique,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return 'bytea';
  },
});

export const schema = pgSchema(schemaName);

export const dbVersion = schema.table('dbVersion', {
  dbVersion: integer('dbVersion').primaryKey().notNull(),
});

export const image = schema.table(
  'image',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey().notNull(),
    imgId: varchar('imgID', { length: 255 }),
    // TODO: failed to parse database type 'bytea'
    imgContent: bytea('imgContent'),
  },
  (table) => ({
    imgID: index('image_img_i_d').on(table.imgId),
    imgidIdx: index('image_imgid_index').on(table.imgId),
    imageImgidUnique: unique('image_imgid_unique').on(table.imgId),
  }),
);

export const reply = schema.table(
  'reply',
  {
    replyId: text('replyID').primaryKey().notNull(),
    topicId: text('topicID'),
    authorId: text('authorID'),
    authorName: text('authorName'),
    isPoster: boolean('isPoster'),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    replyTime: bigint('replyTime', { mode: 'number' }),
    quoting: boolean('quoting'),
    quotingImage: text('quotingImage'),
    quotingText: text('quotingText'),
    quotingAuthorId: text('quotingAuthorID'),
    quotingAuthorName: text('quotingAuthorName'),
    image: text('image'),
    content: text('content'),
    votes: integer('votes').default(0),
  },
  (table) => ({
    idx38486Replytime: index('idx_38486_replytime').on(table.replyTime),
    replyTime: index('reply_reply_time').on(table.replyTime),
  }),
);

export const topicList = schema.table(
  'topicList',
  {
    title: text('title'),
    authorId: text('authorID'),
    authorName: text('authorName'),
    reply: integer('reply'),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lastReplyTime: bigint('lastReplyTime', { mode: 'number' }),
    topicId: text('topicID').primaryKey().notNull(),
    isElite: boolean('isElite'),
    content: text('content'),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lastFetchTime: bigint('lastFetchTime', { mode: 'number' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createTime: bigint('createTime', { mode: 'number' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    deleteTime: bigint('deleteTime', { mode: 'number' }),
  },
  (table) => ({
    idx16976Lastreplytime: index('idx_16976_lastreplytime').on(table.lastReplyTime),
    idx16976SqliteAutoindexTopiclist1: uniqueIndex('idx_16976_sqlite_autoindex_topiclist_1').on(
      table.topicId,
    ),
    topicListLastReplyTime: index('topic_list_last_reply_time').on(table.lastReplyTime),
  }),
);

export const user = schema.table(
  'user',
  {
    id: varchar('id', { length: 36 }).primaryKey().notNull(),
    username: text('username'),
    nickname: text('nickname'),
    password: text('password'),
    avatar: text('avatar'),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lastRevokeTime: bigint('lastRevokeTime', { mode: 'number' }),
    isVerified: boolean('isVerified').default(false),
  },
  (table) => ({
    idIdx: index().on(table.id),
    username: index('user_username').on(table.username),
    usernameIdx: index().on(table.username),
    userUsernameUnique: unique('user_username_unique').on(table.username),
  }),
);
