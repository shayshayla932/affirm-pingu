# Affirm Pingu — 云端助手 MVP

个人开发者模式：**你的 OpenAI Key 只放在服务器 `.env`**，用户用邮箱 + **兑换码** 获得对话额度。

## 快速开始

```bash
cd server
cp .env.example .env
# 编辑 .env：OPENAI_API_KEY、JWT_SECRET、ADMIN_SECRET

npm install
npm start
# → http://127.0.0.1:8787
```

## 生成兑换码

```bash
npm run gen-codes -- --count 10 --credits 300 --days 30
```

把打印出来的 `PINGU-XXXX-XX` 发给用户；用户在 App **设置 → Pingu 助手** 里登录后粘贴激活。

## API（App 已对接）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/v1/auth/register` | `{ email?, phone?, password }` 二选一 |
| POST | `/v1/auth/login` | `{ email?, phone?, password }` |
| POST | `/v1/auth/bind` | 登录后绑定 `{ email?, phone? }` |
| POST | `/v1/auth/password` | 登录后修改密码 `{ currentPassword, newPassword }` |
| GET | `/v1/me` | `Authorization: Bearer <token>` |
| POST | `/v1/redeem` | `{ code }` |
| POST | `/v1/chat` | `{ messages, model? }` — 走你的 OpenAI Key，每次成功扣 1 积分 |

## 部署（个人）

- [Fly.io](https://fly.io) / [Railway](https://railway.app) 上传 `server/`，设置环境变量，HTTPS 域名填进 App 的「助手服务地址」。
- `CORS_ORIGINS` 填你的 PWA 页面 origin（不要用 `*` 上生产）。

## 成本提醒

每个付费用户对话都会消耗 **你 OpenAI 账户** 的 token；兑换码里的 `credits` 是「次数上限」，请按你的定价覆盖成本。
