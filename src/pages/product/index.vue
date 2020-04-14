<template>
  <transition name="product">
    <div class="product a" :class="[isActive?active:'',errorClass]">product</div>
  </transition>
</template>

<script>
    export default{
        name:'Product',
        data(){
          return {
            isActive:true,
            active:'active',
            errorClass:'errorClass'
          }
        }
    }
</script>

<style lang="scss" scoped>
  @import "~assets/scss/mixins";
  .active{
    color:red;
  }
  .errorClass{
    border:1px solid green;
  }
  .product{
    overflow:hidden;
    position: absolute;
    top:0;
    left:0;
    z-index:$product-z-index;
    width:100%;
    height:100%;
    background-color:#fff;
    
    &-enter-active,
    &-leave-active{
      transition:all 0.3s;
    }
    
    &-enter,
    &-leave-to{
      transform:translate3d(100%,0,0);
    }
  }
</style>

