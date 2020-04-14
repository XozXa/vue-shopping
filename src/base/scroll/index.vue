<template>
  <swiper :options="swiperOption" ref="swiper">
      <div class="mine-scroll-pull-down" v-if="pullDown">
          <me-loading :text="pullDownText" inline ref="pullDownLoading"/>
      </div>
      <swiper-slide>
          <slot></slot>
      </swiper-slide>
      <div class="mine-scroll-pull-up" v-if="pullUp">
          <me-loading :text="pullUpText" inline ref="pullUpLoading"/>
      </div>
      <div class="swiper-scrollbar" v-if="scrollbar" slot="scrollbar"></div>
  </swiper>
</template>

<script>
    import {swiper,swiperSlide} from 'vue-awesome-swiper';
    import MeLoading from 'base/loading';
    import {
        PULL_DOWN_HEIGHT,
        PULL_DOWN_TEXT_INIT,
        PULL_DOWN_TEXT_START,
        PULL_DOWN_TEXT_ING,
        PULL_DOWN_TEXT_END,
        PULL_UP_HEIGHT,
        PULL_UP_TEXT_INIT,
        PULL_UP_TEXT_START,
        PULL_UP_TEXT_ING,
        PULL_UP_TEXT_END
    } from './config';
    export default{
        name:'MeScroll',
        components:{
            swiper,
            swiperSlide,
            MeLoading
        },
        props:{
            scrollbar:{
                type:Boolean,
                default:true
            },
            data:{
                type:[Array,Object]
            },
            pullDown:{
                type: Boolean,
                default: false
            },
            pullUp:{
                type: Boolean,
                default: false
            }
        },
        created(){
            this.init();
        },

        watch:{
            data(){
                this.update();//检测data的变化
            }
        },
        methods:{
            //API
            update(){
                this.$nextTick(()=>{
                    this.$refs.swiper && this.$refs.swiper.swiper.update();
                });
            },
            scrollToTap(speed,runCallbacks){
                this.$refs.swiper && this.$refs.swiper.swiper.slideTo(0,speed,runCallbacks);
            },


            init(){
                this.pulling=false;
                this.swiperOption={
                    direction:'vertical',
                    slidesPerView:'auto',
                    freeMode:true,
                    setWrapperSize:true,
                    scrollbar:{
                        el:this.scrollbar?'.swiper-scrollbar':null,
                        hide:true
                    },
                    on:{
                        sliderMove:this.scroll,
                        touchEnd:this.touchEnd,
                        transitionEnd:this.scrollEnd
                    }
                },
                this.pullDownText=PULL_DOWN_TEXT_INIT;
                this.pullUpText=PULL_UP_TEXT_INIT;
            },


            scroll(){
                const swiper=this.$refs.swiper.swiper;
                this.$emit('scroll',swiper.translate,this.$refs.swiper.swiper);
                if(this.pulling){
                    return;
                }
                // console.log(swiper.translate);
                if(swiper.translate>0){
                    if(!this.pullDown){
                        return;
                    }
                    if(swiper.translate>PULL_DOWN_HEIGHT){
                        this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_START);  
                    }else{
                        this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_INIT);
                    }
                }else if(swiper.isEnd){//上拉
                    if(!this.pullUp){
                        return;
                    }
                    const isPullUp=swiper.height+Math.abs(swiper.translate)-PULL_UP_HEIGHT>parseInt(swiper.$wrapperEl.css('height'));
                    if(isPullUp){
                       this.$refs.pullUpLoading.setText(PULL_UP_TEXT_START);  
                    }else{
                        this.$refs.pullUpLoading.setText(PULL_UP_TEXT_INIT);
                    }
                }
            },
            scrollEnd(){
                this.$emit('scroll-end',this.$refs.swiper.swiper.translate,this.$refs.swiper.swiper,this.pulling);
            },
            touchEnd(){
                if(this.pulling){
                    return;
                }

                const swiper=this.$refs.swiper.swiper;
                const totalHeight=parseInt(swiper.$wrapperEl.css('height'));
                const isPullUp=swiper.height+Math.abs(swiper.translate)-PULL_UP_HEIGHT>totalHeight;
                if(swiper.translate>PULL_DOWN_HEIGHT){
                    if(!this.pullDown){
                        return;
                    }

                    this.pulling=true;
                    swiper.allowTouchMove=false;//禁止下拉
                    swiper.setTransition(swiper.params.speed);
                    swiper.setTranslate(PULL_DOWN_HEIGHT);
                    swiper.params.virtualTranslate=true;
                    this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_ING);
                    this.$emit('pull-down',this.pullDownEnd);
                }else if(swiper.isEnd){//上拉
                    
                    if(isPullUp){
                        if(!this.pullUp){
                            return;
                        }
                        this.pulling=true;
                        swiper.allowTouchMove=false;//禁止上拉
                        swiper.setTransition(swiper.params.speed);
                        swiper.setTranslate(-(totalHeight+PULL_UP_HEIGHT-swiper.height));
                        swiper.params.virtualTranslate=true;
                        this.$refs.pullUpLoading.setText(PULL_UP_TEXT_ING);
                        this.$emit('pull-up',this.pullUpEnd);
                    }
                    
                }
            },
            pullDownEnd(){
                this.pulling=false;
                const swiper=this.$refs.swiper.swiper;
                this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_END);
                swiper.allowTouchMove=true;//允许下拉
                swiper.params.virtualTranslate=false;//允许回弹
                swiper.setTransition(swiper.params.speed);
                swiper.setTranslate(0);
                setTimeout(()=>{
                    this.$emit('pull-down-transition-end');
                },300);
            },
            pullUpEnd(){
                this.pulling=false;
                const swiper=this.$refs.swiper.swiper;
                this.$refs.pullUpLoading.setText(PULL_UP_TEXT_END);
                swiper.allowTouchMove=true;//允许上拉
                swiper.params.virtualTranslate=false;//允许回弹
                // swiper.setTransition(swiper.params.speed);
                // swiper.setTranslate();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~assets/scss/mixins';
    .swiper-container{
        overflow:hidden;
        width:100%;
        height:100%;
    }
    .swiper-slide{
        height:auto;
    }
    .mine-scroll-pull-down,
    .mine-scroll-pull-up{
        position: absolute;
        left:0;
        width:100%;
    }
    .mine-scroll-pull-down{
        bottom:100%;
        height:80px;
    }
    .mine-scroll-pull-up{
        top:100%;
        height:30px;
    }
</style>

