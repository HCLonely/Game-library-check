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

### Gist 双向同步

在菜单中打开 **数据同步设置**，填写 GitHub Token、已有 Gist ID 和文件名，点击 **保存配置并测试**。Token 需要有该 Gist 的读写权限。

- **自动同步 Gist** 默认关闭；开启后可设置整数小时或天数，范围为 **1 小时～30 天**，默认 **24 小时**。首次开启立即检查，之后按最近成功同步时间计算周期。
- 每次先比较本地和远程的**数据更新时间**：本地较新则上传，远程较新则下载；内容相同则确认一致，不重复上传。比较针对整份游戏库与共享设置，较新快照覆盖较旧快照，不逐条合并。
- **立即同步** 使用相同的双向判断。**手动上传（覆盖远程）** 与 **手动下载（覆盖本地）** 用于明确指定保留哪一端；旧备份没有更新时间或两端时间相同但内容不同时，需要手动选择一次建立基线。手动下载旧版备份时，也会将远程升级为带时间的新版格式。
- 上传、下载或确认一致成功后显示绿色提示，失败显示红色原因提示。后台页面的提醒在恢复可见时显示一次。菜单显示 **数据同步设置（2 小时前同步）** 或 **（3 天前同步）**；失败保留上次成功时间。
- 数据实际变化才刷新数据更新时间；下载保留远程时间，避免反复覆盖。Token、自动同步设置、同步记录、登录缓存及请求限频状态不进入备份。
- 网络错误按 5、15、60 分钟退避，之后最多每小时重试；限流按服务端等待时间处理。权限或数据格式错误暂停自动同步，修正后重新保存并测试。断网时也可以关闭自动同步并保存。
- 用户脚本需要有适用网页打开才能运行；浏览器关闭或页面被禁用期间不执行，恢复后补做一次。后台定时器可能受浏览器节流而延迟。
- 同一浏览器的标签页使用共享租约协调，游戏库抓取期间暂缓同步；下载后刷新页面内的共享设置与游戏标记。多设备同时修改仍可能发生竞争，上传前复查与上传后校验不能提供服务端原子冲突保护。设备系统时间应保持准确。

### Itch 联动码（与 RedeemHelper 联动）

同时安装 [RedeemHelper](https://github.com/HCLonely/RedeemHelper) 后，可将本脚本的 itch.io 游戏库提供给 RedeemHelper 使用。RedeemHelper 在领取 itch.io 游戏或批量处理 bundle 时会跳过已拥有的游戏，并在领取完成后更新游戏库缓存。

1. 在已登录 itch.io 的状态下，先使用 **"更新游戏库"** 获取 itch.io 游戏库。
2. 在 Tampermonkey 的本脚本菜单中选择 **"生成Itch联动码"**，复制弹窗中的联动码。
3. 在 RedeemHelper 菜单中选择 **"输入Itch联动码"**，粘贴并保存该联动码。
4. 保持两个脚本启用；若 RedeemHelper 提示联动码不可用，请刷新网页后重试，并确认两个脚本均为支持联动的最新版本。

联动码重新生成后，需要在 RedeemHelper 中重新输入新码。

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
- **数据同步设置（x 小时/天前同步）** — 配置 Gist 双向同步、自动间隔，并查看最近结果
- **设置** — 打开设置面板，配置白名单/黑名单等选项
- **生成Itch联动码** — 生成供 RedeemHelper 使用的 Itch 联动码

### 设置

打开设置面板可配置以下选项：

- **白名单模式**：只在网址包含白名单内容的页面启用脚本。如果启用白名单模式，则黑名单模式不生效。
- **黑名单模式**：在网址包含黑名单内容的页面禁用脚本。

## 开发检查

使用 Node.js 24并安装依赖后运行 `npm run verify`：类型检查、功能测试、构建和合并脚本检查。测试通过 esbuild 加载 TypeScript，Gist 请求采用本地模拟，不使用真实凭据。

## 📄 License

[MIT](LICENSE)
