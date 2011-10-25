SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `lao` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `lao` ;

-- -----------------------------------------------------
-- Table `lao`.`tbl_user`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `lao`.`tbl_user` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `lastname` VARCHAR(255) NOT NULL ,
  `firstname` VARCHAR(255) NOT NULL ,
  `password` VARCHAR(48) NOT NULL ,
  `email` VARCHAR(255) NOT NULL ,
  `isRegistered` TINYINT(1)  NOT NULL ,
  `lastVisit` DATETIME NOT NULL ,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `lao`.`tbl_whiteboard`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `lao`.`tbl_whiteboard` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(255) NOT NULL ,
  `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `owner` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_user_whiteboard` (`id` ASC) ,
  CONSTRAINT `fk_user_whiteboard`
    FOREIGN KEY (`id` )
    REFERENCES `lao`.`tbl_user` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `lao`.`tbl_postIt`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `lao`.`tbl_postIt` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `text` TEXT NOT NULL ,
  `position` VARCHAR(45) NOT NULL ,
  `whiteboardId` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_postId_whiteboard` (`id` ASC) ,
  CONSTRAINT `fk_postId_whiteboard`
    FOREIGN KEY (`id` )
    REFERENCES `lao`.`tbl_whiteboard` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `lao`.`tbl_whiteboardUsers`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `lao`.`tbl_whiteboardUsers` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `userId` INT NOT NULL ,
  `whiteboardId` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_access_whiteboard` (`id` ASC) ,
  INDEX `fk_access_users` (`id` ASC) ,
  CONSTRAINT `fk_access_whiteboard`
    FOREIGN KEY (`id` )
    REFERENCES `lao`.`tbl_whiteboard` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_access_users`
    FOREIGN KEY (`id` )
    REFERENCES `lao`.`tbl_user` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
