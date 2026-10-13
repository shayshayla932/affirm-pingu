(() => {
  const STORAGE_KEY = "affirm-pingu-data-v3";
  const AI_STORAGE_KEY = "affirm-pingu-ai-v1";
  const THEME_STORAGE_KEY = "affirm-pingu-theme-v1";
  const LEGACY_KEYS = ["affirm-pingu-data-v2", "affirm-pingu-data-v1"];
  const DEFAULT_HOME_BG = "assets/sky-home.png";
  const DEFAULT_CHAT_BG = "assets/450-20170130161150300883.jpg";
  const DEFAULT_HOME_COLOR = "#C8E4F8";
  const DEFAULT_CHAT_COLOR = "#cfe8f8";
  const DEFAULT_PINGU = "assets/curly-cat-animated.gif";
  const LEGACY_PINGU = "assets/pingu-sprite.png";
  const LEGACY_NUNU_PNG = "assets/buddy-nunu.png";
  const LOCALE_STORAGE_KEY = "affirm-pingu-locale-v1";
  const DIARY_STORAGE_KEY = "affirm-pingu-diary-v1";
  const PINGU_PRESETS = [
    { id: "nunu", labelKey: "presetNunu", src: "assets/curly-cat-animated.gif" },
    { id: "pingu", labelKey: "presetPingu", src: "assets/pingu-wave-blink.gif" },
    { id: "jishibao", labelKey: "presetJishibao", src: "assets/chiwawa.png" },
    { id: "xuebi-idle", labelKey: "presetXuebiIdle", src: "assets/xuebi1.png" },
    { id: "xuebi-cast", labelKey: "presetXuebiCast", src: "assets/xuebi2.png" },
  ];
  const PINGU_PRESET_SRCS = new Set([
    ...PINGU_PRESETS.map((p) => p.src),
    LEGACY_PINGU,
    LEGACY_NUNU_PNG,
  ]);
  const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
  const DEFAULT_CLOUD_API = "http://127.0.0.1:8787";
  const APP_VERSION = "1.1.0";
  const MAX_CHAT_MESSAGES = 40;
  const COACH_MD_URL = "./coach/manifestation-coach.md";
  const MEMORY_BLOCK_RE = /\[\[MEMORY\]\]([\s\S]*?)\[\[\/MEMORY\]\]/gi;
  const AFFIRM_BLOCK_RE = /\[\[AFFIRM\]\]([\s\S]*?)\[\[\/AFFIRM\]\]/gi;
  const AFFIRM_SHORT_BLOCK_RE =
    /\[\[(?:AFFIRM_SHORT|ROBOTIC)\]\]([\s\S]*?)\[\[\/(?:AFFIRM_SHORT|ROBOTIC)\]\]/gi;
  const DAILY_BLOCK_RE = /\[\[DAILY\]\]([\s\S]*?)\[\[\/DAILY\]\]/gi;
  const PROFILE_BLOCK_RE = /\[\[PROFILE\]\]([\s\S]*?)\[\[\/PROFILE\]\]/gi;
  const RITUAL_ROBOTIC_SECS = 10 * 60;
  const RITUAL_VISUAL_SECS = 10 * 60;
  const SPOTIFY_TOKEN_STORAGE = "affirm-pingu-spotify-token-v1";
  const SPOTIFY_VERIFIER_STORAGE = "affirm-pingu-spotify-verifier-v1";
  const SPOTIFY_SCOPES =
    "streaming user-read-email user-read-private playlist-read-private playlist-read-collaborative";
  /** Optional: set your Spotify app Client ID here for OAuth without typing each time. */
  const SPOTIFY_APP_CLIENT_ID = "";
  const MUSIC_OAUTH_PENDING_KEY = "affirm-pingu-music-oauth-pending";
  const GREETING_PICK_PREFIX = "affirm-pingu-greeting-pick";

  const I18N = {
    zh: {
      settingsTitle: "设置",
      userCenterTitle: "个人中心",
      userCenterSub: "本机档案与偏好",
      userProfileEditAria: "编辑昵称与头像",
      userProfileEditTitle: "编辑资料",
      userProfileNameLabel: "昵称",
      userProfileAvatarLabel: "头像",
      userProfileAvatarHint: "点击上传图片",
      profileOpenHint: "Coach 会读取这里的字段",
      done: "完成",
      back: "返回",
      languageHeading: "语言",
      buddyHeading: "首页形象",
      homeBgHeading: "主页背景",
      chatBgHeading: "聊天背景",
      tapUpload: "点击上传图片",
      currentBuddy: "当前形象",
      appearanceNote: "点预设切换形象，点背景预览上传图片。设置保存在本机。",
      presetPingu: "企鹅",
      presetJishibao: "吉式堡",
      presetXuebiIdle: "雪碧发呆",
      presetXuebiCast: "雪碧施法",
      presetCustom: "自定义",
      presetNunu: "Nunu",
      navHome: "首页",
      navDiary: "感恩日记",
      navFavorites: "收藏",
      greetingName: "小 Gin,",
      greetingDiaryHint: "你今天还没有开始写你的感恩日记",
      greetingDiaryDone: "今天已经写下感恩了，真棒",
      greetingCheckinA: "今天的打卡还没开始，展开每日任务来一轮？",
      greetingCheckinB: "机械 A 和视觉化在等你，完成今日打卡吧。",
      greetingCheckinPartial: "还差一步就完成今日打卡了，继续加油。",
      greetingDiaryA: "打卡完成啦，要不要写几句感恩日记？",
      greetingDiaryB: "今天的小确幸还没记录，感恩日记在等你。",
      greetingAllA: "今天有什么想聊的吗？点水晶球找我。",
      greetingAllB: "你想要的一切，你已经拥有了。",
      greetingAllC: "你是最有钱的富婆，好好享受今天。",
      greetingAllD: "状态很好，想再显化一次就点我。",
      musicSheetTitle: "仪式背景音乐",
      musicSheetLead: "视觉化或机械 A 进行时自动播放。可连接 Spotify 或粘贴播放链接。",
      musicTabUrl: "直链",
      musicSpotifyClientId: "Spotify Client ID（开发者后台）",
      musicSpotifyClientHint:
        "在 Spotify Developer 创建应用，Redirect URI 填本页完整地址。需 Premium 才能在应用内播放。",
      musicSpotifyConnect: "连接 Spotify",
      musicSpotifyDisconnect: "断开",
      musicSpotifyConnected: "已连接 Spotify",
      musicSpotifyNeedClient: "请先填写 Client ID",
      musicPlaylistPick: "播放列表",
      musicPlaylistEmpty: "连接后选择列表",
      musicPlaylistUrl: "或粘贴 Spotify 播放列表链接",
      musicApplePlaylist: "Apple Music 播放列表链接",
      musicAppleHint:
        "Apple Music 需在系统 App 内播放；此处保存链接便于打开。仪式内请用直链或 Spotify 作为背景音。",
      musicOpenApple: "在 Apple Music 打开",
      musicDirectUrl: "音频直链（mp3 / m4a 等）",
      musicDirectHint: "适合自建或公开音频地址，本地保存后不依赖第三方登录。",
      musicSavedToast: "背景音乐已保存",
      musicPlayFailed: "无法播放背景音乐，请检查账号或歌单",
      musicRitualHint: "先在今日任务下方关联音乐 App",
      musicProviderSpotifyLead: "登录 Spotify 并选择要在仪式中播放的歌单（需 Premium）。",
      musicProviderAppleLead: "在 Apple Music 登录后，保存要播放的歌单链接。",
      musicProviderNeteaseLead:
        "网易没有开放给网页的播放 API，Pingu 无法在应用内替你播歌。仪式时只能打开你保存的分享链接，或在 App 里自己播放。",
      musicProviderQqLead:
        "QQ 分享多是短链（如 c6.y.qq.com），会跳转到站内，没有官方 API 无法在 Pingu 内解析或播放。请保存整段分享链接，仪式时由系统打开 QQ 音乐。",
      musicNeteaseSteps:
        "1. 在网易 App 里登录\n2. 分享歌单/单曲 → 复制整段文字或链接粘贴下方（不必找 ID）\n3. 点「完成」→ 仪式开始时会打开该链接\n4. 没链接也可以：仪式时只打开网易 App，你在 App 里自己点播放",
      musicQqSteps:
        "1. 在 QQ 音乐 App 登录\n2. 分享 → 复制链接（如 https://c6.y.qq.com/…）粘贴下方\n3. 点「完成」→ 仪式时用系统浏览器/App 打开\n4. 也可不填链接，仪式时只打开 QQ 音乐",
      musicSharePaste: "粘贴 QQ / 网易分享链接（可选）",
      musicSharePastePh: "整段口令或 https://… 短链都可以，无需识别 song id",
      musicCompanionNote:
        "说明：国内音乐平台的版权与接口不对第三方网页开放；只有 Spotify（Premium + 连接）能在 Pingu 里直接播歌单并切歌。",
      musicCompanionSaved: "已保存：仪式时会打开链接或音乐 App",
      musicCompanionStart: "请在打开的音乐 App 里点播放（Pingu 无法代播）",
      musicCompanionPlay: "打开音乐",
      musicParseShare: "识别",
      musicParseOk: "已识别，请点「完成」保存",
      musicParseFail: "没识别到 ID，可换方式：手动填 ID、多首单曲，或选「App 内自播」",
      musicParseEmpty: "请先粘贴分享内容",
      musicParseGuess: "已从文案里猜了一个单曲 ID，请核对后点「完成」",
      musicModeShare: "分享识别",
      musicModeManual: "手动 ID",
      musicModeMulti: "多首单曲",
      musicModeHandoff: "App 内自播",
      musicModeHandoffLead:
        "私有/无分享权限的歌单用这个：仪式开始时打开 App，你在 App 里自己点播放即可（Pingu 不绑具体歌单）。",
      musicModeMultiLead: "每行一首单曲 ID（分享单曲往往比歌单容易），仪式内可点「下一首」切换。",
      musicNeteaseSongIds: "单曲 ID 列表（每行一个数字）",
      musicQqSongMids: "songmid 列表（每行一个）",
      musicHandoffSaved: "已保存：仪式时会打开音乐 App",
      musicHandoffStart: "请在音乐 App 里开始播放你的歌单",
      musicFindIdHelp:
        "找 ID：浏览器打开 music.163.com → 打开歌曲页 → 地址栏 song?id= 后面的数字；短链需先点开成长链接。",
      musicNeteasePlaylistId: "歌单 ID（数字）",
      musicNeteaseSongId: "单曲 ID（没有歌单链接时用）",
      musicQqPlaylistId: "歌单 ID（数字）",
      musicQqSongMid: "单曲 songmid（没有歌单链接时用）",
      musicIdHelp: "分享后复制链接点「识别」；或打开分享链接，看地址栏 id= / songmid= 后面的内容",
      musicNeteasePlayHint: "仪式已开始：正在播放网易音乐（若无声请在 App 内检查版权）",
      musicQqPlayHint: "仪式已开始：请在 QQ 音乐 App 中继续播放（已打开对应页面）",
      musicTransportPlay: "播放",
      musicTransportPause: "暂停",
      musicSkipInApp: "切歌请在对应音乐 App 里操作（Spotify 可在这里切）",
      musicStopHint: "已停止播放",
      musicOpenApp: "打开 App 登录",
      musicPlaylistLink: "歌单链接",
      musicPickPlaylist: "选择歌单",
      musicClientIdOnce: "Spotify Client ID",
      musicRedirectUriLabel: "授权回跳地址（复制到 Spotify Developer → Redirect URIs）",
      musicCopyUri: "复制",
      musicCopied: "已复制",
      musicSpotifySteps:
        "1. 在 developer.spotify.com 创建应用\n2. 把下方回跳地址加入 Redirect URIs\n3. 填 Client ID → 点「连接 Spotify」\n4. 登录后应自动回到本页\n5. 选歌单 → 点「完成」",
      musicOtherSteps:
        "1. 点「打开 App 登录」\n2. 在 App 里打开要用的歌单，复制分享链接\n3. 粘贴到下方 → 点「完成」",
      musicSpotifyReturnOk: "Spotify 已连接，请选择歌单",
      musicSpotifyReturnFail: "Spotify 回跳失败：请确认 Redirect URI 与 Client ID",
      musicSpotifyDenied: "已取消 Spotify 授权",
      musicSaveHint: "关联后记得点「完成」保存",
      musicNeedHttps: "请用 http(s) 打开本页（不要用 file://），否则无法 OAuth 回跳",
      yourNewStory: "你的新故事",
      writeNewAffirm: "新建肯定语",
      editHint: "从空白开始写，当前肯定语不会预填在这里…",
      editHintEndstate: "让句子站在「已拥有」的终点。",
      editCategoryOptional: "分类（可选）",
      updatedAt: "更新于",
      editPlaceholderStory: "从这里写下你的新故事…",
      discard: "放弃",
      save: "保存",
      diaryTitle: "感恩日记",
      diaryAdd: "新建日记",
      diaryNew: "写一条感恩",
      diaryPlaceholder: "今天想感谢什么？",
      diaryStylePlain: "纯白",
      diaryStyleLined: "横线纸",
      diaryEmpty: "还没有日记，点右上角 + 写下今天的小确幸",
      diaryToday: "今天",
      diaryYesterday: "昨天",
      favoritesSub: "收藏视频，随时回看",
      practiceSummary: "本次练习总结",
      sessionRepeatCount: "本次重复次数",
      repeatCount: "重复次数",
      confirm: "确认",
      confirmCount: "确认",
      ritualFinished: "今天的仪式完成啦",
      sessionPause: "暂停",
      sessionResume: "继续",
      tapBuddyHint: "点按nunu可以进行计数",
      statsMovedHint: "统计已移到日历页的「统计」标签。",
      profileTitle: "显化档案",
      profileIntro: "这些会喂给 coach。你可以随时改；对话里学到的新细节也会往这里补。",
      profileGoal: "终点目标",
      profileOldStory: "旧故事",
      profileEffective: "有效肯定语",
      profileCrash: "崩溃模式",
      profileBoundaries: "边界",
      profileNotes: "其他备注",
      navCalendar: "日历",
      navAffirm: "肯定语",
      navStats: "统计",
      navChat: "Pingu 对话",
      navResources: "资源",
      navSettings: "设置",
      collapseRail: "收起侧栏",
      expandRail: "展开侧栏",
      chatPlaceholder: "跟 Pingu 聊聊…",
      chatApiHeading: "对话 · API",
      chatApiHeadingAdvanced: "高级 · 自带 API Key",
      cloudHeading: "Pingu 助手",
      cloudIntro:
        "使用创作者提供的 AI（走服务端），无需自己的 OpenAI Key。注册/登录后输入兑换码激活。",
      cloudApiBase: "助手服务地址",
      cloudEmail: "邮箱",
      cloudPassword: "密码（至少 8 位）",
      cloudLogin: "登录",
      cloudRegister: "注册",
      cloudRedeem: "兑换码",
      cloudRedeemPh: "PINGU-XXXX-XX",
      cloudRedeemBtn: "激活",
      cloudStatusLoggedOut: "未登录助手",
      cloudStatusReady: "助手已就绪 · 剩余 {n} 次 · 到期 {date}",
      cloudStatusNeedRedeem: "已登录，请激活兑换码",
      cloudStatusExpired: "次数或套餐已用完，请输入新兑换码",
      cloudLoginOk: "登录成功",
      cloudRegisterOk: "注册成功，请激活兑换码",
      cloudRedeemOk: "兑换成功",
      cloudOrKeyMissing: "请登录 Pingu 助手并激活兑换码，或在「高级」里填写 API Key",
      cloudChatQuota: "助手次数或套餐已用完",
      cloudAuthFailed: "登录失败，请检查邮箱、密码与服务地址",
      cloudRedeemFailed: "兑换失败，请检查兑换码",
      accountSecurityRow: "账号与数据",
      gotoAuthFromSettings: "登录 / 管理账号",
      authPageTitle: "账号",
      authTabLogin: "登录",
      authTabRegister: "注册",
      authMethodEmail: "邮箱",
      authMethodPhone: "手机",
      authPhoneLabel: "手机号",
      authPhonePh: "11 位手机号或 +86…",
      authPasswordConfirm: "确认密码",
      authSubmitLogin: "登录",
      authSubmitRegister: "注册",
      authBindTitle: "绑定联系方式",
      authBindLead: "登录后可补充邮箱或手机，下次可用任一方式登录。",
      authBindBtn: "保存绑定",
      authLogout: "退出登录",
      authLoggedInAs: "已登录：{who}",
      authPasswordMismatch: "两次密码不一致",
      authBindOk: "绑定已保存",
      authBindFail: "绑定失败，可能已被其他账号使用",
      privacyHeading: "隐私与安全",
      privacyLead:
        "Affirm Pingu 以本机优先保存日记与档案；使用云端助手时，对话经加密连接发往 AI 服务生成回复。",
      privacyDataLocalTitle: "本机数据",
      privacyDataLocalBody:
        "肯定语、感恩日记、显化档案、外观与多数设置保存在你的设备上，不会自动上传，除非你使用云端助手等功能。",
      privacyCloudTitle: "云端助手",
      privacyCloudBody:
        "登录后发送的聊天与为 coaching 组装的本地活动摘要，经 HTTPS 发往创作者配置的 AI 服务。请勿发送银行卡、密码等敏感信息。",
      privacySecurityTitle: "账号安全",
      privacySecurityBody:
        "密码在服务器以哈希保存；登录令牌存在本机。请使用独立密码，公共设备用后请退出。短信验证码将在后续版本提供。",
      privacyDeleteTitle: "删除与导出",
      privacyDeleteBody:
        "清除浏览器数据或卸载会删除本机存档。云端账号删除请联系创作者；后续将提供自助导出/注销。",
      modelLabel: "模型",
      customModelLabel: "自定义模型 ID",
      autoAnalyzeLabel: "每天第一次打开对话时自动分析",
      saveApi: "保存 API 设置",
      apiSaved: "API 设置已保存",
      apiCleared: "已清除 API Key",
      apiKeyMissing: "请先到设置里填写 OpenAI API Key",
      apiAutoSaveNote: "改动会自动保存。ChatGPT 会员 ≠ API，请用 platform.openai.com 的 Key。",
      newChat: "新对话",
      chatCleared: "已开始新对话",
      chatFolder: "快捷面板",
      collapseFolder: "收起",
      chatArchive: "档案",
      chatArchiveHint: "记录与画像",
      chatDailyAnalyze: "每日分析",
      chatDailyAnalyzeHint: "复盘状态",
      chatAdvice: "建议",
      chatAdviceHint: "今日指引",
      calendar: "日历",
      list: "列表",
      today: "今日",
      total: "累计",
      stats: "统计",
      week: "周",
      month: "月",
      rangeTotal: "合计",
      resources: "参考视频",
      navVideos: "参考视频",
      navFaq: "常见问题",
      faq: "常见问题",
      videos: "参考视频",
      faqLead: "显化里最常见的 10 个卡点，点开看简明解答。",
      videosLead: "粘贴链接生成跳转卡片，方便下次打开。",
      urlPlaceholder: "粘贴 B站 / YouTube 等视频链接…",
      titlePlaceholder: "标题（可选，不填自动识别）",
      add: "添加",
      dailyTasks: "今日任务",
      doneMark: "✓ 已完成",
      robotic: "机械 A",
      visual: "视觉化",
      startRobotic: "开始机械 A",
      startVisual: "开始视觉化",
      restartRobotic: "再做一次机械 A",
      restartVisual: "再做一次视觉化",
      roboticEmpty: "还没有机械 A 短句。去对话点「今日复盘」生成，或点首页形象用当前肯定语练习。",
      visualEmpty: "还没有今日视觉化脚本。去对话点「今日复盘」生成。",
      switchToStory: "切换到故事稿",
      switchToRobotic: "切换到机械 A 短句",
      collapseTasks: "收起今日任务",
      expandTasks: "展开今日任务",
      storyMode: "故事稿",
      roboticMode: "机械 A",
      switchBubble: "切换故事稿 / 机械A",
      sessionInProgress: "仪式进行中",
      sessionRoboticHint: "点首页形象计数 · 结束后再报次数",
      sessionVisualHint: "停在终点日常 · 不抓取",
      visualFallback:
        "闭眼，进入终点日常：目标已经实现，气氛轻松自然。只停留在已拥有的感觉里，不谈判、不祈求。",
      close: "关闭",
      saveFail: "保存失败：自定义图片可能太大，请换小一点的图再试。",
      uploadFail: "上传失败",
      pickImage: "请选择图片文件",
      readFail: "读取图片失败",
      parseFail: "图片无法解析",
      imageTooBig: "图片太大，请换更小的图",
      weekdaySun: "日",
      weekdayMon: "一",
      weekdayTue: "二",
      weekdayWed: "三",
      weekdayThu: "四",
      weekdayFri: "五",
      weekdaySat: "六",
      heatLow: "少",
      heatHigh: "多",
      statsTodayKicker: "今日计数",
      statsTimesUnit: "次",
      statsTodayCaption: "主页点击形象也会计入次数",
      statsChartKicker: "每日次数",
      statsPrevPeriod: "上一段",
      statsNextPeriod: "下一段",
      statsDetailSummary: "{n} 次",
      statsDetailEmpty: "这一天还没有 A 过，点形象开始练习吧。",
      statsDetailRitual: "视觉化 {visual} · 机械 A {robotic}",
      statsDetailDone: "已完成",
      statsDetailNotDone: "未完成",
      dailyTasksShort: "今日",
      dailyTasksKicker: "TODAY",
      historyTitle: "肯定语记录",
      writeNew: "写新的",
      currentStory: "当前故事稿",
      currentRobotic: "当前机械 A 短句",
      editHistory: "修改历史",
      historyEmpty: "还没有修改记录",
      historyFilterAll: "全部",
      tagMoney: "金钱",
      tagLove: "爱情",
      tagCareer: "事业",
      tagRelations: "人际关系",
      addTag: "添加",
      cancel: "取消",
      newTagPlaceholder: "新分类名称",
      addTagChip: "新分类",
      noTagMatches: "这个分类还没有记录",
      editTitle: "写新肯定语",
      discard: "放弃",
      save: "保存",
      editPlaceholderRobotic: "写一句机械 A 短句…",
      profileTitle: "显化档案",
      profileIntro: "这些会喂给 coach。你可以随时改；对话里学到的新细节也会往这里补。",
      profileGoal: "终点目标",
      profileOldStory: "旧故事",
      profileEffective: "有效肯定语",
      profileCrash: "崩溃模式",
      profileBoundaries: "边界",
      profileNotes: "其他备注",
      profileGoalPh: "你要显化到的关系/生活终点…",
      profileOldStoryPh: "一遇到 3D 就容易信的旧剧本…",
      profileEffectivePh: "真正用着顺、能稳住你的句子…",
      profileCrashPh: "什么会击穿你？崩的时候通常怎么反应？",
      profileBoundariesPh: "你接受/不接受的关系底线…",
      profileNotesPh: "时间线、触发点、背景细节…",
      profileSaved: "显化档案已保存",
      profileSavedShort: "已保存",
      sessionCancel: "取消",
      sessionFinish: "结束并记完成",
      tapToAffirm: "显化一次",
      jumpBottom: "回到底部",
      send: "发送",
      modelLuna: "gpt-5.6-luna（省钱）",
      modelTerra: "gpt-5.6-terra（均衡）",
      modelSol: "gpt-5.6-sol（更强）",
      modelCustomOption: "自定义模型 ID…",
      customModelPh: "例如 gpt-5.2",
      emptyValue: "（空）",
      notGenerated: "（尚未生成）",
      chartAriaWeek: "本周次数走势，合计 {n}",
      chartAriaMonth: "本月次数走势，合计 {n}",
      statsTipAffirmed: "A 了",
      statsTipTimes: "{n} 次",
      statsTipDone: "已完成",
      statsTipNotDone: "未完成",
      monthDay: "{m}月{d}日",
      listEmpty: "还没有记录，按空格开始吧",
      timesCount: "{n} 次",
      noEntry: "无记录",
      calendarCellMeta: "{date} · {duration}{count}",
      ritualCancelToast: "已取消 · 本次 {n} 次",
      ritualRoboticToast: "本次机械 A：{n} 次",
      ritualRoboticEnded: "本次机械 A 结束",
      ritualVisualDoneToast: "视觉化已完成",
      delete: "删除",
      deleteRecord: "删除这条记录",
      deleteCard: "删除卡片",
      openWatch: "打开观看 →",
      pasteLinkRequired: "请粘贴链接",
      invalidLink: "链接无效",
      linkAlreadyAdded: "这个链接已经添加过了",
      addFailed: "添加失败",
      customVideo: "自定义视频",
      myFavorites: "我的收藏",
      customLabel: "自定义",
      linkBadge: "链接",
      customCollection: "自定义收藏",
      bilibili: "B站",
      bilibiliSite: "哔哩哔哩",
      bilibiliVideo: "B站视频",
      bilibiliVideoId: "B站视频 {id}",
      youtubeVideo: "YouTube 视频",
      youtubeVideoId: "YouTube 视频 {id}",
      douyinVideo: "{badge} 视频",
      xiaohongshu: "小红书",
      xiaohongshuContent: "小红书内容",
      customLinkHost: "自定义链接",
      coachReady: "高阶显化 coach 已就绪。可点「今日复盘」，或直接说今天的状态。",
      coachReadyEn: "Advanced manifestation coach is ready. Tap Daily Review, or tell me how you're doing today.",
      thinking: "Pingu 思考中…",
      profileFieldsUpdated: "档案字段已更新 +{n}",
      notesAdded: "备注已补充 +{n}",
      dailySynced: "今日目标已同步到首页仪式",
      storySynced: "故事稿已同步到记录与气泡",
      roboticSynced: "机械 A 短句已同步",
      requestFailed: "请求失败",
      noApiKey: "还没有设置 API Key",
      apiKeyInvalid: "API Key 无效。请到 platform.openai.com 创建 API Key（不是 ChatGPT 登录密码）。",
      apiQuota: "API 额度不足或未开通计费。ChatGPT 会员不能用于这里——请到 platform.openai.com/settings/organization/billing 开通 API 付费。",
      modelUnavailable: "模型不可用，请换一个模型或检查账号权限。",
      emptyModelResponse: "模型没有返回内容",
      requestFailedStatus: "请求失败（{status}）",
      activityToday: "今天：{n} 次",
      activityWeek: "本周：{n} 次，{duration}",
      activityMonth: "本月：{n} 次，{duration}",
      activityTotal: "累计：{n} 次，{duration}",
      activityRecent: "近两周明细：\n{lines}",
      activityNoRecent: "近两周暂无记录",
      activityStory: "当前故事稿：\n{text}",
      activityRobotic: "当前机械 A 短句：\n{text}",
      activityGoals: "今日目标：\n{text}",
      activityDayLine: "{date}: {n}次 / {duration}",
      profileGoalLine: "终点目标：\n{text}",
      profileOldStoryLine: "旧故事：\n{text}",
      profileEffectiveLine: "有效肯定语：\n{text}",
      profileCrashLine: "崩溃模式：\n{text}",
      profileBoundariesLine: "边界：\n{text}",
      profileNotesLine: "其他备注：\n{text}",
      durationH: "{h}时",
      durationHM: "{h}时{m}分",
      durationM: "{m}分",
      durationMS: "{m}分{s}秒",
      durationS: "{s}秒",
      chartWeekMon: "一",
      chartWeekTue: "二",
      chartWeekWed: "三",
      chartWeekThu: "四",
      chartWeekFri: "五",
      chartWeekSat: "六",
      chartWeekSun: "日",
      prevMonth: "上个月",
      nextMonth: "下个月",
      statsRangeAria: "统计范围",
      chartAria: "次数走势图",
      filterTagsAria: "分类筛选",
      affirmKindAria: "肯定语类型",
      ritualTabsAria: "今日任务类型",
      railAria: "底部导航",
      presetBuddyAria: "预设形象",
      uploadBuddyTitle: "上传自定义形象",
      uploadBgTitle: "点击上传背景图",
      buddyPreviewTitle: "当前首页形象预览",
      faq1q: "A 了很多次，为什么还是没结果？",
      faq1a: "次数不是成绩单。关键是：你在用什么身份解释现实。如果一边机械 A「已经拥有」，一边用 3D 证明「还没有」，等于在强化旧故事。先稳住自我概念（SC），再让 A 服务新假设，而不是焦虑计数。",
      faq2q: "一看到 3D 反馈就崩，怎么办？",
      faq2a: "3D 是旧状态的回声，不是否决票。崩的时候别硬撑「我不在意」——先承认难受，再改一句内对话：从「怎么还不来」换成「这是旧回声，我已经站在终点」。然后做 5–10 分钟机械 A 或一段终点视觉化。",
      faq3q: "自我概念（SC）不稳，怎么修？",
      faq3a: "把价值从外在证据上拿回来。写几条关于「我是谁 / 我配得到什么」的短句（现在时、已拥有），优先于讨好式终点肯定。SC 稳了，终点肯定语才站得住。",
      faq4q: "肯定语怎么写才有效？",
      faq4a: "具体、正向、现在时、已发生；避免「不 / 别 / 没有」。句子里不要偷偷承认「现在还没有」。过长或互相打架的句子，拆成一句能机械重复的短句。",
      faq5q: "机械 A 一定要有感觉吗？",
      faq5a: "不必。机械 A 的作用是打断旧内对话、灌入新假设，可以平淡、一心二用。靠情绪高潮硬「感觉」容易变成表演；真正要切换的是你默认相信的故事。",
      faq6q: "白天假设已实现，晚上又怀疑，这算摇摆吗？",
      faq6a: "是。新旧故事来回跳，会把延迟解读成失败。解决办法不是「更用力求」，而是 Just Decide：决定新故事，白天用机械 A 守住，晚上用终点场景入睡，少用 3D 复盘当监视。",
      faq7q: "视觉化总是在演「还没有怎么办」？",
      faq7a: "那就在演匮乏。视觉化重点是终点已实现后的日常自然感（已经拥有时你会怎么走路、怎么说话、怎么过今天），不是祈求过程和补救剧情。",
      faq8q: "一定要显化彩票/大目标才算成功吗？",
      faq8a: "不是。大额结果可以学方法（如状态、假设、坚持），但核心能力是：你能否稳定地活在所选故事里。小结果与自我概念的校准，往往比追逐神话故事更持久。",
      faq9q: "限时显化 / 快速显化靠谱吗？",
      faq9a: "「限时」是训练专注与决定，不是宇宙倒计时威胁。把时限当成练习窗口：这段时间只站新故事；别把「到点没出现」写成失败剧本。方法服务于状态，状态稳了，时间感会变松。",
      faq10q: "情绪很差的时候还能不能 A？",
      faq10a: "能，但先降抓取。情绪差时硬念「我超级开心」容易自欺。可以先短机械 A 稳住身份句，或只做 2–3 分钟终点场景；允许难受，同时不把难受当「显化失败」的证据。",
    },
    en: {
      settingsTitle: "Settings",
      userCenterTitle: "Account",
      userCenterSub: "Local profile & preferences",
      userProfileEditAria: "Edit name and avatar",
      userProfileEditTitle: "Edit profile",
      userProfileNameLabel: "Display name",
      userProfileAvatarLabel: "Avatar",
      userProfileAvatarHint: "Tap to upload photo",
      profileOpenHint: "The coach reads these fields",
      done: "Done",
      back: "Back",
      languageHeading: "Language",
      buddyHeading: "Home buddy",
      homeBgHeading: "Home background",
      chatBgHeading: "Chat background",
      tapUpload: "Tap to upload image",
      currentBuddy: "Current buddy",
      appearanceNote: "Pick a preset buddy, or tap a preview to upload an image. Saved on this device.",
      presetPingu: "Pingu",
      presetJishibao: "Jishibao",
      presetXuebiIdle: "Xuebi idle",
      presetXuebiCast: "Xuebi cast",
      presetCustom: "Custom",
      presetNunu: "Nunu",
      navHome: "Home",
      navDiary: "Diary",
      navFavorites: "Favorites",
      greetingName: "Little Gin,",
      greetingDiaryHint: "You haven't started your gratitude diary today",
      greetingDiaryDone: "You already wrote gratitude today — nice",
      greetingCheckinA: "You haven't checked in today — open daily tasks?",
      greetingCheckinB: "Robotic A and visualization are waiting for today's check-in.",
      greetingCheckinPartial: "Almost done with today's check-in — one more step.",
      greetingDiaryA: "Check-in done — want to write gratitude?",
      greetingDiaryB: "Your gratitude diary is still empty today.",
      greetingAllA: "Anything you want to talk about? Tap the crystal.",
      greetingAllB: "Everything you want — you already have it.",
      greetingAllC: "You're the richest queen — enjoy today.",
      greetingAllD: "You're in a great flow — tap me to affirm again.",
      musicSheetTitle: "Ritual background music",
      musicSheetLead: "Plays during visualization or robotic A. Connect Spotify or paste a link.",
      musicTabUrl: "Direct URL",
      musicSpotifyClientId: "Spotify Client ID (developer dashboard)",
      musicSpotifyClientHint:
        "Create an app on Spotify Developer; set Redirect URI to this page URL. Premium required for in-app playback.",
      musicSpotifyConnect: "Connect Spotify",
      musicSpotifyDisconnect: "Disconnect",
      musicSpotifyConnected: "Spotify connected",
      musicSpotifyNeedClient: "Enter Client ID first",
      musicPlaylistPick: "Playlist",
      musicPlaylistEmpty: "Connect to choose a playlist",
      musicPlaylistUrl: "Or paste a Spotify playlist link",
      musicApplePlaylist: "Apple Music playlist link",
      musicAppleHint:
        "Apple Music plays in the system app; save the link here. Use direct URL or Spotify for in-session audio.",
      musicOpenApple: "Open in Apple Music",
      musicDirectUrl: "Direct audio URL (mp3 / m4a)",
      musicDirectHint: "Public or self-hosted audio; no third-party login needed.",
      musicSavedToast: "Background music saved",
      musicPlayFailed: "Couldn't play background music — check account or playlist",
      musicRitualHint: "Link a music app under today's tasks first",
      musicProviderSpotifyLead: "Sign in to Spotify and pick a playlist for rituals (Premium required).",
      musicProviderAppleLead: "After signing in to Apple Music, save your playlist link.",
      musicProviderNeteaseLead:
        "NetEase has no public web playback API — Pingu can't stream inside the app. Save a share link to open at ritual start, or play manually in the app.",
      musicProviderQqLead:
        "QQ shares are often short links that redirect in-app; without an official API we can't parse or play them inside Pingu. Paste the full share URL to open at ritual time.",
      musicNeteaseSteps:
        "1. Sign in in the NetEase app\n2. Share → copy link/text and paste below (no song ID needed)\n3. Tap Done — ritual opens that link\n4. Or leave blank and open the app at ritual start",
      musicQqSteps:
        "1. Sign in in QQ Music\n2. Share → copy link (e.g. c6.y.qq.com…) and paste below\n3. Tap Done — system opens QQ Music\n4. Or leave blank to open the app only",
      musicSharePaste: "Paste share link (optional)",
      musicSharePastePh: "Full share text or https://… — no ID parsing",
      musicCompanionNote:
        "Domestic streaming services don't offer third-party web playback; only Spotify (Premium + connect) plays in Pingu with skip controls.",
      musicCompanionSaved: "Saved — we'll open your link or the music app when the ritual starts",
      musicCompanionStart: "Press play in the music app (Pingu can't stream for you)",
      musicCompanionPlay: "Open music",
      musicParseShare: "Parse",
      musicParseOk: "Parsed — tap Done to save",
      musicParseFail: "No ID found — try manual ID, multi-song list, or App handoff mode",
      musicParseEmpty: "Paste share text first",
      musicParseGuess: "Guessed a song ID from text — verify, then tap Done",
      musicModeShare: "Share parse",
      musicModeManual: "Manual ID",
      musicModeMulti: "Multi songs",
      musicModeHandoff: "Play in app",
      musicModeHandoffLead: "For private playlists: we open the app at ritual start; you hit play there.",
      musicModeMultiLead: "One song ID per line; use Next during the ritual to switch.",
      musicNeteaseSongIds: "Song IDs (one per line)",
      musicQqSongMids: "songmid list (one per line)",
      musicHandoffSaved: "Saved — we'll open the music app when the ritual starts",
      musicHandoffStart: "Start playback in your music app",
      musicFindIdHelp:
        "Find ID: open the song on music.163.com — digits after song?id= in the URL.",
      musicNeteasePlaylistId: "Playlist ID (digits)",
      musicNeteaseSongId: "Song ID (when no playlist link)",
      musicQqPlaylistId: "Playlist ID (digits)",
      musicQqSongMid: "Song songmid (when no playlist link)",
      musicIdHelp: "Copy from share link, or open the link and read id= / songmid= from the URL",
      musicNeteasePlayHint: "Ritual music: NetEase player started (silent? check rights in app)",
      musicQqPlayHint: "Ritual music: opened in QQ Music — continue in the app if needed",
      musicTransportPlay: "Play",
      musicTransportPause: "Pause",
      musicSkipInApp: "Skip tracks in the music app (Spotify can skip here)",
      musicStopHint: "Playback stopped",
      musicOpenApp: "Open app to sign in",
      musicPlaylistLink: "Playlist link",
      musicPickPlaylist: "Choose playlist",
      musicClientIdOnce: "Spotify Client ID",
      musicRedirectUriLabel: "Redirect URI (add in Spotify Developer → Redirect URIs)",
      musicCopyUri: "Copy",
      musicCopied: "Copied",
      musicSpotifySteps:
        "1. Create an app at developer.spotify.com\n2. Add the redirect URI below to Redirect URIs\n3. Enter Client ID → Connect Spotify\n4. After login you should return here automatically\n5. Pick a playlist → Done",
      musicOtherSteps:
        "1. Open the app to sign in\n2. Copy your playlist share link from the app\n3. Paste below → Done",
      musicSpotifyReturnOk: "Spotify connected — choose a playlist",
      musicSpotifyReturnFail: "Spotify callback failed — check Redirect URI and Client ID",
      musicSpotifyDenied: "Spotify authorization cancelled",
      musicSaveHint: "Tap Done to save your link",
      musicNeedHttps: "Open this app via http(s), not file://, for OAuth redirect",
      yourNewStory: "Your new story",
      writeNewAffirm: "New affirmation",
      editHint: "Start blank — current text won't be prefilled…",
      editHintEndstate: "Write from the end state — as if you already have it.",
      editCategoryOptional: "Category (optional)",
      updatedAt: "Updated",
      editPlaceholderStory: "Write your new story here…",
      discard: "Discard",
      save: "Save",
      diaryTitle: "Gratitude diary",
      diaryAdd: "New entry",
      diaryNew: "Write gratitude",
      diaryPlaceholder: "What are you grateful for today?",
      diaryStylePlain: "Plain",
      diaryStyleLined: "Lined",
      diaryEmpty: "No entries yet — tap + to write a little joy",
      diaryToday: "Today",
      diaryYesterday: "Yesterday",
      favoritesSub: "Saved videos, always here",
      practiceSummary: "Session summary",
      sessionRepeatCount: "Reps this session",
      repeatCount: "Reps",
      confirm: "Confirm",
      confirmCount: "Confirm",
      ritualFinished: "Today's ritual is done",
      sessionPause: "Pause",
      sessionResume: "Resume",
      tapBuddyHint: "Tap nunu to count",
      statsMovedHint: "Stats moved into the Calendar → Stats tab.",
      profileTitle: "Manifestation profile",
      profileIntro: "These feed the coach. Edit anytime; chat can fill in details too.",
      profileGoal: "End goal",
      profileOldStory: "Old story",
      profileEffective: "Effective affirmations",
      profileCrash: "Crash patterns",
      profileBoundaries: "Boundaries",
      profileNotes: "Notes",
      navCalendar: "Calendar",
      navAffirm: "Affirmations",
      navStats: "Stats",
      navChat: "Chat with Pingu",
      navResources: "Resources",
      navSettings: "Settings",
      collapseRail: "Collapse toolbar",
      expandRail: "Expand toolbar",
      chatPlaceholder: "Ask Pingu…",
      chatApiHeading: "Chat · API",
      chatApiHeadingAdvanced: "Advanced · own API key",
      cloudHeading: "Pingu Assistant",
      cloudIntro:
        "Use hosted AI (via the creator's server). Sign in and redeem a code — no OpenAI key needed.",
      cloudApiBase: "Assistant server URL",
      cloudEmail: "Email",
      cloudPassword: "Password (8+ chars)",
      cloudLogin: "Sign in",
      cloudRegister: "Register",
      cloudRedeem: "Redeem code",
      cloudRedeemPh: "PINGU-XXXX-XX",
      cloudRedeemBtn: "Redeem",
      cloudStatusLoggedOut: "Not signed in",
      cloudStatusReady: "Ready · {n} chats left · until {date}",
      cloudStatusNeedRedeem: "Signed in — redeem a code to start",
      cloudStatusExpired: "No chats left or plan expired",
      cloudLoginOk: "Signed in",
      cloudRegisterOk: "Registered — redeem a code",
      cloudRedeemOk: "Code redeemed",
      cloudOrKeyMissing: "Sign in to Pingu Assistant and redeem a code, or add an API key under Advanced",
      cloudChatQuota: "Assistant quota exhausted",
      cloudAuthFailed: "Sign-in failed — check email, password, and server URL",
      cloudRedeemFailed: "Invalid or used code",
      accountSecurityRow: "Account & data",
      gotoAuthFromSettings: "Sign in / account",
      authPageTitle: "Account",
      authTabLogin: "Sign in",
      authTabRegister: "Register",
      authMethodEmail: "Email",
      authMethodPhone: "Phone",
      authPhoneLabel: "Phone number",
      authPhonePh: "Mobile or +86…",
      authPasswordConfirm: "Confirm password",
      authSubmitLogin: "Sign in",
      authSubmitRegister: "Create account",
      authBindTitle: "Link contact",
      authBindLead: "Add email or phone so you can sign in either way next time.",
      authBindBtn: "Save link",
      authLogout: "Sign out",
      authLoggedInAs: "Signed in as {who}",
      authPasswordMismatch: "Passwords don't match",
      authBindOk: "Contact saved",
      authBindFail: "Couldn't link — may already be in use",
      privacyHeading: "Privacy & security",
      privacyLead:
        "Affirm Pingu keeps diary and profile data on your device first; cloud assistant chat is sent over HTTPS to generate replies.",
      privacyDataLocalTitle: "On-device data",
      privacyDataLocalBody:
        "Affirmations, diary, manifestation profile, and appearance stay on your device unless you use cloud features.",
      privacyCloudTitle: "Cloud assistant",
      privacyCloudBody:
        "Chat and a local activity summary for coaching are sent over HTTPS to the creator's AI service. Don't send passwords or card numbers.",
      privacySecurityTitle: "Account security",
      privacySecurityBody:
        "Passwords are hashed on the server; tokens stay on device. Use a unique password and sign out on shared devices. SMS OTP coming later.",
      privacyDeleteTitle: "Deletion & export",
      privacyDeleteBody:
        "Clearing browser data removes local archives. Contact the creator to delete cloud accounts; self-serve export/delete planned.",
      modelLabel: "Model",
      customModelLabel: "Custom model ID",
      autoAnalyzeLabel: "Auto-analyze the first time you open chat each day",
      saveApi: "Save API settings",
      apiSaved: "API settings saved",
      apiCleared: "API key cleared",
      apiKeyMissing: "Add your OpenAI API key in Settings first",
      apiAutoSaveNote: "Changes save automatically. ChatGPT Plus ≠ API — use a key from platform.openai.com.",
      newChat: "New chat",
      chatCleared: "Started a new chat",
      chatFolder: "Quick panel",
      collapseFolder: "Collapse",
      chatArchive: "Archive",
      chatArchiveHint: "Profile & memory",
      chatDailyAnalyze: "Daily review",
      chatDailyAnalyzeHint: "Check your state",
      chatAdvice: "Advice",
      chatAdviceHint: "Today's guide",
      calendar: "Calendar",
      list: "List",
      today: "Today",
      total: "Total",
      stats: "Stats",
      week: "Week",
      month: "Month",
      rangeTotal: "Total",
      resources: "Videos",
      navVideos: "Videos",
      navFaq: "FAQ",
      faq: "FAQ",
      videos: "Videos",
      faqLead: "Ten common manifestation stuck points — tap for a short answer.",
      videosLead: "Paste a link to save a quick-open video card.",
      urlPlaceholder: "Paste a Bilibili / YouTube link…",
      titlePlaceholder: "Title (optional)",
      add: "Add",
      dailyTasks: "Today's tasks",
      doneMark: "✓ Done",
      robotic: "Robotic A",
      visual: "Visualize",
      startRobotic: "Start robotic A",
      startVisual: "Start visualize",
      restartRobotic: "Do robotic A again",
      restartVisual: "Visualize again",
      roboticEmpty: "No robotic A line yet. Generate one in chat via Daily Review, or tap your buddy to practice with the current affirmation.",
      visualEmpty: "No visualize script yet. Generate one in chat via Daily Review.",
      switchToStory: "Switch to story",
      switchToRobotic: "Switch to robotic A",
      collapseTasks: "Collapse today's tasks",
      expandTasks: "Expand today's tasks",
      storyMode: "Story",
      roboticMode: "Robotic A",
      switchBubble: "Switch story / robotic A",
      sessionInProgress: "Session in progress",
      sessionRoboticHint: "Tap buddy to count · report after",
      sessionVisualHint: "Stay in the end scene · no grabbing",
      visualFallback:
        "Close your eyes. Step into the end: it's already yours, easy and natural. Stay in possession — no bargaining, no begging.",
      close: "Close",
      saveFail: "Save failed: custom image may be too large. Try a smaller one.",
      uploadFail: "Upload failed",
      pickImage: "Please choose an image file",
      readFail: "Could not read image",
      parseFail: "Could not parse image",
      imageTooBig: "Image is too large — try a smaller one",
      weekdaySun: "S",
      weekdayMon: "M",
      weekdayTue: "T",
      weekdayWed: "W",
      weekdayThu: "T",
      weekdayFri: "F",
      weekdaySat: "S",
      heatLow: "Less",
      heatHigh: "More",
      statsTodayKicker: "Today's count",
      statsTimesUnit: "times",
      statsTodayCaption: "Taps on the home buddy count here too.",
      statsChartKicker: "Daily counts",
      statsPrevPeriod: "Previous period",
      statsNextPeriod: "Next period",
      statsDetailSummary: "{n}×",
      statsDetailEmpty: "No affirmations this day yet — tap the buddy on home to start.",
      statsDetailRitual: "Visual {visual} · Robotic {robotic}",
      statsDetailDone: "Done",
      statsDetailNotDone: "Not done",
      dailyTasksShort: "Today",
      dailyTasksKicker: "TODAY",
      historyTitle: "Affirmations",
      writeNew: "Write",
      currentStory: "Current story",
      currentRobotic: "Current robotic A",
      editHistory: "Edit history",
      historyEmpty: "No edit history yet",
      historyFilterAll: "All",
      tagMoney: "Money",
      tagLove: "Love",
      tagCareer: "Career",
      tagRelations: "Relationships",
      addTag: "Add",
      cancel: "Cancel",
      newTagPlaceholder: "New category name",
      addTagChip: "New tag",
      noTagMatches: "Nothing in this category yet",
      editTitle: "Write affirmation",
      discard: "Discard",
      save: "Save",
      editPlaceholderRobotic: "Write a short robotic A line…",
      profileTitle: "Manifestation profile",
      profileIntro: "This feeds the coach. Edit anytime — details learned in chat are filled in here too.",
      profileGoal: "End goal",
      profileOldStory: "Old story",
      profileEffective: "Effective affirmations",
      profileCrash: "Crash patterns",
      profileBoundaries: "Boundaries",
      profileNotes: "Other notes",
      profileGoalPh: "The relationship / life end state you're manifesting…",
      profileOldStoryPh: "The old script you fall into when 3D hits…",
      profileEffectivePh: "Lines that actually land and stabilize you…",
      profileCrashPh: "What pierces you? How do you usually react when you crash?",
      profileBoundariesPh: "What you accept / don't accept in relationships…",
      profileNotesPh: "Timeline, triggers, background details…",
      profileSaved: "Manifestation profile saved",
      profileSavedShort: "Saved",
      sessionCancel: "Cancel",
      sessionFinish: "Finish & mark done",
      tapToAffirm: "Affirm once",
      jumpBottom: "Jump to bottom",
      send: "Send",
      modelLuna: "gpt-5.6-luna (budget)",
      modelTerra: "gpt-5.6-terra (balanced)",
      modelSol: "gpt-5.6-sol (stronger)",
      modelCustomOption: "Custom model ID…",
      customModelPh: "e.g. gpt-5.2",
      emptyValue: "(empty)",
      notGenerated: "(not generated yet)",
      chartAriaWeek: "Weekly count trend, total {n}",
      chartAriaMonth: "Monthly count trend, total {n}",
      statsTipAffirmed: "Affirmed",
      statsTipTimes: "{n}×",
      statsTipDone: "Done",
      statsTipNotDone: "Not done",
      monthDay: "{m}/{d}",
      listEmpty: "No records yet — press Space to start",
      timesCount: "{n}×",
      noEntry: "No entry",
      calendarCellMeta: "{date} · {duration}{count}",
      ritualCancelToast: "Cancelled · {n} this session",
      ritualRoboticToast: "Robotic A session: {n}",
      ritualRoboticEnded: "Robotic A session ended",
      ritualVisualDoneToast: "Visualization complete",
      delete: "Delete",
      deleteRecord: "Delete this record",
      deleteCard: "Delete card",
      openWatch: "Open →",
      pasteLinkRequired: "Paste a link first",
      invalidLink: "Invalid link",
      linkAlreadyAdded: "This link is already added",
      addFailed: "Couldn't add",
      customVideo: "Custom video",
      myFavorites: "My saves",
      customLabel: "Custom",
      linkBadge: "Link",
      customCollection: "Saved link",
      bilibili: "Bilibili",
      bilibiliSite: "Bilibili",
      bilibiliVideo: "Bilibili video",
      bilibiliVideoId: "Bilibili {id}",
      youtubeVideo: "YouTube video",
      youtubeVideoId: "YouTube {id}",
      douyinVideo: "{badge} video",
      xiaohongshu: "Xiaohongshu",
      xiaohongshuContent: "Xiaohongshu post",
      customLinkHost: "Custom link",
      coachReady: "Advanced manifestation coach is ready. Tap Daily Review, or tell me how you're doing today.",
      coachReadyEn: "Advanced manifestation coach is ready. Tap Daily Review, or tell me how you're doing today.",
      thinking: "Pingu is thinking…",
      profileFieldsUpdated: "Profile fields updated +{n}",
      notesAdded: "Notes added +{n}",
      dailySynced: "Today's goals synced to home rituals",
      storySynced: "Story synced to history & bubble",
      roboticSynced: "Robotic A line synced",
      requestFailed: "Request failed",
      noApiKey: "No API key set yet",
      apiKeyInvalid: "Invalid API key. Create one at platform.openai.com (not your ChatGPT password).",
      apiQuota: "API quota / billing issue. ChatGPT Plus won't work here — enable API billing at platform.openai.com/settings/organization/billing.",
      modelUnavailable: "Model unavailable — try another model or check account access.",
      emptyModelResponse: "The model returned no content",
      requestFailedStatus: "Request failed ({status})",
      activityToday: "Today: {n}",
      activityWeek: "This week: {n}, {duration}",
      activityMonth: "This month: {n}, {duration}",
      activityTotal: "All time: {n}, {duration}",
      activityRecent: "Last 2 weeks:\n{lines}",
      activityNoRecent: "No records in the last 2 weeks",
      activityStory: "Current story:\n{text}",
      activityRobotic: "Current robotic A:\n{text}",
      activityGoals: "Today's goals:\n{text}",
      activityDayLine: "{date}: {n}× / {duration}",
      profileGoalLine: "End goal:\n{text}",
      profileOldStoryLine: "Old story:\n{text}",
      profileEffectiveLine: "Effective affirmations:\n{text}",
      profileCrashLine: "Crash patterns:\n{text}",
      profileBoundariesLine: "Boundaries:\n{text}",
      profileNotesLine: "Other notes:\n{text}",
      durationH: "{h}h",
      durationHM: "{h}h {m}m",
      durationM: "{m}m",
      durationMS: "{m}m {s}s",
      durationS: "{s}s",
      chartWeekMon: "M",
      chartWeekTue: "T",
      chartWeekWed: "W",
      chartWeekThu: "T",
      chartWeekFri: "F",
      chartWeekSat: "S",
      chartWeekSun: "S",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      statsRangeAria: "Stats range",
      chartAria: "Count trend chart",
      filterTagsAria: "Filter by tag",
      affirmKindAria: "Affirmation type",
      ritualTabsAria: "Today's task type",
      railAria: "Bottom navigation",
      presetBuddyAria: "Buddy presets",
      uploadBuddyTitle: "Upload custom buddy",
      uploadBgTitle: "Tap to upload background",
      buddyPreviewTitle: "Current home buddy preview",
      faq1q: "I've affirmed a lot — why no results?",
      faq1a: "Count isn't a scoreboard. What matters is which identity you use to interpret reality. Affirming “I already have it” while proving “I don't” with 3D reinforces the old story. Stabilize self-concept (SC) first, then let affirming serve the new assumption — not anxious counting.",
      faq2q: "I crash the moment I see 3D feedback. Help?",
      faq2a: "3D is an echo of the old state, not a veto. When you crash, don't force “I don't care” — feel it, then rewrite the inner line: from “why isn't it here” to “this is an old echo; I'm already at the end.” Then do 5–10 minutes of robotic A or an end-state visualization.",
      faq3q: "Self-concept (SC) feels shaky. How do I fix it?",
      faq3a: "Pull worth off external proof. Write short present-tense, already-owning lines about who you are / what you deserve — before end-goal flattery. When SC is steady, end affirmations can stand.",
      faq4q: "How do I write affirmations that work?",
      faq4a: "Specific, positive, present tense, already happened; avoid no / not / never. Don't secretly admit “I don't have it yet.” Long or conflicting lines — split into one short robotic line.",
      faq5q: "Does robotic A require feeling?",
      faq5a: "No. Robotic A interrupts the old inner talk and installs a new assumption — it can be flat and multitasked. Chasing emotional peaks turns into performance; what changes is the story you default to.",
      faq6q: "I assume it's done by day, doubt at night. Is that wavering?",
      faq6a: "Yes. Jumping between stories reads delay as failure. Don't “try harder” — Just Decide: pick the new story, hold it with robotic A by day, sleep in the end scene at night, and stop using 3D as surveillance.",
      faq7q: "My visualization keeps playing “what if I still don't have it”?",
      faq7a: "That's scarcity. Visualization is the natural everyday feel after it's already yours — how you walk, talk, spend the day — not begging or rescue plots.",
      faq8q: "Do I have to manifest lottery / huge goals to “succeed”?",
      faq8a: "No. Big outcomes can teach method (state, assumption, persistence), but the real skill is living in the chosen story. Small results that calibrate SC often last longer than chasing myths.",
      faq9q: "Are timed / rapid manifestation methods legit?",
      faq9a: "A time box trains focus and decision — it's not a cosmic deadline. Use it as a practice window to stand in the new story; don't script “it didn't show up on time” as failure. Method serves state; when state is steady, time feels looser.",
      faq10q: "Can I still affirm when I feel awful?",
      faq10a: "Yes, but drop the grab first. Forcing “I'm so happy” when crushed becomes self-gaslighting. Short robotic identity lines, or 2–3 minutes in the end scene — allow the feeling without treating it as proof that manifestation failed.",
    },
  };

  const BUILTIN_TAGS = [
    {
      id: "money",
      labelKey: "tagMoney",
      icon: "fa-coins",
      tone: "lime",
      keywords: [
        "钱",
        "金钱",
        "财富",
        "富",
        "富有",
        "富足",
        "丰盛",
        "收入",
        "赚",
        "存款",
        "理财",
        "发财",
        "万元",
        "月入",
        "年薪",
        "奖金",
        "分红",
        "资产",
        "负债",
        "金钱自由",
        "财富自由",
        "money",
        "rich",
        "wealth",
        "abundance",
        "income",
        "cash",
        "dollar",
        "salary",
        "finance",
        "financial",
        "millionaire",
        "大平层",
        "平层",
        "房子",
        "房产",
        "买房",
        "购房",
        "置业",
        "别墅",
        "公寓",
        "住宅",
        "豪宅",
        "江景房",
        "学区房",
        "首付",
        "房贷",
        "按揭",
        "千万",
        "百万",
        "亿万",
        "house",
        "home",
        "property",
        "mortgage",
        "real estate",
      ],
      patterns: [
        /显化.{0,12}(钱|金钱|财富|富|收入|赚|房|楼|万)/,
        /(钱|金钱|财富|富|收入|房|楼|万).{0,12}显化/,
        /manifest.{0,16}(money|wealth|rich|abundance|income|house|home|property)/i,
        /(money|wealth|rich|abundance|income|house|home|property).{0,16}manifest/i,
        /[\$￥¥]\s*[\d,.]+/,
        /[\d,.]+\s*万/,
        /[\d,.]+万/,
        /大平层|(?:江景|学区|海景|复式)?(?:大)?平层/,
        /(?:买|购|拥有|住进|搬进|入住)?(?:我的|一套|这|那)?(?:大)?(?:平层|别墅|公寓|豪宅|房子|房产)/,
        /\d+\s*(k|m)\b/i,
      ],
    },
    {
      id: "love",
      labelKey: "tagLove",
      icon: "fa-heart",
      tone: "pink",
      keywords: [
        "爱",
        "爱情",
        "恋爱",
        "感情",
        "伴侣",
        "男友",
        "女友",
        "老公",
        "老婆",
        "对象",
        "暧昧",
        "表白",
        "复合",
        "和好",
        "分手",
        "结婚",
        "婚姻",
        "婚礼",
        "订婚",
        "前任",
        "现任",
        "喜欢我",
        "爱我",
        "对我好",
        "疼我",
        "宠我",
        "体贴",
        "温柔",
        "soulmate",
        "love",
        "romance",
        "boyfriend",
        "girlfriend",
        "husband",
        "wife",
        "marriage",
        "crush",
        "dating",
        "spouse",
        "ex",
        "reconcile",
        "breakup",
      ],
      patterns: [
        /显化.{0,12}(爱|爱情|恋爱|感情|伴侣|男友|女友|结婚|婚姻|对象|分手|复合|和好)/,
        /(爱|爱情|恋爱|感情|伴侣|男友|女友|结婚|婚姻|分手|复合|和好).{0,12}显化/,
        /manifest.{0,12}(love|romance|marriage|partner|soulmate|ex|reconcile)/i,
        /(love|romance|marriage|partner|soulmate|ex|reconcile).{0,12}manifest/i,
        /分手|和好|复合|重新在一起/,
        /(他|她|对方|伴侣|男友|女友|老公|老婆|对象|sp).{0,20}(爱|喜欢|好|宠|疼|体贴|温柔)/i,
        /(爱|喜欢|宠|疼|体贴).{0,16}(我|自己)/,
        /(给我|为我).{0,12}(花|买|送|转账|礼物)/,
      ],
    },
    {
      id: "career",
      labelKey: "tagCareer",
      icon: "fa-briefcase",
      tone: "ink",
      keywords: [
        "事业",
        "工作",
        "职场",
        "升职",
        "加薪",
        "offer",
        "面试",
        "入职",
        "跳槽",
        "上岸",
        "公司",
        "创业",
        "项目",
        "客户",
        "业绩",
        "事业有成",
        "career",
        "job",
        "work",
        "promotion",
        "boss",
        "business",
        "startup",
        "office",
        "hired",
        "interview",
      ],
      patterns: [
        /显化.{0,8}(工作|事业|职场|offer|面试|升职|创业|上岸)/i,
        /(工作|事业|职场|offer|面试|升职|创业).{0,8}显化/,
        /manifest.{0,12}(career|job|work|promotion|business|offer)/i,
        /(career|job|work|promotion|business|offer).{0,12}manifest/i,
      ],
    },
    {
      id: "relations",
      labelKey: "tagRelations",
      icon: "fa-handshake",
      tone: "violet",
      keywords: [
        "人际",
        "人际关系",
        "朋友",
        "家人",
        "家庭",
        "社交",
        "闺蜜",
        "兄弟",
        "父母",
        "妈妈",
        "爸爸",
        "同事",
        "同学",
        "邻居",
        "上司",
        "领导",
        "主管",
        "下属",
        "团队",
        "感恩",
        "friend",
        "family",
        "social",
        "colleague",
        "coworker",
        "boss",
        "manager",
        "parents",
        "friendship",
        "community",
        "grateful",
      ],
      patterns: [
        /显化.{0,12}(朋友|家人|人际|社交|父母|同事|上司|领导|同学|闺蜜)/,
        /(朋友|家人|人际|社交|父母|同事|上司|领导|同学|闺蜜).{0,12}显化/,
        /manifest.{0,12}(friend|family|social|colleague|coworker|boss)/i,
        /(?:我的|和)?朋友|同事|上司|领导|主管|下属|同学|闺蜜|兄弟/,
      ],
    },
  ];

  const TAG_FALLBACK_ORDER = ["career", "relations", "love", "money"];

  function loadLocale() {
    try {
      const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (raw === "en" || raw === "zh") return raw;
    } catch {
      /* ignore */
    }
    return "zh";
  }

  let locale = loadLocale();

  function t(key) {
    return I18N[locale]?.[key] || I18N.zh[key] || key;
  }

  function tf(key, vars = {}) {
    return t(key).replace(/\{(\w+)\}/g, (_, name) =>
      vars[name] != null ? String(vars[name]) : ""
    );
  }

  function saveLocale(next) {
    locale = next === "en" ? "en" : "zh";
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    applyLocale();
  }

  function applyLocale() {
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    try { updateHomeGreeting(); } catch (_) {}
    try { renderDiaryPage(); } catch (_) {}

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && I18N.zh[key] != null) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key) el.setAttribute("aria-label", t(key));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key));
    });
    const zhBtn = document.getElementById("locale-zh");
    const enBtn = document.getElementById("locale-en");
    zhBtn?.classList.toggle("is-active", locale === "zh");
    enBtn?.classList.toggle("is-active", locale === "en");
    syncUserProfileFromTheme();
    const weekdays = document.querySelector(".cal-weekdays");
    if (weekdays) {
      const keys = [
        "weekdaySun",
        "weekdayMon",
        "weekdayTue",
        "weekdayWed",
        "weekdayThu",
        "weekdayFri",
        "weekdaySat",
      ];
      weekdays.querySelectorAll("span").forEach((span, i) => {
        if (keys[i]) span.textContent = t(keys[i]);
      });
    }
    const heat = document.querySelector(".cal-legend");
    if (heat) {
      const spans = heat.querySelectorAll("span");
      if (spans[0]) spans[0].textContent = t("heatLow");
      if (spans[1]) spans[1].textContent = t("heatHigh");
    }
    try {
      renderActiveBubble?.();
      renderRitualBar?.();
      renderFaq?.(true);
      renderResources?.();
      refreshStats?.();
      renderCalendar?.();
      renderDayList?.();
      setEditKind?.(editKind);
      if (els.pageHistory && !els.pageHistory.hidden) renderAffirmHistoryPage?.();
    } catch {
      /* render helpers may not exist yet on first paint */
    }
  }

  const PROFILE_FIELD_KEYS = [
    "goal",
    "oldStory",
    "effectiveAffirms",
    "crashPatterns",
    "boundaries",
    "notes",
  ];

  const DEFAULT_COACH_PROFILE = {
    goal: "",
    oldStory: "",
    effectiveAffirms: "",
    crashPatterns: "",
    boundaries: "",
    notes: "",
  };

  const DEFAULT_COACH_MEMORY = [];

  const DEFAULT_AFFIRMATION = "";

  const DEFAULT_ROBOTIC = "";

  const els = {
    screen: document.getElementById("screen"),
    onboardingGate: document.getElementById("onboarding-gate"),
    onboardingRegister: document.getElementById("onboarding-register"),
    onboardingLogin: document.getElementById("onboarding-login"),
    onboardingSkip: document.getElementById("onboarding-skip"),
    bigCount: document.getElementById("big-count"),
    todayCount: document.getElementById("today-count"),
    totalCount: document.getElementById("total-count"),
    statsTodayCount: document.getElementById("stats-today-count"),
    statsChart: document.getElementById("stats-chart"),
    statsTabWeek: document.getElementById("stats-tab-week"),
    statsTabMonth: document.getElementById("stats-tab-month"),
    statsPeriodLabel: document.getElementById("stats-period-label"),
    statsPrevPeriod: document.getElementById("stats-prev-period"),
    statsNextPeriod: document.getElementById("stats-next-period"),
    statsTodayCaption: document.getElementById("stats-today-caption"),
    statsDetailTitle: document.getElementById("stats-detail-title"),
    statsDetailSub: document.getElementById("stats-detail-sub"),
    statsDetailBody: document.getElementById("stats-detail-body"),
    calPanelFooter: document.querySelector(".cal-panel-footer"),
    pingu: document.getElementById("pingu"),
    pinguWrap: document.getElementById("pingu-wrap"),
    jumpFx: document.getElementById("jump-fx"),
    affirmPreview: document.getElementById("affirm-preview"),
    affirmInput: document.getElementById("affirm-input"),
    saveAffirm: document.getElementById("save-affirm"),
    discardAffirm: document.getElementById("discard-affirm"),
    editKindStory: document.getElementById("edit-kind-story"),
    editKindRobotic: document.getElementById("edit-kind-robotic"),
    calTitle: document.getElementById("cal-title"),
    calGrid: document.getElementById("cal-grid"),
    historyList: document.getElementById("history-list"),
    calendarView: document.getElementById("calendar-view"),
    listView: document.getElementById("list-view"),
    tabCalendar: document.getElementById("tab-calendar"),
    tabList: document.getElementById("tab-list"),
    prevMonth: document.getElementById("prev-month"),
    nextMonth: document.getElementById("next-month"),
    iconCalendar: document.getElementById("icon-calendar"),
    iconAffirm: document.getElementById("icon-affirm"),
    iconStats: document.getElementById("icon-stats"),
    iconChat: document.getElementById("icon-chat"),
    iconResources: document.getElementById("icon-resources"),
    iconFaq: document.getElementById("icon-faq"),
    iconSettings: document.getElementById("icon-settings"),
    iconRail: document.getElementById("icon-rail"),
    railToggle: document.getElementById("rail-toggle"),
    pageUserCenter: document.getElementById("page-user-center"),
    backFromUserCenter: document.getElementById("back-from-user-center"),
    gotoSettings: document.getElementById("goto-settings"),
    gotoAuth: document.getElementById("goto-auth"),
    gotoAuthFromSettings: document.getElementById("goto-auth-from-settings"),
    pageAuth: document.getElementById("page-auth"),
    backFromAuth: document.getElementById("back-from-auth"),
    authForm: document.getElementById("auth-form"),
    authLoggedIn: document.getElementById("auth-logged-in"),
    authAccountSummary: document.getElementById("auth-account-summary"),
    authEntitlementSummary: document.getElementById("auth-entitlement-summary"),
    authTabLogin: document.getElementById("auth-tab-login"),
    authTabRegister: document.getElementById("auth-tab-register"),
    authMethodEmail: document.getElementById("auth-method-email"),
    authMethodPhone: document.getElementById("auth-method-phone"),
    authEmailField: document.getElementById("auth-email-field"),
    authPhoneField: document.getElementById("auth-phone-field"),
    authEmail: document.getElementById("auth-email"),
    authPhone: document.getElementById("auth-phone"),
    authPassword: document.getElementById("auth-password"),
    authPasswordConfirm: document.getElementById("auth-password-confirm"),
    authPasswordConfirmField: document.getElementById("auth-password-confirm-field"),
    authSubmit: document.getElementById("auth-submit"),
    authFormTitle: document.getElementById("auth-form-title"),
    authSwitchMode: document.getElementById("auth-switch-mode"),
    authNameStep: document.getElementById("auth-name-step"),
    authDisplayName: document.getElementById("auth-display-name"),
    authNameContinue: document.getElementById("auth-name-continue"),
    authBindEmail: document.getElementById("auth-bind-email"),
    authBindPhone: document.getElementById("auth-bind-phone"),
    authBindSubmit: document.getElementById("auth-bind-submit"),
    authLogout: document.getElementById("auth-logout"),
    accountSettingsAvatar: document.getElementById("account-settings-avatar"),
    accountSettingsName: document.getElementById("account-settings-name"),
    accountVersion: document.getElementById("account-version"),
    authChangePassword: document.getElementById("auth-change-password"),
    accountPasswordPanel: document.getElementById("account-password-panel"),
    accountCurrentPassword: document.getElementById("account-current-password"),
    accountNewPassword: document.getElementById("account-new-password"),
    accountConfirmPassword: document.getElementById("account-confirm-password"),
    accountPasswordCancel: document.getElementById("account-password-cancel"),
    accountPasswordSave: document.getElementById("account-password-save"),
    authDownloadChat: document.getElementById("auth-download-chat"),
    authClearCache: document.getElementById("auth-clear-cache"),
    gotoFaq: document.getElementById("goto-faq"),
    userCenterName: document.getElementById("user-center-name"),
    userCenterAvatar: document.getElementById("user-center-avatar"),
    editUserProfile: document.getElementById("edit-user-profile"),
    userProfileSheet: document.getElementById("user-profile-sheet"),
    userProfileName: document.getElementById("user-profile-name"),
    userProfileAvatarPick: document.getElementById("user-profile-avatar-pick"),
    userProfileAvatarUpload: document.getElementById("user-profile-avatar-upload"),
    userProfileAvatarPreview: document.getElementById("user-profile-avatar-preview"),
    userProfileAvatarPreviewImg: document.getElementById("user-profile-avatar-preview-img"),
    userProfileAvatarPreviewLetter: document.getElementById("user-profile-avatar-preview-letter"),
    userCenterAvatarPhoto: document.getElementById("user-center-avatar-photo"),
    userCenterAvatarLetter: document.getElementById("user-center-avatar-letter"),
    iconSettingsPhoto: document.getElementById("icon-settings-photo"),
    iconSettingsLetter: document.getElementById("icon-settings-letter"),
    userProfileCancel: document.getElementById("user-profile-cancel"),
    userProfileSave: document.getElementById("user-profile-save"),
    pageAppearance: document.getElementById("page-appearance"),
    backFromAppearance: document.getElementById("back-from-appearance"),
    pageFaq: document.getElementById("page-faq"),
    backFromFaq: document.getElementById("back-from-faq"),
    homeBgUpload: document.getElementById("home-bg-upload"),
    homeBgPreview: document.getElementById("home-bg-preview"),
    chatBgUpload: document.getElementById("chat-bg-upload"),
    chatBgPreview: document.getElementById("chat-bg-preview"),
    pinguUpload: document.getElementById("pingu-upload"),
    pinguPreview: document.getElementById("pingu-preview"),
    pinguPresetGrid: document.getElementById("pingu-preset-grid"),
    localeZh: document.getElementById("locale-zh"),
    localeEn: document.getElementById("locale-en"),
    bgPhoto: document.querySelector(".bg-photo"),
    calendarDrawer: document.getElementById("calendar-drawer"),
    statsDrawer: document.getElementById("stats-drawer"),
    resourcesDrawer: document.getElementById("resources-drawer"),
    faqDrawer: document.getElementById("faq-drawer"),
    closeCalendar: document.getElementById("close-calendar"),
    closeStats: document.getElementById("close-stats"),
    closeResources: document.getElementById("close-resources"),
    closeFaq: document.getElementById("close-faq"),
    faqList: document.getElementById("faq-list"),
    resourceCards: document.getElementById("resource-cards"),
    resourceAddForm: document.getElementById("resource-add-form"),
    resourceUrlInput: document.getElementById("resource-url-input"),
    resourceTitleInput: document.getElementById("resource-title-input"),
    drawerBackdrop: document.getElementById("drawer-backdrop"),
    pageHistory: document.getElementById("page-affirm-history"),
    pageEdit: document.getElementById("page-affirm-edit"),
    pageChat: document.getElementById("page-chat"),
    pageProfile: document.getElementById("page-profile"),
    historyCurrent: document.getElementById("history-current"),
    historyRobotic: document.getElementById("history-robotic"),
    affirmHistoryList: document.getElementById("affirm-history-list"),
    historyTagBar: document.getElementById("history-tag-bar"),
    historyTagAddForm: document.getElementById("history-tag-add-form"),
    historyTagInput: document.getElementById("history-tag-input"),
    historyTagCancel: document.getElementById("history-tag-cancel"),
    ritualRoboticCopy: document.getElementById("ritual-robotic-copy"),
    ritualVisualCopy: document.getElementById("ritual-visual-copy"),
    ritualActiveDone: document.getElementById("ritual-active-done"),
    tabRobotic: document.getElementById("tab-robotic"),
    tabVisual: document.getElementById("tab-visual"),
    panelRobotic: document.getElementById("panel-robotic"),
    panelVisual: document.getElementById("panel-visual"),
    btnStartRobotic: document.getElementById("btn-start-robotic"),
    btnStartVisual: document.getElementById("btn-start-visual"),
    taskDock: document.getElementById("task-dock"),
    homeMusicHub: document.getElementById("home-music-hub"),
    ritualBar: document.getElementById("ritual-bar"),
    ritualCollapse: document.getElementById("ritual-collapse"),
    ritualExpand: document.getElementById("ritual-expand"),
    stage: document.getElementById("stage"),
    speechBubble: document.getElementById("speech-bubble"),
    ritualToast: document.getElementById("ritual-toast"),
    ritualSession: document.getElementById("ritual-session"),
    ritualSessionMode: document.getElementById("ritual-session-mode"),
    ritualSessionKicker: document.getElementById("ritual-session-kicker"),
    ritualSessionTimer: document.getElementById("ritual-session-timer"),
    ritualSessionBody: document.getElementById("ritual-session-body"),
    ritualRingProgress: document.getElementById("ritual-ring-progress"),
    ritualSessionCancel: document.getElementById("ritual-session-cancel"),
    ritualSessionFinish: document.getElementById("ritual-session-finish"),
    bubbleModeSwitch: document.getElementById("bubble-mode-switch"),
    bubbleModeLabel: document.getElementById("bubble-mode-label"),
    gotoEdit: document.getElementById("goto-edit"),
    backFromHistory: document.getElementById("back-from-history"),
    backFromEdit: document.getElementById("back-from-edit"),
    backFromChat: document.getElementById("back-from-chat"),
    backFromProfile: document.getElementById("back-from-profile"),
    gotoProfile: document.getElementById("goto-profile"),
    profileSavedFlag: document.getElementById("profile-saved-flag"),
    profileGoal: document.getElementById("profile-goal"),
    profileOldStory: document.getElementById("profile-old-story"),
    profileEffective: document.getElementById("profile-effective"),
    profileCrash: document.getElementById("profile-crash"),
    profileBoundaries: document.getElementById("profile-boundaries"),
    profileNotes: document.getElementById("profile-notes"),
    chatSettings: document.getElementById("chat-settings"),
    openaiKey: document.getElementById("openai-key"),
    cloudApiBase: document.getElementById("cloud-api-base"),
    cloudRedeemCode: document.getElementById("cloud-redeem-code"),
    cloudRedeem: document.getElementById("cloud-redeem"),
    cloudStatus: document.getElementById("cloud-status"),
    openaiModel: document.getElementById("openai-model"),
    autoAnalyze: document.getElementById("auto-analyze"),
    btnAnalyze: document.getElementById("btn-analyze"),
    btnDailyCheck: document.getElementById("btn-daily-check"),
    btnShowMemory: document.getElementById("btn-show-memory"),
    chatMessages: document.getElementById("chat-messages"),
    chatJumpBottom: document.getElementById("chat-jump-bottom"),
    chatForm: document.getElementById("chat-form"),
    chatInput: document.getElementById("chat-input"),
    iconHome: document.getElementById("icon-home"),
    iconDiary: document.getElementById("icon-diary"),
    iconFavorites: document.getElementById("icon-favorites"),
    favoritesDrawer: document.getElementById("favorites-drawer"),
    pageFavorites: document.getElementById("page-favorites"),
    closeFavorites: document.getElementById("close-favorites"),
    historyStoryTag: document.getElementById("history-story-tag"),
    historyRoboticTag: document.getElementById("history-robotic-tag"),
    historyStoryMeta: document.getElementById("history-story-meta"),
    historyRoboticMeta: document.getElementById("history-robotic-meta"),
    editTagBar: document.getElementById("edit-tag-bar"),
    favTabVideos: document.getElementById("fav-tab-videos"),
    favTabFaq: document.getElementById("fav-tab-faq"),
    favPanelVideos: document.getElementById("fav-panel-videos"),
    favPanelFaq: document.getElementById("fav-panel-faq"),
    dailyTasksPill: document.getElementById("daily-tasks-pill"),
    topBar: document.getElementById("top-bar"),
    homeGreetingLine: document.getElementById("home-greeting-line"),
    pageDiary: document.getElementById("page-diary"),
    diaryList: document.getElementById("diary-list"),
    diaryAdd: document.getElementById("diary-add"),
    diarySheet: document.getElementById("diary-sheet"),
    diaryInput: document.getElementById("diary-input"),
    diarySave: document.getElementById("diary-save"),
    diaryCancel: document.getElementById("diary-cancel"),
    diarySheetTitle: document.getElementById("diary-sheet-title"),
    taskIdle: document.getElementById("task-idle"),
    taskSummary: document.getElementById("task-summary"),
    taskFinished: document.getElementById("task-finished"),
    taskFinishedText: document.getElementById("task-finished-text"),
    taskFinishedOk: document.getElementById("task-finished-ok"),
    taskProgressFill: document.getElementById("task-progress-fill"),
    taskIdleTimer: document.getElementById("task-idle-timer"),
    ritualSessionTitle: document.getElementById("ritual-session-title"),
    ritualTapHint: document.getElementById("ritual-tap-hint"),
    taskSummaryTitle: document.getElementById("task-summary-title"),
    taskSummaryTimer: document.getElementById("task-summary-timer"),
    taskStepper: document.getElementById("task-stepper"),
    summaryMinus: document.getElementById("summary-minus"),
    summaryPlus: document.getElementById("summary-plus"),
    summaryCount: document.getElementById("summary-count"),
    summaryConfirm: document.getElementById("summary-confirm"),
    tabStatsInline: document.getElementById("tab-stats-inline"),
    statsInlineView: document.getElementById("stats-inline-view"),
    chatSend: document.getElementById("chat-send"),
    homeMusicBtn: document.getElementById("home-music-btn"),
    musicControlBar: document.getElementById("music-control-bar"),
    homeMusicDot: document.getElementById("home-music-dot"),
    musicDial: document.getElementById("music-dial"),
    musicDialBackdrop: document.getElementById("music-dial-backdrop"),
    musicProviderSheet: document.getElementById("music-provider-sheet"),
    musicProviderTitle: document.getElementById("music-provider-sheet-title"),
    musicProviderLead: document.getElementById("music-provider-sheet-lead"),
    musicProviderBody: document.getElementById("music-provider-body"),
    musicProviderCancel: document.getElementById("music-provider-cancel"),
    musicProviderSave: document.getElementById("music-provider-save"),
    musicTransport: document.getElementById("music-transport"),
    musicTransportPlay: document.getElementById("music-transport-play"),
    musicTransportPlayIcon: document.getElementById("music-transport-play-icon"),
    musicTransportPrev: document.getElementById("music-transport-prev"),
    musicTransportNext: document.getElementById("music-transport-next"),
  };

  let viewDate = new Date();
  let jumping = false;
  let editDraftSource = "";
  let editKind = "story";
  let profileDraft = null;
  /** @type {"userCenter" | "chat" | "home"} */
  let profileReturnTo = "userCenter";
  /** @type {"userCenter" | "settings" | "onboarding"} */
  let authReturnTo = "userCenter";
  let authUiMode = "login";
  let authUiMethod = "email";
  /** @type {null | "calendar" | "stats" | "resources" | "faq" | "favorites"} */
  let openDrawer = null;
  let ritualCardState = "collapsed";
  let summaryDraftCount = 0;
  let diaryDraftId = null;
  let diaryDraftStyle = "plain";
  let diaryEntries = [];
  let activeNav = "home";
  /** @type {null | {
   *   nav: string,
   *   drawer: null | string,
   *   diary: boolean,
   *   history: boolean,
   *   edit: boolean,
   *   appearance: boolean,
   *   profile: boolean,
   *   pageOpen: boolean,
   *   favTab: "videos" | "faq",
   *   calTab: "calendar" | "list" | "stats"
   * }} */
  let chatReturnState = null;
  /** @type {"week" | "month"} */
  let statsRange = "week";
  let statsAnchorDate = new Date();
  let statsDetailIndex = -1;
  let lastAffirmAt = 0;
  let timeDirty = false;
  let chatBusy = false;
  let coachManual = "";
  /** @type {null | { kind: "robotic" | "visual", remaining: number, total: number, sessionCount: number, timerId: number }} */
  let ritualRun = null;
  const RITUAL_RING_LEN = 2 * Math.PI * 52;
  let ritualToastTimer = 0;
  let ritualTab = "robotic";

  function todayKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function uid() {
    return `a_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function emptyDailyPlan(date = todayKey()) {
    return {
      date,
      goals: "",
      visualScript: "",
      roboticDone: false,
      visualDone: false,
    };
  }

  function normalizeRitualDays(raw) {
    if (!raw || typeof raw !== "object") return {};
    const out = {};
    for (const [key, value] of Object.entries(raw)) {
      if (!value || typeof value !== "object") continue;
      out[key] = {
        robotic: Boolean(value.robotic),
        visual: Boolean(value.visual),
      };
    }
    return out;
  }

  function normalizeDailyPlan(raw) {
    const base = emptyDailyPlan();
    if (!raw || typeof raw !== "object") return base;
    return {
      date: typeof raw.date === "string" && raw.date ? raw.date : base.date,
      goals: typeof raw.goals === "string" ? raw.goals : "",
      visualScript: typeof raw.visualScript === "string" ? raw.visualScript : "",
      roboticDone: Boolean(raw.roboticDone),
      visualDone: Boolean(raw.visualDone),
    };
  }

  function normalize(data) {
    const affirmation =
      typeof data.affirmation === "string" && data.affirmation.trim()
        ? data.affirmation
        : DEFAULT_AFFIRMATION;
    const roboticAffirmation =
      typeof data.roboticAffirmation === "string" && data.roboticAffirmation.trim()
        ? data.roboticAffirmation
        : DEFAULT_ROBOTIC;
    const bubbleMode = data.bubbleMode === "robotic" ? "robotic" : "story";
    const customTags = normalizeCustomTags(data.customTags);
    let history = Array.isArray(data.affirmHistory) ? data.affirmHistory : [];
    history = history
      .filter((item) => item && typeof item.text === "string" && item.text.trim())
      .map((item) => {
        const text = item.text;
        const existing = normalizeItemTags(item.tags, customTags);
        const hadGeneral = (item.tags || []).some(
          (id) => String(id).toLowerCase() === "general"
        );
        let tags = existing.filter((id) => String(id).toLowerCase() !== "general");
        if (!tags.length || hadGeneral) tags = assignTagsForText(text, customTags);
        return {
          id: item.id || uid(),
          text,
          savedAt: item.savedAt || new Date().toISOString(),
          tags,
        };
      });
    const timeDays =
      data.timeDays && typeof data.timeDays === "object" ? data.timeDays : {};
    const cleanedTime = {};
    for (const [key, value] of Object.entries(timeDays)) {
      const n = Number(value);
      if (n > 0) cleanedTime[key] = Math.floor(n);
    }
    const dailyPlan = normalizeDailyPlan(data.dailyPlan);
    const ritualDays = normalizeRitualDays(data.ritualDays);
    if (dailyPlan.date && (dailyPlan.roboticDone || dailyPlan.visualDone)) {
      const prev = ritualDays[dailyPlan.date] || { robotic: false, visual: false };
      ritualDays[dailyPlan.date] = {
        robotic: prev.robotic || dailyPlan.roboticDone,
        visual: prev.visual || dailyPlan.visualDone,
      };
    }
    return {
      days: data.days && typeof data.days === "object" ? data.days : {},
      timeDays: cleanedTime,
      ritualDays,
      affirmation,
      roboticAffirmation,
      bubbleMode,
      dailyPlan,
      affirmHistory: history,
      customTags,
    };
  }

  function normalizeCustomTags(raw) {
    if (!Array.isArray(raw)) return [];
    const builtinIds = new Set(BUILTIN_TAGS.map((tag) => tag.id));
    const seen = new Set();
    const out = [];
    for (const item of raw) {
      const label = String(item || "")
        .trim()
        .slice(0, 16);
      if (!label) continue;
      const key = label.toLowerCase();
      if (seen.has(key) || builtinIds.has(key)) continue;
      seen.add(key);
      out.push(label);
    }
    return out.slice(0, 24);
  }

  function normalizeItemTags(raw, customTags = []) {
    if (!Array.isArray(raw)) return [];
    const customMap = new Map(customTags.map((c) => [c.toLowerCase(), c]));
    const out = [];
    for (const tag of raw) {
      const value = String(tag || "").trim();
      if (!value) continue;
      if (BUILTIN_TAGS.some((t) => t.id === value)) {
        if (!out.includes(value)) out.push(value);
        continue;
      }
      const custom = customMap.get(value.toLowerCase());
      if (custom && !out.includes(custom)) out.push(custom);
    }
    return out.slice(0, 8);
  }

  function scoreBuiltinTag(text, tag) {
    const raw = String(text || "");
    const hay = raw.toLowerCase();
    let score = 0;
    for (const kw of tag.keywords || []) {
      const needle = String(kw).toLowerCase();
      if (!needle || !hay.includes(needle)) continue;
      score += Math.max(needle.length, 2);
    }
    for (const pattern of tag.patterns || []) {
      if (pattern.test(raw)) score += 14;
    }
    if (tag.id === "money") {
      if (/大平层|平层|别墅|公寓|豪宅|房产|买房|购房|置业|江景房|学区房/.test(raw)) {
        score += 20;
      }
      if (/[\d,.]+万|[\$￥¥]\s*[\d,.]+/.test(raw)) score += 22;
      if (
        /(给我|为我).{0,12}(花|买|送|转账|礼物)/.test(raw) &&
        /(他|她|男友|女友|伴侣|老公|老婆|对象|恋爱|爱情|感情)/.test(raw)
      ) {
        score -= 18;
      }
    }
    if (tag.id === "love") {
      if (/分手|和好|复合|重新在一起|前任|现任/.test(raw)) score += 20;
      if (/对我好|疼我|宠我|体贴|温柔|爱我|喜欢我/.test(raw)) score += 16;
      if (
        /(给我|为我).{0,12}(花|买|送|转账|礼物)/.test(raw) &&
        /(他|她|男友|女友|伴侣|老公|老婆|对象|恋爱|爱情|感情|对方)/.test(raw)
      ) {
        score += 18;
      }
    }
    if (tag.id === "relations") {
      if (/朋友|同事|上司|领导|主管|同学|闺蜜|兄弟|邻居/.test(raw)) score += 12;
    }
    if (tag.id === "career") {
      if (/升职|加薪|涨薪|晋升|offer|面试|上岸|跳槽|职级|年终奖/.test(raw)) score += 14;
      if (/上司|领导|老板|主管/.test(raw) && !/升职|加薪|涨薪|晋升|offer|面试|上岸|跳槽/.test(raw)) {
        score -= 10;
      }
    }
    return score;
  }

  function applyAffirmTagComboRules(raw, builtinIds) {
    const ids = new Set(builtinIds);
    const hasSocial =
      /朋友|闺蜜|兄弟|同学|同事|上司|领导|主管|下属|人际|社交|邻居|家人|父母|妈妈|爸爸/.test(raw);
    const hasCareerAdvance =
      /升职|加薪|涨薪|晋升|offer|面试|上岸|跳槽|职级|年终奖|考核|述职|事业|工作|职场|创业/.test(raw);
    const hasRomance =
      /恋爱|爱情|感情|男友|女友|老公|老婆|对象|伴侣|分手|复合|和好|结婚|婚姻|暧昧|表白|前任|现任/.test(
        raw
      ) ||
      /(他|她|对方).{0,20}(爱|喜欢|好|宠|疼)/.test(raw) ||
      /(给我|为我).{0,12}(花|买|送)/.test(raw) &&
        /(他|她|男友|女友|伴侣|老公|老婆|对象|恋爱|爱情)/.test(raw);

    if (hasSocial) ids.add("relations");
    if (hasCareerAdvance) ids.add("career");
    if (hasRomance) ids.add("love");
    if (hasSocial && hasCareerAdvance) {
      ids.add("relations");
      ids.add("career");
    }
    return [...ids];
  }

  function pickFallbackBuiltinTag(text) {
    const raw = String(text || "").trim();
    const hay = raw.toLowerCase();
    if (/大平层|平层|别墅|公寓|豪宅|房产|买房|购房|[\d,.]+万|[\$￥¥][\d,.]+/.test(raw)) {
      return "money";
    }
    if (/^(我是|i am|i'm|im |我已|我已经|我拥有)/i.test(raw)) return "career";
    if (/朋友|同事|上司|领导|同学|闺蜜|人际/.test(raw)) return "relations";
    if (/分手|复合|和好|恋爱|爱情|男友|女友|对象|伴侣/.test(raw)) return "love";
    if (/感谢|grateful|thank/i.test(hay)) return "relations";
    if (/拥有|已经|丰盛|abundant|gratitude/i.test(hay)) return "money";
    if (/喜欢|love|you/i.test(hay) && /他|她|对方|男友|女友/.test(raw)) return "love";
    for (const id of TAG_FALLBACK_ORDER) {
      if (scoreBuiltinTag(raw, BUILTIN_TAGS.find((t) => t.id === id) || {}) > 0) return id;
    }
    return "career";
  }

  function classifyAffirmTags(text, customTags = []) {
    const raw = String(text || "").trim();
    if (!raw) return [pickFallbackBuiltinTag("")];

    const customFound = [];
    for (const custom of customTags || []) {
      const label = String(custom || "").trim();
      if (!label) continue;
      if (raw.toLowerCase().includes(label.toLowerCase())) customFound.push(label);
    }

    const ranked = BUILTIN_TAGS.map((tag) => ({
      id: tag.id,
      score: scoreBuiltinTag(raw, tag),
    }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score);

    const builtin = [];
    if (ranked.length) {
      const top = ranked[0].score;
      const threshold = Math.max(3, top * 0.55);
      for (const row of ranked) {
        if (row.score >= threshold) builtin.push(row.id);
      }
    } else {
      builtin.push(pickFallbackBuiltinTag(raw));
    }

    const comboBuiltin = applyAffirmTagComboRules(raw, builtin);

    const merged = [...customFound];
    for (const id of comboBuiltin) {
      if (!merged.some((t) => String(t).toLowerCase() === id)) merged.push(id);
    }
    return merged.slice(0, 6);
  }

  /** Always returns at least one tag id (built-in or custom). */
  function assignTagsForText(text, customTags = []) {
    const tags = classifyAffirmTags(text, customTags);
    return tags.length ? tags : [pickFallbackBuiltinTag(text)];
  }

  function tagLabel(tagId) {
    const builtin = BUILTIN_TAGS.find((t) => t.id === tagId);
    if (builtin) return t(builtin.labelKey);
    return String(tagId || "");
  }

  function allTagOptions(customTags = state.customTags || []) {
    return [
      ...BUILTIN_TAGS.map((tag) => ({
        id: tag.id,
        label: t(tag.labelKey),
        icon: tag.icon,
        tone: tag.tone,
        builtin: true,
      })),
      ...customTags.map((label) => ({
        id: label,
        label,
        icon: "fa-tag",
        tone: "custom",
        builtin: false,
      })),
    ];
  }

  function buildTagChip({ id, label, icon, tone, active = false, isAdd = false }) {
    const btn = document.createElement("button");
    btn.type = "button";
    const toneClass = isAdd ? "tone-add" : `tone-${tone || "custom"}`;
    btn.className = `history-tag-chip ${toneClass}${active ? " is-active" : ""}${isAdd ? " is-add" : ""}`;
    btn.dataset.tag = id;
    const text = document.createElement("span");
    text.textContent = label;
    if (id !== "all" && icon) {
      const iconEl = document.createElement("i");
      iconEl.className = `fa-solid ${icon}`;
      iconEl.setAttribute("aria-hidden", "true");
      btn.appendChild(iconEl);
    }
    btn.appendChild(text);
    return btn;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normalize(JSON.parse(raw));

      for (const key of LEGACY_KEYS) {
        const legacy = localStorage.getItem(key);
        if (!legacy) continue;
        const old = JSON.parse(legacy);
        const next = normalize(old);
        if (!next.affirmHistory.length && next.affirmation) {
          next.affirmHistory = [
            {
              id: uid(),
              text: next.affirmation,
              savedAt: new Date().toISOString(),
              tags: assignTagsForText(next.affirmation, next.customTags),
            },
          ];
        }
        return next;
      }

      return normalize({ affirmation: DEFAULT_AFFIRMATION, days: {}, affirmHistory: [] });
    } catch {
      return normalize({ affirmation: DEFAULT_AFFIRMATION, days: {}, affirmHistory: [] });
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    syncNativeToday(data);
  }

  function syncNativeToday(data) {
    try {
      if (!window.AffirmNative || typeof window.AffirmNative.syncToday !== "function") return;
      const day = todayKey();
      const count = Number(data?.days?.[day]) || 0;
      window.AffirmNative.syncToday(day, count);
    } catch {
      /* ignore */
    }
  }

  function pullNativeCountIntoState() {
    try {
      if (!window.AffirmNative || typeof window.AffirmNative.getToday !== "function") return;
      const raw = window.AffirmNative.getToday();
      if (!raw) return;
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      const day = String(parsed.day || todayKey());
      const count = Number(parsed.count) || 0;
      const local = Number(state.days[day]) || 0;
      if (count > local) {
        state.days[day] = count;
        save(state);
        refreshCounts();
      } else if (count < local) {
        syncNativeToday(state);
      }
    } catch {
      /* ignore */
    }
  }

  let state = load();
  if (!Array.isArray(state.customTags)) state.customTags = [];
  if (!state.affirmHistory.length && state.affirmation) {
    state.affirmHistory = [
      {
        id: uid(),
        text: state.affirmation,
        savedAt: new Date().toISOString(),
        tags: assignTagsForText(state.affirmation, state.customTags),
      },
    ];
  }
  save(state);
  window.setTimeout(() => pullNativeCountIntoState(), 400);

  function ensureDailyPlanDay({ persist = true } = {}) {
    const today = todayKey();
    const prev = state.dailyPlan || emptyDailyPlan(today);
    if (prev.date === today) {
      state.dailyPlan = normalizeDailyPlan(prev);
      return false;
    }
    if (!state.ritualDays || typeof state.ritualDays !== "object") state.ritualDays = {};
    if (prev.date && (prev.roboticDone || prev.visualDone)) {
      const saved = state.ritualDays[prev.date] || { robotic: false, visual: false };
      state.ritualDays[prev.date] = {
        robotic: saved.robotic || Boolean(prev.roboticDone),
        visual: saved.visual || Boolean(prev.visualDone),
      };
    }
    state.dailyPlan = {
      date: today,
      goals: prev.goals || "",
      visualScript: prev.visualScript || "",
      roboticDone: false,
      visualDone: false,
    };
    if (persist) save(state);
    return true;
  }

  ensureDailyPlanDay();

  function emptyCoachProfile() {
    return {
      goal: "",
      oldStory: "",
      effectiveAffirms: "",
      crashPatterns: "",
      boundaries: "",
      notes: "",
    };
  }

  function normalizeCoachProfile(raw, memoryFallback = []) {
    const base = { ...DEFAULT_COACH_PROFILE };
    if (raw && typeof raw === "object") {
      for (const key of PROFILE_FIELD_KEYS) {
        if (typeof raw[key] === "string") base[key] = raw[key];
      }
    } else if (Array.isArray(memoryFallback) && memoryFallback.length) {
      const joined = memoryFallback.filter(Boolean).join("\n");
      if (!base.notes.trim()) base.notes = joined;
      else if (!base.notes.includes(memoryFallback[0])) {
        base.notes = `${base.notes}\n${joined}`.trim();
      }
    }
    return base;
  }

  function formatCoachProfile(profile) {
    const p = profile || emptyCoachProfile();
    const empty = t("emptyValue");
    return [
      tf("profileGoalLine", { text: p.goal || empty }),
      tf("profileOldStoryLine", { text: p.oldStory || empty }),
      tf("profileEffectiveLine", { text: p.effectiveAffirms || empty }),
      tf("profileCrashLine", { text: p.crashPatterns || empty }),
      tf("profileBoundariesLine", { text: p.boundaries || empty }),
      tf("profileNotesLine", { text: p.notes || empty }),
    ].join("\n\n");
  }

  function loadAi() {
    try {
      const raw = localStorage.getItem(AI_STORAGE_KEY);
      if (!raw) {
        return {
          apiKey: "",
          model: "gpt-5.6-luna",
          autoAnalyze: true,
          lastAutoAnalyzeDate: "",
          messages: [],
          coachMemory: [...DEFAULT_COACH_MEMORY],
          coachProfile: { ...DEFAULT_COACH_PROFILE },
          cloudToken: "",
          cloudEmail: "",
          cloudApiBase: DEFAULT_CLOUD_API,
          cloudCanChat: false,
          cloudCredits: 0,
          cloudPlanExpiresAt: "",
          cloudPhone: "",
          cloudPhoneMasked: "",
          cloudHasEmail: false,
          cloudHasPhone: false,
        };
      }
      const data = JSON.parse(raw);
      const memory = Array.isArray(data.coachMemory)
        ? data.coachMemory
            .filter((item) => typeof item === "string" && item.trim())
            .map((item) => item.trim())
        : [...DEFAULT_COACH_MEMORY];
      return {
        apiKey: typeof data.apiKey === "string" ? data.apiKey : "",
        model: typeof data.model === "string" && data.model ? data.model : "gpt-5.6-luna",
        autoAnalyze: data.autoAnalyze !== false,
        lastAutoAnalyzeDate:
          typeof data.lastAutoAnalyzeDate === "string" ? data.lastAutoAnalyzeDate : "",
        messages: Array.isArray(data.messages)
          ? data.messages
              .filter(
                (m) =>
                  m &&
                  (m.role === "user" || m.role === "assistant") &&
                  typeof m.content === "string"
              )
              .slice(-MAX_CHAT_MESSAGES)
          : [],
        coachMemory: memory.length ? memory.slice(-80) : [...DEFAULT_COACH_MEMORY],
        coachProfile: normalizeCoachProfile(data.coachProfile, memory),
        cloudToken: typeof data.cloudToken === "string" ? data.cloudToken : "",
        cloudEmail: typeof data.cloudEmail === "string" ? data.cloudEmail : "",
        cloudApiBase:
          typeof data.cloudApiBase === "string" && data.cloudApiBase.trim()
            ? data.cloudApiBase.trim()
            : DEFAULT_CLOUD_API,
        cloudCanChat: Boolean(data.cloudCanChat),
        cloudCredits: Number(data.cloudCredits) || 0,
        cloudPlanExpiresAt:
          typeof data.cloudPlanExpiresAt === "string" ? data.cloudPlanExpiresAt : "",
        cloudPhone: typeof data.cloudPhone === "string" ? data.cloudPhone : "",
        cloudPhoneMasked:
          typeof data.cloudPhoneMasked === "string" ? data.cloudPhoneMasked : "",
        cloudHasEmail: Boolean(data.cloudHasEmail),
        cloudHasPhone: Boolean(data.cloudHasPhone),
      };
    } catch {
      return {
        apiKey: "",
        model: "gpt-5.6-luna",
        autoAnalyze: true,
        lastAutoAnalyzeDate: "",
        messages: [],
        coachMemory: [...DEFAULT_COACH_MEMORY],
        coachProfile: { ...DEFAULT_COACH_PROFILE },
        cloudToken: "",
        cloudEmail: "",
        cloudApiBase: DEFAULT_CLOUD_API,
        cloudCanChat: false,
        cloudCredits: 0,
        cloudPlanExpiresAt: "",
        cloudPhone: "",
        cloudPhoneMasked: "",
        cloudHasEmail: false,
        cloudHasPhone: false,
      };
    }
  }

  function saveAi() {
    localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(ai));
  }

  let ai = loadAi();
  if (!Array.isArray(ai.coachMemory) || !ai.coachMemory.length) {
    ai.coachMemory = [...DEFAULT_COACH_MEMORY];
  }
  if (!ai.coachProfile || typeof ai.coachProfile !== "object") {
    ai.coachProfile = normalizeCoachProfile(null, ai.coachMemory);
  }
  saveAi();

  function defaultTheme() {
    return {
      homeMode: "image",
      homePreset: DEFAULT_HOME_BG,
      homeColor: DEFAULT_HOME_COLOR,
      homeCustom: "",
      chatMode: "image",
      chatPreset: DEFAULT_CHAT_BG,
      chatColor: DEFAULT_CHAT_COLOR,
      chatCustom: "",
      pinguPreset: DEFAULT_PINGU,
      pinguCustom: "",
      displayName: "",
      avatarLetter: "",
      avatarCustom: "",
      music: defaultMusicSettings(),
    };
  }

  function defaultMusicSettings() {
    return {
      provider: "",
      spotifyClientId: "",
      spotifyPlaylistUri: "",
      spotifyPlaylistUrl: "",
      applePlaylistUrl: "",
      neteasePlaylistUrl: "",
      neteasePlaylistId: "",
      neteaseSongId: "",
      neteaseSharePaste: "",
      qqPlaylistUrl: "",
      qqPlaylistId: "",
      qqSongMid: "",
      qqSharePaste: "",
      neteaseLinkMode: "companion",
      qqLinkMode: "companion",
      neteaseSongIds: "",
      qqSongMids: "",
    };
  }

  const MUSIC_LINK_MODES = new Set(["share", "manual", "multitrack", "handoff", "companion"]);
  const MUSIC_PROVIDERS = new Set(["spotify", "apple", "netease", "qq"]);

  function normalizeMusicSettings(raw) {
    const base = defaultMusicSettings();
    if (!raw || typeof raw !== "object") return base;
    const provider = MUSIC_PROVIDERS.has(raw.provider) ? raw.provider : base.provider;
    return {
      provider,
      spotifyClientId:
        typeof raw.spotifyClientId === "string" ? raw.spotifyClientId.trim().slice(0, 64) : "",
      spotifyPlaylistUri:
        typeof raw.spotifyPlaylistUri === "string" ? raw.spotifyPlaylistUri.trim().slice(0, 120) : "",
      spotifyPlaylistUrl:
        typeof raw.spotifyPlaylistUrl === "string" ? raw.spotifyPlaylistUrl.trim().slice(0, 512) : "",
      applePlaylistUrl:
        typeof raw.applePlaylistUrl === "string" ? raw.applePlaylistUrl.trim().slice(0, 512) : "",
      neteasePlaylistUrl:
        typeof raw.neteasePlaylistUrl === "string" ? raw.neteasePlaylistUrl.trim().slice(0, 512) : "",
      neteasePlaylistId:
        typeof raw.neteasePlaylistId === "string" ? raw.neteasePlaylistId.replace(/\D/g, "").slice(0, 16) : "",
      neteaseSongId:
        typeof raw.neteaseSongId === "string" ? raw.neteaseSongId.replace(/\D/g, "").slice(0, 16) : "",
      neteaseSharePaste:
        typeof raw.neteaseSharePaste === "string" ? raw.neteaseSharePaste.trim().slice(0, 2000) : "",
      qqPlaylistUrl: typeof raw.qqPlaylistUrl === "string" ? raw.qqPlaylistUrl.trim().slice(0, 512) : "",
      qqPlaylistId:
        typeof raw.qqPlaylistId === "string" ? raw.qqPlaylistId.replace(/\D/g, "").slice(0, 16) : "",
      qqSongMid:
        typeof raw.qqSongMid === "string" ? raw.qqSongMid.trim().slice(0, 32) : "",
      qqSharePaste: typeof raw.qqSharePaste === "string" ? raw.qqSharePaste.trim().slice(0, 2000) : "",
      neteaseLinkMode: "companion",
      qqLinkMode: "companion",
      neteaseSongIds: typeof raw.neteaseSongIds === "string" ? raw.neteaseSongIds.trim().slice(0, 800) : "",
      qqSongMids: typeof raw.qqSongMids === "string" ? raw.qqSongMids.trim().slice(0, 800) : "",
    };
  }

  function normalizeHomeMode(raw) {
    if (!raw || typeof raw !== "object") return "gradient";
    // Color picker removed — migrate old color mode to gradient
    if (raw.homeMode === "color") return "gradient";
    if (raw.homeMode === "gradient") return "gradient";
    if (raw.homeMode === "image") {
      const hasCustom =
        raw.homePreset === "__custom__" && typeof raw.homeCustom === "string" && raw.homeCustom;
      const preset = typeof raw.homePreset === "string" ? raw.homePreset : "";
      if (!hasCustom && !preset) return "image";
      return "image";
    }
    return "gradient";
  }

  function normalizeTheme(raw) {
    const base = defaultTheme();
    if (!raw || typeof raw !== "object") return base;
    const homeMode = normalizeHomeMode(raw);
    const hasChatCustom =
      raw.chatPreset === "__custom__" && typeof raw.chatCustom === "string" && raw.chatCustom;
    const chatPreset =
      typeof raw.chatPreset === "string" && raw.chatPreset ? raw.chatPreset : base.chatPreset;
    return {
      homeMode,
      homePreset:
        homeMode === "gradient"
          ? ""
          : typeof raw.homePreset === "string" && raw.homePreset
            ? raw.homePreset
            : base.homePreset,
      homeColor: base.homeColor,
      homeCustom: typeof raw.homeCustom === "string" ? raw.homeCustom : "",
      // Color picker removed — always image (preset or custom)
      chatMode: "image",
      chatPreset: hasChatCustom || chatPreset ? chatPreset : base.chatPreset,
      chatColor: base.chatColor,
      chatCustom: typeof raw.chatCustom === "string" ? raw.chatCustom : "",
      pinguPreset:
        raw.pinguPreset === "__custom__"
          ? "__custom__"
          : raw.pinguPreset === LEGACY_PINGU ||
              raw.pinguPreset === LEGACY_NUNU_PNG ||
              raw.pinguPreset === "assets/crystal-ball-pink-glow.gif"
            ? DEFAULT_PINGU
            : typeof raw.pinguPreset === "string" && PINGU_PRESET_SRCS.has(raw.pinguPreset)
              ? raw.pinguPreset
              : base.pinguPreset,
      pinguCustom: typeof raw.pinguCustom === "string" ? raw.pinguCustom : "",
      displayName: typeof raw.displayName === "string" ? raw.displayName.slice(0, 24) : "",
      avatarLetter: typeof raw.avatarLetter === "string" ? raw.avatarLetter.slice(0, 1) : "",
      avatarCustom: typeof raw.avatarCustom === "string" ? raw.avatarCustom : "",
      music: normalizeMusicSettings(raw.music),
    };
  }

  function loadTheme() {
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      return normalizeTheme(raw ? JSON.parse(raw) : null);
    } catch {
      return defaultTheme();
    }
  }

  function saveTheme(data) {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(data));
  }

  let theme = loadTheme();
  let appearanceDraft = { ...theme };
  // V2: migrate night-sky default to pastel sky photo once
  try {
    if (
      theme.homeMode === "gradient" ||
      theme.homePreset === "assets/home-bg.jpeg" ||
      theme.homeColor === "#1A2348"
    ) {
      const rawTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const parsed = rawTheme ? JSON.parse(rawTheme) : null;
      const userCustomHome =
        parsed &&
        ((parsed.homePreset === "__custom__" && parsed.homeCustom) ||
          (parsed.homeMode === "image" &&
            parsed.homePreset &&
            parsed.homePreset !== "assets/home-bg.jpeg" &&
            parsed.homePreset !== DEFAULT_HOME_BG));
      if (!userCustomHome) {
        theme.homeMode = "image";
        theme.homePreset = DEFAULT_HOME_BG;
        theme.homeColor = DEFAULT_HOME_COLOR;
      }
    }
    if (
      !theme.pinguCustom &&
      (theme.pinguPreset === "assets/pingu-wave-blink.gif" ||
        theme.pinguPreset === LEGACY_PINGU ||
        theme.pinguPreset === LEGACY_NUNU_PNG ||
        !theme.pinguPreset)
    ) {
      theme.pinguPreset = DEFAULT_PINGU;
      try {
        localStorage.setItem("affirm-pingu-v2-buddy", "gif");
      } catch {
        /* ignore */
      }
    }
    saveTheme(theme);
  } catch (_) {}


  function resolveThemeImage(which, data = theme) {
    if (which === "pingu") {
      if (data.pinguPreset === "__custom__" && data.pinguCustom) return data.pinguCustom;
      if (data.pinguPreset && data.pinguPreset !== "__custom__") return data.pinguPreset;
      return DEFAULT_PINGU;
    }
    const preset = which === "home" ? data.homePreset : data.chatPreset;
    const custom = which === "home" ? data.homeCustom : data.chatCustom;
    if (preset === "__custom__" && custom) return custom;
    if (preset && preset !== "__custom__") return preset;
    return which === "home" ? DEFAULT_HOME_BG : DEFAULT_CHAT_BG;
  }

  function cssUrl(value) {
    const v = String(value || "");
    if (!v) return "none";
    if (v.startsWith("data:") || v.startsWith("blob:")) return `url("${v}")`;
    return `url("${v.replace(/"/g, '\\"')}")`;
  }

  function applyTheme(data = theme) {
    const root = document.documentElement;
    root.style.setProperty("--home-bg-color", DEFAULT_HOME_COLOR);
    root.style.setProperty("--chat-bg-color", DEFAULT_CHAT_COLOR);

    els.bgPhoto?.classList.remove("bg-mode-color", "bg-mode-gradient");
    if (data.homeMode === "gradient") {
      root.style.setProperty("--home-bg-image", "none");
      els.bgPhoto?.classList.add("bg-mode-gradient");
    } else {
      root.style.setProperty("--home-bg-image", cssUrl(resolveThemeImage("home", data)));
    }

    root.style.setProperty("--chat-bg-image", cssUrl(resolveThemeImage("chat", data)));
    els.pageChat?.classList.remove("chat-bg-mode-color");

    const pinguSrc = resolveThemeImage("pingu", data);
    if (els.pingu) els.pingu.src = pinguSrc;
  }

  function commitAppearance({ alertOnFail = true } = {}) {
    const next = normalizeTheme(appearanceDraft);
    try {
      saveTheme(next);
    } catch {
      if (alertOnFail) {
        window.alert(t("saveFail"));
      }
      return false;
    }
    theme = next;
    applyTheme(theme);
    return true;
  }

  function updateAppearancePreview() {
    const homePrev = els.homeBgPreview;
    const chatPrev = els.chatBgPreview;
    const pinguPrev = els.pinguPreview;
    if (homePrev) {
      const homeGradientMode = appearanceDraft.homeMode === "gradient";
      homePrev.classList.toggle("is-gradient-mode", homeGradientMode);
      if (homeGradientMode) {
        homePrev.style.backgroundColor = "#FFF9F2";
        homePrev.style.backgroundImage = "";
      } else {
        homePrev.style.backgroundColor = "#FFF9F2";
        homePrev.style.backgroundImage = cssUrl(resolveThemeImage("home", appearanceDraft));
      }
    }
    if (chatPrev) {
      chatPrev.style.backgroundColor = "#cfe8f8";
      chatPrev.style.backgroundImage = cssUrl(resolveThemeImage("chat", appearanceDraft));
    }
    if (pinguPrev) {
      pinguPrev.style.backgroundImage = cssUrl(resolveThemeImage("pingu", appearanceDraft));
    }
    syncPinguPresetButtons();
  }

  function syncPinguPresetButtons() {
    const root = els.pinguPresetGrid;
    if (!root) return;
    const active = appearanceDraft.pinguPreset;
    root.querySelectorAll(".pingu-preset-btn").forEach((btn) => {
      const src = btn.getAttribute("data-src");
      const isCustom = btn.getAttribute("data-preset") === "__custom__";
      const on = isCustom ? active === "__custom__" : active === src;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function selectPinguPreset(src) {
    if (!PINGU_PRESET_SRCS.has(src)) return;
    appearanceDraft.pinguPreset = src;
    appearanceDraft.pinguCustom = "";
    syncAppearanceFields();
    commitAppearance();
  }

  function syncAppearanceFields() {
    updateAppearancePreview();
  }

  function pickAppearanceImage(inputEl) {
    if (!inputEl) return;
    inputEl.value = "";
    inputEl.click();
  }

  async function handleAppearanceImageUpload(kind, file) {
    if (!file) return;
    try {
      if (kind === "pingu") {
        appearanceDraft.pinguCustom = await compressImageFile(file, 1024, 0.9, {
          preserveAlpha: true,
        });
        appearanceDraft.pinguPreset = "__custom__";
      } else if (kind === "home") {
        appearanceDraft.homeCustom = await compressImageFile(file);
        appearanceDraft.homePreset = "__custom__";
        appearanceDraft.homeMode = "image";
      } else if (kind === "chat") {
        appearanceDraft.chatCustom = await compressImageFile(file);
        appearanceDraft.chatPreset = "__custom__";
        appearanceDraft.chatMode = "image";
      }
      syncAppearanceFields();
      commitAppearance();
    } catch (err) {
      window.alert(err?.message || t("uploadFail"));
    }
  }

  function compressImageFile(file, maxSide = 1280, quality = 0.82, { preserveAlpha = false } = {}) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type?.startsWith("image/")) {
        reject(new Error(t("pickImage")));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error(t("readFail")));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error(t("parseFail")));
        img.onload = () => {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          const preferPng =
            preserveAlpha ||
            file.type === "image/png" ||
            file.type === "image/webp";
          let dataUrl = preferPng
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", quality);
          if (dataUrl.length > 1.6e6) {
            dataUrl = preferPng
              ? canvas.toDataURL("image/jpeg", 0.82)
              : canvas.toDataURL("image/jpeg", 0.65);
          }
          if (dataUrl.length > 2.2e6) {
            reject(new Error(t("imageTooBig")));
            return;
          }
          resolve(dataUrl);
        };
        img.src = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }

  applyTheme(theme);
  applyLocale();

  async function loadCoachManual() {
    try {
      const res = await fetch(COACH_MD_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error(String(res.status));
      coachManual = await res.text();
    } catch {
      coachManual = "";
    }
  }

  function mergeCoachMemory(lines) {
    if (!lines?.length) return 0;
    const next = [...(ai.coachMemory || [])];
    let added = 0;
    for (const line of lines) {
      const text = String(line || "")
        .replace(/^[-*•]\s*/, "")
        .trim();
      if (!text) continue;
      const dup = next.some(
        (item) => item === text || item.includes(text) || text.includes(item)
      );
      if (dup) continue;
      next.push(text);
      added += 1;
      const notes = ai.coachProfile?.notes || "";
      if (!notes.includes(text)) {
        ai.coachProfile.notes = notes ? `${notes}\n- ${text}` : `- ${text}`;
      }
    }
    if (added) {
      ai.coachMemory = next.slice(-80);
      saveAi();
      if (els.pageProfile && !els.pageProfile.hidden) fillProfileForm(ai.coachProfile);
    }
    return added;
  }

  function applyProfilePatch(patch) {
    if (!patch || typeof patch !== "object") return 0;
    let changed = 0;
    if (!ai.coachProfile) ai.coachProfile = { ...DEFAULT_COACH_PROFILE };
    for (const key of PROFILE_FIELD_KEYS) {
      if (typeof patch[key] !== "string") continue;
      const next = patch[key].trim();
      if (!next) continue;
      if (ai.coachProfile[key] === next) continue;
      // append-style for notes if shorter additive fact; replace for main fields when provided
      if (key === "notes") {
        if (ai.coachProfile.notes.includes(next)) continue;
        ai.coachProfile.notes = ai.coachProfile.notes
          ? `${ai.coachProfile.notes}\n${next}`
          : next;
      } else {
        ai.coachProfile[key] = next;
      }
      changed += 1;
    }
    if (changed) {
      saveAi();
      if (els.pageProfile && !els.pageProfile.hidden) fillProfileForm(ai.coachProfile);
    }
    return changed;
  }

  function parseProfileBlock(body) {
    const patch = {};
    const alias = {
      goal: "goal",
      终点目标: "goal",
      目标: "goal",
      oldstory: "oldStory",
      old_story: "oldStory",
      旧故事: "oldStory",
      effectiveaffirms: "effectiveAffirms",
      effective_affirms: "effectiveAffirms",
      有效肯定语: "effectiveAffirms",
      肯定语: "effectiveAffirms",
      crashpatterns: "crashPatterns",
      crash_patterns: "crashPatterns",
      崩溃模式: "crashPatterns",
      boundaries: "boundaries",
      边界: "boundaries",
      notes: "notes",
      其他备注: "notes",
      备注: "notes",
    };

    const lines = String(body || "").split("\n");
    let currentKey = null;
    let buf = [];
    const flush = () => {
      if (!currentKey) return;
      const text = buf.join("\n").trim();
      if (text) patch[currentKey] = text;
      buf = [];
    };

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      const matched = line.match(/^([A-Za-z_\u4e00-\u9fff]+)\s*[:：]\s*(.*)$/);
      if (matched) {
        const keyRaw = matched[1].trim().toLowerCase();
        const mapped = alias[keyRaw] || alias[matched[1].trim()];
        if (mapped) {
          flush();
          currentKey = mapped;
          buf = matched[2] ? [matched[2]] : [];
          continue;
        }
      }
      if (currentKey) buf.push(line);
    }
    flush();
    return patch;
  }

  function extractLabeledSection(text, label) {
    const re = new RegExp(`【${label}】\\s*([\\s\\S]*?)(?=\\n【|$)`);
    const m = String(text || "").match(re);
    return m ? m[1].trim() : "";
  }

  function parseDailyBlock(body) {
    const raw = String(body || "").trim();
    if (!raw) return null;
    const goalsMatch = raw.match(/(?:goals|今日目标)\s*[:：]\s*([\s\S]*?)(?=\n(?:visual|视觉化)\s*[:：]|$)/i);
    const visualMatch = raw.match(/(?:visual|视觉化)\s*[:：]\s*([\s\S]*?)$/i);
    if (goalsMatch || visualMatch) {
      return {
        goals: (goalsMatch?.[1] || "").trim() || raw,
        visualScript: (visualMatch?.[1] || "").trim(),
      };
    }
    return { goals: raw, visualScript: "" };
  }

  function extractMemoryUpdate(raw) {
    const facts = [];
    let affirm = "";
    let affirmShort = "";
    let daily = null;
    let profilePatch = null;
    let cleaned = String(raw || "");
    cleaned = cleaned.replace(MEMORY_BLOCK_RE, (_, body) => {
      String(body)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => facts.push(line.replace(/^[-*•]\s*/, "").trim()));
      return "";
    });
    cleaned = cleaned.replace(AFFIRM_BLOCK_RE, (_, body) => {
      const text = String(body || "").trim();
      if (text) affirm = text;
      return "";
    });
    cleaned = cleaned.replace(AFFIRM_SHORT_BLOCK_RE, (_, body) => {
      const text = String(body || "").trim();
      if (text) affirmShort = text;
      return "";
    });
    cleaned = cleaned.replace(DAILY_BLOCK_RE, (_, body) => {
      daily = parseDailyBlock(body);
      return "";
    });
    cleaned = cleaned.replace(PROFILE_BLOCK_RE, (_, body) => {
      profilePatch = parseProfileBlock(body);
      return "";
    });
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

    if (!daily) {
      const goals = extractLabeledSection(cleaned, "今日目标");
      const visual = extractLabeledSection(cleaned, "视觉化");
      if (goals || visual) {
        daily = { goals, visualScript: visual };
      }
    }
    if (!affirmShort) {
      const section = extractLabeledSection(cleaned, "肯定语");
      if (section && section.length <= 220) affirmShort = section;
    }

    return { cleaned, facts, affirm, affirmShort, daily, profilePatch };
  }

  function applyDailyPlanUpdate(patch) {
    if (!patch) return false;
    ensureDailyPlanDay({ persist: false });
    const goals = String(patch.goals || "").trim();
    const visualScript = String(patch.visualScript || "").trim();
    let changed = false;
    if (goals && goals !== state.dailyPlan.goals) {
      state.dailyPlan.goals = goals;
      changed = true;
    }
    if (visualScript && visualScript !== state.dailyPlan.visualScript) {
      state.dailyPlan.visualScript = visualScript;
      changed = true;
    }
    if (!changed) return false;
    save(state);
    renderRitualBar();
    return true;
  }

  function applyRoboticUpdate(text) {
    const next = String(text || "").trim();
    if (!next) return false;
    if (next === state.roboticAffirmation) return false;
    state.roboticAffirmation = next;
    save(state);
    renderActiveBubble();
    if (!els.pageHistory?.hidden) renderAffirmHistoryPage();
    return true;
  }

  function applyAffirmationUpdate(text, { source = "coach" } = {}) {
    const next = String(text || "").trim();
    if (!next) return false;
    if (next === state.affirmation) return false;

    if (state.affirmation.trim()) {
      const top = state.affirmHistory[0];
      if (!top || top.text !== state.affirmation) {
        state.affirmHistory.unshift({
          id: uid(),
          text: state.affirmation,
          savedAt: new Date().toISOString(),
          tags: assignTagsForText(state.affirmation, state.customTags),
        });
      }
    }

    state.affirmation = next;
    state.affirmHistory.unshift({
      id: uid(),
      text: next,
      savedAt: new Date().toISOString(),
      tags: assignTagsForText(next, state.customTags),
    });
    state.affirmHistory = state.affirmHistory.slice(0, 30);
    save(state);
    renderActiveBubble();
    if (!els.pageHistory?.hidden) renderAffirmHistoryPage();
    return true;
  }

  function getTodayCount() {
    return state.days[todayKey()] || 0;
  }

  function getTotalCount() {
    return Object.values(state.days).reduce((sum, n) => sum + (Number(n) || 0), 0);
  }

  function startOfWeek(d = new Date()) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = x.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    x.setDate(x.getDate() + diff);
    return x;
  }

  function eachDayKey(from, to) {
    const keys = [];
    const cur = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    while (cur <= end) {
      keys.push(todayKey(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return keys;
  }

  function sumMap(map, keys) {
    return keys.reduce((sum, key) => sum + (Number(map[key]) || 0), 0);
  }

  function formatDuration(totalSeconds) {
    const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return m > 0 ? tf("durationHM", { h, m }) : tf("durationH", { h });
    if (m > 0) return sec > 0 && m < 10 ? tf("durationMS", { m, s: sec }) : tf("durationM", { m });
    return tf("durationS", { s: sec });
  }

  function getWeekKeys(d = new Date()) {
    const start = startOfWeek(d);
    return eachDayKey(start, d);
  }

  function getMonthKeys(d = new Date()) {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    return eachDayKey(start, d);
  }

  function getFullWeekKeys(d = new Date()) {
    const start = startOfWeek(d);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return eachDayKey(start, end);
  }

  function getFullMonthKeys(d = new Date()) {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return eachDayKey(start, end);
  }

  function getChartWeekdayLabels() {
    return [
      t("chartWeekMon"),
      t("chartWeekTue"),
      t("chartWeekWed"),
      t("chartWeekThu"),
      t("chartWeekFri"),
      t("chartWeekSat"),
      t("chartWeekSun"),
    ];
  }
  /** @type {{ keys: string[], values: number[], points: { x: number, y: number }[] } | null} */
  let statsChartData = null;

  function setStatsRange(range) {
    statsRange = range === "month" ? "month" : "week";
    statsAnchorDate = new Date();
    statsDetailIndex = -1;
    if (els.statsTabWeek) {
      els.statsTabWeek.classList.toggle("active", statsRange === "week");
      els.statsTabWeek.setAttribute("aria-selected", statsRange === "week" ? "true" : "false");
    }
    if (els.statsTabMonth) {
      els.statsTabMonth.classList.toggle("active", statsRange === "month");
      els.statsTabMonth.setAttribute("aria-selected", statsRange === "month" ? "true" : "false");
    }
    refreshStats();
  }

  function shiftStatsAnchor(delta) {
    const d = new Date(statsAnchorDate);
    if (statsRange === "month") {
      d.setMonth(d.getMonth() + delta);
      d.setDate(1);
    } else {
      d.setDate(d.getDate() + delta * 7);
    }
    statsAnchorDate = d;
    statsDetailIndex = -1;
    refreshStats();
  }

  function formatStatsPeriodLabel() {
    const isMonth = statsRange === "month";
    if (isMonth) {
      const y = statsAnchorDate.getFullYear();
      const m = statsAnchorDate.getMonth() + 1;
      return locale === "en"
        ? `${y}.${String(m).padStart(2, "0")}`
        : `${y}年${m}月`;
    }
    const keys = getFullWeekKeys(statsAnchorDate);
    if (!keys.length) return "";
    const start = keys[0].split("-");
    const end = keys[keys.length - 1].split("-");
    if (locale === "en") {
      return `${start[1]}.${start[2]} – ${end[1]}.${end[2]}`;
    }
    return `${Number(start[1])}.${Number(start[2])} – ${Number(end[1])}.${Number(end[2])}`;
  }

  function defaultStatsDetailIndex(keys) {
    const today = todayKey();
    const idx = keys.indexOf(today);
    if (idx >= 0) return idx;
    return Math.max(0, keys.length - 1);
  }

  function updateStatsDayDetail(index) {
    if (!statsChartData || !els.statsDetailTitle) return;
    const { keys, values } = statsChartData;
    if (index < 0 || index >= keys.length) index = defaultStatsDetailIndex(keys);
    statsDetailIndex = index;
    const key = keys[index];
    const count = values[index] || 0;
    const ritual = getRitualFlags(key);
    els.statsDetailTitle.textContent = formatStatsDayLabel(key);
    els.statsDetailSub.textContent = tf("statsDetailSummary", { n: count });
    if (count <= 0) {
      els.statsDetailBody.textContent = t("statsDetailEmpty");
      return;
    }
    els.statsDetailBody.textContent = tf("statsDetailRitual", {
      visual: ritual.visual ? t("statsDetailDone") : t("statsDetailNotDone"),
      robotic: ritual.robotic ? t("statsDetailDone") : t("statsDetailNotDone"),
    });
  }

  const RESOURCE_FAQ_KEYS = [
    ["faq1q", "faq1a"],
    ["faq2q", "faq2a"],
    ["faq3q", "faq3a"],
    ["faq4q", "faq4a"],
    ["faq5q", "faq5a"],
    ["faq6q", "faq6a"],
    ["faq7q", "faq7a"],
    ["faq8q", "faq8a"],
    ["faq9q", "faq9a"],
    ["faq10q", "faq10a"],
  ];

  const RESOURCE_LINKS = [
    {
      title: "【SAMMY】超简单：三天显化任何事！",
      author: "是显化不是魔法",
      meta: "B站 · 约 8 分钟",
      url: "https://www.bilibili.com/video/BV1VMu7z5E6w",
      badge: "B站",
    },
    {
      title: "对显化出 1.12 亿美元彩票中奖者的采访",
      author: "柠溪迷蝶",
      meta: "B站 · 约 1 小时",
      url: "https://www.bilibili.com/video/BV1FV4y1U7ts",
      badge: "B站",
    },
    {
      title: "每个人都可以做到限时显化 / 快速显化",
      author: "我要两个肉松面包",
      meta: "B站 · 约 9 分钟",
      url: "https://www.bilibili.com/video/BV1BrqaYRE43",
      badge: "B站",
    },
  ];

  const CUSTOM_LINKS_KEY = "affirm-pingu-resource-links-v1";
  let resourcesFaqRendered = false;

  function loadCustomResourceLinks() {
    try {
      const raw = JSON.parse(localStorage.getItem(CUSTOM_LINKS_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw
        .filter((item) => item && typeof item.url === "string" && item.url.trim())
        .map((item) => ({
          id: String(item.id || uid()),
          title: String(item.title || t("customVideo")).slice(0, 120),
          author: String(item.author || t("myFavorites")).slice(0, 60),
          meta: String(item.meta || t("customLabel")).slice(0, 60),
          url: String(item.url).trim(),
          badge: String(item.badge || t("linkBadge")).slice(0, 12),
          custom: true,
        }));
    } catch {
      return [];
    }
  }

  function saveCustomResourceLinks(list) {
    try {
      localStorage.setItem(
        CUSTOM_LINKS_KEY,
        JSON.stringify(
          (list || []).map((item) => ({
            id: item.id,
            title: item.title,
            author: item.author,
            meta: item.meta,
            url: item.url,
            badge: item.badge,
          }))
        )
      );
    } catch {
      /* ignore */
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeResourceUrl(raw) {
    const text = String(raw || "").trim();
    if (!text) throw new Error(t("pasteLinkRequired"));
    let href = text;
    if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
    const url = new URL(href);
    if (!/^https?:$/i.test(url.protocol)) throw new Error(t("invalidLink"));
    return url;
  }

  function buildResourceFromUrl(rawUrl, customTitle = "") {
    const url = normalizeResourceUrl(rawUrl);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    const titleHint = String(customTitle || "").trim();
    let badge = t("linkBadge");
    let author = host;
    let meta = t("customCollection");
    let title = titleHint;

    if (host.includes("bilibili.com") || host === "b23.tv") {
      badge = t("bilibili");
      author = t("bilibiliSite");
      const bv = url.pathname.match(/BV[\w]+/i)?.[0];
      if (!title) title = bv ? tf("bilibiliVideoId", { id: bv }) : t("bilibiliVideo");
    } else if (host.includes("youtube.com") || host === "youtu.be") {
      badge = "YT";
      author = "YouTube";
      const id =
        host === "youtu.be"
          ? url.pathname.replace(/^\//, "").split("/")[0]
          : url.searchParams.get("v");
      if (!title) title = id ? tf("youtubeVideoId", { id }) : t("youtubeVideo");
    } else if (host.includes("douyin.com") || host.includes("tiktok.com")) {
      badge = host.includes("tiktok") ? "TikTok" : "抖音";
      author = badge;
      if (!title) title = tf("douyinVideo", { badge });
    } else if (host.includes("xiaohongshu.com") || host === "xhslink.com") {
      badge = t("xiaohongshu");
      author = t("xiaohongshu");
      if (!title) title = t("xiaohongshuContent");
    } else if (!title) {
      title = host || t("customLinkHost");
    }

    return {
      id: uid(),
      title: title.slice(0, 120),
      author: author.slice(0, 60),
      meta,
      url: url.href,
      badge,
      custom: true,
    };
  }

  function renderResourceCards() {
    if (!els.resourceCards) return;
    const customs = loadCustomResourceLinks();
    const items = [
      ...RESOURCE_LINKS.map((item) => ({ ...item, custom: false })),
      ...customs,
    ];
    els.resourceCards.innerHTML = items
      .map((item) => {
        const wrapClass = item.custom
          ? "resource-card-wrap is-custom"
          : "resource-card-wrap";
        const removeBtn = item.custom
          ? `<button type="button" class="resource-card-remove" data-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(t("deleteCard"))}" title="${escapeHtml(t("delete"))}">×</button>`
          : "";
        return `
          <div class="${wrapClass}">
            <a class="resource-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
              <div class="resource-card-top">
                <span class="resource-badge">${escapeHtml(item.badge || t("linkBadge"))}</span>
                <span class="resource-card-meta">${escapeHtml(item.author || "")}</span>
              </div>
              <h3 class="resource-card-title">${escapeHtml(item.title)}</h3>
              <span class="resource-card-meta">${escapeHtml(item.meta || "")}</span>
              <span class="resource-card-cta">${escapeHtml(t("openWatch"))}</span>
            </a>
            ${removeBtn}
          </div>
        `;
      })
      .join("");
  }

  function addCustomResourceLink(rawUrl, customTitle) {
    const item = buildResourceFromUrl(rawUrl, customTitle);
    const list = loadCustomResourceLinks();
    if (list.some((x) => x.url === item.url)) {
      throw new Error(t("linkAlreadyAdded"));
    }
    list.unshift(item);
    saveCustomResourceLinks(list.slice(0, 40));
    renderResourceCards();
    return item;
  }

  function removeCustomResourceLink(id) {
    const next = loadCustomResourceLinks().filter((item) => item.id !== id);
    saveCustomResourceLinks(next);
    renderResourceCards();
  }

  function renderFaq(force = false) {
    if (!els.faqList) return;
    if (resourcesFaqRendered && !force) return;
    els.faqList.innerHTML = RESOURCE_FAQ_KEYS.map(
      ([qKey, aKey]) => `
          <details class="faq-item">
            <summary>${escapeHtml(t(qKey))}</summary>
            <p>${escapeHtml(t(aKey))}</p>
          </details>
        `
    ).join("");
    resourcesFaqRendered = true;
  }

  function renderResources() {
    renderResourceCards();
  }

  function getRitualFlags(dayKey) {
    const saved = state.ritualDays?.[dayKey] || {};
    if (dayKey === todayKey() && state.dailyPlan) {
      return {
        robotic: Boolean(saved.robotic || state.dailyPlan.roboticDone),
        visual: Boolean(saved.visual || state.dailyPlan.visualDone),
      };
    }
    return {
      robotic: Boolean(saved.robotic),
      visual: Boolean(saved.visual),
    };
  }

  function buildSmoothPath(points) {
    if (!points.length) return "";
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  function formatStatsDayLabel(key) {
    const parts = String(key).split("-");
    if (parts.length !== 3) return key;
    return tf("monthDay", { m: Number(parts[1]), d: Number(parts[2]) });
  }

  function hideStatsHover() {
    if (!els.statsChart) return;
    const tip = els.statsChart.querySelector(".stats-tip");
    const cursor = els.statsChart.querySelector(".stats-line-cursor");
    els.statsChart.querySelectorAll(".stats-line-dot.is-active").forEach((el) => {
      el.classList.remove("is-active");
    });
    if (tip) tip.classList.remove("is-on");
    if (cursor) cursor.classList.remove("is-on");
    if (statsChartData?.keys?.length) {
      updateStatsDayDetail(defaultStatsDetailIndex(statsChartData.keys));
    }
  }

  function showStatsHover(index) {
    if (!statsChartData || !els.statsChart) return;
    const { keys, values, points } = statsChartData;
    if (index < 0 || index >= keys.length) return;

    const key = keys[index];
    const count = values[index];
    const point = points[index];
    const ritual = getRitualFlags(key);
    const tip = els.statsChart.querySelector(".stats-tip");
    const cursor = els.statsChart.querySelector(".stats-line-cursor");
    const dots = els.statsChart.querySelectorAll(".stats-line-dot");

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });

    if (cursor) {
      cursor.style.left = `${point.x}%`;
      cursor.classList.add("is-on");
    }

    if (tip) {
      tip.innerHTML = `
        <span class="stats-tip-date">${formatStatsDayLabel(key)}</span>
        <div class="stats-tip-row"><span>${escapeHtml(t("statsTipAffirmed"))}</span><strong>${escapeHtml(tf("statsTipTimes", { n: count }))}</strong></div>
        <div class="stats-tip-row"><span>${escapeHtml(t("visual"))}</span><strong class="${ritual.visual ? "is-yes" : "is-no"}">${escapeHtml(ritual.visual ? t("statsTipDone") : t("statsTipNotDone"))}</strong></div>
        <div class="stats-tip-row"><span>${escapeHtml(t("robotic"))}</span><strong class="${ritual.robotic ? "is-yes" : "is-no"}">${escapeHtml(ritual.robotic ? t("statsTipDone") : t("statsTipNotDone"))}</strong></div>
      `;
      const plot = els.statsChart.querySelector(".stats-line-plot");
      const plotW = plot ? plot.clientWidth : els.statsChart.clientWidth;
      const tipW = tip.offsetWidth || 140;
      const rawLeft = (point.x / 100) * plotW;
      const clamped = Math.min(plotW - tipW / 2 - 4, Math.max(tipW / 2 + 4, rawLeft));
      tip.style.left = `${clamped}px`;
      tip.style.top = `${(point.y / 100) * (plot ? plot.clientHeight : 120)}px`;
      tip.classList.add("is-on");
    }
    updateStatsDayDetail(index);
  }

  function bindStatsChartHover(wrap) {
    const onMove = (event) => {
      if (!statsChartData || !statsChartData.keys.length) return;
      const plot = wrap.querySelector(".stats-line-plot");
      if (!plot) return;
      const rect = plot.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      let best = 0;
      let bestDist = Infinity;
      statsChartData.points.forEach((pt, i) => {
        const dist = Math.abs(pt.x - x);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      showStatsHover(best);
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onMove);
    wrap.addEventListener("pointerleave", hideStatsHover);
  }

  function refreshCounts() {
    const today = getTodayCount();
    const total = getTotalCount();
    if (els.bigCount) els.bigCount.textContent = String(today);
    if (els.todayCount) els.todayCount.textContent = String(today);
    if (els.totalCount) els.totalCount.textContent = String(total);
    refreshStats();
  }

  function refreshStats() {
    if (els.statsTodayCount) {
      els.statsTodayCount.textContent = String(getTodayCount());
    }
    if (els.statsTodayCaption) {
      els.statsTodayCaption.textContent = t("statsTodayCaption");
    }
    if (els.statsPeriodLabel) {
      els.statsPeriodLabel.textContent = formatStatsPeriodLabel();
    }
    if (!els.statsChart) return;

    const today = todayKey();
    const isMonth = statsRange === "month";
    const keys = isMonth ? getFullMonthKeys(statsAnchorDate) : getFullWeekKeys(statsAnchorDate);
    const values = keys.map((key) => Number(state.days[key]) || 0);
    const max = Math.max(...values, 1);
    const rangeTotal = values.reduce((sum, n) => sum + n, 0);
    const points = keys.map((_, i) => {
      const x = keys.length <= 1 ? 50 : (i / (keys.length - 1)) * 100;
      const y = 92 - (values[i] / max) * 78;
      return { x, y };
    });

    statsChartData = { keys, values, points };
    els.statsChart.classList.toggle("is-month", isMonth);
    els.statsChart.classList.add("is-line");
    els.statsChart.setAttribute(
      "aria-label",
      isMonth ? tf("chartAriaMonth", { n: rangeTotal }) : tf("chartAriaWeek", { n: rangeTotal })
    );

    const linePath = buildSmoothPath(points);
    const areaPath = points.length
      ? `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`
      : "";

    const labelsHtml = keys
      .map((key, i) => {
        const dayNum = Number(key.slice(-2));
        let text = "";
        if (isMonth) {
          const show =
            dayNum === 1 ||
            dayNum === keys.length ||
            dayNum % 5 === 0 ||
            key === today;
          text = show ? String(dayNum) : "";
        } else {
          text = getChartWeekdayLabels()[i] || "";
        }
        const cls = key === today ? "stats-line-xlabel is-today" : "stats-line-xlabel";
        return `<span class="${cls}">${text}</span>`;
      })
      .join("");

    const dotsHtml = points
      .map((pt, i) => {
        const cls = [
          "stats-line-dot",
          keys[i] === today ? "is-today" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `<i class="${cls}" data-index="${i}" style="left:${pt.x}%;top:${pt.y}%"></i>`;
      })
      .join("");

    els.statsChart.innerHTML = `
      <div class="stats-line-wrap">
        <div class="stats-line-plot">
          <svg class="stats-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="stats-line-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#e93abb" stop-opacity="0.28"/>
                <stop offset="100%" stop-color="#e93abb" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path class="stats-line-area" d="${areaPath}"></path>
            <path class="stats-line-path" d="${linePath}"></path>
          </svg>
          <div class="stats-line-cursor"></div>
          ${dotsHtml}
          <div class="stats-tip"></div>
        </div>
        <div class="stats-line-xlabels">${labelsHtml}</div>
      </div>
    `;

    const wrap = els.statsChart.querySelector(".stats-line-wrap");
    if (wrap) bindStatsChartHover(wrap);

    updateStatsDayDetail(
      statsDetailIndex >= 0 && statsDetailIndex < keys.length
        ? statsDetailIndex
        : defaultStatsDetailIndex(keys)
    );
  }

  function triggerJump({ silent = false } = {}) {
    if (jumping) {
      els.pingu.classList.remove("jump");
      void els.pingu.offsetWidth;
    }
    jumping = true;
    els.pingu.classList.add("jump");

    if (!silent) {
      els.jumpFx.classList.remove("show");
      void els.jumpFx.offsetWidth;
      els.jumpFx.classList.add("show");

      if (els.bigCount) {
        els.bigCount.classList.remove("pop");
        void els.bigCount.offsetWidth;
        els.bigCount.classList.add("pop");
      }
    } else {
      els.jumpFx.classList.remove("show");
    }

    window.setTimeout(() => {
      els.pingu.classList.remove("jump");
      jumping = false;
    }, 550);
  }

  function affirm() {
    if (isAnyPageOpen()) return;
    const now = Date.now();
    if (now - lastAffirmAt < 120) return;
    lastAffirmAt = now;
    const key = todayKey();
    state.days[key] = (state.days[key] || 0) + 1;
    save(state);

    if (ritualRun) {
      ritualRun.sessionCount = (ritualRun.sessionCount || 0) + 1;
      triggerJump({ silent: true });
      return;
    }

    refreshCounts();
    renderCalendar();
    renderDayList();
    triggerJump();
  }

  function heatLevelFromSeconds(secs) {
    const s = Number(secs) || 0;
    if (s <= 0) return 0;
    if (s < 5 * 60) return 1; // < 5 min
    if (s < 20 * 60) return 2; // 5–20 min
    if (s < 60 * 60) return 3; // 20–60 min
    return 4; // 1h+
  }

  function renderCalendar() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthNum = month + 1;
    els.calTitle.textContent =
      locale === "en"
        ? `${year}.${String(monthNum).padStart(2, "0")}`
        : `${year}年${monthNum}月`;

    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = todayKey();

    els.calGrid.innerHTML = "";

    for (let i = 0; i < startPad; i += 1) {
      const cell = document.createElement("div");
      cell.className = "cal-cell empty";
      els.calGrid.appendChild(cell);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const secs = Number(state.timeDays[key]) || 0;
      const count = state.days[key] || 0;
      const heat = heatLevelFromSeconds(secs);
      const cell = document.createElement("div");
      cell.className = `cal-cell heat-${heat}`;
      if (secs > 0) cell.classList.add("has-time");
      if (key === today) cell.classList.add("today");

      const num = document.createElement("span");
      num.className = "day-num";
      num.textContent = String(day);
      cell.appendChild(num);

      cell.title =
        secs > 0 || count > 0
          ? tf("calendarCellMeta", {
              date: key,
              duration: formatDuration(secs),
              count: count ? ` · ${tf("timesCount", { n: count })}` : "",
            })
          : tf("calendarCellMeta", { date: key, duration: t("noEntry"), count: "" });
      cell.setAttribute("aria-label", cell.title);

      els.calGrid.appendChild(cell);
    }
  }

  function renderDayList() {
    const entries = Object.entries(state.days)
      .filter(([, n]) => Number(n) > 0)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1));

    els.historyList.innerHTML = "";

    if (entries.length === 0) {
      const li = document.createElement("li");
      li.className = "empty-msg";
      li.textContent = t("listEmpty");
      els.historyList.appendChild(li);
      return;
    }

    for (const [date, count] of entries) {
      const li = document.createElement("li");
      const dateEl = document.createElement("span");
      dateEl.className = "date";
      dateEl.textContent = date;
      const countEl = document.createElement("span");
      countEl.className = "count";
      countEl.textContent = tf("timesCount", { n: count });
      li.appendChild(dateEl);
      li.appendChild(countEl);
      els.historyList.appendChild(li);
    }
  }

  function setCalView(view) {
    const isCalendar = view === "calendar";
    const isList = view === "list";
    els.tabCalendar?.classList.toggle("active", isCalendar);
    els.tabList?.classList.toggle("active", isList);
    els.tabStatsInline?.classList.toggle("active", false);
    els.calendarView?.classList.toggle("active", isCalendar);
    els.listView?.classList.toggle("active", isList);
    els.statsInlineView?.classList.remove("active");
  }

  function renderBubbleText(text) {
    const value = text || "";
    els.affirmPreview.replaceChildren();
    if (!value.trim()) return;

    value.split(/\n/).forEach((line, index) => {
      const p = document.createElement("p");
      p.className = "wobble-line";
      p.textContent = line || " ";
      const tilt = ((index % 5) - 2) * 0.7 + (index % 2 === 0 ? -0.6 : 0.8);
      const shift = ((index % 3) - 1) * 4;
      p.style.transform = `rotate(${tilt}deg) translateX(${shift}px)`;
      els.affirmPreview.appendChild(p);
    });
  }

  function activeBubbleText() {
    return state.bubbleMode === "robotic"
      ? state.roboticAffirmation || DEFAULT_ROBOTIC
      : state.affirmation || "";
  }

  function renderActiveBubble() {
    if (els.bubbleModeLabel) {
      els.bubbleModeLabel.textContent =
        state.bubbleMode === "robotic" ? t("roboticMode") : t("storyMode");
    }
    if (els.bubbleModeSwitch) {
      const robotic = state.bubbleMode === "robotic";
      els.bubbleModeSwitch.classList.toggle("is-robotic", robotic);
      els.bubbleModeSwitch.setAttribute("aria-pressed", robotic ? "true" : "false");
      const tip = robotic ? t("switchToStory") : t("switchToRobotic");
      els.bubbleModeSwitch.title = tip;
      els.bubbleModeSwitch.setAttribute("aria-label", tip);
    }
    if (els.speechBubble) {
      els.speechBubble.hidden = true;
    }
  }

  let bubbleFlipBusy = false;

  function toggleBubbleMode() {
    const apply = () => {
      state.bubbleMode = state.bubbleMode === "robotic" ? "story" : "robotic";
      save(state);
      renderActiveBubble();
    };

    const bubble = els.speechBubble;
    if (!bubble || bubbleFlipBusy || typeof bubble.animate !== "function") {
      apply();
      return;
    }

    bubbleFlipBusy = true;
    const motion = bubble.closest(".bubble-motion");
    if (motion) motion.classList.add("is-paused");
    bubble.classList.add("is-flipping");

    const out = bubble.animate(
      [
        { transform: "rotateY(0deg)", opacity: 1 },
        { transform: "rotateY(90deg)", opacity: 0.45 },
      ],
      { duration: 160, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" }
    );

    out.finished
      .then(() => {
        apply();
        return bubble.animate(
          [
            { transform: "rotateY(-90deg)", opacity: 0.45 },
            { transform: "rotateY(0deg)", opacity: 1 },
          ],
          {
            duration: 200,
            easing: "cubic-bezier(0, 0, 0.2, 1)",
            fill: "forwards",
          }
        ).finished;
      })
      .catch(() => {
        apply();
      })
      .finally(() => {
        bubble.getAnimations().forEach((a) => a.cancel());
        bubble.style.removeProperty("transform");
        bubble.style.removeProperty("opacity");
        bubble.classList.remove("is-flipping");
        if (motion) motion.classList.remove("is-paused");
        bubbleFlipBusy = false;
      });
  }

  function formatRitualClock(totalSecs) {
    const s = Math.max(0, Math.floor(totalSecs));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function updateRitualRing(remaining, total) {
    const t = Math.max(1, Number(total) || 1);
    const r = Math.max(0, Math.min(t, Number(remaining) || 0));
    const ratio = r / t;
    if (els.ritualRingProgress) {
      const offset = RITUAL_RING_LEN * (1 - ratio);
      els.ritualRingProgress.style.strokeDasharray = String(RITUAL_RING_LEN);
      els.ritualRingProgress.style.strokeDashoffset = String(offset);
    }
    if (els.taskProgressFill) {
      els.taskProgressFill.style.transform = `scaleX(${ratio})`;
    }
  }

  function setRitualTab(kind) {
    ritualTab = kind === "visual" ? "visual" : "robotic";
    const isRobotic = ritualTab === "robotic";
    if (els.ritualBar) els.ritualBar.dataset.kind = ritualTab;
    if (els.tabRobotic) {
      els.tabRobotic.classList.toggle("is-active", isRobotic);
      els.tabRobotic.setAttribute("aria-selected", isRobotic ? "true" : "false");
    }
    if (els.tabVisual) {
      els.tabVisual.classList.toggle("is-active", !isRobotic);
      els.tabVisual.setAttribute("aria-selected", !isRobotic ? "true" : "false");
    }
    if (els.panelRobotic) {
      els.panelRobotic.classList.toggle("is-active", isRobotic);
      els.panelRobotic.hidden = !isRobotic;
    }
    if (els.panelVisual) {
      els.panelVisual.classList.toggle("is-active", !isRobotic);
      els.panelVisual.hidden = isRobotic;
    }
    if (els.ritualRoboticCopy) els.ritualRoboticCopy.hidden = !isRobotic;
    if (els.ritualVisualCopy) els.ritualVisualCopy.hidden = isRobotic;
    if (els.btnStartRobotic) els.btnStartRobotic.hidden = !isRobotic;
    if (els.btnStartVisual) els.btnStartVisual.hidden = isRobotic;
    if (els.taskIdleTimer) els.taskIdleTimer.textContent = "10:00";
    renderRitualBar();
    requestAnimationFrame(() => {
      const seg = els.tabRobotic?.closest(".task-seg");
      updateSegIndicator(seg);
    });
  }

  function ritualSummaryTitle(kind) {
    return `${kind === "visual" ? t("visual") : t("robotic")} · ${t("practiceSummary")}`;
  }

  function ritualRunningTitle(kind) {
    if (kind === "visual") return `${t("visual")} · ${t("sessionInProgress")}`;
    return `${t("robotic")} · 10 ${locale === "en" ? "min" : "分钟"}`;
  }

  function renderRitualBar() {
    ensureDailyPlanDay({ persist: false });
    const plan = state.dailyPlan;
    const roboticText =
      state.roboticAffirmation?.trim() ||
      plan.goals?.trim() ||
      t("roboticEmpty");
    const visualText =
      plan.visualScript?.trim() ||
      plan.goals?.trim() ||
      t("visualEmpty");

    if (els.ritualRoboticCopy) els.ritualRoboticCopy.textContent = roboticText;
    if (els.ritualVisualCopy) els.ritualVisualCopy.textContent = visualText;

    if (els.tabRobotic) {
      els.tabRobotic.classList.toggle("is-done", Boolean(plan.roboticDone));
    }
    if (els.tabVisual) {
      els.tabVisual.classList.toggle("is-done", Boolean(plan.visualDone));
    }

    if (els.btnStartRobotic) {
      els.btnStartRobotic.textContent = plan.roboticDone ? t("restartRobotic") : t("startRobotic");
    }
    if (els.btnStartVisual) {
      els.btnStartVisual.textContent = plan.visualDone ? t("restartVisual") : t("startVisual");
    }
  }

  function setRitualStage(on) {
    const stage = document.querySelector(".stage");
    if (stage) stage.classList.toggle("ritual-on", Boolean(on));
  }

  function showRitualToast(message) {
    if (!els.ritualToast) return;
    els.ritualToast.textContent = message;
    els.ritualToast.hidden = false;
    const sheetOpen = els.musicProviderSheet && !els.musicProviderSheet.hidden;
    els.ritualToast.classList.toggle("is-over-sheet", Boolean(sheetOpen));
    if (ritualToastTimer) window.clearTimeout(ritualToastTimer);
    ritualToastTimer = window.setTimeout(() => {
      if (els.ritualToast) {
        els.ritualToast.hidden = true;
        els.ritualToast.classList.remove("is-over-sheet");
      }
      ritualToastTimer = 0;
    }, 2600);
  }

  function stopRitualTimer() {
    if (ritualRun?.timerId) window.clearInterval(ritualRun.timerId);
    ritualRun = null;
  }

  function closeRitualSession() {
    stopRitualTimer();
    stopSessionMusic();
    if (els.ritualSession) {
      els.ritualSession.hidden = true;
      els.ritualSession.classList.remove("kind-robotic", "kind-visual");
    }
    setRitualStage(false);
  }

  function markRitualDone(kind) {
    ensureDailyPlanDay({ persist: false });
    const day = todayKey();
    if (!state.ritualDays || typeof state.ritualDays !== "object") state.ritualDays = {};
    const prev = state.ritualDays[day] || { robotic: false, visual: false };
    if (kind === "robotic") {
      state.dailyPlan.roboticDone = true;
      prev.robotic = true;
    }
    if (kind === "visual") {
      state.dailyPlan.visualDone = true;
      prev.visual = true;
    }
    state.ritualDays[day] = prev;
    save(state);
    renderRitualBar();
    updateHomeGreeting();
  }

  function completeRitualSession({ mark = true, cancelled = false, skipSummary = false } = {}) {
    if (!ritualRun) {
      closeRitualSession();
      setRitualCardState("idle");
      return;
    }
    const kind = ritualRun.kind;
    const gained = ritualRun.sessionCount || 0;
    const totalSecs = ritualRun.total || (kind === "visual" ? RITUAL_VISUAL_SECS : RITUAL_ROBOTIC_SECS);
    closeRitualSession();
    if (cancelled) {
      setRitualCardState("idle");
      if (gained > 0) showRitualToast(tf("ritualCancelToast", { n: gained }));
      refreshCounts();
      renderCalendar();
      renderDayList();
      return;
    }
    if (!skipSummary) {
      summaryDraftCount = gained;
      if (els.ritualBar) els.ritualBar.dataset.kind = kind;
      if (els.taskSummaryTitle) els.taskSummaryTitle.textContent = ritualSummaryTitle(kind);
      if (els.taskSummaryTimer) els.taskSummaryTimer.textContent = formatRitualClock(totalSecs);
      if (els.summaryCount) els.summaryCount.textContent = String(summaryDraftCount);
      if (els.summaryConfirm) {
        els.summaryConfirm.dataset.baseline = String(gained);
        els.summaryConfirm.dataset.kind = kind;
      }
      setRitualCardState("summary");
      if (mark) markRitualDone(kind);
      return;
    }
    if (mark) markRitualDone(kind);
    refreshCounts();
    renderCalendar();
    renderDayList();
    setRitualCardState("collapsed");
    updateHomeGreeting();
  }

  function confirmSummaryCount() {
    const n = Math.max(0, Number(summaryDraftCount) || 0);
    const today = todayKey();
    // taps during the run already counted via affirm(); apply ± delta only
    const baseline = Number(els.summaryConfirm?.dataset?.baseline || n) || 0;
    const delta = n - baseline;
    if (delta !== 0) {
      state.days[today] = Math.max(0, (state.days[today] || 0) + delta);
      save(state);
    }
    refreshCounts();
    renderCalendar();
    renderDayList();
    setRitualCardState("collapsed");
    updateHomeGreeting();
  }

  function tickRitualSession() {
    if (!ritualRun) return;
    ritualRun.remaining -= 1;
    if (els.ritualSessionTimer) {
      els.ritualSessionTimer.textContent = formatRitualClock(ritualRun.remaining);
    }
    updateRitualRing(ritualRun.remaining, ritualRun.total);
    if (ritualRun.remaining <= 0) {
      if (ritualRun.kind === "robotic") {
        state.bubbleMode = "robotic";
        save(state);
        renderActiveBubble();
      }
      completeRitualSession({ mark: true });
    }
  }

  function startRitualSession(kind) {
    ensureDailyPlanDay();
    closeRitualSession();
    const isRobotic = kind === "robotic";
    const remaining = isRobotic ? RITUAL_ROBOTIC_SECS : RITUAL_VISUAL_SECS;
    const body = isRobotic
      ? state.roboticAffirmation || DEFAULT_ROBOTIC
      : state.dailyPlan.visualScript?.trim() || t("visualFallback");

    if (els.ritualBar) els.ritualBar.dataset.kind = isRobotic ? "robotic" : "visual";
    if (els.ritualSessionTitle) {
      els.ritualSessionTitle.textContent = ritualRunningTitle(isRobotic ? "robotic" : "visual");
    }
    if (els.ritualTapHint) els.ritualTapHint.hidden = isRobotic;
    if (els.ritualSessionMode) {
      els.ritualSessionMode.textContent = ritualRunningTitle(isRobotic ? "robotic" : "visual");
    }
    if (els.ritualSessionKicker) {
      els.ritualSessionKicker.textContent = isRobotic
        ? t("sessionRoboticHint")
        : t("sessionVisualHint");
    }
    if (els.ritualSessionTimer) {
      els.ritualSessionTimer.textContent = formatRitualClock(remaining);
    }
    updateRitualRing(remaining, remaining);
    if (els.ritualSessionBody) els.ritualSessionBody.textContent = body;
    if (els.ritualSession) {
      els.ritualSession.classList.remove("kind-robotic", "kind-visual");
      els.ritualSession.classList.add(isRobotic ? "kind-robotic" : "kind-visual");
    }
    if (els.ritualSessionCancel) els.ritualSessionCancel.textContent = t("sessionPause");
    setRitualCardState("running");
    setRitualStage(true);

    if (isRobotic) {
      state.bubbleMode = "robotic";
      save(state);
      renderActiveBubble();
    }

    ritualRun = {
      kind,
      remaining,
      total: remaining,
      sessionCount: 0,
      paused: false,
      timerId: window.setInterval(tickRitualSession, 1000),
    };
    startSessionMusic().catch(() => {});
  }

  function finishRitualSession() {
    completeRitualSession({ mark: true });
  }

  function formatTime(iso) {
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${y}-${m}-${day} ${hh}:${mm}`;
    } catch {
      return iso;
    }
  }

  function formatCardUpdated(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const m = d.getMonth() + 1;
      const day = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      if (locale === "en") return `${t("updatedAt")} ${m}/${day} · ${hh}:${mm}`;
      return `${t("updatedAt")} ${m}.${day} · ${hh}:${mm}`;
    } catch {
      return "";
    }
  }

  function formatHistoryMeta(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const day = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${y}.${m}.${day} · ${hh}:${mm}`;
    } catch {
      return "";
    }
  }

  function savedAtForCurrentText(text) {
    const hit = state.affirmHistory.find((item) => item.text === text);
    return hit?.savedAt || "";
  }

  function setOutlineBadge(el, tagId) {
    if (!el) return;
    if (!tagId) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    const opt = allTagOptions().find((t) => t.id === tagId);
    el.hidden = false;
    el.textContent = opt?.label || tagLabel(tagId);
    el.className = `badge badge-outline tone-${opt?.tone || "custom"}`;
  }

  let historyFilterTag = "all";

  function renderHistoryTagBar() {
    const bar = els.historyTagBar;
    if (!bar) return;
    bar.innerHTML = "";

    bar.appendChild(
      buildTagChip({
        id: "all",
        label: t("historyFilterAll"),
        icon: "fa-wand-magic-sparkles",
        tone: "all",
        active: historyFilterTag === "all",
      })
    );
    for (const tag of allTagOptions()) {
      bar.appendChild(
        buildTagChip({
          id: tag.id,
          label: tag.label,
          icon: tag.icon,
          tone: tag.tone,
          active: historyFilterTag === tag.id,
        })
      );
    }
    bar.appendChild(
      buildTagChip({
        id: "__add__",
        label: t("addTagChip"),
        icon: "fa-plus",
        tone: "add",
        isAdd: true,
      })
    );
  }

  function renderAffirmHistoryPage() {
    els.historyCurrent.textContent = state.affirmation || "";
    if (els.historyRobotic) {
      els.historyRobotic.textContent = state.roboticAffirmation || DEFAULT_ROBOTIC;
    }
    const storyTags = assignTagsForText(state.affirmation || "", state.customTags);
    const roboticTags = assignTagsForText(state.roboticAffirmation || "", state.customTags);
    setOutlineBadge(els.historyStoryTag, storyTags[0]);
    setOutlineBadge(els.historyRoboticTag, roboticTags[0]);
    if (els.historyStoryMeta) {
      els.historyStoryMeta.textContent = formatCardUpdated(savedAtForCurrentText(state.affirmation));
    }
    if (els.historyRoboticMeta) {
      els.historyRoboticMeta.textContent = formatCardUpdated(
        savedAtForCurrentText(state.roboticAffirmation) || savedAtForCurrentText(state.affirmation)
      );
    }
    renderHistoryTagBar();
    els.affirmHistoryList.innerHTML = "";

    const items = [...state.affirmHistory]
      .sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1))
      .filter((item) => {
        if (historyFilterTag === "all") return true;
        const tags = Array.isArray(item.tags) ? item.tags : [];
        return tags.some(
          (tag) => String(tag).toLowerCase() === String(historyFilterTag).toLowerCase()
        );
      });

    if (state.affirmHistory.length === 0) {
      const li = document.createElement("li");
      li.className = "empty-msg";
      li.textContent = t("historyEmpty");
      els.affirmHistoryList.appendChild(li);
      return;
    }

    if (items.length === 0) {
      const li = document.createElement("li");
      li.className = "empty-msg";
      li.textContent = t("noTagMatches");
      els.affirmHistoryList.appendChild(li);
      return;
    }

    for (const item of items) {
      const li = document.createElement("li");
      li.dataset.id = item.id;

      const tagRow = document.createElement("div");
      tagRow.className = "history-item-tags is-readonly";
      let itemTags = normalizeItemTags(item.tags, state.customTags);
      if (!itemTags.length) itemTags = assignTagsForText(item.text, state.customTags);
      for (const tagId of itemTags) {
        const opt = allTagOptions().find(
          (tag) => String(tag.id).toLowerCase() === String(tagId).toLowerCase()
        );
        if (!opt) continue;
        const chip = buildTagChip({
          id: opt.id,
          label: opt.label,
          icon: opt.icon,
          tone: opt.tone,
          active: false,
        });
        chip.classList.add("history-item-tag", "is-on");
        chip.disabled = true;
        chip.type = "button";
        tagRow.appendChild(chip);
      }

      const snippet = document.createElement("div");
      snippet.className = "snippet";
      snippet.textContent = item.text;

      const meta = document.createElement("div");
      meta.className = "meta";
      const timeEl = document.createElement("span");
      timeEl.className = "meta-time";
      timeEl.textContent = formatHistoryMeta(item.savedAt);
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "history-delete";
      delBtn.setAttribute("aria-label", t("deleteRecord"));
      delBtn.title = t("delete");
      delBtn.innerHTML = '<img src="assets/icon-trash.svg" width="14" height="14" alt="" />';
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteAffirmHistory(item.id);
      });
      meta.appendChild(timeEl);
      meta.appendChild(delBtn);

      if (tagRow.childElementCount) li.appendChild(tagRow);
      li.appendChild(snippet);
      li.appendChild(meta);
      els.affirmHistoryList.appendChild(li);
    }
  }

  function toggleHistoryItemTag(id, tagId) {
    const item = state.affirmHistory.find((entry) => entry.id === id);
    if (!item) return;
    const tags = Array.isArray(item.tags) ? [...item.tags] : [];
    const idx = tags.findIndex(
      (tag) => String(tag).toLowerCase() === String(tagId).toLowerCase()
    );
    if (idx >= 0) tags.splice(idx, 1);
    else tags.push(tagId);
    item.tags = tags.slice(0, 8);
    save(state);
    renderAffirmHistoryPage();
  }

  function addCustomTag(label) {
    const next = String(label || "")
      .trim()
      .slice(0, 16);
    if (!next) return false;
    if (BUILTIN_TAGS.some((tag) => tag.id === next.toLowerCase())) return false;
    if ((state.customTags || []).some((tag) => tag.toLowerCase() === next.toLowerCase())) {
      historyFilterTag = next;
      return true;
    }
    state.customTags = [...(state.customTags || []), next].slice(0, 24);
    historyFilterTag = next;
    save(state);
    return true;
  }

  function deleteAffirmHistory(id) {
    if (!id) return;
    const next = state.affirmHistory.filter((item) => item.id !== id);
    if (next.length === state.affirmHistory.length) return;
    state.affirmHistory = next;
    save(state);
    renderAffirmHistoryPage();
  }

  function isAnyPageOpen() {
    return (
      (els.pageHistory && !els.pageHistory.hidden) ||
      (els.pageEdit && !els.pageEdit.hidden) ||
      (els.pageChat && !els.pageChat.hidden) ||
      (els.pageProfile && !els.pageProfile.hidden) ||
      (els.pageUserCenter && !els.pageUserCenter.hidden) ||
      (els.pageAppearance && !els.pageAppearance.hidden) ||
      (els.pageFaq && !els.pageFaq.hidden) ||
      (els.pageDiary && !els.pageDiary.hidden) ||
      (els.pageFavorites && !els.pageFavorites.hidden) ||
      (els.pageAuth && !els.pageAuth.hidden) ||
      (els.diarySheet && !els.diarySheet.hidden)
    );
  }

  function buildActivityBrief() {
    const weekKeys = getWeekKeys();
    const monthKeys = getMonthKeys();
    const weekCount = sumMap(state.days, weekKeys);
    const monthCount = sumMap(state.days, monthKeys);
    const totalCount = getTotalCount();
    const weekTime = sumMap(state.timeDays, weekKeys);
    const monthTime = sumMap(state.timeDays, monthKeys);
    const totalTime = Object.values(state.timeDays).reduce(
      (sum, n) => sum + (Number(n) || 0),
      0
    );

    const recentDays = Object.entries(state.days)
      .filter(([, n]) => Number(n) > 0)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 14)
      .map(([date, count]) =>
        tf("activityDayLine", {
          date,
          n: count,
          duration: formatDuration(state.timeDays[date] || 0),
        })
      )
      .join("\n");

    const empty = t("emptyValue");
    return [
      tf("activityToday", { n: getTodayCount() }),
      tf("activityWeek", { n: weekCount, duration: formatDuration(weekTime) }),
      tf("activityMonth", { n: monthCount, duration: formatDuration(monthTime) }),
      tf("activityTotal", { n: totalCount, duration: formatDuration(totalTime) }),
      recentDays ? tf("activityRecent", { lines: recentDays }) : t("activityNoRecent"),
      tf("activityStory", { text: state.affirmation || empty }),
      tf("activityRobotic", { text: state.roboticAffirmation || empty }),
      tf("activityGoals", { text: state.dailyPlan?.goals || t("notGenerated") }),
    ].join("\n");
  }

  function systemPrompt() {
    const manual =
      coachManual?.trim() ||
      [
        "你是高阶显化 coach：融合 Sammy robotic affirming、N姐假设法则、内维尔活在终点。",
        "风格像 B 站干货向（钰脑/终会见）：直接定位问题，给每日目标与肯定语，不空安慰。",
        "每天检查视觉化、肯定语、SC 稳定度、抓取感与旧故事。",
      ].join("\n");

    return [
      "你是 Affirm Pingu 的高阶显化导师（Pingu Coach）。",
      "严格遵循下面的 coach 手册与用户档案；不要降级成只会安慰的聊天机器人。",
      locale === "en"
        ? "Reply in English. Diagnose first, then explain the mechanism and give actionable steps."
        : "用中文回复。先定位问题，再给机制解释与可执行步骤。",
      "完整复盘用手册中的【定位】【机制】【今日目标】【肯定语】【视觉化】【若崩了】结构。",
      "学到耐久新细节时：结构化字段用 [[PROFILE]]（goal/oldStory/effectiveAffirms/crashPatterns/boundaries/notes），零散事实用 [[MEMORY]]。",
      "故事稿用 [[AFFIRM]]...[[/AFFIRM]]；机械 A 短句用 [[AFFIRM_SHORT]]...[[/AFFIRM_SHORT]]。",
      "给出今日目标时追加 [[DAILY]]goals: ...\\nvisual: ...[[/DAILY]]，会写入首页「今日仪式」。",
      "不要编造用户没说过的事实；尊重用户自己声明的终点目标，同时坚持稳 SC。档案为空时先问清目标再给肯定语。",
      "",
      "===== COACH 手册 =====",
      manual,
      "",
      "===== 用户结构化档案 =====",
      formatCoachProfile(ai.coachProfile),
    ].join("\n");
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function applyInlineMarkdown(text) {
    let s = String(text || "");
    const stash = [];
    const park = (html) => {
      const key = `\u0000MD${stash.length}\u0000`;
      stash.push(html);
      return key;
    };

    s = s.replace(/`([^`\n]+)`/g, (_, code) =>
      park(`<code class="md-code">${code}</code>`)
    );
    s = s.replace(/\*\*\*([^*\n]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    s = s.replace(/___([^_\n]+)___/g, "<strong><em>$1</em></strong>");
    s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
    s = s.replace(/(^|[\s（(【「『"'])_([^_\n]+)_(?=[\s）)】」』"'.,!?;:，。！？、]|$)/g, "$1<em>$2</em>");
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_, label, url) =>
      park(
        `<a class="md-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
      )
    );

    stash.forEach((html, i) => {
      s = s.replace(`\u0000MD${i}\u0000`, html);
    });
    return s;
  }

  function renderMarkdown(src) {
    const raw = String(src || "").replace(/\r\n/g, "\n").trim();
    if (!raw) return "";

    const blocks = [];
    let text = escapeHtml(raw).replace(/```([\s\S]*?)```/g, (_, code) => {
      const key = `\u0000BLK${blocks.length}\u0000`;
      blocks.push(
        `<pre class="md-pre"><code>${code.replace(/^\n+|\n+$/g, "")}</code></pre>`
      );
      return key;
    });

    const lines = text.split("\n");
    const out = [];
    let listType = null;

    const closeList = () => {
      if (listType) {
        out.push(listType === "ol" ? "</ol>" : "</ul>");
        listType = null;
      }
    };

    for (const line of lines) {
      const blockMatch = line.match(/^\u0000BLK(\d+)\u0000$/);
      if (blockMatch) {
        closeList();
        out.push(blocks[Number(blockMatch[1])] || "");
        continue;
      }

      const heading = line.match(/^#{1,3}\s+(.+)$/);
      if (heading) {
        closeList();
        out.push(`<div class="md-h">${applyInlineMarkdown(heading[1])}</div>`);
        continue;
      }

      const ul = line.match(/^[-*•]\s+(.+)$/);
      if (ul) {
        if (listType !== "ul") {
          closeList();
          out.push('<ul class="md-list">');
          listType = "ul";
        }
        out.push(`<li>${applyInlineMarkdown(ul[1])}</li>`);
        continue;
      }

      const ol = line.match(/^\d+\.\s+(.+)$/);
      if (ol) {
        if (listType !== "ol") {
          closeList();
          out.push('<ol class="md-list">');
          listType = "ol";
        }
        out.push(`<li>${applyInlineMarkdown(ol[1])}</li>`);
        continue;
      }

      if (!line.trim()) {
        closeList();
        out.push('<div class="md-gap"></div>');
        continue;
      }

      closeList();
      out.push(`<p class="md-p">${applyInlineMarkdown(line)}</p>`);
    }
    closeList();
    return out.join("");
  }

  const CHAT_AVATAR_SRC = "assets/pingu-wave-blink.gif";

  function fillChatBubble(bubble, content, { markdown = false } = {}) {
    if (!bubble) return;
    if (markdown) {
      bubble.classList.add("md");
      bubble.innerHTML = renderMarkdown(content);
    } else {
      bubble.classList.remove("md");
      bubble.textContent = content;
    }
  }

  function createChatAvatar() {
    const wrap = document.createElement("div");
    wrap.className = "chat-msg-avatar";
    wrap.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.src = CHAT_AVATAR_SRC;
    img.alt = "";
    img.decoding = "async";
    wrap.appendChild(img);
    return wrap;
  }

  function mountChatMessage(role, content, extraClass = "") {
    if (!els.chatMessages) return null;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}${extraClass ? ` ${extraClass}` : ""}`;
    const useMd =
      !extraClass.includes("pending") && (role === "assistant" || role === "user");
    fillChatBubble(bubble, content, { markdown: useMd });

    if (role === "assistant") {
      const row = document.createElement("div");
      row.className = `chat-row assistant${extraClass ? ` ${extraClass}` : ""}`;
      row.appendChild(createChatAvatar());
      row.appendChild(bubble);
      els.chatMessages.appendChild(row);
      return bubble;
    }

    els.chatMessages.appendChild(bubble);
    return bubble;
  }

  function isChatNearBottom(threshold = 72) {
    const el = els.chatMessages;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  }

  function updateChatJumpBottom() {
    if (!els.chatJumpBottom || !els.chatMessages) return;
    const show = els.chatMessages.scrollHeight > els.chatMessages.clientHeight + 8 && !isChatNearBottom();
    els.chatJumpBottom.hidden = !show;
  }

  function scrollChatToBottom({ smooth = true } = {}) {
    if (!els.chatMessages) return;
    els.chatMessages.scrollTo({
      top: els.chatMessages.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
    window.setTimeout(updateChatJumpBottom, smooth ? 320 : 0);
  }

  function renderChatMessages({ stickToBottom = false } = {}) {
    if (!els.chatMessages) return;
    const prevTop = els.chatMessages.scrollTop;
    els.chatMessages.innerHTML = "";
    if (!ai.messages.length) {
      const empty = document.createElement("div");
      empty.className = "chat-bubble system";
      empty.textContent = canUseAnyChat() ? t("coachReady") : t("cloudOrKeyMissing");
      els.chatMessages.appendChild(empty);
      updateChatJumpBottom();
      return;
    }
    for (const msg of ai.messages) {
      const shown =
        msg.role === "assistant"
          ? extractMemoryUpdate(msg.content).cleaned || msg.content
          : msg.content;
      mountChatMessage(msg.role, shown);
    }
    if (stickToBottom) {
      els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    } else {
      els.chatMessages.scrollTop = prevTop;
    }
    updateChatJumpBottom();
  }

  function setChatBusy(busy) {
    chatBusy = busy;
    if (els.chatSend) els.chatSend.disabled = busy;
    if (els.btnAnalyze) els.btnAnalyze.disabled = busy;
    if (els.btnDailyCheck) els.btnDailyCheck.disabled = busy;
    if (els.btnShowMemory) els.btnShowMemory.disabled = busy;
    if (els.chatInput) els.chatInput.disabled = busy;
    els.iconChat?.classList.toggle("is-chat-loading", busy);
  }

  function updateSegIndicator(track, { instant = false } = {}) {
    if (!track) return;
    const indicator = track.querySelector(".seg-indicator");
    if (!indicator) return;
    const active =
      track.querySelector(".task-seg-btn.is-active") ||
      track.querySelector(".edit-kind-tab.is-active") ||
      track.querySelector(".tab.active");
    if (!active) {
      indicator.style.opacity = "0";
      return;
    }
    const tr = track.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    const x = ar.left - tr.left;
    const w = ar.width;
    if (instant) indicator.style.transition = "none";
    indicator.style.opacity = "1";
    indicator.style.width = `${w}px`;
    indicator.style.transform = `translate3d(${x}px, 0, 0)`;
    indicator.classList.add("is-ready");
    if (instant) {
      void indicator.offsetWidth;
      indicator.style.transition = "";
    }
  }

  function syncAllSegIndicators({ instant = false } = {}) {
    document.querySelectorAll(".task-seg, .cal-tabs").forEach((track) => {
      updateSegIndicator(track, { instant });
    });
  }

  function popRailNavIcon(btn) {
    if (!btn) return;
    const icon = btn.querySelector(".rail-icon-img");
    btn.classList.remove("is-nav-pop");
    icon?.classList.remove("is-icon-pop");
    void btn.offsetWidth;
    btn.classList.add("is-nav-pop");
    if (icon) {
      void icon.offsetWidth;
      icon.classList.add("is-icon-pop");
    }
  }

  function flashPageEnter(pageEl) {
    if (!pageEl) return;
    pageEl.classList.remove("page-enter");
    void pageEl.offsetWidth;
    pageEl.classList.add("page-enter");
  }

  function revealAppPage(pageEl) {
    if (!pageEl) return;
    pageEl.hidden = false;
    flashPageEnter(pageEl);
  }

  function flashSaveButton(btn) {
    if (!btn) return;
    btn.classList.remove("is-save-flash");
    void btn.offsetWidth;
    btn.classList.add("is-save-flash");
  }

  function appendLocalBubble(role, content, extraClass = "") {
    if (!els.chatMessages) return null;
    const empty = els.chatMessages.querySelector(".chat-bubble.system");
    if (empty) empty.remove();
    const bubble = mountChatMessage(role, content, extraClass);
    updateChatJumpBottom();
    return bubble;
  }

  function getCloudApiBase() {
    return (ai.cloudApiBase || DEFAULT_CLOUD_API).replace(/\/+$/, "");
  }

  function hasCloudSession() {
    return Boolean(String(ai.cloudToken || "").trim());
  }

  const ONBOARDING_STORAGE_KEY = "affirm-pingu-onboarding-v1";

  function shouldShowOnboarding() {
    return !hasCloudSession() && localStorage.getItem(ONBOARDING_STORAGE_KEY) !== "done";
  }

  function showOnboarding() {
    if (!els.onboardingGate) return;
    els.onboardingGate.hidden = false;
    document.body.classList.add("onboarding-open");
  }

  function hideOnboarding({ remember = false } = {}) {
    if (remember) localStorage.setItem(ONBOARDING_STORAGE_KEY, "done");
    if (els.onboardingGate) els.onboardingGate.hidden = true;
    document.body.classList.remove("onboarding-open");
  }

  function startOnboardingAuth(mode) {
    hideOnboarding();
    setAuthUiMode(mode);
    openAuthPage({ returnTo: "onboarding" });
  }

  function completeOnboarding() {
    hideOnboarding({ remember: true });
    if (els.pageAuth) els.pageAuth.hidden = true;
    closePages();
  }

  function showNameSetupStep() {
    if (!els.authNameStep) return;
    els.authNameStep.hidden = false;
    if (els.authDisplayName) {
      els.authDisplayName.value = "";
      window.requestAnimationFrame(() => els.authDisplayName?.focus());
    }
  }

  function completeNameSetup() {
    const name = (els.authDisplayName?.value || "").trim().slice(0, 24);
    if (!name) {
      els.authDisplayName?.focus();
      return;
    }
    theme.displayName = name;
    theme.avatarLetter = ([...name][0] || "D").toUpperCase();
    theme.avatarCustom = "";
    saveTheme(theme);
    appearanceDraft = { ...theme };
    syncUserProfileFromTheme();
    updateHomeGreeting();
    if (els.authNameStep) els.authNameStep.hidden = true;
    completeOnboarding();
  }

  function canUseCloudChat() {
    return hasCloudSession() && Boolean(ai.cloudCanChat);
  }

  function canUseAnyChat() {
    return canUseCloudChat() || Boolean(String(ai.apiKey || "").trim());
  }

  function applyCloudUser(user) {
    if (!user || typeof user !== "object") return;
    ai.cloudCredits = Number(user.creditsRemaining) || 0;
    ai.cloudPlanExpiresAt =
      typeof user.planExpiresAt === "string" ? user.planExpiresAt : "";
    ai.cloudCanChat = Boolean(user.canChat);
    if (typeof user.email === "string" && user.email) ai.cloudEmail = user.email;
    ai.cloudHasEmail = Boolean(user.hasEmail ?? user.email);
    ai.cloudHasPhone = Boolean(user.hasPhone ?? user.phone);
    if (typeof user.phone === "string") ai.cloudPhone = user.phone;
    if (typeof user.phoneMasked === "string") ai.cloudPhoneMasked = user.phoneMasked;
    saveAi();
    paintCloudStatus();
    syncAuthPageUi();
  }

  function normalizeClientPhone(raw) {
    let digits = String(raw || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("86") && digits.length >= 13) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("1")) return `+86${digits}`;
    if (String(raw || "").trim().startsWith("+")) return `+${digits}`;
    if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
    return "";
  }

  function cloudAccountLabel() {
    if (ai.cloudEmail) return ai.cloudEmail;
    if (ai.cloudPhoneMasked) return ai.cloudPhoneMasked;
    if (ai.cloudPhone) return ai.cloudPhone;
    return "—";
  }

  function cloudLogout() {
    ai.cloudToken = "";
    ai.cloudCanChat = false;
    ai.cloudCredits = 0;
    ai.cloudPlanExpiresAt = "";
    ai.cloudEmail = "";
    ai.cloudPhone = "";
    ai.cloudPhoneMasked = "";
    ai.cloudHasEmail = false;
    ai.cloudHasPhone = false;
    saveAi();
    paintCloudStatus();
    syncAuthPageUi();
  }

  function formatCloudDate(iso) {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return String(iso).slice(0, 10);
    }
  }

  function paintCloudStatus() {
    if (!els.cloudStatus) return;
    if (!hasCloudSession()) {
      els.cloudStatus.textContent = t("cloudStatusLoggedOut");
      return;
    }
    if (ai.cloudCanChat) {
      els.cloudStatus.textContent = tf("cloudStatusReady", {
        n: ai.cloudCredits,
        date: formatCloudDate(ai.cloudPlanExpiresAt),
      });
      return;
    }
    if (!ai.cloudPlanExpiresAt && ai.cloudCredits <= 0) {
      els.cloudStatus.textContent = t("cloudStatusNeedRedeem");
      return;
    }
    els.cloudStatus.textContent = t("cloudStatusExpired");
  }

  async function cloudFetch(path, options = {}) {
    const url = `${getCloudApiBase()}${path}`;
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (ai.cloudToken && !headers.Authorization) {
      headers.Authorization = `Bearer ${ai.cloudToken.trim()}`;
    }
    const res = await fetch(url, {
      ...options,
      headers,
      body: options.body,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { res, data };
  }

  async function refreshCloudEntitlement() {
    if (!hasCloudSession()) return false;
    const { res, data } = await cloudFetch("/v1/me", { method: "GET" });
    if (!res.ok) {
      if (res.status === 401) {
        ai.cloudToken = "";
        ai.cloudCanChat = false;
        saveAi();
        paintCloudStatus();
      }
      return false;
    }
    applyCloudUser(data);
    return true;
  }

  function readAuthCredentials() {
    const password = els.authPassword?.value || "";
    if (authUiMethod === "phone") {
      const phone = normalizeClientPhone(els.authPhone?.value || "");
      return { phone, password };
    }
    const email = (els.authEmail?.value || "").trim().toLowerCase();
    return { email, password };
  }

  async function cloudAuthLoginFromForm() {
    const { email, phone, password } = readAuthCredentials();
    if ((!email && !phone) || !password) throw new Error(t("cloudAuthFailed"));
    const { res, data } = await cloudFetch("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, phone, password }),
    });
    if (!res.ok) throw new Error(t("cloudAuthFailed"));
    ai.cloudToken = data.token || "";
    applyCloudUser(data.user);
    if (els.authPassword) els.authPassword.value = "";
  }

  async function cloudAuthRegisterFromForm() {
    const { email, phone, password } = readAuthCredentials();
    const confirm = els.authPasswordConfirm?.value || "";
    if (password !== confirm) throw new Error(t("authPasswordMismatch"));
    if ((!email && !phone) || password.length < 8) throw new Error(t("cloudAuthFailed"));
    const { res, data } = await cloudFetch("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, phone, password }),
    });
    if (!res.ok) throw new Error(t("cloudAuthFailed"));
    ai.cloudToken = data.token || "";
    applyCloudUser(data.user);
    if (els.authPassword) els.authPassword.value = "";
    if (els.authPasswordConfirm) els.authPasswordConfirm.value = "";
  }

  async function cloudAuthBindFromForm() {
    const email = (els.authBindEmail?.value || "").trim().toLowerCase();
    const phone = normalizeClientPhone(els.authBindPhone?.value || "");
    if (!email && !phone) throw new Error(t("authBindFail"));
    const { res, data } = await cloudFetch("/v1/auth/bind", {
      method: "POST",
      body: JSON.stringify({
        email: email.includes("@") ? email : undefined,
        phone: phone || undefined,
      }),
    });
    if (!res.ok) throw new Error(t("authBindFail"));
    applyCloudUser(data.user);
  }

  function setPasswordPanelOpen(open) {
    if (!els.accountPasswordPanel) return;
    els.accountPasswordPanel.hidden = !open;
    if (!open) {
      if (els.accountCurrentPassword) els.accountCurrentPassword.value = "";
      if (els.accountNewPassword) els.accountNewPassword.value = "";
      if (els.accountConfirmPassword) els.accountConfirmPassword.value = "";
      return;
    }
    window.requestAnimationFrame(() => els.accountCurrentPassword?.focus());
  }

  async function changeCloudPassword() {
    const currentPassword = els.accountCurrentPassword?.value || "";
    const newPassword = els.accountNewPassword?.value || "";
    const confirmPassword = els.accountConfirmPassword?.value || "";
    if (!currentPassword || newPassword.length < 8) {
      throw new Error("请输入当前密码，新密码至少 8 位");
    }
    if (newPassword !== confirmPassword) throw new Error(t("authPasswordMismatch"));
    const { res, data } = await cloudFetch("/v1/auth/password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      if (data?.error === "invalid_current_password") throw new Error("当前密码不正确");
      throw new Error("密码修改失败，请稍后重试");
    }
    setPasswordPanelOpen(false);
  }

  function downloadLocalChatHistory() {
    const rows = Array.isArray(ai.messages) ? ai.messages : [];
    const header = [
      "Dreamey. 本机聊天记录",
      `导出时间：${new Date().toLocaleString()}`,
      "",
    ];
    const body = rows.length
      ? rows.flatMap((message) => [
          message.role === "user" ? "我" : "Dreamey",
          String(message.content || "").trim(),
          "",
        ])
      : ["暂无本机聊天记录。", ""];
    const blob = new Blob([[...header, ...body].join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dreamey-chat-${todayKey()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function clearAppCache() {
    if (!("caches" in window)) return 0;
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    return keys.length;
  }

  async function cloudRedeemCode() {
    const code = (els.cloudRedeemCode?.value || "").trim();
    if (!code) throw new Error(t("cloudRedeemFailed"));
    if (!hasCloudSession()) throw new Error(t("cloudOrKeyMissing"));
    const { res, data } = await cloudFetch("/v1/redeem", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    if (!res.ok) throw new Error(t("cloudRedeemFailed"));
    applyCloudUser(data.user);
    saveAi();
    if (els.cloudRedeemCode) els.cloudRedeemCode.value = "";
  }

  async function cloudOpenaiChat(messages) {
    const { res, data } = await cloudFetch("/v1/chat", {
      method: "POST",
      body: JSON.stringify({
        messages,
        model: ai.model || "gpt-5.6-luna",
      }),
    });
    if (res.status === 402) {
      if (data?.user) applyCloudUser(data.user);
      throw new Error(t("cloudChatQuota"));
    }
    if (!res.ok) {
      const msg = data?.message || data?.error || tf("requestFailedStatus", { status: res.status });
      throw new Error(msg);
    }
    if (data?.user) applyCloudUser(data.user);
    const text = data?.content?.trim();
    if (!text) throw new Error(t("emptyModelResponse"));
    return text;
  }

  async function openaiChatDirect(messages) {
    if (!ai.apiKey.trim()) {
      throw new Error(t("noApiKey"));
    }

    const payload = {
      model: ai.model || "gpt-5.6-luna",
      temperature: 0.7,
      messages,
    };

    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ai.apiKey.trim()}`,
      },
      body: JSON.stringify(payload),
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const apiMsg = data?.error?.message || "";
      let msg = apiMsg || tf("requestFailedStatus", { status: res.status });
      if (res.status === 401) {
        msg = t("apiKeyInvalid");
      } else if (
        res.status === 429 ||
        /quota|billing|insufficient/i.test(apiMsg)
      ) {
        msg = t("apiQuota");
      } else if (res.status === 404 || /model/i.test(apiMsg)) {
        msg = apiMsg || t("modelUnavailable");
      }
      throw new Error(msg);
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error(t("emptyModelResponse"));
    return text;
  }

  async function pinguChatComplete(messages) {
    if (hasCloudSession()) {
      if (!canUseCloudChat()) await refreshCloudEntitlement();
      if (canUseCloudChat()) return cloudOpenaiChat(messages);
    }
    return openaiChatDirect(messages);
  }

  async function askPingu(userText) {
    if (chatBusy) return false;
    const content = (userText || "").trim();
    if (!content) return false;

    if (!canUseAnyChat()) {
      if (hasCloudSession()) await refreshCloudEntitlement();
    }
    if (!canUseAnyChat()) {
      appendLocalBubble("error", t("cloudOrKeyMissing"));
      return false;
    }

    setChatBusy(true);
    ai.messages.push({ role: "user", content });
    ai.messages = ai.messages.slice(-MAX_CHAT_MESSAGES);
    saveAi();
    appendLocalBubble("user", content);

    const pending = appendLocalBubble("assistant", t("thinking"), "pending");

    try {
      const apiMessages = [
        { role: "system", content: systemPrompt() },
        {
          role: "system",
          content: `以下是用户本地活动摘要（仅供参考）：\n${buildActivityBrief()}`,
        },
        ...ai.messages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const replyRaw = await pinguChatComplete(apiMessages);
      const { cleaned, facts, affirm, affirmShort, daily, profilePatch } =
        extractMemoryUpdate(replyRaw);
      const reply = cleaned || replyRaw;
      if (pending) {
        const pendingRow = pending.closest(".chat-row");
        (pendingRow || pending).remove();
      }
      ai.messages.push({ role: "assistant", content: reply });
      ai.messages = ai.messages.slice(-MAX_CHAT_MESSAGES);
      saveAi();
      appendLocalBubble("assistant", reply);
      const profileChanged = applyProfilePatch(profilePatch);
      const added = mergeCoachMemory(facts);
      if (profileChanged > 0) {
        appendLocalBubble("system", tf("profileFieldsUpdated", { n: profileChanged }));
      }
      if (added > 0) {
        appendLocalBubble("system", tf("notesAdded", { n: added }));
      }
      if (daily && applyDailyPlanUpdate(daily)) {
        appendLocalBubble("system", t("dailySynced"));
      }
      if (affirm && applyAffirmationUpdate(affirm)) {
        appendLocalBubble("system", t("storySynced"));
      }
      if (affirmShort && applyRoboticUpdate(affirmShort)) {
        appendLocalBubble("system", t("roboticSynced"));
      }
      return true;
    } catch (err) {
      if (pending) {
        const pendingRow = pending.closest(".chat-row");
        (pendingRow || pending).remove();
      }
      appendLocalBubble("error", err?.message || t("requestFailed"));
      return false;
    } finally {
      setChatBusy(false);
    }
  }

  async function analyzeRecent(isAuto = false) {
    const prompt = [
      "请根据我的本地活动数据与用户档案，做一次显化复盘（不是空安慰）：",
      "重点检查：SC 稳不稳、肯定语有没有在抓取、视觉化是否停在终点、有没有被 3D 带跑。",
      "输出【定位】【机制】【今日目标】【肯定语】【视觉化】【若崩了】。",
      "故事稿若需替换：用 [[AFFIRM]]；机械 A 短句用 [[AFFIRM_SHORT]]；今日目标用 [[DAILY]]。",
      isAuto ? "这是今天自动复盘。" : "",
    ]
      .filter(Boolean)
      .join("\n");

    const ok = await askPingu(prompt);
    if (isAuto && ok) {
      ai.lastAutoAnalyzeDate = todayKey();
      saveAi();
    }
  }

  async function dailyCoachCheck() {
    const prompt = [
      "请对我做「今日显化检查」（高阶 coach 模式）：",
      "结合我的活动数据、当前故事稿、机械 A 短句、用户档案。",
      "若信息不够，先基于已有信息定位最可能卡点，再最多追问 2 个关键问题。",
      "必须给出今日目标 + 1 条 SC 短句 + 1 条终点/SP 短句 + 一个短视觉化脚本。",
      "用 [[DAILY]] 写入今日目标与视觉化；用 [[AFFIRM_SHORT]] 写入可狂 A 的短句；长故事稿必要时用 [[AFFIRM]]。",
      "不要一味安慰；有问题就直接说。",
    ].join("\n");
    await askPingu(prompt);
  }

  function showCoachMemory() {
    openProfilePage({ returnTo: "chat" });
  }

  function syncTopChrome() {
    const chatOpen = Boolean(els.pageChat && !els.pageChat.hidden);
    const anyPage = isAnyPageOpen();
    const showHomeTop = activeNav === "home" && !anyPage && !chatOpen && !openDrawer;
    els.screen?.classList.toggle("is-home", showHomeTop);
    if (els.topBar) els.topBar.hidden = !showHomeTop;
    if (els.taskDock) els.taskDock.hidden = !showHomeTop;
    if (els.homeMusicHub) els.homeMusicHub.hidden = !showHomeTop;
  }

  function fillProfileForm(profile) {
    const p = profile || ai.coachProfile || DEFAULT_COACH_PROFILE;
    if (els.profileGoal) els.profileGoal.value = p.goal || "";
    if (els.profileOldStory) els.profileOldStory.value = p.oldStory || "";
    if (els.profileEffective) els.profileEffective.value = p.effectiveAffirms || "";
    if (els.profileCrash) els.profileCrash.value = p.crashPatterns || "";
    if (els.profileBoundaries) els.profileBoundaries.value = p.boundaries || "";
    if (els.profileNotes) els.profileNotes.value = p.notes || "";
  }

  function readProfileForm() {
    return {
      goal: (els.profileGoal?.value || "").trim(),
      oldStory: (els.profileOldStory?.value || "").trim(),
      effectiveAffirms: (els.profileEffective?.value || "").trim(),
      crashPatterns: (els.profileCrash?.value || "").trim(),
      boundaries: (els.profileBoundaries?.value || "").trim(),
      notes: (els.profileNotes?.value || "").trim(),
    };
  }

  let profileAutoSaveTimer = null;
  let profileSavedHideTimer = null;
  /** @type {string | null | undefined} undefined = keep saved; null = cleared; string = new */
  let profileAvatarDraft = undefined;

  function refreshLucideIcons(root) {
    if (typeof lucide === "undefined" || !lucide.createIcons) return;
    const opts = { attrs: { "stroke-width": 2 }, nameAttr: "data-lucide" };
    if (root && root.querySelectorAll) opts.root = root;
    lucide.createIcons(opts);
  }

  function showProfileSavedFlag() {
    const el = els.profileSavedFlag;
    if (!el) return;
    el.hidden = false;
    el.classList.remove("is-visible");
    void el.offsetWidth;
    el.classList.add("is-visible");
    refreshLucideIcons(el);
    clearTimeout(profileSavedHideTimer);
    profileSavedHideTimer = setTimeout(() => {
      el.classList.remove("is-visible");
    }, 2400);
  }

  function scheduleProfileAutoSave() {
    if (!els.pageProfile || els.pageProfile.hidden) return;
    clearTimeout(profileAutoSaveTimer);
    profileAutoSaveTimer = setTimeout(() => {
      saveProfileFromForm({ stayOnPage: true });
    }, 650);
  }

  function syncUserCenterProfile() {
    syncUserProfileFromTheme();
  }

  function hideUserHubPages() {
    if (els.pageUserCenter) els.pageUserCenter.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageFaq) els.pageFaq.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageAuth) els.pageAuth.hidden = true;
    closeUserProfileSheet();
  }

  function leaveUserHubChrome() {
    hideUserHubPages();
    if (els.iconSettings) els.iconSettings.classList.remove("active");
  }

  function defaultDisplayName() {
    return t("greetingName").replace(/,\s*$/, "").trim();
  }

  function getUserDisplayName() {
    const custom = (theme.displayName || "").trim();
    return custom || defaultDisplayName();
  }

  function getUserAvatarLetter() {
    const custom = (theme.avatarLetter || "").trim();
    if (custom) return custom.slice(0, 1).toUpperCase();
    const fromName = getUserDisplayName().trim();
    return (fromName.slice(0, 1) || "N").toUpperCase();
  }

  function greetingNameLine() {
    return `${getUserDisplayName()},`;
  }

  function activeAvatarImageUrl() {
    const custom = (theme.avatarCustom || "").trim();
    return custom || "";
  }

  function paintAvatarSlot({ wrap, img, letterEl, url, letter }) {
    const hasPhoto = Boolean(url);
    if (wrap) wrap.classList.toggle("has-photo", hasPhoto);
    if (img) {
      if (hasPhoto) {
        img.src = url;
        img.hidden = false;
      } else {
        img.hidden = true;
        img.removeAttribute("src");
      }
    }
    if (letterEl) {
      letterEl.textContent = letter;
      letterEl.hidden = hasPhoto;
    }
  }

  function syncUserProfileFromTheme() {
    const nameLine = greetingNameLine();
    const letter = getUserAvatarLetter();
    const photo = activeAvatarImageUrl();
    const greetingNameEl = document.getElementById("home-greeting-name");
    if (greetingNameEl) greetingNameEl.textContent = nameLine;
    if (els.userCenterName) els.userCenterName.textContent = getUserDisplayName();
    paintAvatarSlot({
      wrap: els.userCenterAvatar,
      img: els.userCenterAvatarPhoto,
      letterEl: els.userCenterAvatarLetter,
      url: photo,
      letter,
    });
    paintAvatarSlot({
      wrap: els.iconSettings,
      img: els.iconSettingsPhoto,
      letterEl: els.iconSettingsLetter,
      url: photo,
      letter,
    });
  }

  function syncUserProfileSheetPreview() {
    const letter =
      (els.userProfileName?.value || "").trim().slice(0, 1).toUpperCase() ||
      getUserAvatarLetter();
    let url = activeAvatarImageUrl();
    if (profileAvatarDraft !== undefined) {
      url = profileAvatarDraft || "";
    }
    paintAvatarSlot({
      wrap: els.userProfileAvatarPreview,
      img: els.userProfileAvatarPreviewImg,
      letterEl: els.userProfileAvatarPreviewLetter,
      url,
      letter,
    });
  }

  function openUserProfileSheet() {
    if (!els.userProfileSheet) return;
    profileAvatarDraft = undefined;
    if (els.userProfileName) els.userProfileName.value = getUserDisplayName();
    syncUserProfileSheetPreview();
    els.userProfileSheet.hidden = false;
    refreshLucideIcons(els.userProfileSheet);
    els.userProfileName?.focus();
  }

  function closeUserProfileSheet() {
    if (els.userProfileSheet) els.userProfileSheet.hidden = true;
    profileAvatarDraft = undefined;
  }

  async function handleUserAvatarUpload(file) {
    if (!file) return;
    try {
      profileAvatarDraft = await compressImageFile(file, 512, 0.88);
      syncUserProfileSheetPreview();
    } catch (err) {
      window.alert(err?.message || t("uploadFail"));
    }
  }

  function saveUserProfileFromSheet() {
    const name = (els.userProfileName?.value || "").trim().slice(0, 24);
    if (!name) return;
    theme.displayName = name;
    if (profileAvatarDraft !== undefined) {
      theme.avatarCustom = profileAvatarDraft || "";
    }
    if (!theme.avatarCustom) {
      theme.avatarLetter = name.slice(0, 1).toUpperCase();
    }
    saveTheme(theme);
    appearanceDraft = { ...theme };
    syncUserProfileFromTheme();
    flashSaveButton(els.userProfileSave);
    closeUserProfileSheet();
  }

  function openUserCenterPage() {
    setDrawer(null);
    closeChatSheet({ restore: false });
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageDiary) els.pageDiary.hidden = true;
    if (els.pageFavorites) els.pageFavorites.hidden = true;
    if (els.diarySheet) els.diarySheet.hidden = true;
    hideUserHubPages();
    revealAppPage(els.pageUserCenter);
    if (els.iconAffirm) els.iconAffirm.classList.remove("active");
    if (els.iconChat) els.iconChat.classList.remove("active");
    if (els.iconSettings) els.iconSettings.classList.add("active");
    els.screen?.classList.add("page-open");
    setNavActive("home");
    syncUserCenterProfile();
    syncTopChrome();
    refreshLucideIcons(els.pageUserCenter);
  }

  function setAuthUiMode(mode) {
    authUiMode = mode === "register" ? "register" : "login";
    els.authTabLogin?.classList.toggle("is-active", authUiMode === "login");
    els.authTabRegister?.classList.toggle("is-active", authUiMode === "register");
    els.authTabLogin?.setAttribute("aria-selected", authUiMode === "login" ? "true" : "false");
    els.authTabRegister?.setAttribute("aria-selected", authUiMode === "register" ? "true" : "false");
    if (els.authPasswordConfirmField) {
      els.authPasswordConfirmField.hidden = authUiMode !== "register";
    }
    if (els.authSubmit) {
      els.authSubmit.textContent =
        authUiMode === "register" ? t("authSubmitRegister") : t("authSubmitLogin");
    }
    if (els.authFormTitle) {
      els.authFormTitle.textContent = authUiMode === "register" ? "创建账号" : "欢迎回来";
    }
    if (els.authSwitchMode) {
      els.authSwitchMode.innerHTML =
        authUiMode === "register" ? "已有账号？<span>登录</span>" : "还没有账号？<span>注册</span>";
    }
    if (els.authPassword) {
      els.authPassword.autocomplete = authUiMode === "register" ? "new-password" : "current-password";
    }
  }

  function setAuthUiMethod(method) {
    authUiMethod = method === "phone" ? "phone" : "email";
    els.authMethodEmail?.classList.toggle("is-active", authUiMethod === "email");
    els.authMethodPhone?.classList.toggle("is-active", authUiMethod === "phone");
    if (els.authEmailField) els.authEmailField.hidden = authUiMethod !== "email";
    if (els.authPhoneField) els.authPhoneField.hidden = authUiMethod !== "phone";
  }

  function syncAuthPageUi() {
    const loggedIn = hasCloudSession();
    els.pageAuth?.classList.toggle("is-account-settings", loggedIn);
    if (els.authLoggedIn) els.authLoggedIn.hidden = !loggedIn;
    if (els.authForm) els.authForm.hidden = loggedIn;
    if (loggedIn && els.authAccountSummary) {
      els.authAccountSummary.textContent = cloudAccountLabel();
      if (els.accountSettingsName) els.accountSettingsName.textContent = getUserDisplayName();
      if (els.accountSettingsAvatar) els.accountSettingsAvatar.textContent = getUserAvatarLetter();
      if (els.accountVersion) els.accountVersion.textContent = `版本 ${APP_VERSION}`;
    }
    if (loggedIn && els.authEntitlementSummary) {
      if (ai.cloudCanChat) {
        els.authEntitlementSummary.textContent = tf("cloudStatusReady", {
          n: ai.cloudCredits,
          date: formatCloudDate(ai.cloudPlanExpiresAt),
        });
      } else if (!ai.cloudPlanExpiresAt && ai.cloudCredits <= 0) {
        els.authEntitlementSummary.textContent = t("cloudStatusNeedRedeem");
      } else {
        els.authEntitlementSummary.textContent = t("cloudStatusExpired");
      }
    }
    if (loggedIn) {
      if (els.authBindEmail && !ai.cloudHasEmail) {
        els.authBindEmail.value = "";
      } else if (els.authBindEmail && ai.cloudEmail) {
        els.authBindEmail.value = ai.cloudEmail;
      }
      if (els.authBindBlock) {
        els.authBindBlock.hidden = ai.cloudHasEmail && ai.cloudHasPhone;
      }
    }
    if (!loggedIn) {
      setPasswordPanelOpen(false);
      if (els.authEmail && ai.cloudEmail) els.authEmail.value = ai.cloudEmail;
      setAuthUiMode(authUiMode);
      setAuthUiMethod(authUiMethod);
    }
  }

  function openAuthPage({ returnTo = "userCenter" } = {}) {
    authReturnTo = ["settings", "onboarding"].includes(returnTo) ? returnTo : "userCenter";
    setDrawer(null);
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageFaq) els.pageFaq.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageUserCenter) els.pageUserCenter.hidden = true;
    revealAppPage(els.pageAuth);
    if (els.pageAuth) els.pageAuth.scrollTop = 0;
    if (els.iconSettings) els.iconSettings.classList.add("active");
    els.screen?.classList.add("page-open");
    setNavActive("home");
    refreshCloudEntitlement()
      .catch(() => {})
      .finally(() => syncAuthPageUi());
    syncTopChrome();
    refreshLucideIcons(els.pageAuth);
  }

  function closeAuthPage() {
    if (els.pageAuth) els.pageAuth.hidden = true;
    if (authReturnTo === "onboarding") showOnboarding();
    else if (authReturnTo === "settings") openSettingsPage();
    else openUserCenterPage();
  }

  function openSettingsPage() {
    setDrawer(null);
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageFaq) els.pageFaq.hidden = true;
    if (els.pageUserCenter) els.pageUserCenter.hidden = true;
    if (els.pageAuth) els.pageAuth.hidden = true;
    revealAppPage(els.pageAppearance);
    if (els.iconSettings) els.iconSettings.classList.add("active");
    els.screen?.classList.add("page-open");
    setNavActive("home");
    appearanceDraft = { ...theme };
    syncAppearanceFields();
    fillChatSettingsForm();
    refreshCloudEntitlement().catch(() => {});
    syncTopChrome();
    refreshLucideIcons(els.pageAppearance);
  }

  function closeSettingsPage() {
    if (els.pageAppearance && !els.pageAppearance.hidden) {
      persistChatApiSettings();
      commitAppearance({ alertOnFail: false });
    }
    openUserCenterPage();
  }

  function openFaqPage() {
    setDrawer(null);
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    hideUserHubPages();
    revealAppPage(els.pageFaq);
    renderFaq(true);
    if (els.iconSettings) els.iconSettings.classList.add("active");
    els.screen?.classList.add("page-open");
    syncTopChrome();
  }

  function closeFaqPage() {
    openUserCenterPage();
  }

  function openProfilePage({ returnTo = "userCenter" } = {}) {
    profileReturnTo =
      returnTo === "chat" ? "chat" : returnTo === "home" ? "home" : "userCenter";
    setDrawer(null);
    if (profileReturnTo === "chat") {
      if (!chatReturnState) chatReturnState = captureSurfaceState();
      if (els.pageChat) els.pageChat.hidden = true;
      els.screen?.classList.remove("chat-open");
      if (els.iconChat) els.iconChat.classList.remove("active");
    } else {
      closeChatSheet({ restore: false });
    }
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageDiary) els.pageDiary.hidden = true;
    if (els.pageFavorites) els.pageFavorites.hidden = true;
    if (els.diarySheet) els.diarySheet.hidden = true;
    if (els.pageUserCenter) els.pageUserCenter.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageFaq) els.pageFaq.hidden = true;
    if (els.iconAffirm) els.iconAffirm.classList.remove("active");
    if (els.iconChat && profileReturnTo !== "chat") els.iconChat.classList.remove("active");
    if (els.iconSettings) {
      els.iconSettings.classList.toggle("active", profileReturnTo === "userCenter");
    }
    revealAppPage(els.pageProfile);
    els.screen?.classList.add("page-open");
    syncTopChrome();
    profileDraft = { ...(ai.coachProfile || DEFAULT_COACH_PROFILE) };
    fillProfileForm(profileDraft);
    if (els.profileSavedFlag) {
      els.profileSavedFlag.hidden = true;
      els.profileSavedFlag.classList.remove("is-visible");
    }
    refreshLucideIcons(els.pageProfile);
  }

  function closeProfilePage({ backToChat } = {}) {
    let target = profileReturnTo;
    if (backToChat === true) target = "chat";
    else if (backToChat === false) target = "home";
    if (els.pageProfile) els.pageProfile.hidden = true;

    if (target === "chat") {
      if (els.pageChat) els.pageChat.hidden = false;
      els.screen?.classList.add("chat-open");
      if (els.iconChat) els.iconChat.classList.add("active");
      els.screen?.classList.add("page-open");
      syncTopChrome();
      syncOverlayBackdrop();
      return;
    }
    if (target === "userCenter") {
      openUserCenterPage();
      return;
    }
    closePages();
    syncTopChrome();
  }

  function saveProfileFromForm({ stayOnPage = false } = {}) {
    ai.coachProfile = readProfileForm();
    // keep a compact mirror in coachMemory for older flows
    ai.coachMemory = [
      ai.coachProfile.goal && `终点目标：${ai.coachProfile.goal}`,
      ai.coachProfile.oldStory && `旧故事：${ai.coachProfile.oldStory}`,
      ai.coachProfile.effectiveAffirms && `有效肯定语：${ai.coachProfile.effectiveAffirms}`,
      ai.coachProfile.crashPatterns && `崩溃模式：${ai.coachProfile.crashPatterns}`,
      ai.coachProfile.boundaries && `边界：${ai.coachProfile.boundaries}`,
      ai.coachProfile.notes && `备注：${ai.coachProfile.notes}`,
    ]
      .filter(Boolean)
      .slice(0, 80);
    saveAi();
    profileDraft = { ...ai.coachProfile };
    showProfileSavedFlag();
    if (stayOnPage) return;
    closeProfilePage();
    if (profileReturnTo === "chat") appendLocalBubble("system", t("profileSaved"));
  }

  function syncCustomModelField() {
    const customField = document.getElementById("custom-model-field");
    const customInput = document.getElementById("openai-model-custom");
    if (!els.openaiModel || !customField) return;
    const isCustom = els.openaiModel.value === "__custom__";
    customField.hidden = !isCustom;
    if (isCustom && customInput && !customInput.value.trim() && ai.model) {
      customInput.value = ai.model;
    }
  }

  function selectedModelId() {
    if (!els.openaiModel) return ai.model || "gpt-5.6-luna";
    if (els.openaiModel.value === "__custom__") {
      const custom = document.getElementById("openai-model-custom")?.value?.trim();
      return custom || ai.model || "gpt-5.6-luna";
    }
    return els.openaiModel.value || "gpt-5.6-luna";
  }

  function fillChatSettingsForm() {
    if (!els.openaiKey) return;
    els.openaiKey.value = ai.apiKey || "";
    const model = ai.model || "gpt-5.6-luna";
    const options = [...(els.openaiModel?.options || [])].map((o) => o.value);
    if (options.includes(model)) {
      els.openaiModel.value = model;
    } else {
      els.openaiModel.value = "__custom__";
      const customInput = document.getElementById("openai-model-custom");
      if (customInput) customInput.value = model;
    }
    syncCustomModelField();
    if (els.autoAnalyze) els.autoAnalyze.checked = ai.autoAnalyze !== false;
    if (els.cloudApiBase) {
      els.cloudApiBase.value = ai.cloudApiBase || DEFAULT_CLOUD_API;
    }
    paintCloudStatus();
  }

  function persistCloudApiBase() {
    if (!els.cloudApiBase) return;
    ai.cloudApiBase = (els.cloudApiBase.value || DEFAULT_CLOUD_API).trim() || DEFAULT_CLOUD_API;
    saveAi();
  }

  function persistChatApiSettings() {
    if (!els.openaiKey) return;
    ai.apiKey = (els.openaiKey.value || "").trim();
    ai.model = selectedModelId();
    ai.autoAnalyze = Boolean(els.autoAnalyze?.checked);
    saveAi();
  }

  let apiSaveTimer = 0;
  function scheduleChatApiPersist() {
    window.clearTimeout(apiSaveTimer);
    apiSaveTimer = window.setTimeout(persistChatApiSettings, 280);
  }

  function syncOverlayBackdrop() {
    if (!els.drawerBackdrop) return;
    const chatOn = els.pageChat && !els.pageChat.hidden;
    els.drawerBackdrop.hidden = !(openDrawer || chatOn);
  }

  function currentCalTab() {
    if (els.statsInlineView?.classList.contains("active")) return "stats";
    if (els.listView?.classList.contains("active")) return "list";
    return "calendar";
  }

  function captureSurfaceState() {
    return {
      nav: activeNav || "home",
      drawer: openDrawer,
      diary: Boolean(els.pageDiary && !els.pageDiary.hidden),
      favorites: Boolean(els.pageFavorites && !els.pageFavorites.hidden),
      history: Boolean(els.pageHistory && !els.pageHistory.hidden),
      edit: Boolean(els.pageEdit && !els.pageEdit.hidden),
      userCenter: Boolean(els.pageUserCenter && !els.pageUserCenter.hidden),
      appearance: Boolean(els.pageAppearance && !els.pageAppearance.hidden),
      faq: Boolean(els.pageFaq && !els.pageFaq.hidden),
      auth: Boolean(els.pageAuth && !els.pageAuth.hidden),
      profile: Boolean(els.pageProfile && !els.pageProfile.hidden),
      pageOpen: Boolean(els.screen?.classList.contains("page-open")),
      favTab: "videos",
      calTab: currentCalTab(),
    };
  }

  function applyCalTab(tab) {
    const which = tab === "stats" ? "stats" : tab === "list" ? "list" : "calendar";
    if (els.calendarView) els.calendarView.classList.toggle("active", which === "calendar");
    if (els.listView) els.listView.classList.toggle("active", which === "list");
    if (els.statsInlineView) els.statsInlineView.classList.toggle("active", which === "stats");
    els.tabCalendar?.classList.toggle("active", which === "calendar");
    els.tabList?.classList.toggle("active", which === "list");
    els.tabStatsInline?.classList.toggle("active", which === "stats");
    if (els.calPanelFooter) {
      els.calPanelFooter.hidden = which === "stats";
    }
    if (which === "stats") refreshStats();
    requestAnimationFrame(() => {
      const seg = els.tabCalendar?.closest(".cal-tabs");
      updateSegIndicator(seg);
    });
  }

  function restoreSurfaceState(state) {
    if (!state) {
      syncOverlayBackdrop();
      return;
    }
    if (els.pageDiary) els.pageDiary.hidden = !state.diary;
    if (els.pageFavorites) els.pageFavorites.hidden = !state.favorites;
    if (els.pageHistory) els.pageHistory.hidden = !state.history;
    if (els.pageEdit) els.pageEdit.hidden = !state.edit;
    if (els.pageUserCenter) els.pageUserCenter.hidden = !state.userCenter;
    if (els.pageAppearance) els.pageAppearance.hidden = !state.appearance;
    if (els.pageFaq) els.pageFaq.hidden = !state.faq;
    if (els.pageAuth) els.pageAuth.hidden = !state.auth;
    if (els.pageProfile) els.pageProfile.hidden = !state.profile;
    els.screen?.classList.toggle("page-open", Boolean(state.pageOpen));
    setNavActive(state.nav || "home");
    if (state.favorites) {
      setFavoritesTab();
      renderResources();
    }
    if (state.drawer === "calendar") applyCalTab(state.calTab || "calendar");
    // Re-open drawer without wiping restored pages
    openDrawer = null;
    if (state.drawer) setDrawer(state.drawer);
    else {
      setDrawer(null);
      syncOverlayBackdrop();
    }
    syncTopChrome();
  }

  let chatSheetAnimating = false;
  const CHAT_SHEET_MS = 380;

  function finishCloseChatSheet({ keepProfile = false, restore = true } = {}) {
    if (els.pageChat) {
      els.pageChat.hidden = true;
      els.pageChat.classList.remove("is-chat-closing", "is-chat-opening");
    }
    els.iconChat?.classList.remove("is-chat-open");
    els.drawerBackdrop?.classList.remove("chat-backdrop-out");
    chatSheetAnimating = false;
    const pending = chatReturnState;
    chatReturnState = null;
    if (restore && pending) restoreSurfaceState(pending);
    else syncOverlayBackdrop();
    syncTopChrome();
  }

  function closeChatSheet({ keepProfile = false, restore = true } = {}) {
    if (!els.pageChat || els.pageChat.hidden) {
      finishCloseChatSheet({ keepProfile, restore });
      return;
    }
    if (chatSheetAnimating) return;
    chatSheetAnimating = true;
    els.pageChat.classList.remove("is-chat-opening");
    els.pageChat.classList.add("is-chat-closing");
    if (els.iconChat) els.iconChat.classList.remove("active");
    els.drawerBackdrop?.classList.add("chat-backdrop-out");
    requestAnimationFrame(() => {
      els.screen?.classList.remove("chat-open");
    });
    let done = false;
    const complete = () => {
      if (done) return;
      done = true;
      els.pageChat?.removeEventListener("transitionend", onEnd);
      finishCloseChatSheet({ keepProfile, restore });
    };
    const onEnd = (e) => {
      if (e.target !== els.pageChat) return;
      if (e.propertyName !== "transform") return;
      complete();
    };
    els.pageChat.addEventListener("transitionend", onEnd);
    window.setTimeout(complete, CHAT_SHEET_MS + 80);
  }

  function openChatPage() {
    chatReturnState = captureSurfaceState();
    // Park drawers under the sheet; pages stay remembered in chatReturnState
    if (els.calendarDrawer) els.calendarDrawer.hidden = true;
    if (els.statsDrawer) els.statsDrawer.hidden = true;
    if (els.favoritesDrawer) els.favoritesDrawer.hidden = true;
    if (els.pageFavorites) els.pageFavorites.hidden = true;
    openDrawer = null;
    els.screen?.classList.remove("drawer-open");
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageUserCenter) els.pageUserCenter.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageFaq) els.pageFaq.hidden = true;
    if (els.pageDiary) els.pageDiary.hidden = true;
    if (els.pageChat) {
      els.pageChat.hidden = false;
      els.pageChat.classList.remove("is-chat-closing");
      els.pageChat.classList.add("is-chat-opening");
    }
    els.screen?.classList.remove("chat-open");
    void els.pageChat?.offsetWidth;
    requestAnimationFrame(() => {
      els.screen?.classList.add("chat-open");
      els.pageChat?.classList.remove("is-chat-opening");
    });
    if (els.iconAffirm) els.iconAffirm.classList.remove("active");
    if (els.iconSettings) els.iconSettings.classList.remove("active");
    if (els.iconChat) {
      els.iconChat.classList.add("active");
      els.iconChat.classList.remove("is-chat-open");
      void els.iconChat.offsetWidth;
      els.iconChat.classList.add("is-chat-open");
    }
    chatSheetAnimating = false;
    syncOverlayBackdrop();
    renderChatMessages({ stickToBottom: true });
    loadCoachManual();

    if (ai.autoAnalyze && canUseAnyChat() && ai.lastAutoAnalyzeDate !== todayKey() && !chatBusy) {
      window.setTimeout(() => {
        if (els.pageChat && !els.pageChat.hidden) analyzeRecent(true);
      }, 350);
    }
  }

  function setDrawer(which) {
    openDrawer = which;
    if (which && els.pageChat && !els.pageChat.hidden) {
      chatReturnState = null;
      closeChatSheet({ restore: false });
    }
    const calendarOn = which === "calendar";
    const statsOn = which === "stats";
    const resourcesOn = which === "resources";
    const faqOn = which === "faq";
    if (els.calendarDrawer) els.calendarDrawer.hidden = !calendarOn;
    if (els.statsDrawer) els.statsDrawer.hidden = !statsOn;
    if (els.resourcesDrawer) els.resourcesDrawer.hidden = true;
    if (els.faqDrawer) els.faqDrawer.hidden = true;
    if (els.favoritesDrawer) els.favoritesDrawer.hidden = true;
    els.screen.classList.toggle("drawer-open", Boolean(which));
    els.screen.classList.toggle("calendar-open", calendarOn);
    syncOverlayBackdrop();
    if (els.iconCalendar) {
      els.iconCalendar.classList.toggle("active", calendarOn);
      els.iconCalendar.setAttribute("aria-expanded", calendarOn ? "true" : "false");
    }
    if (els.iconStats) {
      els.iconStats.classList.toggle("active", statsOn);
      els.iconStats.setAttribute("aria-expanded", statsOn ? "true" : "false");
    }
    if (statsOn) refreshStats();
    if (calendarOn) {
      requestAnimationFrame(() => {
        const seg = els.tabCalendar?.closest(".cal-tabs");
        updateSegIndicator(seg);
      });
    }
  }

  function setFavoritesTab() {
    if (els.favPanelVideos) els.favPanelVideos.hidden = false;
  }

  function updateRailIndicator({ instant = false } = {}) {
    const items = document.getElementById("rail-items");
    const indicator = document.getElementById("rail-indicator");
    if (!items || !indicator) return;
    const active = items.querySelector(".rail-btn.is-active");
    if (!active) {
      indicator.style.opacity = "0";
      return;
    }
    const ir = items.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    const x = ar.left - ir.left;
    const w = ar.width;
    if (instant) {
      indicator.style.transition = "none";
    }
    indicator.style.opacity = "1";
    indicator.style.width = `${w}px`;
    indicator.style.transform = `translate3d(${x}px, 0, 0)`;
    indicator.classList.add("is-ready");
    if (instant) {
      // force reflow then restore transition
      void indicator.offsetWidth;
      indicator.style.transition = "";
    }
  }

  function setNavActive(nav) {
    activeNav = nav || "home";
    const map = {
      home: els.iconHome,
      affirm: els.iconAffirm,
      diary: els.iconDiary,
      favorites: els.iconFavorites,
    };
    Object.entries(map).forEach(([key, el]) => {
      el?.classList.toggle("is-active", key === activeNav);
      if (key === activeNav) el?.setAttribute("aria-current", "page");
      else el?.removeAttribute("aria-current");
    });
    popRailNavIcon(map[activeNav]);
    syncTopChrome();
    requestAnimationFrame(() => updateRailIndicator());
  }

  function goHome() {
    setDrawer(null);
    closePages({ keepNav: true });
    if (els.pageDiary) els.pageDiary.hidden = true;
    if (els.pageFavorites) els.pageFavorites.hidden = true;
    if (els.diarySheet) els.diarySheet.hidden = true;
    setNavActive("home");
    updateHomeGreeting();
  }

  function closePages({ keepNav = false } = {}) {
    if (els.pageAppearance && !els.pageAppearance.hidden) {
      persistChatApiSettings();
      commitAppearance({ alertOnFail: false });
    }
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageUserCenter) els.pageUserCenter.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageFaq) els.pageFaq.hidden = true;
    if (els.pageAuth) els.pageAuth.hidden = true;
    if (els.pageDiary) els.pageDiary.hidden = true;
    if (els.pageFavorites) els.pageFavorites.hidden = true;
    if (els.diarySheet) els.diarySheet.hidden = true;
    chatReturnState = null;
    closeChatSheet({ restore: false });
    if (els.iconAffirm) els.iconAffirm.classList.remove("active");
    if (els.iconSettings) els.iconSettings.classList.remove("active");
    els.screen?.classList.remove("page-open");
    if (!keepNav) setNavActive("home");
    else syncTopChrome();
  }

  function openHistoryPage() {
    setDrawer(null);
    closeChatSheet();
    leaveUserHubChrome();
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageDiary) els.pageDiary.hidden = true;
    if (els.pageFavorites) els.pageFavorites.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.iconChat) els.iconChat.classList.remove("active");
    if (els.iconSettings) els.iconSettings.classList.remove("active");
    if (els.pageEdit) els.pageEdit.hidden = true;
    revealAppPage(els.pageHistory);
    els.screen?.classList.add("page-open");
    setNavActive("affirm");
    renderAffirmHistoryPage();
  }

  function setEditKind(kind, { syncInput = false } = {}) {
    editKind = kind === "robotic" ? "robotic" : "story";
    const robotic = editKind === "robotic";
    if (els.editKindStory) {
      els.editKindStory.classList.toggle("is-active", !robotic);
      els.editKindStory.setAttribute("aria-selected", robotic ? "false" : "true");
    }
    if (els.editKindRobotic) {
      els.editKindRobotic.classList.toggle("is-active", robotic);
      els.editKindRobotic.setAttribute("aria-selected", robotic ? "true" : "false");
    }
    requestAnimationFrame(() => {
      const seg = els.editKindStory?.closest(".task-seg");
      updateSegIndicator(seg);
    });
    if (els.affirmInput) {
      els.affirmInput.placeholder = robotic
        ? t("editPlaceholderRobotic")
        : t("editPlaceholderStory");
      if (syncInput) {
        const other = robotic
          ? state.affirmation || ""
          : state.roboticAffirmation || "";
        const val = els.affirmInput.value;
        if (!val.trim() || val === other || val === editDraftSource) {
          els.affirmInput.value = "";
          editDraftSource = "";
        }
      }
    }
  }

  function openEditPage(text, kind) {
    leaveUserHubChrome();
    // 空白字符串 = 新建；传入历史文本 = 基于该条修改
    const isBlank = text === "";
    const nextKind =
      kind === "robotic" || kind === "story"
        ? kind
        : isBlank
          ? state.bubbleMode === "robotic"
            ? "robotic"
            : "story"
          : "story";
    editDraftSource = isBlank ? "" : text ?? "";
    setEditKind(nextKind);
    els.affirmInput.value = editDraftSource;
    if (els.pageChat) els.pageChat.hidden = true;
    if (els.iconChat) els.iconChat.classList.remove("active");
    if (els.pageDiary) els.pageDiary.hidden = true;
    if (els.pageFavorites) els.pageFavorites.hidden = true;
    els.pageHistory.hidden = true;
    revealAppPage(els.pageEdit);
    els.screen?.classList.add("page-open");
    setNavActive("affirm");
    requestAnimationFrame(() => {
      const seg = els.editKindStory?.closest(".task-seg");
      updateSegIndicator(seg);
    });
    els.affirmInput.focus();
  }

  function saveAffirmation() {
    const next = els.affirmInput.value.trim();
    if (!next) return;

    if (editKind === "robotic") {
      applyRoboticUpdate(next);
      if (state.bubbleMode !== "robotic") {
        state.bubbleMode = "robotic";
        save(state);
        renderActiveBubble();
      }
    } else {
      applyAffirmationUpdate(next);
      if (state.bubbleMode !== "story") {
        state.bubbleMode = "story";
        save(state);
        renderActiveBubble();
      }
    }
    flashSaveButton(els.saveAffirm);
    openHistoryPage();
  }

  function discardAffirmation() {
    els.affirmInput.value = editDraftSource;
    openHistoryPage();
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (ritualRun || (els.ritualSession && !els.ritualSession.hidden)) {
        completeRitualSession({ mark: false, cancelled: true });
        return;
      }
      if (els.pageEdit && !els.pageEdit.hidden) {
        discardAffirmation();
        return;
      }
      if (els.pageHistory && !els.pageHistory.hidden) {
        closePages();
        return;
      }
      if (els.pageChat && !els.pageChat.hidden) {
        closePages();
        return;
      }
      if (els.pageProfile && !els.pageProfile.hidden) {
        closeProfilePage();
        return;
      }
      if (els.pageFaq && !els.pageFaq.hidden) {
        closeFaqPage();
        return;
      }
      if (els.pageAppearance && !els.pageAppearance.hidden) {
        closeSettingsPage();
        return;
      }
      if (els.pageUserCenter && !els.pageUserCenter.hidden) {
        closePages();
        return;
      }
      if (openDrawer) setDrawer(null);
      return;
    }

    if (e.code !== "Space" && e.key !== " ") return;
    if (isTypingTarget(e.target)) return;
    if (isAnyPageOpen()) return;
    e.preventDefault();
    affirm();
  });

  els.iconCalendar.addEventListener("click", () => {
    if (isAnyPageOpen()) closePages();
    setDrawer(openDrawer === "calendar" ? null : "calendar");
  });

  const RAIL_STORAGE_KEY = "affirm-pingu-rail-collapsed";
  const RITUAL_COLLAPSE_KEY = "affirm-pingu-ritual-collapsed";

  function setRitualCardState(next) {
    ritualCardState = next || "collapsed";
    const card = els.ritualBar;
    if (!card) return;
    const collapsed = ritualCardState === "collapsed";
    if (els.ritualBar) els.ritualBar.hidden = collapsed;
    card.dataset.state = ritualCardState;
    if (els.dailyTasksPill) {
      els.dailyTasksPill.classList.toggle("is-open", !collapsed);
      els.dailyTasksPill.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
    if (els.taskIdle) els.taskIdle.hidden = ritualCardState !== "idle";
    if (els.ritualSession) {
      els.ritualSession.hidden = ritualCardState !== "running";
    }
    if (els.taskSummary) els.taskSummary.hidden = ritualCardState !== "summary";
    const stage = els.stage || card.closest(".stage");
    stage?.classList.toggle("ritual-collapsed", collapsed);
    stage?.classList.toggle("ritual-on", ritualCardState === "running");
    try {
      localStorage.setItem(RITUAL_COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function setRitualCollapsed(collapsed) {
    if (collapsed) {
      if (ritualCardState === "running") return;
      setRitualCardState("collapsed");
    } else {
      if (ritualCardState === "collapsed" || ritualCardState === "summary") {
        setRitualCardState("idle");
        setRitualTab(ritualTab);
      }
    }
  }

  function initRitualCollapsed() {
    // V2 home matches Figma default: task card collapsed
    setRitualCollapsed(true);
  }

  if (els.ritualCollapse) {
    els.ritualCollapse.addEventListener("click", () => setRitualCollapsed(true));
  }
  if (els.ritualExpand) {
    els.ritualExpand.addEventListener("click", () => setRitualCollapsed(false));
  }
  if (els.dailyTasksPill) {
    els.dailyTasksPill.addEventListener("click", () => {
      goHome();
      if (ritualCardState === "collapsed") setRitualCollapsed(false);
      else if (ritualCardState === "idle" || ritualCardState === "summary") setRitualCollapsed(true);
    });
  }
  initRitualCollapsed();

  // Bottom dock stays always expanded
  function setRailCollapsed() {
    els.screen?.classList.remove("rail-collapsed");
    try {
      localStorage.setItem(RAIL_STORAGE_KEY, "0");
    } catch {
      /* ignore */
    }
  }
  setRailCollapsed();

  els.closeCalendar.addEventListener("click", () => setDrawer(null));
  if (els.closeStats) {
    els.closeStats.addEventListener("click", () => setDrawer(null));
  }
  if (els.closeResources) {
    els.closeResources.addEventListener("click", () => setDrawer(null));
  }
  if (els.closeFaq) {
    els.closeFaq.addEventListener("click", () => setDrawer(null));
  }
  if (els.statsTabWeek) {
    els.statsPrevPeriod?.addEventListener("click", () => shiftStatsAnchor(-1));
    els.statsNextPeriod?.addEventListener("click", () => shiftStatsAnchor(1));
    els.statsTabWeek.addEventListener("click", () => setStatsRange("week"));
  }
  if (els.statsTabMonth) {
    els.statsTabMonth.addEventListener("click", () => setStatsRange("month"));
  }
  if (els.resourceAddForm) {
    els.resourceAddForm.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        addCustomResourceLink(
          els.resourceUrlInput?.value || "",
          els.resourceTitleInput?.value || ""
        );
        if (els.resourceUrlInput) els.resourceUrlInput.value = "";
        if (els.resourceTitleInput) els.resourceTitleInput.value = "";
        els.resourceUrlInput?.focus();
      } catch (err) {
        window.alert(err?.message || t("addFailed"));
      }
    });
  }
  if (els.resourceCards) {
    els.resourceCards.addEventListener("click", (e) => {
      const btn = e.target?.closest?.(".resource-card-remove");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      removeCustomResourceLink(btn.getAttribute("data-id"));
    });
  }
  if (els.drawerBackdrop) {
    els.drawerBackdrop.addEventListener("click", () => {
      if (els.pageChat && !els.pageChat.hidden) {
        closeChatSheet({ restore: true });
        return;
      }
      setDrawer(null);
    });
  }

  if (els.iconStats) {
    els.iconStats.addEventListener("click", () => {
      if (isAnyPageOpen()) closePages({ keepNav: true });
      leaveUserHubChrome();
      setDrawer("calendar");
      els.tabStatsInline?.click();
    });
  }

  if (els.iconResources) {
    els.iconResources.addEventListener("click", () => openFavoritesPage());
  }

  if (els.iconFaq) {
    els.iconFaq.addEventListener("click", () => openFavoritesPage());
  }

  if (els.iconChat) {
    els.iconChat.addEventListener("click", () => {
      if (els.pageChat && !els.pageChat.hidden) {
        closeChatSheet({ restore: true });
        return;
      }
      openChatPage();
    });
  }

  if (els.iconSettings) {
    els.iconSettings.addEventListener("click", () => {
      if (
        (els.pageUserCenter && !els.pageUserCenter.hidden) ||
        (els.pageAppearance && !els.pageAppearance.hidden) ||
        (els.pageFaq && !els.pageFaq.hidden) ||
        (els.pageProfile && !els.pageProfile.hidden)
      ) {
        closePages();
        return;
      }
      openUserCenterPage();
    });
  }

  if (els.backFromUserCenter) {
    els.backFromUserCenter.addEventListener("click", closePages);
  }
  if (els.gotoProfile) {
    els.gotoProfile.addEventListener("click", () => openProfilePage({ returnTo: "userCenter" }));
  }
  if (els.gotoSettings) {
    els.gotoSettings.addEventListener("click", () => openSettingsPage());
  }
  if (els.gotoFaq) {
    els.gotoFaq.addEventListener("click", () => openFaqPage());
  }
  if (els.editUserProfile) {
    els.editUserProfile.addEventListener("click", () => openUserProfileSheet());
  }
  if (els.userProfileCancel) {
    els.userProfileCancel.addEventListener("click", () => closeUserProfileSheet());
  }
  if (els.userProfileSave) {
    els.userProfileSave.addEventListener("click", () => saveUserProfileFromSheet());
  }
  if (els.userProfileSheet) {
    els.userProfileSheet.addEventListener("click", (e) => {
      if (e.target === els.userProfileSheet) closeUserProfileSheet();
    });
  }
  if (els.userProfileName) {
    els.userProfileName.addEventListener("input", () => syncUserProfileSheetPreview());
  }
  if (els.userProfileAvatarPick) {
    els.userProfileAvatarPick.addEventListener("click", () => pickAppearanceImage(els.userProfileAvatarUpload));
  }
  if (els.userProfileAvatarUpload) {
    els.userProfileAvatarUpload.addEventListener("change", () => {
      handleUserAvatarUpload(els.userProfileAvatarUpload.files?.[0]);
    });
  }

  if (els.backFromAppearance) {
    els.backFromAppearance.addEventListener("click", closeSettingsPage);
  }
  if (els.backFromFaq) {
    els.backFromFaq.addEventListener("click", closeFaqPage);
  }
  if (els.localeZh) {
    els.localeZh.addEventListener("click", () => saveLocale("zh"));
  }
  if (els.localeEn) {
    els.localeEn.addEventListener("click", () => saveLocale("en"));
  }
  if (els.pinguPresetGrid) {
    els.pinguPresetGrid.addEventListener("click", (e) => {
      const btn = e.target?.closest?.(".pingu-preset-btn");
      if (!btn) return;
      if (btn.getAttribute("data-preset") === "__custom__") {
        pickAppearanceImage(els.pinguUpload);
        return;
      }
      selectPinguPreset(btn.getAttribute("data-src"));
    });
  }
  if (els.homeBgPreview) {
    els.homeBgPreview.addEventListener("click", () => {
      pickAppearanceImage(els.homeBgUpload);
    });
  }
  if (els.chatBgPreview) {
    els.chatBgPreview.addEventListener("click", () => {
      pickAppearanceImage(els.chatBgUpload);
    });
  }
  if (els.homeBgUpload) {
    els.homeBgUpload.addEventListener("change", () => {
      handleAppearanceImageUpload("home", els.homeBgUpload.files?.[0]);
    });
  }
  if (els.chatBgUpload) {
    els.chatBgUpload.addEventListener("change", () => {
      handleAppearanceImageUpload("chat", els.chatBgUpload.files?.[0]);
    });
  }
  if (els.pinguUpload) {
    els.pinguUpload.addEventListener("change", () => {
      handleAppearanceImageUpload("pingu", els.pinguUpload.files?.[0]);
    });
  }


  /* —— Gratitude diary —— */
  function loadDiary() {
    try {
      const raw = localStorage.getItem(DIARY_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      diaryEntries = Array.isArray(parsed)
        ? parsed
            .filter((e) => e && typeof e.text === "string")
            .map((e) => ({
              id: e.id || uid(),
              text: e.text,
              createdAt: e.createdAt || new Date().toISOString(),
              style: e.style === "lined" ? "lined" : "plain",
            }))
        : [];
    } catch {
      diaryEntries = [];
    }
  }

  function saveDiary() {
    try {
      localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(diaryEntries));
    } catch {
      /* ignore */
    }
    updateHomeGreeting();
  }

  function diaryDayKey(iso) {
    try {
      return todayKey(new Date(iso));
    } catch {
      return todayKey();
    }
  }

  function formatDiaryGroupLabel(day) {
    const today = todayKey();
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = todayKey(y);
    const d = new Date(day + "T12:00:00");
    const md = locale === "en"
      ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : `${d.getMonth() + 1}月${d.getDate()}日`;
    if (day === today) return `${t("diaryToday")} · ${md}`;
    if (day === yesterday) return `${t("diaryYesterday")} · ${md}`;
    const week = locale === "en"
      ? d.toLocaleDateString("en-US", { weekday: "long" })
      : ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][d.getDay()];
    return `${md} · ${week}`;
  }

  function hasDiaryToday() {
    const today = todayKey();
    return diaryEntries.some((e) => diaryDayKey(e.createdAt) === today);
  }

  function pickStableGreetingLine(stateKey, pool) {
    const day = todayKey();
    const storageKey = `${GREETING_PICK_PREFIX}:${day}:${stateKey}`;
    try {
      let idx = sessionStorage.getItem(storageKey);
      if (idx == null) {
        idx = String(Math.floor(Math.random() * pool.length));
        sessionStorage.setItem(storageKey, idx);
      }
      const n = Number(idx);
      return pool[Number.isFinite(n) ? n % pool.length : 0];
    } catch {
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  function homeGreetingSubline() {
    const flags = getRitualFlags(todayKey());
    if (!flags.robotic && !flags.visual) {
      return pickStableGreetingLine("checkin", [t("greetingCheckinA"), t("greetingCheckinB")]);
    }
    if (!flags.robotic || !flags.visual) {
      return t("greetingCheckinPartial");
    }
    if (!hasDiaryToday()) {
      return pickStableGreetingLine("diary", [t("greetingDiaryA"), t("greetingDiaryHint"), t("greetingDiaryB")]);
    }
    return pickStableGreetingLine("all", [
      t("greetingAllA"),
      t("greetingAllB"),
      t("greetingAllC"),
      t("greetingAllD"),
    ]);
  }

  function updateHomeGreeting() {
    if (els.homeGreetingLine) els.homeGreetingLine.textContent = homeGreetingSubline();
    syncUserCenterProfile();
  }

  /** @type {HTMLAudioElement | null} */
  let ritualAudioEl = null;
  /** @type {any} */
  let spotifyPlayer = null;
  let spotifyDeviceId = "";
  let spotifySdkLoading = null;
  let sessionMusicActive = false;
  const musicPlayback = {
    active: false,
    paused: false,
    neteaseSrc: "",
    queue: [],
    queueIndex: 0,
    handoff: false,
  };

  function getMusicSettings() {
    return normalizeMusicSettings(theme.music);
  }

  const MUSIC_SESSION_VOLUME = 0.65;
  let musicProviderDraft = "spotify";
  let musicDialOpen = false;

  function parseNeteaseSongIdList(raw) {
    return String(raw || "")
      .split(/[\s,，、;\n]+/)
      .map((x) => x.replace(/\D/g, ""))
      .filter((x) => x.length >= 4);
  }

  function parseQqMidList(raw) {
    return String(raw || "")
      .split(/[\s,，、;\n]+/)
      .map((x) => x.trim())
      .filter((x) => /^[A-Za-z0-9]{10,}$/.test(x));
  }

  function extractFirstHttpUrl(input) {
    const raw = String(input || "").trim();
    if (!raw) return "";
    const m = raw.match(/https?:\/\/[^\s<>"']+/i);
    return m ? m[0] : "";
  }

  function companionShareUrl(m, provider) {
    const paste = provider === "netease" ? m.neteaseSharePaste : m.qqSharePaste;
    const fromPaste = extractFirstHttpUrl(paste);
    if (fromPaste) return fromPaste;
    const stored = provider === "netease" ? m.neteasePlaylistUrl : m.qqPlaylistUrl;
    return extractFirstHttpUrl(stored) || (stored.startsWith("http") ? stored.trim() : "");
  }

  function isCompanionMusicProvider(provider) {
    return provider === "netease" || provider === "qq";
  }

  function musicPlaylistForProvider(m, provider) {
    if (provider === "spotify") return m.spotifyPlaylistUri || m.spotifyPlaylistUrl;
    if (provider === "apple") return m.applePlaylistUrl;
    if (isCompanionMusicProvider(provider)) return "companion";
    return "";
  }

  function startCompanionMusic(provider) {
    const m = getMusicSettings();
    const url = companionShareUrl(m, provider);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      openMusicApp(provider);
    }
    musicPlayback.handoff = true;
    setMusicPlaybackState(true, false);
    showRitualToast(t("musicCompanionStart"));
    return true;
  }

  function musicIsConfigured() {
    const m = getMusicSettings();
    if (!m.provider) return false;
    return Boolean(musicPlaylistForProvider(m, m.provider));
  }

  function updateMusicTransportUi() {
    const m = getMusicSettings();
    const linked = musicIsConfigured();
    const spotifyControls = linked && m.provider === "spotify";
    const companionControls = linked && isCompanionMusicProvider(m.provider);
    if (els.musicTransport) els.musicTransport.hidden = !linked;
    if (els.musicTransportPrev) els.musicTransportPrev.hidden = !spotifyControls;
    if (els.musicTransportNext) els.musicTransportNext.hidden = !spotifyControls;
    const playing = musicPlayback.active && !musicPlayback.paused;
    if (els.musicTransportPlay) {
      els.musicTransportPlay.classList.toggle("is-playing", playing && spotifyControls);
      let playLabel = playing ? t("musicTransportPause") : t("musicTransportPlay");
      if (companionControls) playLabel = t("musicCompanionPlay");
      els.musicTransportPlay.title = playLabel;
      els.musicTransportPlay.setAttribute("aria-label", playLabel);
    }
    if (els.musicTransportPlayIcon) {
      if (companionControls) {
        els.musicTransportPlayIcon.classList.remove("fa-pause");
        els.musicTransportPlayIcon.classList.add("fa-play");
      } else {
        els.musicTransportPlayIcon.classList.toggle("fa-play", !playing);
        els.musicTransportPlayIcon.classList.toggle("fa-pause", playing);
      }
    }
    els.musicControlBar?.classList.toggle("is-linked", linked);
  }

  function setMusicPlaybackState(active, paused = false) {
    musicPlayback.active = Boolean(active);
    musicPlayback.paused = Boolean(paused);
    sessionMusicActive = musicPlayback.active && !musicPlayback.paused;
    updateMusicTransportUi();
  }

  function paintMusicChrome() {
    const m = getMusicSettings();
    const linked = musicIsConfigured();
    els.homeMusicBtn?.classList.toggle("is-linked", linked);
    if (els.homeMusicDot) els.homeMusicDot.hidden = !linked;
    document.querySelectorAll(".music-provider-menu-item").forEach((btn) => {
      const p = btn.getAttribute("data-provider");
      btn.classList.toggle("is-active-provider", linked && p === m.provider);
    });
    updateMusicTransportUi();
  }

  function parseSpotifyPlaylistId(input) {
    const raw = String(input || "").trim();
    if (!raw) return "";
    if (raw.startsWith("spotify:playlist:")) return raw.slice("spotify:playlist:".length).split("?")[0];
    try {
      const u = new URL(raw);
      const m = u.pathname.match(/\/playlist\/([a-zA-Z0-9]+)/);
      return m ? m[1] : "";
    } catch {
      return "";
    }
  }

  function spotifyPlaylistUriFromSettings(m) {
    if (m.spotifyPlaylistUri) return m.spotifyPlaylistUri;
    const id = parseSpotifyPlaylistId(m.spotifyPlaylistUrl);
    return id ? `spotify:playlist:${id}` : "";
  }

  function loadSpotifyToken() {
    try {
      const raw = localStorage.getItem(SPOTIFY_TOKEN_STORAGE);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data.access_token !== "string") return null;
      if (data.expires_at && Date.now() > Number(data.expires_at) - 30000) {
        return data.refresh_token ? data : null;
      }
      return data;
    } catch {
      return null;
    }
  }

  function saveSpotifyToken(data) {
    localStorage.setItem(SPOTIFY_TOKEN_STORAGE, JSON.stringify(data));
  }

  function clearSpotifyToken() {
    localStorage.removeItem(SPOTIFY_TOKEN_STORAGE);
  }

  function spotifyRedirectUri() {
    if (window.location.protocol === "file:") return "";
    const path = window.location.pathname || "/";
    return `${window.location.origin}${path.endsWith("/") ? path : path}`;
  }

  function effectiveSpotifyClientId(m) {
    return (m?.spotifyClientId || SPOTIFY_APP_CLIENT_ID || "").trim();
  }

  function appendMusicSteps(body, text) {
    const steps = document.createElement("p");
    steps.className = "music-steps";
    steps.textContent = text;
    body.appendChild(steps);
  }

  function appendSpotifyRedirectUriBox(body) {
    const uri = spotifyRedirectUri();
    const box = document.createElement("div");
    box.className = "music-oauth-uri-box";
    const label = document.createElement("p");
    label.className = "music-oauth-uri-label";
    label.textContent = t("musicRedirectUriLabel");
    box.appendChild(label);
    if (!uri) {
      const warn = document.createElement("p");
      warn.className = "music-oauth-warn";
      warn.textContent = t("musicNeedHttps");
      box.appendChild(warn);
      body.appendChild(box);
      return;
    }
    const row = document.createElement("div");
    row.className = "music-oauth-uri-row";
    const code = document.createElement("code");
    code.className = "music-oauth-uri-code";
    code.textContent = uri;
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "music-oauth-copy";
    copyBtn.textContent = t("musicCopyUri");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(uri);
        showRitualToast(t("musicCopied"));
      } catch {
        showRitualToast(uri);
      }
    });
    row.appendChild(code);
    row.appendChild(copyBtn);
    box.appendChild(row);
    body.appendChild(box);
  }

  function appendMusicSaveHint(body) {
    const hint = document.createElement("p");
    hint.className = "music-save-hint";
    hint.textContent = t("musicSaveHint");
    body.appendChild(hint);
  }

  function base64UrlEncode(buffer) {
    const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer);
    let str = "";
    bytes.forEach((b) => {
      str += String.fromCharCode(b);
    });
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  async function sha256(plain) {
    const enc = new TextEncoder();
    const data = enc.encode(plain);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return base64UrlEncode(hash);
  }

  function randomVerifier(len = 64) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    let out = "";
    arr.forEach((n) => {
      out += chars[n % chars.length];
    });
    return out;
  }

  async function beginSpotifyAuth(clientIdInput) {
    const m = getMusicSettings();
    const redirect = spotifyRedirectUri();
    if (!redirect) {
      showRitualToast(t("musicNeedHttps"));
      return;
    }
    const clientId = (clientIdInput || effectiveSpotifyClientId(m) || "").trim();
    if (!clientId) {
      showRitualToast(t("musicSpotifyNeedClient"));
      return;
    }
    theme.music = { ...m, spotifyClientId: clientId };
    saveTheme(theme);
    const verifier = randomVerifier();
    sessionStorage.setItem(SPOTIFY_VERIFIER_STORAGE, verifier);
    sessionStorage.setItem(MUSIC_OAUTH_PENDING_KEY, "spotify");
    const challenge = await sha256(verifier);
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: spotifyRedirectUri(),
      scope: SPOTIFY_SCOPES,
      code_challenge_method: "S256",
      code_challenge: challenge,
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async function exchangeSpotifyCode(code) {
    const m = getMusicSettings();
    const clientId = effectiveSpotifyClientId(m);
    const verifier = sessionStorage.getItem(SPOTIFY_VERIFIER_STORAGE) || "";
    sessionStorage.removeItem(SPOTIFY_VERIFIER_STORAGE);
    sessionStorage.removeItem(MUSIC_OAUTH_PENDING_KEY);
    const redirect = spotifyRedirectUri();
    if (!clientId || !verifier || !redirect) {
      showRitualToast(t("musicSpotifyReturnFail"));
      throw new Error("spotify-oauth-prereq");
    }
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirect,
      code_verifier: verifier,
    });
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      showRitualToast(t("musicSpotifyReturnFail"));
      throw new Error("spotify-token");
    }
    const json = await res.json();
    saveSpotifyToken({
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      expires_at: Date.now() + Number(json.expires_in || 3600) * 1000,
    });
    window.history.replaceState({}, document.title, redirect);
    paintMusicChrome();
    showRitualToast(t("musicSpotifyReturnOk"));
  }

  async function refreshSpotifyAccessToken() {
    const stored = loadSpotifyToken();
    const m = getMusicSettings();
    const clientId = effectiveSpotifyClientId(m);
    if (!stored?.refresh_token || !clientId) return null;
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: stored.refresh_token,
    });
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return null;
    const json = await res.json();
    const next = {
      access_token: json.access_token,
      refresh_token: stored.refresh_token,
      expires_at: Date.now() + Number(json.expires_in || 3600) * 1000,
    };
    saveSpotifyToken(next);
    return next.access_token;
  }

  async function spotifyAccessToken() {
    let stored = loadSpotifyToken();
    if (!stored) return null;
    if (stored.expires_at && Date.now() > Number(stored.expires_at) - 30000) {
      return refreshSpotifyAccessToken();
    }
    return stored.access_token;
  }

  async function spotifyApi(path, options = {}) {
    const token = await spotifyAccessToken();
    if (!token) throw new Error("no token");
    const res = await fetch(`https://api.spotify.com/v1${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("spotify api");
    return res.json();
  }

  function loadSpotifySdk() {
    if (window.Spotify) return Promise.resolve();
    if (spotifySdkLoading) return spotifySdkLoading;
    spotifySdkLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      window.onSpotifyWebPlaybackSDKReady = () => resolve();
      script.onerror = () => reject(new Error("sdk"));
      document.body.appendChild(script);
    });
    return spotifySdkLoading;
  }

  async function ensureSpotifyPlayer() {
    const token = await spotifyAccessToken();
    if (!token) return null;
    await loadSpotifySdk();
    if (spotifyPlayer) return spotifyPlayer;
    spotifyPlayer = new window.Spotify.Player({
      name: "Affirm Pingu",
      getOAuthToken: (cb) => {
        spotifyAccessToken().then((t) => cb(t || ""));
      },
      volume: MUSIC_SESSION_VOLUME,
    });
    spotifyPlayer.addListener("ready", ({ device_id }) => {
      spotifyDeviceId = device_id;
    });
    spotifyPlayer.addListener("initialization_error", () => {});
    spotifyPlayer.addListener("authentication_error", () => {});
    spotifyPlayer.connect();
    return spotifyPlayer;
  }

  async function playSpotifyPlaylist(uri) {
    if (!uri) return false;
    await ensureSpotifyPlayer();
    const token = await spotifyAccessToken();
    if (!token || !spotifyDeviceId) {
      await new Promise((r) => window.setTimeout(r, 800));
    }
    const device = spotifyDeviceId;
    if (!device) return false;
    await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.round(MUSIC_SESSION_VOLUME * 100)}&device_id=${encodeURIComponent(device)}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(device)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ context_uri: uri }),
    });
    return res.ok || res.status === 204;
  }

  function stopSessionMusic() {
    if (ritualAudioEl) {
      ritualAudioEl.pause();
      ritualAudioEl.removeAttribute("src");
      ritualAudioEl.load();
    }
    if (neteaseFrameEl) {
      neteaseFrameEl.removeAttribute("src");
      delete neteaseFrameEl.dataset.pausedSrc;
    }
    musicPlayback.neteaseSrc = "";
    musicPlayback.queue = [];
    musicPlayback.queueIndex = 0;
    musicPlayback.handoff = false;
    if (spotifyPlayer) {
      spotifyPlayer.pause().catch(() => {});
    }
    setMusicPlaybackState(false, false);
  }

  async function pauseSessionMusic() {
    if (!musicPlayback.active || musicPlayback.paused) return;
    const m = getMusicSettings();
    if (m.provider === "spotify" && spotifyPlayer) {
      await spotifyPlayer.pause().catch(() => {});
    }
    if (m.provider === "netease" && neteaseFrameEl?.src) {
      neteaseFrameEl.dataset.pausedSrc = neteaseFrameEl.src;
      musicPlayback.neteaseSrc = neteaseFrameEl.src;
      neteaseFrameEl.removeAttribute("src");
    }
    setMusicPlaybackState(true, true);
  }

  async function resumeSessionMusic() {
    if (!musicPlayback.active) {
      await startSessionMusic();
      return;
    }
    if (!musicPlayback.paused) return;
    const m = getMusicSettings();
    if (m.provider === "spotify" && spotifyPlayer) {
      await spotifyPlayer.resume().catch(() => {});
    }
    if (m.provider === "netease") {
      const src = neteaseFrameEl?.dataset.pausedSrc || musicPlayback.neteaseSrc;
      if (src && neteaseFrameEl) neteaseFrameEl.src = src;
    }
    setMusicPlaybackState(true, false);
  }

  async function toggleMusicPlayPause() {
    if (!musicIsConfigured()) {
      showRitualToast(t("musicRitualHint"));
      return;
    }
    const m = getMusicSettings();
    if (isCompanionMusicProvider(m.provider)) {
      startCompanionMusic(m.provider);
      return;
    }
    if (!musicPlayback.active) await startSessionMusic();
    else if (musicPlayback.paused) await resumeSessionMusic();
    else await pauseSessionMusic();
  }

  async function spotifyPlayerTransport(path) {
    const token = await spotifyAccessToken();
    if (!token) return false;
    let device = spotifyDeviceId;
    if (!device && spotifyPlayer) {
      await new Promise((r) => window.setTimeout(r, 400));
      device = spotifyDeviceId;
    }
    const q = device ? `?device_id=${encodeURIComponent(device)}` : "";
    const res = await fetch(`https://api.spotify.com/v1/me/player/${path}${q}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok || res.status === 204;
  }

  async function skipMusicNext() {
    const m = getMusicSettings();
    if (m.provider === "spotify") {
      const ok = await spotifyPlayerTransport("next").catch(() => false);
      if (!ok) showRitualToast(t("musicSkipInApp"));
      if (!musicPlayback.active) setMusicPlaybackState(true, false);
      return;
    }
    showRitualToast(t("musicSkipInApp"));
    if (isCompanionMusicProvider(m.provider)) startCompanionMusic(m.provider);
  }

  async function skipMusicPrevious() {
    const m = getMusicSettings();
    if (m.provider === "spotify") {
      const ok = await spotifyPlayerTransport("previous").catch(() => false);
      if (!ok) showRitualToast(t("musicSkipInApp"));
      if (!musicPlayback.active) setMusicPlaybackState(true, false);
      return;
    }
    showRitualToast(t("musicSkipInApp"));
  }

  function parseNeteasePlaylistId(input) {
    return parseNeteaseFromShare(input).playlistId;
  }

  function parseNeteaseSongId(input) {
    return parseNeteaseFromShare(input).songId;
  }

  function parseNeteaseFromShare(input) {
    const raw = String(input || "").trim();
    const out = { playlistId: "", songId: "" };
    if (!raw) return out;
    const probes = [];
    const urlMatches = raw.match(/https?:\/\/[^\s<>"']+/gi);
    if (urlMatches) probes.push(...urlMatches);
    probes.push(raw);
    for (const probe of probes) {
      const songHash = probe.match(/song\?id=(\d+)/i);
      const plHash = probe.match(/playlist\?id=(\d+)/i);
      if (plHash) out.playlistId = plHash[1];
      if (songHash) out.songId = songHash[1];
      const pathSong = probe.match(/\/song\/(\d+)/i);
      const pathPl = probe.match(/\/playlist\/(\d+)/i);
      if (pathPl) out.playlistId = pathPl[1];
      if (pathSong) out.songId = pathSong[1];
      const mSong = probe.match(/(?:[?&]id=)(\d+)/i);
      if (mSong && /song/i.test(probe) && !out.songId) out.songId = mSong[1];
      if (mSong && /playlist/i.test(probe) && !out.playlistId) out.playlistId = mSong[1];
    }
    if (!out.playlistId && !out.songId) {
      const anyPl = raw.match(/playlist\?id=(\d+)/i);
      const anySong = raw.match(/song\?id=(\d+)/i);
      if (anyPl) out.playlistId = anyPl[1];
      if (anySong) out.songId = anySong[1];
    }
    if (!out.playlistId && !out.songId && /^\d{4,}$/.test(raw)) out.playlistId = raw;
    if (!out.playlistId && !out.songId) {
      const runs = raw.match(/\d{5,12}/g);
      if (runs?.length) out.songId = runs[0];
    }
    return out;
  }

  function parseNeteaseFromShareWithGuess(input) {
    const parsed = parseNeteaseFromShare(input);
    const guessed = Boolean(parsed.songId && !input.match(/playlist/i));
    return { ...parsed, guessed };
  }

  function parseQqPlaylistId(input) {
    return parseQqFromShare(input).playlistId;
  }

  function parseQqFromShare(input) {
    const raw = String(input || "").trim();
    const out = { playlistId: "", songMid: "" };
    if (!raw) return out;
    const probes = [];
    const urlMatches = raw.match(/https?:\/\/[^\s<>"']+/gi);
    if (urlMatches) probes.push(...urlMatches);
    probes.push(raw);
    for (const probe of probes) {
      const midM =
        probe.match(/[?&]songmid=([A-Za-z0-9]+)/i) ||
        probe.match(/[?&]songMid=([A-Za-z0-9]+)/i);
      if (midM) out.songMid = midM[1];
      const midM2 = probe.match(/\/songDetail\/([A-Za-z0-9]+)/i);
      if (midM2) out.songMid = midM2[1];
      const plM =
        probe.match(/\/playlist\/(\d+)/i) ||
        probe.match(/\/playsong\.html[^#?]*[?&]songid=(\d+)/i) ||
        probe.match(/[?&]id=(\d+)/i);
      if (plM) out.playlistId = plM[1];
    }
    const rawMid = raw.match(/songmid[=:：\s]+([A-Za-z0-9]{10,})/i);
    if (rawMid) out.songMid = rawMid[1];
    if (!out.playlistId && !out.songMid && /^\d+$/.test(raw)) out.playlistId = raw;
    if (!out.playlistId && !out.songMid && /^[A-Za-z0-9]{10,}$/.test(raw)) out.songMid = raw;
    return out;
  }

  function setMusicParseStatus(body, message, ok) {
    if (!body) return;
    let el = body.querySelector(".music-parse-status");
    if (!el) {
      el = document.createElement("p");
      el.className = "music-parse-status";
      body.appendChild(el);
    }
    el.textContent = message;
    el.hidden = !message;
    el.classList.toggle("is-ok", Boolean(ok));
    el.classList.toggle("is-fail", message && !ok);
  }

  function neteasePlaybackTarget(m, queueIndex = 0) {
    if (m.neteaseLinkMode === "multitrack") {
      const list = parseNeteaseSongIdList(m.neteaseSongIds);
      const id = list[queueIndex];
      if (id) return { type: 0, id };
    }
    const pl =
      m.neteasePlaylistId ||
      parseNeteasePlaylistId(m.neteasePlaylistUrl) ||
      parseNeteaseFromShare(m.neteaseSharePaste).playlistId;
    const song =
      m.neteaseSongId ||
      parseNeteaseSongId(m.neteasePlaylistUrl) ||
      parseNeteaseFromShare(m.neteaseSharePaste).songId;
    if (pl) return { type: 1, id: pl };
    if (song) return { type: 0, id: song };
    return null;
  }

  function qqPlaybackTarget(m, queueIndex = 0) {
    if (m.qqLinkMode === "multitrack") {
      const list = parseQqMidList(m.qqSongMids);
      const id = list[queueIndex];
      if (id) return { kind: "song", id };
    }
    const pl =
      m.qqPlaylistId ||
      parseQqPlaylistId(m.qqPlaylistUrl) ||
      parseQqFromShare(m.qqSharePaste).playlistId;
    const mid = m.qqSongMid || parseQqFromShare(m.qqSharePaste).songMid;
    if (pl) return { kind: "playlist", id: pl };
    if (mid) return { kind: "song", id: mid };
    return null;
  }

  /** @type {HTMLIFrameElement | null} */
  let neteaseFrameEl = null;

  function playNeteaseOutchain(type, id) {
    if (!id) return false;
    if (!neteaseFrameEl) {
      neteaseFrameEl = document.createElement("iframe");
      neteaseFrameEl.setAttribute("aria-hidden", "true");
      neteaseFrameEl.hidden = true;
      neteaseFrameEl.width = "0";
      neteaseFrameEl.height = "0";
      neteaseFrameEl.style.cssText =
        "position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none";
      neteaseFrameEl.allow = "autoplay";
      document.body.appendChild(neteaseFrameEl);
    }
    neteaseFrameEl.src = `https://music.163.com/outchain/player?type=${type}&id=${encodeURIComponent(id)}&auto=1`;
    return true;
  }

  function tryOpenNeteaseDeepLink(type, id) {
    if (!id) return;
    const path = type === 1 ? `playlist/${id}` : `song/${id}`;
    const link = document.createElement("a");
    link.href = `orpheus://${path}`;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function renderChineseMusicFields(body, provider, m) {
    const isNetease = provider === "netease";
    appendMusicSteps(body, t(isNetease ? "musicNeteaseSteps" : "musicQqSteps"));

    const note = document.createElement("p");
    note.className = "music-oauth-warn";
    note.textContent = t("musicCompanionNote");
    body.appendChild(note);

    const pasteKey = isNetease ? "neteaseSharePaste" : "qqSharePaste";
    const pasteLabel = document.createElement("label");
    pasteLabel.className = "user-profile-field";
    pasteLabel.innerHTML = `<span>${escapeHtml(t("musicSharePaste"))}</span>`;
    const paste = document.createElement("textarea");
    paste.id = "music-share-paste";
    paste.rows = 4;
    paste.placeholder = t("musicSharePastePh");
    paste.value = m[pasteKey] || m[isNetease ? "neteasePlaylistUrl" : "qqPlaylistUrl"] || "";
    pasteLabel.appendChild(paste);
    body.appendChild(pasteLabel);

    const preview = document.createElement("p");
    preview.className = "music-id-help";
    preview.id = "music-share-preview";
    const syncPreview = () => {
      const url = extractFirstHttpUrl(paste.value);
      preview.textContent = url
        ? `${t("musicParseOk").replace(/[。.!]$/, "")}: ${url}`
        : t("musicModeHandoffLead");
    };
    paste.addEventListener("input", syncPreview);
    syncPreview();
    body.appendChild(preview);
  }

  function openMusicApp(provider) {
    const urls = {
      spotify: "https://open.spotify.com/",
      apple: "https://music.apple.com/",
      netease: "https://music.163.com/",
      qq: "https://y.qq.com/",
    };
    const url = urls[provider];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function startSessionMusic() {
    const m = getMusicSettings();
    if (!m.provider || !musicPlaylistForProvider(m, m.provider)) {
      showRitualToast(t("musicRitualHint"));
      return false;
    }
    if (m.provider === "spotify") {
      const uri = spotifyPlaylistUriFromSettings(m);
      if (uri && (await spotifyAccessToken())) {
        const ok = await playSpotifyPlaylist(uri).catch(() => false);
        if (ok) {
          setMusicPlaybackState(true, false);
          return true;
        }
      }
      showRitualToast(t("musicPlayFailed"));
      return false;
    }
    if (m.provider === "netease") {
      return startCompanionMusic("netease");
    }
    if (m.provider === "apple" && m.applePlaylistUrl) {
      window.open(m.applePlaylistUrl, "_blank", "noopener,noreferrer");
      setMusicPlaybackState(true, false);
      return true;
    }
    if (m.provider === "qq") {
      return startCompanionMusic("qq");
    }
    showRitualToast(t("musicPlayFailed"));
    return false;
  }

  async function fetchSpotifyPlaylistsInto(selectEl) {
    const token = await spotifyAccessToken();
    if (!token || !selectEl) return [];
    const data = await spotifyApi("/me/playlists?limit=50");
    const current = getMusicSettings().spotifyPlaylistUri;
    selectEl.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = t("musicPlaylistEmpty");
    selectEl.appendChild(placeholder);
    (data.items || []).forEach((pl) => {
      if (!pl?.uri) return;
      const opt = document.createElement("option");
      opt.value = pl.uri;
      opt.textContent = pl.name || pl.uri;
      if (pl.uri === current) opt.selected = true;
      selectEl.appendChild(opt);
    });
    return data.items || [];
  }

  function musicProviderTitle(provider) {
    const map = {
      spotify: "Spotify",
      apple: "Apple Music",
      netease: "网易云音乐",
      qq: "QQ 音乐",
    };
    return map[provider] || provider;
  }

  function musicProviderLeadText(provider) {
    const key = {
      spotify: "musicProviderSpotifyLead",
      apple: "musicProviderAppleLead",
      netease: "musicProviderNeteaseLead",
      qq: "musicProviderQqLead",
    }[provider];
    return key ? t(key) : "";
  }

  function renderMusicProviderBody(provider) {
    musicProviderDraft = provider;
    const body = els.musicProviderBody;
    if (!body) return;
    body.innerHTML = "";
    const m = getMusicSettings();

    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = `music-connect-btn${provider === "spotify" ? " is-spotify" : ""}`;
    body.appendChild(openBtn);

    if (provider === "spotify") {
      appendMusicSteps(body, t("musicSpotifySteps"));
      appendSpotifyRedirectUriBox(body);
      const token = loadSpotifyToken();
      let clientInput = null;
      if (!token?.access_token) {
        const label = document.createElement("label");
        label.className = "user-profile-field";
        label.innerHTML = `<span>${escapeHtml(t("musicClientIdOnce"))}</span>`;
        clientInput = document.createElement("input");
        clientInput.type = "text";
        clientInput.id = "music-spotify-client-id";
        clientInput.value = effectiveSpotifyClientId(m);
        clientInput.autocomplete = "off";
        clientInput.spellcheck = false;
        label.appendChild(clientInput);
        body.appendChild(label);
      }
      if (token?.access_token) {
        openBtn.textContent = t("musicSpotifyConnected");
        openBtn.classList.add("is-ghost");
        openBtn.addEventListener("click", () => openMusicApp("spotify"));
        const disconnect = document.createElement("button");
        disconnect.type = "button";
        disconnect.className = "music-connect-btn is-ghost";
        disconnect.textContent = t("musicSpotifyDisconnect");
        disconnect.addEventListener("click", () => {
          clearSpotifyToken();
          if (spotifyPlayer) {
            spotifyPlayer.disconnect();
            spotifyPlayer = null;
            spotifyDeviceId = "";
          }
          renderMusicProviderBody("spotify");
        });
        body.appendChild(disconnect);
      } else {
        openBtn.textContent = t("musicSpotifyConnect");
        openBtn.addEventListener("click", () => {
          const cid =
            clientInput?.value?.trim() ||
            document.getElementById("music-spotify-client-id")?.value?.trim() ||
            m.spotifyClientId;
          beginSpotifyAuth(cid).catch(() => {});
        });
      }

      const pickLabel = document.createElement("label");
      pickLabel.className = "user-profile-field";
      pickLabel.innerHTML = `<span>${escapeHtml(t("musicPickPlaylist"))}</span>`;
      const select = document.createElement("select");
      select.id = "music-spotify-playlist-pick";
      pickLabel.appendChild(select);
      body.appendChild(pickLabel);
      fetchSpotifyPlaylistsInto(select).catch(() => {});

      const linkLabel = document.createElement("label");
      linkLabel.className = "user-profile-field";
      linkLabel.innerHTML = `<span>${escapeHtml(t("musicPlaylistLink"))}</span>`;
      const linkInput = document.createElement("input");
      linkInput.type = "url";
      linkInput.id = "music-spotify-link";
      linkInput.value = m.spotifyPlaylistUrl;
      linkInput.placeholder = "https://open.spotify.com/playlist/…";
      linkLabel.appendChild(linkInput);
      body.appendChild(linkLabel);
      appendMusicSaveHint(body);
      return;
    }

    if (provider === "netease" || provider === "qq") {
      openBtn.textContent = t("musicOpenApp");
      openBtn.addEventListener("click", () => openMusicApp(provider));
      renderChineseMusicFields(body, provider, m);
      appendMusicSaveHint(body);
      return;
    }

    appendMusicSteps(body, t("musicOtherSteps"));
    openBtn.textContent = t("musicOpenApp");
    openBtn.addEventListener("click", () => openMusicApp(provider));

    const linkLabel = document.createElement("label");
    linkLabel.className = "user-profile-field";
    linkLabel.innerHTML = `<span>${escapeHtml(t("musicPlaylistLink"))}</span>`;
    const linkInput = document.createElement("input");
    linkInput.type = "url";
    linkInput.id = "music-provider-link";
    linkInput.value = m.applePlaylistUrl || "";
    linkLabel.appendChild(linkInput);
    body.appendChild(linkLabel);
    appendMusicSaveHint(body);
  }

  function openMusicProviderSheet(provider) {
    musicProviderDraft = provider;
    if (els.musicProviderTitle) els.musicProviderTitle.textContent = musicProviderTitle(provider);
    if (els.musicProviderLead) els.musicProviderLead.textContent = musicProviderLeadText(provider);
    renderMusicProviderBody(provider);
    if (els.musicProviderSheet) els.musicProviderSheet.hidden = false;
  }

  function closeMusicProviderSheet() {
    if (els.musicProviderSheet) els.musicProviderSheet.hidden = true;
  }

  function saveMusicProviderSheet() {
    const provider = musicProviderDraft;
    const m = getMusicSettings();
    const next = { ...m, provider };
    if (provider === "spotify") {
      const select = document.getElementById("music-spotify-playlist-pick");
      const link = (document.getElementById("music-spotify-link")?.value || "").trim();
      const clientInput = document.getElementById("music-spotify-client-id");
      if (clientInput?.value.trim()) next.spotifyClientId = clientInput.value.trim();
      if (select?.value) next.spotifyPlaylistUri = select.value;
      next.spotifyPlaylistUrl = link;
      if (!next.spotifyPlaylistUri && link) {
        const id = parseSpotifyPlaylistId(link);
        if (id) next.spotifyPlaylistUri = `spotify:playlist:${id}`;
      }
    } else if (provider === "netease") {
      next.neteaseLinkMode = "companion";
      const paste = (document.getElementById("music-share-paste")?.value || "").trim().slice(0, 2000);
      next.neteaseSharePaste = paste;
      const url = extractFirstHttpUrl(paste);
      if (url) next.neteasePlaylistUrl = url.slice(0, 512);
    } else if (provider === "qq") {
      next.qqLinkMode = "companion";
      const paste = (document.getElementById("music-share-paste")?.value || "").trim().slice(0, 2000);
      next.qqSharePaste = paste;
      const url = extractFirstHttpUrl(paste);
      if (url) next.qqPlaylistUrl = url.slice(0, 512);
    } else {
      const link = (document.getElementById("music-provider-link")?.value || "").trim();
      if (provider === "apple") next.applePlaylistUrl = link;
    }
    theme.music = normalizeMusicSettings(next);
    saveTheme(theme);
    paintMusicChrome();
    closeMusicProviderSheet();
    const companion = isCompanionMusicProvider(provider);
    showRitualToast(companion ? t("musicCompanionSaved") : t("musicSavedToast"));
  }

  function setMusicDialOpen(open) {
    musicDialOpen = open;
    if (els.musicDial) {
      els.musicDial.classList.toggle("is-open", open);
      els.musicDial.hidden = !open;
      els.musicDial.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (els.musicDialBackdrop) els.musicDialBackdrop.hidden = !open;
    els.homeMusicBtn?.classList.toggle("is-open", open);
    els.homeMusicBtn?.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function toggleMusicDial() {
    setMusicDialOpen(!musicDialOpen);
  }

  function finishSpotifyOAuthReturnUi() {
    setRitualCollapsed(false);
    openMusicProviderSheet("spotify");
  }

  function handleSpotifyOAuthReturn() {
    try {
      const u = new URL(window.location.href);
      const err = u.searchParams.get("error");
      const code = u.searchParams.get("code");
      const pending = sessionStorage.getItem(MUSIC_OAUTH_PENDING_KEY);
      if (err) {
        sessionStorage.removeItem(MUSIC_OAUTH_PENDING_KEY);
        window.history.replaceState({}, document.title, spotifyRedirectUri() || u.pathname);
        if (pending === "spotify" || err) showRitualToast(t("musicSpotifyDenied"));
        return;
      }
      if (!code) return;
      exchangeSpotifyCode(code)
        .then(() => finishSpotifyOAuthReturnUi())
        .catch(() => finishSpotifyOAuthReturnUi());
    } catch {
      /* ignore */
    }
  }

  function bindMusicUi() {
    els.homeMusicBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMusicDial();
    });
    els.musicDialBackdrop?.addEventListener("click", () => setMusicDialOpen(false));
    document.querySelectorAll(".music-provider-menu-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const provider = btn.getAttribute("data-provider");
        setMusicDialOpen(false);
        if (provider) openMusicProviderSheet(provider);
      });
    });
    els.musicProviderCancel?.addEventListener("click", () => closeMusicProviderSheet());
    els.musicProviderSave?.addEventListener("click", () => saveMusicProviderSheet());
    els.musicProviderSheet?.addEventListener("click", (e) => {
      if (e.target === els.musicProviderSheet) closeMusicProviderSheet();
    });
    els.musicTransportPlay?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMusicPlayPause().catch(() => {});
    });
    els.musicTransportPrev?.addEventListener("click", (e) => {
      e.stopPropagation();
      skipMusicPrevious().catch(() => {});
    });
    els.musicTransportNext?.addEventListener("click", (e) => {
      e.stopPropagation();
      skipMusicNext().catch(() => {});
    });
  }

  function renderDiaryPage() {
    const root = els.diaryList;
    if (!root) return;
    root.innerHTML = "";
    if (!diaryEntries.length) {
      const empty = document.createElement("p");
      empty.className = "diary-empty";
      empty.textContent = t("diaryEmpty");
      root.appendChild(empty);
      return;
    }
    const today = todayKey();
    const groups = new Map();
    [...diaryEntries]
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .forEach((entry) => {
        const key = diaryDayKey(entry.createdAt);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(entry);
      });
    let historyIndex = 0;
    for (const [day, items] of groups) {
      const isToday = day === today;
      const group = document.createElement("section");
      group.className = `diary-group${isToday ? " is-today" : " is-history"}`;
      const label = document.createElement("p");
      label.className = "diary-group-label";
      label.textContent = formatDiaryGroupLabel(day);
      group.appendChild(label);
      items.forEach((entry) => {
        const card = document.createElement("article");
        card.className = `diary-card${isToday ? " is-today" : " is-history"}`;
        card.dataset.id = entry.id;
        const body = document.createElement("p");
        body.className = "diary-card-text";
        body.textContent = entry.text;
        card.appendChild(body);
        if (!isToday) {
          card.classList.add(historyIndex % 2 === 0 ? "tilt-a" : "tilt-b");
          historyIndex += 1;
        }
        // Figma: today editable; history view-only
        if (isToday) {
          const edit = document.createElement("button");
          edit.type = "button";
          edit.className = "diary-edit-btn";
          edit.setAttribute("data-action", "edit");
          edit.setAttribute("aria-label", t("diaryAdd"));
          edit.innerHTML = '<img src="assets/icon-pencil.svg" width="14" height="14" alt="" />';
          card.appendChild(edit);
        }
        group.appendChild(card);
      });
      root.appendChild(group);
    }
  }

  function openDiaryPage() {
    setDrawer(null);
    closeChatSheet();
    leaveUserHubChrome();
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageFavorites) els.pageFavorites.hidden = true;
    revealAppPage(els.pageDiary);
    els.screen?.classList.add("page-open");
    setNavActive("diary");
    renderDiaryPage();
  }

  function openFavoritesPage() {
    setDrawer(null);
    closeChatSheet({ restore: false });
    leaveUserHubChrome();
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageDiary) els.pageDiary.hidden = true;
    if (els.diarySheet) els.diarySheet.hidden = true;
    revealAppPage(els.pageFavorites);
    els.screen?.classList.add("page-open");
    setFavoritesTab();
    setNavActive("favorites");
    renderResources();
  }

  function openDiarySheet(entry = null) {
    diaryDraftId = entry?.id || null;
    diaryDraftStyle = "plain";
    if (els.diaryInput) els.diaryInput.value = entry?.text || "";
    if (els.diarySheetTitle) {
      els.diarySheetTitle.textContent = entry ? t("diaryNew") : t("diaryNew");
    }
    revealAppPage(els.diarySheet);
    els.diaryInput?.focus();
  }

  function closeDiarySheet() {
    if (els.diarySheet) els.diarySheet.hidden = true;
    diaryDraftId = null;
    if (els.diaryInput) els.diaryInput.value = "";
  }

  function saveDiaryEntry() {
    const textValue = (els.diaryInput?.value || "").trim();
    if (!textValue) return;
    if (diaryDraftId) {
      const idx = diaryEntries.findIndex((e) => e.id === diaryDraftId);
      if (idx >= 0) {
        diaryEntries[idx] = {
          ...diaryEntries[idx],
          text: textValue,
          style: diaryDraftStyle,
        };
      }
    } else {
      diaryEntries.unshift({
        id: uid(),
        text: textValue,
        createdAt: new Date().toISOString(),
        style: diaryDraftStyle,
      });
    }
    saveDiary();
    flashSaveButton(els.diarySave);
    closeDiarySheet();
    renderDiaryPage();
  }

  function deleteDiaryEntry(id) {
    diaryEntries = diaryEntries.filter((e) => e.id !== id);
    saveDiary();
    renderDiaryPage();
  }

  loadDiary();
  updateHomeGreeting();
  bindMusicUi();
  handleSpotifyOAuthReturn();
  paintMusicChrome();

  if (els.iconHome) {
    els.iconHome.addEventListener("click", () => goHome());
  }
  if (els.iconDiary) {
    els.iconDiary.addEventListener("click", () => {
      if (els.pageDiary && !els.pageDiary.hidden) {
        goHome();
        return;
      }
      openDiaryPage();
    });
  }
  if (els.iconFavorites) {
    els.iconFavorites.addEventListener("click", () => {
      if (els.pageFavorites && !els.pageFavorites.hidden) {
        goHome();
        return;
      }
      openFavoritesPage("videos");
    });
  }
  if (els.diaryAdd) {
    els.diaryAdd.addEventListener("click", () => openDiarySheet(null));
  }
  if (els.diarySave) {
    els.diarySave.addEventListener("click", saveDiaryEntry);
  }
  if (els.diaryCancel) {
    els.diaryCancel.addEventListener("click", closeDiarySheet);
  }
  const diaryCancelSecondary = document.getElementById("diary-cancel-secondary");
  if (diaryCancelSecondary) {
    diaryCancelSecondary.addEventListener("click", closeDiarySheet);
  }
  if (els.diaryList) {
    els.diaryList.addEventListener("click", (e) => {
      const btn = e.target?.closest?.("[data-action]");
      if (!btn) return;
      const card = btn.closest(".diary-card");
      const id = card?.dataset?.id;
      if (!id) return;
      if (btn.getAttribute("data-action") === "delete") {
        deleteDiaryEntry(id);
        return;
      }
      if (btn.getAttribute("data-action") === "edit") {
        const entry = diaryEntries.find((x) => x.id === id);
        if (entry) openDiarySheet(entry);
      }
    });
  }
  if (els.summaryMinus) {
    els.summaryMinus.addEventListener("click", () => {
      summaryDraftCount = Math.max(0, summaryDraftCount - 1);
      if (els.summaryCount) els.summaryCount.textContent = String(summaryDraftCount);
    });
  }
  if (els.summaryPlus) {
    els.summaryPlus.addEventListener("click", () => {
      summaryDraftCount += 1;
      if (els.summaryCount) els.summaryCount.textContent = String(summaryDraftCount);
    });
  }
  if (els.summaryConfirm) {
    els.summaryConfirm.addEventListener("click", confirmSummaryCount);
  }
  if (els.tabStatsInline) {
    els.tabStatsInline.addEventListener("click", () => applyCalTab("stats"));
  }

  // Patch calendar/list tabs to hide stats inline
  setNavActive("home");
  setRitualTab(ritualTab);
  requestAnimationFrame(() => {
    updateRailIndicator({ instant: true });
    syncAllSegIndicators({ instant: true });
  });
  window.addEventListener(
    "resize",
    () => {
      updateRailIndicator({ instant: true });
      syncAllSegIndicators({ instant: true });
    },
    { passive: true }
  );
  if (window.visualViewport) {
    window.visualViewport.addEventListener(
      "resize",
      () => {
        updateRailIndicator({ instant: true });
        syncAllSegIndicators({ instant: true });
      },
      { passive: true }
    );
  }


  els.iconAffirm.addEventListener("click", () => {
    if (els.pageChat && !els.pageChat.hidden) {
      closePages({ keepNav: true });
    }
    if (els.pageUserCenter && !els.pageUserCenter.hidden) {
      leaveUserHubChrome();
    }
    if (els.pageHistory && !els.pageHistory.hidden) {
      goHome();
      return;
    }
    openHistoryPage();
  });

  if (els.backFromHistory) {
    els.backFromHistory.addEventListener("click", closePages);
  }
  els.gotoEdit.addEventListener("click", () => openEditPage(""));
  els.backFromEdit.addEventListener("click", discardAffirmation);
  els.saveAffirm.addEventListener("click", saveAffirmation);
  els.discardAffirm.addEventListener("click", discardAffirmation);

  if (els.historyTagBar) {
    els.historyTagBar.addEventListener("click", (e) => {
      const chip = e.target?.closest?.(".history-tag-chip");
      if (!chip) return;
      const tag = chip.dataset.tag;
      if (tag === "__add__") {
        if (els.historyTagAddForm) {
          els.historyTagAddForm.hidden = false;
          els.historyTagInput?.focus();
        }
        return;
      }
      historyFilterTag = tag || "all";
      renderAffirmHistoryPage();
    });
  }
  if (els.historyTagAddForm) {
    els.historyTagAddForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = els.historyTagInput?.value || "";
      if (addCustomTag(value)) {
        if (els.historyTagInput) els.historyTagInput.value = "";
        els.historyTagAddForm.hidden = true;
        renderAffirmHistoryPage();
      }
    });
  }
  if (els.historyTagCancel) {
    els.historyTagCancel.addEventListener("click", () => {
      if (els.historyTagAddForm) els.historyTagAddForm.hidden = true;
      if (els.historyTagInput) els.historyTagInput.value = "";
    });
  }
  if (els.editKindStory) {
    els.editKindStory.addEventListener("click", () =>
      setEditKind("story", { syncInput: true })
    );
  }
  if (els.editKindRobotic) {
    els.editKindRobotic.addEventListener("click", () =>
      setEditKind("robotic", { syncInput: true })
    );
  }

  if (els.backFromChat) {
    els.backFromChat.addEventListener("click", () => closeChatSheet({ restore: true }));
  }
  if (els.openaiModel) {
    els.openaiModel.addEventListener("change", () => {
      syncCustomModelField();
      scheduleChatApiPersist();
    });
  }
  if (els.openaiKey) {
    els.openaiKey.addEventListener("input", scheduleChatApiPersist);
    els.openaiKey.addEventListener("change", scheduleChatApiPersist);
  }
  const customModelInput = document.getElementById("openai-model-custom");
  if (customModelInput) {
    customModelInput.addEventListener("input", scheduleChatApiPersist);
    customModelInput.addEventListener("change", scheduleChatApiPersist);
  }
  if (els.autoAnalyze) {
    els.autoAnalyze.addEventListener("change", scheduleChatApiPersist);
  }
  if (els.cloudApiBase) {
    els.cloudApiBase.addEventListener("change", persistCloudApiBase);
    els.cloudApiBase.addEventListener("blur", persistCloudApiBase);
  }
  if (els.gotoAuth) {
    els.gotoAuth.addEventListener("click", () => openAuthPage({ returnTo: "userCenter" }));
  }
  els.onboardingRegister?.addEventListener("click", () => startOnboardingAuth("register"));
  els.onboardingLogin?.addEventListener("click", () => startOnboardingAuth("login"));
  els.onboardingSkip?.addEventListener("click", () => hideOnboarding({ remember: true }));
  if (els.gotoAuthFromSettings) {
    els.gotoAuthFromSettings.addEventListener("click", () =>
      openAuthPage({ returnTo: "settings" }),
    );
  }
  if (els.backFromAuth) {
    els.backFromAuth.addEventListener("click", () => closeAuthPage());
  }
  if (els.authTabLogin) {
    els.authTabLogin.addEventListener("click", () => setAuthUiMode("login"));
  }
  if (els.authTabRegister) {
    els.authTabRegister.addEventListener("click", () => setAuthUiMode("register"));
  }
  els.authSwitchMode?.addEventListener("click", () =>
    setAuthUiMode(authUiMode === "register" ? "login" : "register"),
  );
  if (els.authMethodEmail) {
    els.authMethodEmail.addEventListener("click", () => setAuthUiMethod("email"));
  }
  if (els.authMethodPhone) {
    els.authMethodPhone.addEventListener("click", () => setAuthUiMethod("phone"));
  }
  if (els.authSubmit) {
    els.authSubmit.addEventListener("click", () => {
      const submittedMode = authUiMode;
      const run =
        submittedMode === "register" ? cloudAuthRegisterFromForm : cloudAuthLoginFromForm;
      run()
        .then(() => {
          showRitualToast(
            submittedMode === "register" ? t("cloudRegisterOk") : t("cloudLoginOk"),
          );
          if (submittedMode === "register") showNameSetupStep();
          else if (authReturnTo === "onboarding") completeOnboarding();
        })
        .catch((err) => showRitualToast(err?.message || t("cloudAuthFailed")));
    });
  }
  els.authNameContinue?.addEventListener("click", completeNameSetup);
  els.authDisplayName?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    completeNameSetup();
  });
  if (els.authBindSubmit) {
    els.authBindSubmit.addEventListener("click", () => {
      cloudAuthBindFromForm()
        .then(() => showRitualToast(t("authBindOk")))
        .catch(() => showRitualToast(t("authBindFail")));
    });
  }
  els.authChangePassword?.addEventListener("click", () => setPasswordPanelOpen(true));
  els.accountPasswordCancel?.addEventListener("click", () => setPasswordPanelOpen(false));
  els.accountPasswordSave?.addEventListener("click", () => {
    changeCloudPassword()
      .then(() => showRitualToast("密码已更新"))
      .catch((err) => showRitualToast(err?.message || "密码修改失败"));
  });
  els.authDownloadChat?.addEventListener("click", () => {
    downloadLocalChatHistory();
    showRitualToast("聊天记录已下载");
  });
  els.authClearCache?.addEventListener("click", () => {
    clearAppCache()
      .then(() => showRitualToast("缓存已清除，本机记录已保留"))
      .catch(() => showRitualToast("清除缓存失败"));
  });
  if (els.authLogout) {
    els.authLogout.addEventListener("click", () => {
      cloudLogout();
      setAuthUiMode("login");
      showRitualToast(t("authLogout"));
    });
  }
  if (els.cloudRedeem) {
    els.cloudRedeem.addEventListener("click", () => {
      cloudRedeemCode()
        .then(() => showRitualToast(t("cloudRedeemOk")))
        .catch(() => showRitualToast(t("cloudRedeemFailed")));
    });
  }
  paintCloudStatus();
  if (els.btnAnalyze) {
    els.btnAnalyze.addEventListener("click", () => analyzeRecent(false));
  }
  if (els.btnDailyCheck) {
    els.btnDailyCheck.addEventListener("click", () => dailyCoachCheck());
  }
  if (els.btnShowMemory) {
    els.btnShowMemory.addEventListener("click", () => openProfilePage());
  }
  if (els.bubbleModeSwitch) {
    els.bubbleModeSwitch.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleBubbleMode();
    });
  }
  if (els.tabRobotic) {
    els.tabRobotic.addEventListener("click", () => setRitualTab("robotic"));
  }
  if (els.tabVisual) {
    els.tabVisual.addEventListener("click", () => setRitualTab("visual"));
  }
  if (els.btnStartRobotic) {
    els.btnStartRobotic.addEventListener("click", () => startRitualSession("robotic"));
  }
  if (els.btnStartVisual) {
    els.btnStartVisual.addEventListener("click", () => startRitualSession("visual"));
  }
  if (els.ritualSessionCancel) {
    els.ritualSessionCancel.addEventListener("click", () => {
      if (!ritualRun) return;
      if (ritualRun.paused) {
        ritualRun.paused = false;
        ritualRun.timerId = window.setInterval(tickRitualSession, 1000);
        els.ritualSessionCancel.textContent = t("sessionPause");
        resumeSessionMusic().catch(() => {});
        return;
      }
      if (ritualRun.timerId) window.clearInterval(ritualRun.timerId);
      ritualRun.timerId = 0;
      ritualRun.paused = true;
      els.ritualSessionCancel.textContent = t("sessionResume");
      pauseSessionMusic().catch(() => {});
    });
  }
  if (els.ritualSessionFinish) {
    els.ritualSessionFinish.addEventListener("click", () => finishRitualSession());
  }
  if (els.backFromProfile) {
    els.backFromProfile.addEventListener("click", () => closeProfilePage());
  }
  const profileFieldEls = [
    els.profileGoal,
    els.profileOldStory,
    els.profileEffective,
    els.profileCrash,
    els.profileBoundaries,
    els.profileNotes,
  ].filter(Boolean);
  profileFieldEls.forEach((field) => {
    field.addEventListener("input", () => scheduleProfileAutoSave());
    field.addEventListener("blur", () => {
      clearTimeout(profileAutoSaveTimer);
      saveProfileFromForm({ stayOnPage: true });
    });
  });
  if (els.chatForm) {
    els.chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = els.chatInput?.value || "";
      if (els.chatInput) els.chatInput.value = "";
      askPingu(text);
    });
  }
  if (els.chatInput) {
    els.chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        els.chatForm?.requestSubmit();
      }
    });
  }
  if (els.chatMessages) {
    els.chatMessages.addEventListener("scroll", () => updateChatJumpBottom(), { passive: true });
  }
  if (els.chatJumpBottom) {
    els.chatJumpBottom.addEventListener("click", () => scrollChatToBottom({ smooth: true }));
  }

  els.tabCalendar?.addEventListener("click", () => applyCalTab("calendar"));
  els.tabList?.addEventListener("click", () => applyCalTab("list"));

  els.prevMonth.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });

  els.nextMonth.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  els.pingu.addEventListener("click", affirm);

  // Mobile: tap penguin = space
  let touchArmed = false;
  const tapTarget = els.pinguWrap || els.pingu;
  tapTarget.addEventListener(
    "touchstart",
    (e) => {
      touchArmed = true;
      e.preventDefault();
    },
    { passive: false }
  );
  tapTarget.addEventListener(
    "touchend",
    (e) => {
      if (!touchArmed) return;
      touchArmed = false;
      e.preventDefault();
      affirm();
    },
    { passive: false }
  );
  tapTarget.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      affirm();
    }
  });
  // Avoid double-count: click already on pingu; wrap click for larger hit area on desktop
  if (els.pinguWrap) {
    els.pinguWrap.addEventListener("click", (e) => {
      if (e.target === els.pingu) return;
      affirm();
    });
  }

  let lastDay = todayKey();
  let secondsSinceSave = 0;
  window.setInterval(() => {
    const now = todayKey();
    if (now !== lastDay) {
      lastDay = now;
      ensureDailyPlanDay();
      renderRitualBar();
      refreshCounts();
      renderCalendar();
      renderDayList();
      updateHomeGreeting();
    }

    if (document.visibilityState !== "visible") return;
    const key = todayKey();
    state.timeDays[key] = (state.timeDays[key] || 0) + 1;
    timeDirty = true;
    secondsSinceSave += 1;
    if (openDrawer === "stats") refreshStats();
    if (secondsSinceSave >= 10) {
      secondsSinceSave = 0;
      if (timeDirty) {
        save(state);
        timeDirty = false;
      }
    }
  }, 1000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && timeDirty) {
      save(state);
      timeDirty = false;
      secondsSinceSave = 0;
    }
    if (document.visibilityState === "visible") {
      pullNativeCountIntoState();
      refreshCounts();
    }
  });

  window.addEventListener("beforeunload", () => {
    if (timeDirty) save(state);
  });

  loadCoachManual();

  renderActiveBubble();
  renderRitualBar();
  refreshCounts();
  renderCalendar();
  renderDayList();
  setCalView("calendar");
  setDrawer(null);
  closePages();
  if (!hasCloudSession()) {
    setAuthUiMode("register");
    openAuthPage({ returnTo: "onboarding" });
  }
  syncUserProfileFromTheme();
  refreshLucideIcons();
})();
