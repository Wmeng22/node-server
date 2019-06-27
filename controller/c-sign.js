const userModel = require('../model/mysql.js')
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')
const u = require('../util/getGuid.js')

/** 
 * 用户分页查询
*/
exports.SignPageController = async ctx => {
    let { uid, page, pagesize } = ctx.request.body;
    let data,
        total_count;
    page = page || 1;
    pagesize = pagesize || 10;
    console.log(ctx.request.body)
    await userModel.findAllUserCount()
        .then(res => {
            total_count = res[0].count
        }).catch(err => {
            // total_count = 0
        })
    await userModel.findUserByPage(page, pagesize)
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


}


/** 
 * 注册控制器
*/
exports.SignupController = async ctx => {
    let { name, password, repeatpass } = ctx.request.body;
    let uid = u.getGuid(32);
    if (!name || !password || !repeatpass) {
        ctx.body = {
            code: 500,
            message: '参数错误'
        };
        return;
    }
    await userModel.findUserCountByName(name)
        .then(async (result) => {
            if (result[0].count >= 1) {
                // 用户存在
                ctx.body = {
                    code: 500,
                    message: '用户存在'
                };
            } else if (password !== repeatpass || password.trim() === '') {
                ctx.body = {
                    code: 500,
                    message: '两次输入的密码不一致'
                };
            }

            else {
                await userModel.insertData([uid, name, md5(password)])
                    .then(res => {
                        console.log('注册成功', res)
                        //注册成功
                        ctx.set('Content-Type', 'application/json')
                        ctx.body = {
                            code: 200,
                            message: '注册成功'
                        };
                    })

            }
        })
}
/** 
 * 登录控制器
*/
exports.SigninController = async ctx => {
    console.log(ctx.request.body)
    let { name, password } = ctx.request.body
    await userModel.findDataByName(name)
        .then(result => {
            let res = result
            if (res.length && name === res[0]['user_name'] && md5(password) === res[0]['password']) {
                ctx.session = {
                    user: res[0]['user_name'],
                    id: res[0]['uid']
                }
                ctx.body = {
                    code: 200,
                    message: '登录成功',
                    uid: res[0]['uid'],
                    user_name: res[0]['user_name']
                }
                console.log('ctx.session.id', ctx.session.id)
                console.log('session', ctx.session)
                console.log('登录成功')
            } else {
                ctx.body = {
                    code: 500,
                    message: '用户名或密码错误',
                }
                console.log('用户名或密码错误!')
            }
        }).catch(err => {
            console.log(err)
        })

}

/** 
 * 退出控制器
*/
exports.SignoutController = async (ctx, next) => {
    ctx.session = null;
    console.log('登出成功')
    ctx.body = {
        code: 200,
        msg: '退出成功'
    }
}

exports.updatePasswordController = async (ctx, next) => {
    let { uid, newPassword, repeatpass } = ctx.request.body;
    if (!uid || !newPassword || !repeatpass) {
        ctx.body = {
            code: 500,
            message: '参数错误'
        };
        return;
    }
    if (newPassword !== repeatpass || newPassword.trim() === '') {
        ctx.body = {
            code: 500,
            message: '两次输入的密码不一致'
        };
        return;
    }
    await userModel.findUserCountByUid(uid).then(async result => {
        if (result[0].count <= 0) {
            // 用户不存在
        } else {
            await userModel.updateUserByUid([md5(newPassword)], uid).then(res => {
                ctx.body = {
                    code: 200,
                    msg: "修改成功"
                }
            }).catch(err => {
                ctx.body = {
                    code: 500,
                    msg: "修改失败"
                }
            })
        }

    })





}