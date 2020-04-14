import storage from 'assets/js/storage';
import {SEARCH_HISTORY_KEYWORD_KEY} from 'pages/search/config';

export const searchMixin={
    methods:{
        $_selectItem(keyWord){
            let keyWords=storage.get(SEARCH_HISTORY_KEYWORD_KEY,[]);
            if(keyWords.length!==0){
              keyWords=keyWords.filter(val=>val!==keyWord);
            }
            keyWords.unshift(keyWord);
  
            storage.set(SEARCH_HISTORY_KEYWORD_KEY,keyWords);
            // location.href=`https://s.m.taobao.com/h5?event_submit_do_new_search_auction=1&_input_charset=utf-8&topSearch=1&atype=b&searchfrom=1&action=home%3Aredirect_app_action&from=1&sst=1&n=20&buying=buyitnow&q=${keyWord}`;
          }
    }
}