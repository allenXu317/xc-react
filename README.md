# 学习React项目-仿写React

```
pnpm i 
pnpm run build:dev
```

## 第一种调试方式:
1. 构建完项目后，在dist文件下执行:
   `pnpm link --global`

2. 使用CRA新建一个react项目,并删去不需要的依赖；

3. 在CRA的项目下运行
   `pnpm link {module_name} --global`

4.  运行CRA项目；
  `npm run start`