# shopping-mall
一个基于 Vue2 的移动端商城项目，使用 Vue Router + Vuex + Axios 进行模块化开发，结合 Vant 组件库完成页面搭建，支持用户注册、商品浏览、购物车、结算等核心功能

## 项目特点
- 响应式移动端布局
- 页面组件模块化
- Vuex 管理购物车数据
- Axios 请求封装与错误处理
- 本地存储用户数据
- 部分 UI 使用 Vant 组件库

## 当前问题
本项目因后端接口部分异常，存在以下问题：
- 图形验证码校验逻辑不完整，输入无论对错均可通过；
- 商品详情页支付功能报“余额不足”，而购物车支付正常，疑为接口参数问题；
- 商品列表组件渲染异常，数据绑定正确但内容无法正常展示，初步判断为后端返回结构不符。

当前问题均已定位为接口层问题，非核心流程，暂未影响整体项目逻辑。

## 项目运行
```bash
npm install
npm run serve
---

<img width="442" height="781" alt="image" src="https://github.com/user-attachments/assets/02ae5417-6b22-43bb-8e32-747b08443804" />
<img width="443" height="784" alt="image" src="https://github.com/user-attachments/assets/bb4a31e7-10f4-496b-9e72-e1a7e47112ad" />
<img width="439" height="786" alt="image" src="https://github.com/user-attachments/assets/d2ff1b22-9fa9-41c7-a8ee-812210bc3376" />
