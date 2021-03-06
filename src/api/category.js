import axios from 'axios';
import {SUCC_CODE,TIMEOUT} from './config';

const CancelToken=axios.CancelToken;
let cancle;


export const getCategoryContent = (id) => {
    cancle&&cancle('取消签一次请求');
    cancle=null;
    return axios.get(`http://www.imooc.com/api/category/content/${id}`, {
      timeout: TIMEOUT,
      cancelToken:new CancelToken(function executor(c){
          cancle=c;
      })
    }).then(res => {
      if (res.data.code === SUCC_CODE) {
        return res.data.content;
      }
      throw new Error('没有成功获取到数据！');
    }).catch(err => {
      if (axios.isCancel(err)) { // 取消前一次的请求
        console.log(err);
      }else if(err){
        console.log(err);
      }
    });
  };