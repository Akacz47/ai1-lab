create table song
(
    id      integer not null
        constraint song_pk
            primary key autoincrement,
    subject text not null,
    content text not null
);
