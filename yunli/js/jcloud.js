/**
 * JCloud.js v1.0.0
 * (c) 2014-2019 Zhong Li
 */
(function(global, factory) {
	axios !== null ? factory(global, axios) : null
})(this, function(global, axios) {
	'use strict';
	const ADDRESS = "http://api.swmfizl.com:3975/jcloud";
	const API = {
		login: "/login",
		userQuery: "/userQuery",
		dataInsert: "/datacenter/dataInsert",
		dataDelete: "/datacenter/dataDelete",
		dataUpdate: "/datacenter/dataUpdate",
		dataQuery: "/datacenter/dataQuery",
		fileUpload: "/filesystem/fileUpload",
		fileQuery: "/filesystem/fileQuery",
		fileDelete: "/filesystem/fileDelete"
	}
	/**
	 * 用户登陆
	 * @param {JSON} data 请求参数 {"account": "", "password": ""}
	 * @param {Function} fun 回调函数
	 */
	const login = function(data, fun) {
		axios({
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			},
			url: ADDRESS + API.login,
			method: "POST",
			data: data
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}
	/**
	 * @param {String} token 登陆验证
	 * @param {Function} fun 回调函数
	 */
	const userQuery = function(token, fun) {
		axios({
			url: ADDRESS + API.userQuery + "?token=" + token,
			method: "GET",
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}

	/**
	 * 插入数据记录
	 * @param {JSON} data 请求参数
	 * @param {Function} fun 回调函数
	 */
	const dataInsert = function(data, fun) {
		axios({
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			},
			url: ADDRESS + API.dataInsert,
			method: "POST",
			data: data
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}
	
	/**
	 * 编辑数据记录
	 * @param {JSON} data 请求参数
	 * @param {Function} fun 回调函数
	 */
	const dataUpdate = function(data, fun) {
		axios({
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			},
			url: ADDRESS + API.dataUpdate,
			method: "POST",
			data: data
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}
	
	/**
	 * 删除数据记录
	 * @param {JSON} data 请求参数
	 * @param {Function} fun 回调函数
	 */
	const dataDelete = function(data, fun) {
		axios({
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			},
			url: ADDRESS + API.dataDelete,
			method: "POST",
			data: data
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}
	/**
	 * 查询一条数据
	 * @param {String} collection 集合名称
	 * @param {String} id 数据ID
	 * @param {Function} fun 回调函数
	 */
	const dataQueryOne = function(collection, id, fun) {
		axios({
			url: ADDRESS + API.dataQuery + "?collection=" + collection + "&id=" + id,
			method: "GET",
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}
	/**
	 * 查询数据集
	 * @param {JSON} data 请求参数
	 * @param {Function} fun 回调函数
	 */
	const dataQuery = function(data, fun) {
		axios({
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			},
			url: ADDRESS + API.dataQuery,
			method: "POST",
			data: data
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}
	
	/**
	 * 查询文件集
	 * @param {JSON} data 请求参数
	 * @param {Function} fun 回调函数
	 */
	const fileQuery = function(data, fun) {
		axios({
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			},
			url: ADDRESS + API.fileQuery,
			method: "POST",
			data: data
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}
	
	/**
	 * 删除文件
	 * @param {JSON} data 请求参数
	 * @param {Function} fun 回调函数
	 */
	const fileDelete = function(data, fun) {
		axios({
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			},
			url: ADDRESS + API.fileDelete,
			method: "POST",
			data: data
		}).then(function(response) {
			fun(response.data)
		}).catch(function(error) {
			fun(error)
		})
	}
	
	/**
	 * 获取文件上传路径接口
	 * @return {String} 上传路径
	 */
	const getFileUploadApi = function() {
		return ADDRESS + API.fileUpload;
	}
	/**
	 * 将方法公开
	 */
	global.JCloud = {
		login: login,
		userQuery: userQuery,
		dataInsert: dataInsert,
		dataDelete: dataDelete,
		dataUpdate: dataUpdate,
		dataQueryOne: dataQueryOne,
		dataQuery: dataQuery,
		fileQuery: fileQuery,
		fileDelete: fileDelete,
		getFileUploadApi: getFileUploadApi
	}
})
