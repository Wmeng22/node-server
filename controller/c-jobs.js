
const userModel = require('../model/mysql.js')
const moment = require('moment')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
const md = require('markdown-it')();
const u = require('../util/getGuid.js')   //生成guid
let nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
/**
 * 分页查询
 */
exports.findJobByPageController = async ctx => {
    let { uid, page, pagesize, category_id } = ctx.request.body;
    let data,
        total_count;
    page = page || 1;
    pagesize = pagesize || 10;
    console.log(ctx.request.body)
    if (!category_id) {
        console.log('全部')
        await userModel.findAllJobCount()
            .then(res => {
                total_count = res[0].count
            }).catch(err => {
                // total_count = 0
            })
        await userModel.findJobByPage(page, pagesize)
            .then(result => {
                data = result
            }).catch(err => {
                data = []
            })

        ctx.body = {
            code: 200,
            msg: "查询成功",
            total_count: total_count,
            data: data
        }

    } else {
        console.log('分类')
        await userModel.findJobByTypePage(page, pagesize, category_id)
            .then(result => {
                ctx.body = result
            }).catch(() => {
                ctx.body = 'error'
            })
    }
}

/** 
 * 增加 控制器
*/
exports.JobCreateController = async (ctx) => {
    let { uid, user_name, position, treatment, city, years, category_id, education, other, responsibility, requirement } = ctx.request.body,
        job_id = u.getGuid(16);
        console.log(responsibility)    
        await userModel.insertJob([job_id, position, treatment, city, years, category_id, education, other, responsibility, requirement, uid, user_name])
        .then(() => {
            ctx.body = {
                code: 200,
                message: '发布成功'
            }
        }).catch((err) => {
            ctx.body = {
                code: 500,
                message: '发布失败'
            }
        })
}

/**
 *  编辑控制器
 */
exports.JobEditController = async ctx => {
    let { uid, job_id, position, treatment, city, years, category_id, education, other, responsibility, requirement } = ctx.request.body
    let allowEdit = true;

    /** 
     * 判断当前用户是有权限
     * */
    // await userModel.findDataById(uid)
    //     .then(res => {
    //         if (res[0].name != ctx.session.user) {
    //             allowEdit = false
    //         } else {
    //             allowEdit = true
    //         }
    //     })

    if (allowEdit) {
        await userModel.updateJob([position, treatment, city, years, category_id, education, other, responsibility, requirement], job_id)
            .then((res) => {
                ctx.body = {
                    code: 200,
                    message: '编辑成功'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: '编辑失败'
                }
            });

    } else {
        ctx.body = {
            code: 404,
            message: '无权限'
        }
    }
}
/**
 * 删除 控制器
 */
exports.JobDeleteController = async ctx => {
    let { uid, job_id } = ctx.request.body
    let allow = true;
    // await userModel.findDataById(uid)
    //     .then(res => {
    //         console.log(res)
    //         if (res[0].name != ctx.session.user) {
    //             allow = false
    //         } else {
    //             allow = true
    //         }
    //     })
    job_id = JSON.parse(job_id)
   
    if (allow) {
       for(let i = 0,len = job_id.length; i<len; i++){
        await userModel.deleteJob(job_id[i])
        .then(() => {
            ctx.body = {
                code: 200,
                message: '删除成功'
            }
        }).catch((err) => {
            console.log(err)
            ctx.body = {
                code: 500,
                message: '删除失败'
            }
        })
       }
    } else {
        ctx.body = {
            code: 404,
            message: '无权限'
        }
    }
}


exports.JobDetailontroller = async ctx => {
    let { uid, job_id } = ctx.request.body;

    await userModel.JobDetail(job_id).then(result => {
        ctx.body = {
            code: 200,
            date: result
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            msg: err
        }
    })

}

exports.getAllCategoryController = async ctx => {

    await userModel.finAllCategory().then(result => {
        ctx.body = {
            code: 200,
            data: result
        }
    }).catch(err => {
        ctx.body = {
            code: 500,
            data: err
        }
    })

}

exports.submitController = async ctx => {
    let { realname, age, phone, email, position, lastCompany } = ctx.request.body;
    

    let transport = nodemailer.createTransport(smtpTransport({
        host: "smtpdm.aliyun.com", // 主机
        secure: true, // 使用 SSL
        secureConnection: true, // 使用 SSL
        port: 465, // SMTP 端口
        auth: {
            user: 'service@email.heygears.com',
            pass: 'HeyGears2017'
        }
    }));


    let mailOptions = {
        from: 'service@email.heygears.com', // sender address
        to: 'hzhang@heygears.com', // list of receivers
        //to: 'jyang@heygears.com', // 公司正式接收方
        //text和html两者只支持一种
        subject: "职位申请",
        html: `<div style="font-size:20px;">应聘职位：${position}</div><div style="font-size:20px;">姓名：${realname}</div><div style="font-size:20px;">年龄：${age}</div><div style="font-size:20px;">联系电话：${phone}</div><div style="font-size:20px;">联系邮箱：${email}</div><div style="font-size:20px;">上一家公司：${lastCompany}</div>` // html 内容

    };
    await new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject({
                    code: 500,
                    msg: '提交失败'
                })
            } else {
                resolve({
                    code: 200,
                    msg: '提交成功'
                })
            }
        });
    }).then(result => {
        console.log(result)
        ctx.body = result
    }).catch(err => {
        ctx.body = err
    })
}
