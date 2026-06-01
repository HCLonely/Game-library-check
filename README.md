# Game Library Check

检测 [itch](https://itch.io/)、[GOG](https://www.gog.com/)、[Epic](https://www.epicgames.com/)、~~[方块](https://www.cubejoy.com/)~~、[IndieGala](https://www.indiegala.com/) 游戏链接是否已拥有，拥有的游戏链接背景会显示为绿色。

首次使用需要获取游戏库数据，首次安装会弹窗询问是否获取。

## 📦 安装

1. 首先安装用户脚本管理器（任选其一）：
   - [Tampermonkey](https://www.tampermonkey.net/)（推荐）
   - [Violentmonkey](https://violentmonkey.github.io/)
   - [Greasemonkey](https://www.greasespot.net/)

2. 点击下方链接安装脚本：

- [Game-Library-Check.user.js](https://github.com/HCLonely/Game-library-check/raw/master/Game-Library-Check.user.js)
- [GreasyFork](https://greasyfork.org/zh-CN/scripts/404924-%E6%B8%B8%E6%88%8F%E5%BA%93%E6%A3%80%E6%B5%8B-%E5%90%88%E9%9B%86)

## 🚀 使用

### 基本使用

1. 安装脚本后，首次打开支持的网站时会弹窗询问是否获取游戏库数据，点击"立即更新"并勾选需要获取的平台。
2. 之后浏览游戏页面时，脚本会自动检测并标记已拥有的游戏（绿色背景）。
3. 如需手动更新游戏库，可在 Tampermonkey 菜单中找到 **"更新游戏库"** 命令。

### 支持的平台

| 平台 | 网站 | 说明 |
| --- | --- | --- |
| Epic | [epicgames.com](https://www.epicgames.com/) | 需要在 [store.epicgames.com](https://store.epicgames.com/) 页面保持登录状态 |
| GOG | [gog.com](https://www.gog.com/) | 需登录 GOG 账号 |
| itch.io | [itch.io](https://itch.io/) | 需登录 itch.io 账号 |
| IndieGala | [indiegala.com](https://www.indiegala.com/) | 需登录 IndieGala 账号 |

### 菜单命令

安装后可在 Tampermonkey 的脚本菜单中使用以下命令：

- **更新游戏库** — 手动触发游戏库数据更新（可选择平台）
- **设置** — 打开设置面板，配置白名单/黑名单等选项

### 设置

打开设置面板可配置以下选项：

- **白名单模式**：只在网址包含白名单内容的页面启用脚本。如果启用白名单模式，则黑名单模式不生效。
- **黑名单模式**：在网址包含黑名单内容的页面禁用脚本。

## 📄 License

[MIT](LICENSE)
