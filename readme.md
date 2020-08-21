# akam-proxy
自动优选B站海外CDN（upos-hz-mirrorakam.akamaized.net）节点，自动选择最低延迟的节点。  
支持自动更新最新的可用节点。

## 安装
### 安装环境
[NodeJS](https://nodejs.org/)
### 下载项目并安装依赖
克隆或下载此项目，在项目目录执行
```bash
npm install
```

## 配置文件
配置文件为`config.json5`，请按照[JSON5](https://github.com/json5/json5)规范配置

## 运行
```bash
npm start
```

## 使用
配置浏览器代理到配置文件配置的端口，例如使用默认端口  
`http://127.0.0.1:7070`  
推荐使用插件[Proxy SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega)来指定代理

## 扩展
可通过修改配置文件`config.json5`的`host`为其他域名，并修改本地缓存的`ip_list.txt`，可以做到为其他服务优选节点的效果。  
本项目使用的`ip_list.txt`本地缓存，是参考了[akamTester](https://github.com/miyouzi/akamTester)项目中的`ip_list.txt`，在这里对[miyouzi](https://github.com/miyouzi)进行感谢。