CREATE DATABASE IF NOT EXISTS interview_db;
USE interview_db;

-- 创建表
-- 创建分类表，分类表用于存储不同类别的信息
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY, -- 分类ID
  name VARCHAR(100) NOT NULL, -- 分类名称
  icon VARCHAR(50), -- 分类图标
  order_num INT DEFAULT 0 -- 分类排序
);

-- 问题表，用于存储面试问题及其相关信息
CREATE TABLE questions (
  id VARCHAR(50) PRIMARY KEY, -- 问题ID
  category_id VARCHAR(50), -- 分类ID
  title TEXT NOT NULL, -- 问题标题
  answer TEXT, -- 问题答案
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium', -- 问题难度
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新时间
  FOREIGN KEY (category_id) REFERENCES categories(id) -- 外键，引用分类表的ID
); 