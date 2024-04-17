create table if not exists feature
(
    id   bigint auto_increment
        primary key,
    name varchar(255) null
);

create table if not exists tag
(
    id          bigint auto_increment
        primary key,
    name        varchar(50) not null,
    number_post int         not null,
    constraint Tên
        unique (name)
);

create table if not exists unit
(
    id            bigint auto_increment
        primary key,
    name          varchar(100) not null,
    number_staffs int          not null,
    manager_id    bigint       null,
    constraint Tên
        unique (name),
    constraint UK_i7a5kg72yn6qgcegnvvtsm4gn
        unique (manager_id)
);

create table if not exists unit_feature
(
    feature_id bigint not null,
    unit_id    bigint not null,
    primary key (feature_id, unit_id),
    constraint FKac15ueqe5cs7j0ctbeeil0vi2
        foreign key (unit_id) references unit (id),
    constraint FKf1096uh5hkuiv8956vbfmd5ff
        foreign key (feature_id) references feature (id)
);

create table if not exists user
(
    id         bigint auto_increment
        primary key,
    address    varchar(50)  not null,
    dob        varchar(10)  not null,
    email      varchar(255) not null,
    image      text         not null,
    is_deleted bit          not null,
    name       varchar(200) not null,
    password   varchar(255) not null,
    phone      varchar(11)  not null,
    unit_id    bigint       not null,
    constraint Email
        unique (email),
    constraint FKcjsdlph5v8ywnu5wqfkvk9mj8
        foreign key (unit_id) references unit (id)
);

create table if not exists password_reset_token
(
    id          int auto_increment
        primary key,
    expiry_date datetime(6)  null,
    token       varchar(255) null,
    user_id     bigint       not null,
    constraint FK5lwtbncug84d4ero33v3cfxvl
        foreign key (user_id) references user (id)
);

create table if not exists post
(
    id          bigint auto_increment
        primary key,
    attachments text         null,
    content     text         null,
    created_at  datetime(6)  not null,
    description varchar(200) not null,
    image       varchar(255) not null,
    title       varchar(100) not null,
    updated_at  datetime(6)  null,
    created_by  bigint       not null,
    constraint FK93o2xaw90541rp5xaf29hsgd2
        foreign key (created_by) references user (id)
);

create table if not exists post_tag
(
    post_id bigint not null,
    tag_id  bigint not null,
    primary key (post_id, tag_id),
    constraint FKac1wdchd2pnur3fl225obmlg0
        foreign key (tag_id) references tag (id),
    constraint FKc2auetuvsec0k566l0eyvr9cs
        foreign key (post_id) references post (id)
);

alter table unit
    add constraint FKcp3cavab0dkipglpra72qhqbu
        foreign key (manager_id) references user (id);

INSERT INTO ciw.unit (id, name, number_staffs)
VALUES (1, 'admin', 1);

INSERT INTO ciw.user (id, address, dob, email, image, is_deleted, name, password, phone, unit_id)
VALUES (1, 'TPHCM', '23/12/2000', 'admin@gmail.com',
        'https://firebasestorage.googleapis.com/v0/b/company-internal-web.appspot.com/o/Default%2Fdefault-avatar.png?alt=media',
        false, 'Admin\'s name', '$2a$10$HaDXxAFsuseSQHdmCaShhOu90UOVYiyRHj6fyDMBG5xUXAKS3FCLe', '0123456789', 1);

UPDATE ciw.unit
SET manager_id    = 1
WHERE id = 1;
