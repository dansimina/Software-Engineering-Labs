CREATE SCHEMA IF NOT EXISTS MyDatabase;
USE MyDatabase;

CREATE TABLE IF NOT EXISTS `account` (
	`id` INT NOT NULL PRIMARY KEY,
    `username` VARCHAR(45),
    `password` VARCHAR(45),
    `email` VARCHAR(45)
);

CREATE TABLE IF NOT EXISTS `user` (
	`id` INT NOT NULL PRIMARY KEY,
    `account_id` INT NOT NULL,
    `surename` VARCHAR(45),
    `forename` VARCHAR(45),
    `role` VARCHAR(10),
    `description` VARCHAR(10000),
    `registration_date` DATE,
    
    CONSTRAINT FK_AccountUser FOREIGN KEY (`account_id`)
    REFERENCES `account`(`id`)
);

CREATE TABLE IF NOT EXISTS `movie` (
	`id` INT NOT NULL PRIMARY KEY,
    `poster` TEXT,
    `title` VARCHAR(100),
    `description` VARCHAR(10000),
    `release_year` DATE,
    `genres` VARCHAR(100),
    `runtime` TIME,
    `stars` VARCHAR(1000),
    `director` VARCHAR(50),
    `created_at` DATE
);

CREATE TABLE IF NOT EXISTS `recommendation` (
	`id` INT NOT NULL PRIMARY KEY,
    `user_id` INT NOT NULL,
    `movie_id` INT NOT NULL,
    `content` VARCHAR(15000),
    `created_at` DATE,
    
    CONSTRAINT FK_UserRecommendation FOREIGN KEY (`user_id`)
    REFERENCES `user`(`id`),
    
    CONSTRAINT FK_MovieRecommendation FOREIGN KEY (`movie_id`)
    REFERENCES `movie`(`id`)
);

CREATE TABLE IF NOT EXISTS `comment` (
	`id` INT NOT NULL PRIMARY KEY,
    `user_id` INT NOT NULL,
    `recommendation_id` INT NOT NULL,
    `content` VARCHAR(10000),
    `created_at` DATE,
    
    CONSTRAINT FK_UserComment FOREIGN KEY (`user_id`)
    REFERENCES `user`(`id`),
    
    CONSTRAINT FK_RecommendationComment FOREIGN KEY (`recommendation_id`)
    REFERENCES `recommendation`(`id`)
    
);

CREATE TABLE IF NOT EXISTS `followed_user` (
	`follower_id` INT NOT NULL,
    `followed_id` INT NOT NULL,
    `created_at` DATE,
    
    CONSTRAINT FK_UserFollower FOREIGN KEY (`follower_id`)
    REFERENCES `user`(`id`),
    
    CONSTRAINT FK_UserFollowed FOREIGN KEY (`followed_id`)
    REFERENCES `user`(`id`)
);

