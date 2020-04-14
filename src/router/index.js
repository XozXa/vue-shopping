import Vue from 'vue';
import Router from 'vue-router';
// import Home from 'pages/home';
// import Category from 'pages/category';
// import Cart from 'pages/cart';
// import Personal from 'pages/personal';
// import Search from 'pages/search';
// import Product from 'pages/product';


Vue.use(Router);

const routes=[
  {
    path:'/home',
    name:'Home',
    component:() => import('pages/home'),
    children:[
      {
        path:'product/:id',
        name:'home-product',
        component:() => import('pages/product')
      }
    ]
  },
  {
    path:'/category',
    name:'Category',
    component:() => import('pages/category')
  },
  {
    path:'/cart',
    name:'Cart',
    component:() => import('pages/cart')
  },
  {
    path:'/personal',
    name:'Personal',
    component:() => import('pages/personal')
  },
  {
    path:'/search',
    name:'Search',
    component:() => import('pages/search')
  },
  {
    path:'*',
    redirect:'/home'
  }
];

export default new Router({
  routes
});
