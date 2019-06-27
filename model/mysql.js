var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE,
  port     : config.database.PORT
});

let query = ( sql, values ) => {

  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release() //连接不再使用，返回到连接池
        })
      }
    })
  })

}

let users =
    `create table if not exists users(
     uid  VARCHAR(32) NOT NULL COMMENT '用户id',
     user_name VARCHAR(100) NOT NULL COMMENT '用户名',
     password VARCHAR(100) NOT NULL COMMENT '密码',
     register_time VARCHAR(100) NOT NULL COMMENT '注册时间',
     PRIMARY KEY ( uid )
    );`
let jobs =
    `create table if not exists jobs(
     job_id VARCHAR(32) NOT NULL COMMENT '职位id',
     position VARCHAR(50) NOT NULL COMMENT '岗位',
     treatment VARCHAR(50) NOT NULL COMMENT '待遇',
     city VARCHAR(50) NOT NULL COMMENT '工作区域',
     category_id VARCHAR(50) NOT NULL COMMENT '类别',
     years VARCHAR(50) NOT NULL COMMENT '工作经验',
     education VARCHAR(50) NOT NULL COMMENT '学历',
     responsibility VARCHAR(1000) NOT NULL COMMENT '岗位职责',
     requirement VARCHAR(1000) NOT NULL COMMENT '岗位要求',
     other VARCHAR(50) NOT NULL COMMENT '其他',
     user_name VARCHAR(50) NOT NULL COMMENT "发布人",
     uid VARCHAR(40) NOT NULL COMMENT '用户id',
     create_time VARCHAR(100) NOT NULL COMMENT '发表时间',
     PRIMARY KEY(job_id)
    );`

let jobs_category = 
` create table if not exists jobs_category (
  category_id INT NOT NULL AUTO_INCREMENT,
  category_name VARCHAR(50) NOT NULL COMMENT '分类名称',
  PRIMARY KEY(category_id)
);`


let createTable = ( sql ) => {
  return query( sql, [] )
}

// 建表
createTable(users)
createTable(jobs)
createTable(jobs_category)




// 注册用户
exports.insertData = ( value ) => {
  let _sql = "insert into users set uid=?,user_name=?,password=?;"
  return query( _sql, value )
}
// 删除用户
exports.deleteUserData = ( user_name ) => {
  let _sql = `delete from users where user_name="${user_name}";`
  return query( _sql )
}
// 查找用户
exports.findUserData = ( user_name ) => {
  let _sql = `select * from users where user_name="${user_name}";`
  return query( _sql )
}

// 通过名字查找用户
exports.findDataByName =  ( user_name ) => {
  let _sql = `select * from users where user_name="${user_name}";`
  return query( _sql)
}
// 通过名字查找用户数量判断是否已经存在
exports.findUserCountByName =  ( user_name ) => {
  let _sql = `select count(*) as count from users where user_name="${user_name}";`
  return query( _sql)
}


// 通过uid查找用户数量判断是否已经存在
exports.findUserCountByUid =  ( uid ) => {
  let _sql = `select count(*) as count from users where uid="${uid}";`
  return query( _sql)
}


// 用户分页查询
exports.findUserByPage = ( page,pagesize ) => {
  let _sql = ` select uid,user_name,register_time from users  limit ${(page-1)*10},${pagesize};`
  return query( _sql)
}
// 查询用户总数量
exports.findAllUserCount = () => {
  let _sql = `select count(*) as count from users;`
  return query( _sql)
}

// 通过uid查找
exports.findUserByUid =  ( id ) => {
  let _sql = `select * from users where uid="${id}";`
  return query( _sql)
}

// 通过uid修改密码
exports.updateUserByUid =  ( values,uid ) => {
  let _sql = `update users set password=? where uid="${uid}";`
  return query( _sql,values)
}

// 全部查询
exports.findJobByPage = ( page,pagesize ) => {
  let _sql = ` select * from jobs  limit ${(page-1)*10},${pagesize};`
  return query( _sql)
}
// 查询职位总数量
exports.findAllJobCount = () => {
  let _sql = `select count(*) as count from jobs;`
  return query( _sql)
}

// 分类查询
exports.findJobByTypePage = ( page,pagesize,category_id ) => {
  let _sql = ` select * from jobs where category_id="${category_id}" limit ${(page-1)*10},${pagesize};`
  return query( _sql)
}

// 根据category_id查询数量
exports.findAllJobCountByType = (category_id) => {
  let _sql = `select count(*) as count from jobs where category_id="${category_id}";`
  return query( _sql)
}


exports.finAllCategory =  () =>{
  let _sql = `select * from jobs_category;`
  return query(_sql)
}

// 增加职位
exports.insertJob = ( values ) => {
  let _sql = "insert into jobs set job_id=?,position=?,treatment=?,city=?,years=?,category_id=?,education=?,other=?,responsibility=?,requirement=?,uid=?,user_name=?;"
  return query( _sql, values )
}

// 更新修改职位信息`
exports.updateJob = (values,job_id) => {
  let _sql = `update jobs set position=?,treatment=?,city=?,years=?,category_id=?,education=?,other=?,responsibility=?,requirement=? where job_id="${job_id}"`
  return query(_sql,values)
}
// 删除职位
exports.deleteJob = (job_id) => {
  let _sql = `delete from jobs where job_id = "${job_id}"`
  return query(_sql)
}

// 职位详细
exports.JobDetail = (job_id) => {
  let _sql = `select * from jobs where job_id = "${job_id}"`
  return query(_sql)
}







// 查询所有个人数量
exports.findJobCountByName = (user_name) => {
  let _sql = `select count(*) as count from jobs where user_name="${user_name}";`
  return query( _sql)
}
// 查询个人分页
exports.findJobByUserPage = (user_name,page) => {
  let _sql = ` select job_id,position,treatment,city,type,uid,user_name,create_time from jobs where user_name="${user_name}" order by category_id desc limit ${(page-1)*10},10 ;`
  return query( _sql)
}


// 通过用户的名字查找招聘
exports.findDataByUser =  ( user_name ) => {
  let _sql = `select * from jobs where user_name="${user_name}";`
  return query( _sql)
}

// // 查询所有
// exports.findAllPost = () => {
//   let _sql = `select * from jobs;`
//   return query( _sql)
// }
