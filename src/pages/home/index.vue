<template>
  <div class="home">
      <header class="g-header-container">
          <home-header :class="{'header-transition':isHeaderTransition}" ref="header"/>
      </header>
      <me-scroll :data="recommends" pullDown pullUp @pull-down="pullToRefresh"  @pull-up="pullToLoadMore" @scroll-end="scrollEnd" @scroll="scroll" @pull-down-transition-end="pullDownTransitionEnd" ref="scroll">
          <home-slider ref="slider"></home-slider>
          <home-nav></home-nav>
          <home-recommend @loaded="getRecommends" ref="recommend"></home-recommend>
      </me-scroll>
      <div class="g-backtop-container">
          <me-backtop :visible="isBacktopVisible" @backtop="backToTop"></me-backtop>
      </div>
      <router-view></router-view>
  </div>
</template>

<script>
    import MeScroll from 'base/scroll';
    import MeBacktop from 'base/backTop';
    import HomeHeader from './header';
    import HomeSlider from './slider';
    import HomeNav from './nav';
    import HomeRecommend from './recommend';
    import {HEADER_TRANSITION_HEIGHT} from './config'
    export default{
        name:'Home',
        components:{
            HomeHeader,
            HomeSlider,
            MeScroll,
            HomeNav,
            HomeRecommend,
            MeBacktop
        },
        data(){
            return{
                recommends:[],
                isBacktopVisible:false,
                isHeaderTransition:false
            };
        },
        // created(){
        //     setTimeout(()=>{
        //         this.isBacktopVisible=true;
        //     },3000);
        // },
        methods:{
            getRecommends(recommends){
                this.recommends=recommends;
            },
            pullToRefresh(end){
                this.$refs.slider.update().then(end);
                // setTimeout(()=>{
                //     console.log("刷新");
                //     end();
                // },1000)
            }
            ,pullToLoadMore(end){
                this.$refs.recommend.update().then(end).catch(err=>{
                    if(err){
                        console.log(err);
                    }
                    end();
                });
            },
            scroll(transition,swiper){
                this.changeHeaderStatus(transition);
            },
            scrollEnd(transition,swiper,pulling){
                if(!pulling){
                    this.changeHeaderStatus(transition);
                }
                this.isBacktopVisible=transition<0 && -transition>swiper.height;
            },
            pullDownTransitionEnd(){
                this.$refs.header.show();
            },
            backToTop(){
                this.$refs.scroll && this.$refs.scroll.scrollToTap();
            },
            changeHeaderStatus(transition){
                if(transition>0){
                    this.$refs.header.hide();
                    return;
                }

                this.$refs.header.show();
                this.isHeaderTransition=-transition>HEADER_TRANSITION_HEIGHT;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~assets/scss/mixins';
    .home{
        overflow: hidden;
        width:100%;
        height:100%;
        background-color:$bgc-theme;
    }
</style>

