(() => {
  const STORAGE_KEY = "affirm-pingu-data-v3";
  const AI_STORAGE_KEY = "affirm-pingu-ai-v1";
  const THEME_STORAGE_KEY = "affirm-pingu-theme-v1";
  const LEGACY_KEYS = ["affirm-pingu-data-v2", "affirm-pingu-data-v1"];
  const DEFAULT_HOME_BG = "assets/home-bg.jpeg";
  const DEFAULT_CHAT_BG = "assets/450-20170130161150300883.jpg";
  const DEFAULT_HOME_COLOR = "#fff5f9";
  const DEFAULT_CHAT_COLOR = "#fff5f9";
  const DEFAULT_PINGU = "assets/pingu-sprite.png";
  const PINGU_PRESETS = [
    { id: "pingu", label: "企鹅", src: "assets/pingu-sprite.png" },
    { id: "jishibao", label: "吉式堡", src: "assets/chiwawa.png" },
    { id: "xuebi-idle", label: "雪碧发呆", src: "assets/xuebi1.png" },
    { id: "xuebi-cast", label: "雪碧施法", src: "assets/xuebi2.png" },
  ];
  const PINGU_PRESET_SRCS = new Set(PINGU_PRESETS.map((p) => p.src));
  const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
  const MAX_CHAT_MESSAGES = 40;
  const COACH_MD_URL = "./coach/manifestation-coach.md";
  const MEMORY_BLOCK_RE = /\[\[MEMORY\]\]([\s\S]*?)\[\[\/MEMORY\]\]/gi;
  const AFFIRM_BLOCK_RE = /\[\[AFFIRM\]\]([\s\S]*?)\[\[\/AFFIRM\]\]/gi;
  const AFFIRM_SHORT_BLOCK_RE =
    /\[\[(?:AFFIRM_SHORT|ROBOTIC)\]\]([\s\S]*?)\[\[\/(?:AFFIRM_SHORT|ROBOTIC)\]\]/gi;
  const DAILY_BLOCK_RE = /\[\[DAILY\]\]([\s\S]*?)\[\[\/DAILY\]\]/gi;
  const PROFILE_BLOCK_RE = /\[\[PROFILE\]\]([\s\S]*?)\[\[\/PROFILE\]\]/gi;
  const RITUAL_ROBOTIC_SECS = 10 * 60;
  const RITUAL_VISUAL_SECS = 90;

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
    bigCount: document.getElementById("big-count"),
    todayCount: document.getElementById("today-count"),
    totalCount: document.getElementById("total-count"),
    statsTodayCount: document.getElementById("stats-today-count"),
    statsChart: document.getElementById("stats-chart"),
    statsRangeTotal: document.getElementById("stats-range-total"),
    statsTabWeek: document.getElementById("stats-tab-week"),
    statsTabMonth: document.getElementById("stats-tab-month"),
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
    iconSettings: document.getElementById("icon-settings"),
    iconRail: document.getElementById("icon-rail"),
    railToggle: document.getElementById("rail-toggle"),
    pageAppearance: document.getElementById("page-appearance"),
    backFromAppearance: document.getElementById("back-from-appearance"),
    saveAppearance: document.getElementById("save-appearance"),
    resetAppearance: document.getElementById("reset-appearance"),
    homeModeImage: document.getElementById("home-mode-image"),
    homeModeColor: document.getElementById("home-mode-color"),
    homeModeGradient: document.getElementById("home-mode-gradient"),
    homeBgColor: document.getElementById("home-bg-color"),
    homeBgUpload: document.getElementById("home-bg-upload"),
    homeBgColorField: document.getElementById("home-bg-color-field"),
    homeBgPreview: document.getElementById("home-bg-preview"),
    chatModeImage: document.getElementById("chat-mode-image"),
    chatModeColor: document.getElementById("chat-mode-color"),
    chatBgColor: document.getElementById("chat-bg-color"),
    chatBgUpload: document.getElementById("chat-bg-upload"),
    chatBgColorField: document.getElementById("chat-bg-color-field"),
    chatBgPreview: document.getElementById("chat-bg-preview"),
    pinguUpload: document.getElementById("pingu-upload"),
    pinguPreview: document.getElementById("pingu-preview"),
    pinguPresetGrid: document.getElementById("pingu-preset-grid"),
    bgPhoto: document.querySelector(".bg-photo"),
    calendarDrawer: document.getElementById("calendar-drawer"),
    statsDrawer: document.getElementById("stats-drawer"),
    resourcesDrawer: document.getElementById("resources-drawer"),
    closeCalendar: document.getElementById("close-calendar"),
    closeStats: document.getElementById("close-stats"),
    closeResources: document.getElementById("close-resources"),
    tabResFaq: document.getElementById("tab-res-faq"),
    tabResLinks: document.getElementById("tab-res-links"),
    resourcesFaqView: document.getElementById("resources-faq-view"),
    resourcesLinksView: document.getElementById("resources-links-view"),
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
    ritualRoboticCopy: document.getElementById("ritual-robotic-copy"),
    ritualVisualCopy: document.getElementById("ritual-visual-copy"),
    ritualActiveDone: document.getElementById("ritual-active-done"),
    tabRobotic: document.getElementById("tab-robotic"),
    tabVisual: document.getElementById("tab-visual"),
    panelRobotic: document.getElementById("panel-robotic"),
    panelVisual: document.getElementById("panel-visual"),
    btnStartRobotic: document.getElementById("btn-start-robotic"),
    btnStartVisual: document.getElementById("btn-start-visual"),
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
    saveProfile: document.getElementById("save-profile"),
    profileGoal: document.getElementById("profile-goal"),
    profileOldStory: document.getElementById("profile-old-story"),
    profileEffective: document.getElementById("profile-effective"),
    profileCrash: document.getElementById("profile-crash"),
    profileBoundaries: document.getElementById("profile-boundaries"),
    profileNotes: document.getElementById("profile-notes"),
    chatSettingsBtn: document.getElementById("chat-settings-btn"),
    chatSettings: document.getElementById("chat-settings"),
    openaiKey: document.getElementById("openai-key"),
    openaiModel: document.getElementById("openai-model"),
    autoAnalyze: document.getElementById("auto-analyze"),
    clearChat: document.getElementById("clear-chat"),
    saveChatSettings: document.getElementById("save-chat-settings"),
    btnAnalyze: document.getElementById("btn-analyze"),
    btnDailyCheck: document.getElementById("btn-daily-check"),
    btnShowMemory: document.getElementById("btn-show-memory"),
    chatMessages: document.getElementById("chat-messages"),
    chatJumpBottom: document.getElementById("chat-jump-bottom"),
    chatForm: document.getElementById("chat-form"),
    chatInput: document.getElementById("chat-input"),
    chatSend: document.getElementById("chat-send"),
  };

  let viewDate = new Date();
  let jumping = false;
  let editDraftSource = "";
  let editKind = "story";
  let profileDraft = null;
  /** @type {null | "calendar" | "stats" | "resources"} */
  let openDrawer = null;
  /** @type {"week" | "month"} */
  let statsRange = "week";
  /** @type {"faq" | "links"} */
  let resourcesView = "faq";
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
    let history = Array.isArray(data.affirmHistory) ? data.affirmHistory : [];
    history = history
      .filter((item) => item && typeof item.text === "string" && item.text.trim())
      .map((item) => ({
        id: item.id || uid(),
        text: item.text,
        savedAt: item.savedAt || new Date().toISOString(),
      }));
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
    };
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
  if (!state.affirmHistory.length && state.affirmation) {
    state.affirmHistory = [
      { id: uid(), text: state.affirmation, savedAt: new Date().toISOString() },
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
    return [
      `终点目标：\n${p.goal || "（空）"}`,
      `旧故事：\n${p.oldStory || "（空）"}`,
      `有效肯定语：\n${p.effectiveAffirms || "（空）"}`,
      `崩溃模式：\n${p.crashPatterns || "（空）"}`,
      `边界：\n${p.boundaries || "（空）"}`,
      `其他备注：\n${p.notes || "（空）"}`,
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
      homeMode: "gradient",
      homePreset: "",
      homeColor: DEFAULT_HOME_COLOR,
      homeCustom: "",
      chatMode: "image",
      chatPreset: DEFAULT_CHAT_BG,
      chatColor: DEFAULT_CHAT_COLOR,
      chatCustom: "",
      pinguPreset: DEFAULT_PINGU,
      pinguCustom: "",
    };
  }

  function normalizeHomeMode(raw) {
    if (!raw || typeof raw !== "object") return "gradient";
    if (raw.homeMode === "color") return "color";
    if (raw.homeMode === "gradient") return "gradient";
    if (raw.homeMode === "image") {
      const hasCustom =
        raw.homePreset === "__custom__" && typeof raw.homeCustom === "string" && raw.homeCustom;
      const preset = typeof raw.homePreset === "string" ? raw.homePreset : "";
      // Migrate untouched default photo → theme aurora gradient
      if (!hasCustom && (!preset || preset === DEFAULT_HOME_BG)) return "gradient";
      return "image";
    }
    return "gradient";
  }

  function normalizeTheme(raw) {
    const base = defaultTheme();
    if (!raw || typeof raw !== "object") return base;
    const homeMode = normalizeHomeMode(raw);
    return {
      homeMode,
      homePreset:
        homeMode === "gradient"
          ? ""
          : typeof raw.homePreset === "string" && raw.homePreset
            ? raw.homePreset
            : base.homePreset,
      homeColor:
        typeof raw.homeColor === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw.homeColor)
          ? raw.homeColor
          : base.homeColor,
      homeCustom: typeof raw.homeCustom === "string" ? raw.homeCustom : "",
      chatMode: raw.chatMode === "color" ? "color" : "image",
      chatPreset:
        typeof raw.chatPreset === "string" && raw.chatPreset
          ? raw.chatPreset
          : base.chatPreset,
      chatColor:
        typeof raw.chatColor === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw.chatColor)
          ? raw.chatColor
          : base.chatColor,
      chatCustom: typeof raw.chatCustom === "string" ? raw.chatCustom : "",
      pinguPreset:
        raw.pinguPreset === "__custom__"
          ? "__custom__"
          : typeof raw.pinguPreset === "string" && PINGU_PRESET_SRCS.has(raw.pinguPreset)
            ? raw.pinguPreset
            : base.pinguPreset,
      pinguCustom: typeof raw.pinguCustom === "string" ? raw.pinguCustom : "",
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
    const homeColor = data.homeColor || DEFAULT_HOME_COLOR;
    const chatColor = data.chatColor || DEFAULT_CHAT_COLOR;
    root.style.setProperty("--home-bg-color", homeColor);
    root.style.setProperty("--chat-bg-color", chatColor);

    els.bgPhoto?.classList.remove("bg-mode-color", "bg-mode-gradient");
    if (data.homeMode === "color") {
      root.style.setProperty("--home-bg-image", "none");
      els.bgPhoto?.classList.add("bg-mode-color");
    } else if (data.homeMode === "gradient") {
      root.style.setProperty("--home-bg-image", "none");
      els.bgPhoto?.classList.add("bg-mode-gradient");
    } else {
      root.style.setProperty("--home-bg-image", cssUrl(resolveThemeImage("home", data)));
    }

    if (data.chatMode === "color") {
      root.style.setProperty("--chat-bg-image", "none");
      els.pageChat?.classList.add("chat-bg-mode-color");
    } else {
      root.style.setProperty("--chat-bg-image", cssUrl(resolveThemeImage("chat", data)));
      els.pageChat?.classList.remove("chat-bg-mode-color");
    }

    const pinguSrc = resolveThemeImage("pingu", data);
    if (els.pingu) els.pingu.src = pinguSrc;
  }

  function commitAppearance({ alertOnFail = true } = {}) {
    const next = normalizeTheme(appearanceDraft);
    try {
      saveTheme(next);
    } catch {
      if (alertOnFail) {
        window.alert("保存失败：自定义图片可能太大，请换小一点的图再试。");
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
      const homeColorMode = appearanceDraft.homeMode === "color";
      const homeGradientMode = appearanceDraft.homeMode === "gradient";
      homePrev.classList.toggle("is-color-mode", homeColorMode);
      homePrev.classList.toggle("is-gradient-mode", homeGradientMode);
      if (homeColorMode) {
        homePrev.style.backgroundImage = "none";
        homePrev.style.backgroundColor = appearanceDraft.homeColor;
      } else if (homeGradientMode) {
        homePrev.style.backgroundColor = "#fff5f9";
        homePrev.style.backgroundImage = "";
      } else {
        homePrev.style.backgroundColor = "#fff5f9";
        homePrev.style.backgroundImage = cssUrl(resolveThemeImage("home", appearanceDraft));
      }
    }
    if (chatPrev) {
      const chatColorMode = appearanceDraft.chatMode === "color";
      chatPrev.classList.toggle("is-color-mode", chatColorMode);
      if (chatColorMode) {
        chatPrev.style.backgroundImage = "none";
        chatPrev.style.backgroundColor = appearanceDraft.chatColor;
      } else {
        chatPrev.style.backgroundColor = "#cfe8f8";
        chatPrev.style.backgroundImage = cssUrl(resolveThemeImage("chat", appearanceDraft));
      }
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
    const homeMode = appearanceDraft.homeMode;
    const homeImage = homeMode === "image";
    const homeColor = homeMode === "color";
    const homeGradient = homeMode === "gradient";
    const chatImage = appearanceDraft.chatMode === "image";
    if (els.homeModeGradient) els.homeModeGradient.classList.toggle("is-active", homeGradient);
    if (els.homeModeImage) els.homeModeImage.classList.toggle("is-active", homeImage);
    if (els.homeModeColor) els.homeModeColor.classList.toggle("is-active", homeColor);
    if (els.chatModeImage) els.chatModeImage.classList.toggle("is-active", chatImage);
    if (els.chatModeColor) els.chatModeColor.classList.toggle("is-active", !chatImage);
    if (els.homeBgColor) els.homeBgColor.value = appearanceDraft.homeColor || DEFAULT_HOME_COLOR;
    if (els.chatBgColor) els.chatBgColor.value = appearanceDraft.chatColor || DEFAULT_CHAT_COLOR;
    if (els.homeBgColorField) els.homeBgColorField.hidden = !homeColor;
    if (els.chatBgColorField) els.chatBgColorField.hidden = chatImage;
    if (els.homeBgPreview) els.homeBgPreview.hidden = homeColor;
    if (els.chatBgPreview) els.chatBgPreview.hidden = !chatImage;
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
      window.alert(err?.message || "上传失败");
    }
  }

  function setAppearanceMode(target, mode) {
    if (target === "home") {
      appearanceDraft.homeMode =
        mode === "color" ? "color" : mode === "image" ? "image" : "gradient";
    }
    if (target === "chat") {
      appearanceDraft.chatMode = mode === "color" ? "color" : "image";
    }
    syncAppearanceFields();
    commitAppearance();
  }

  function compressImageFile(file, maxSide = 1280, quality = 0.82, { preserveAlpha = false } = {}) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type?.startsWith("image/")) {
        reject(new Error("请选择图片文件"));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("读取图片失败"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("图片无法解析"));
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
            reject(new Error("图片太大，请换更小的图"));
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
        });
      }
    }

    state.affirmation = next;
    state.affirmHistory.unshift({
      id: uid(),
      text: next,
      savedAt: new Date().toISOString(),
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
    if (h > 0) return m > 0 ? `${h}时${m}分` : `${h}时`;
    if (m > 0) return sec > 0 && m < 10 ? `${m}分${sec}秒` : `${m}分`;
    return `${sec}秒`;
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

  const WEEKDAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"];
  /** @type {{ keys: string[], values: number[], points: { x: number, y: number }[] } | null} */
  let statsChartData = null;

  function setStatsRange(range) {
    statsRange = range === "month" ? "month" : "week";
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

  const RESOURCE_FAQS = [
    {
      q: "A 了很多次，为什么还是没结果？",
      a: "次数不是成绩单。关键是：你在用什么身份解释现实。如果一边机械 A「已经拥有」，一边用 3D 证明「还没有」，等于在强化旧故事。先稳住自我概念（SC），再让 A 服务新假设，而不是焦虑计数。",
    },
    {
      q: "一看到 3D 反馈就崩，怎么办？",
      a: "3D 是旧状态的回声，不是否决票。崩的时候别硬撑「我不在意」——先承认难受，再改一句内对话：从「怎么还不来」换成「这是旧回声，我已经站在终点」。然后做 5–10 分钟机械 A 或一段终点视觉化。",
    },
    {
      q: "自我概念（SC）不稳，怎么修？",
      a: "把价值从外在证据上拿回来。写几条关于「我是谁 / 我配得到什么」的短句（现在时、已拥有），优先于讨好式终点肯定。SC 稳了，终点肯定语才站得住。",
    },
    {
      q: "肯定语怎么写才有效？",
      a: "具体、正向、现在时、已发生；避免「不 / 别 / 没有」。句子里不要偷偷承认「现在还没有」。过长或互相打架的句子，拆成一句能机械重复的短句。",
    },
    {
      q: "机械 A 一定要有感觉吗？",
      a: "不必。机械 A 的作用是打断旧内对话、灌入新假设，可以平淡、一心二用。靠情绪高潮硬「感觉」容易变成表演；真正要切换的是你默认相信的故事。",
    },
    {
      q: "白天假设已实现，晚上又怀疑，这算摇摆吗？",
      a: "是。新旧故事来回跳，会把延迟解读成失败。解决办法不是「更用力求」，而是 Just Decide：决定新故事，白天用机械 A 守住，晚上用终点场景入睡，少用 3D 复盘当监视。",
    },
    {
      q: "视觉化总是在演「还没有怎么办」？",
      a: "那就在演匮乏。视觉化重点是终点已实现后的日常自然感（已经拥有时你会怎么走路、怎么说话、怎么过今天），不是祈求过程和补救剧情。",
    },
    {
      q: "一定要显化彩票/大目标才算成功吗？",
      a: "不是。大额结果可以学方法（如状态、假设、坚持），但核心能力是：你能否稳定地活在所选故事里。小结果与自我概念的校准，往往比追逐神话故事更持久。",
    },
    {
      q: "限时显化 / 快速显化靠谱吗？",
      a: "「限时」是训练专注与决定，不是宇宙倒计时威胁。把时限当成练习窗口：这段时间只站新故事；别把「到点没出现」写成失败剧本。方法服务于状态，状态稳了，时间感会变松。",
    },
    {
      q: "情绪很差的时候还能不能 A？",
      a: "能，但先降抓取。情绪差时硬念「我超级开心」容易自欺。可以先短机械 A 稳住身份句，或只做 2–3 分钟终点场景；允许难受，同时不把难受当「显化失败」的证据。",
    },
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
          title: String(item.title || "自定义视频").slice(0, 120),
          author: String(item.author || "我的收藏").slice(0, 60),
          meta: String(item.meta || "自定义").slice(0, 60),
          url: String(item.url).trim(),
          badge: String(item.badge || "链接").slice(0, 12),
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
    if (!text) throw new Error("请粘贴链接");
    let href = text;
    if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
    const url = new URL(href);
    if (!/^https?:$/i.test(url.protocol)) throw new Error("链接无效");
    return url;
  }

  function buildResourceFromUrl(rawUrl, customTitle = "") {
    const url = normalizeResourceUrl(rawUrl);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    const titleHint = String(customTitle || "").trim();
    let badge = "链接";
    let author = host;
    let meta = "自定义收藏";
    let title = titleHint;

    if (host.includes("bilibili.com") || host === "b23.tv") {
      badge = "B站";
      author = "哔哩哔哩";
      const bv = url.pathname.match(/BV[\w]+/i)?.[0];
      if (!title) title = bv ? `B站视频 ${bv}` : "B站视频";
    } else if (host.includes("youtube.com") || host === "youtu.be") {
      badge = "YT";
      author = "YouTube";
      const id =
        host === "youtu.be"
          ? url.pathname.replace(/^\//, "").split("/")[0]
          : url.searchParams.get("v");
      if (!title) title = id ? `YouTube 视频 ${id}` : "YouTube 视频";
    } else if (host.includes("douyin.com") || host.includes("tiktok.com")) {
      badge = host.includes("tiktok") ? "TikTok" : "抖音";
      author = badge;
      if (!title) title = `${badge} 视频`;
    } else if (host.includes("xiaohongshu.com") || host === "xhslink.com") {
      badge = "小红书";
      author = "小红书";
      if (!title) title = "小红书内容";
    } else if (!title) {
      title = host || "自定义链接";
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

  function setResourcesView(view) {
    resourcesView = view === "links" ? "links" : "faq";
    const faqOn = resourcesView === "faq";
    if (els.tabResFaq) {
      els.tabResFaq.classList.toggle("active", faqOn);
      els.tabResFaq.setAttribute("aria-selected", faqOn ? "true" : "false");
    }
    if (els.tabResLinks) {
      els.tabResLinks.classList.toggle("active", !faqOn);
      els.tabResLinks.setAttribute("aria-selected", faqOn ? "false" : "true");
    }
    if (els.resourcesFaqView) els.resourcesFaqView.hidden = !faqOn;
    if (els.resourcesLinksView) els.resourcesLinksView.hidden = faqOn;
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
          ? `<button type="button" class="resource-card-remove" data-id="${escapeHtml(item.id)}" aria-label="删除卡片" title="删除">×</button>`
          : "";
        return `
          <div class="${wrapClass}">
            <a class="resource-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
              <div class="resource-card-top">
                <span class="resource-badge">${escapeHtml(item.badge || "链接")}</span>
                <span class="resource-card-meta">${escapeHtml(item.author || "")}</span>
              </div>
              <h3 class="resource-card-title">${escapeHtml(item.title)}</h3>
              <span class="resource-card-meta">${escapeHtml(item.meta || "")}</span>
              <span class="resource-card-cta">打开观看 →</span>
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
      throw new Error("这个链接已经添加过了");
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

  function renderResources() {
    if (!resourcesFaqRendered && els.faqList) {
      els.faqList.innerHTML = RESOURCE_FAQS.map(
        (item) => `
          <details class="faq-item">
            <summary>${item.q}</summary>
            <p>${item.a}</p>
          </details>
        `
      ).join("");
      resourcesFaqRendered = true;
    }
    renderResourceCards();
    setResourcesView(resourcesView);
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
    return `${Number(parts[1])}月${Number(parts[2])}日`;
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
        <div class="stats-tip-row"><span>A 了</span><strong>${count} 次</strong></div>
        <div class="stats-tip-row"><span>视觉化</span><strong class="${ritual.visual ? "is-yes" : "is-no"}">${ritual.visual ? "已完成" : "未完成"}</strong></div>
        <div class="stats-tip-row"><span>机械 A</span><strong class="${ritual.robotic ? "is-yes" : "is-no"}">${ritual.robotic ? "已完成" : "未完成"}</strong></div>
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
    if (!els.statsChart) return;

    const today = todayKey();
    const isMonth = statsRange === "month";
    const keys = isMonth ? getFullMonthKeys() : getFullWeekKeys();
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
      isMonth ? `本月次数走势，合计 ${rangeTotal}` : `本周次数走势，合计 ${rangeTotal}`
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
          text = WEEKDAY_LABELS[i] || "";
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

    if (els.statsRangeTotal) {
      els.statsRangeTotal.textContent = String(rangeTotal);
    }
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
    if (ritualRun && ritualRun.kind === "visual") return;
    const now = Date.now();
    if (now - lastAffirmAt < 120) return;
    lastAffirmAt = now;
    const key = todayKey();
    state.days[key] = (state.days[key] || 0) + 1;
    save(state);

    const inRoboticRitual = Boolean(ritualRun && ritualRun.kind === "robotic");
    if (inRoboticRitual) {
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
    els.calTitle.textContent = `${year}.${String(month + 1).padStart(2, "0")}`;

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
          ? `${key} · ${formatDuration(secs)}${count ? ` · ${count} 次` : ""}`
          : `${key} · 无记录`;
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
      li.textContent = "还没有记录，按空格开始吧";
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
      countEl.textContent = `${count} 次`;
      li.appendChild(dateEl);
      li.appendChild(countEl);
      els.historyList.appendChild(li);
    }
  }

  function setCalView(view) {
    const isCalendar = view === "calendar";
    els.tabCalendar.classList.toggle("active", isCalendar);
    els.tabList.classList.toggle("active", !isCalendar);
    els.calendarView.classList.toggle("active", isCalendar);
    els.listView.classList.toggle("active", !isCalendar);
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
        state.bubbleMode === "robotic" ? "机械 A" : "故事稿";
    }
    if (els.bubbleModeSwitch) {
      const robotic = state.bubbleMode === "robotic";
      els.bubbleModeSwitch.classList.toggle("is-robotic", robotic);
      els.bubbleModeSwitch.setAttribute("aria-pressed", robotic ? "true" : "false");
      els.bubbleModeSwitch.title = robotic
        ? "切换到故事稿"
        : "切换到机械 A 短句";
    }
    renderBubbleText(activeBubbleText());
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
    if (!els.ritualRingProgress) return;
    const t = Math.max(1, Number(total) || 1);
    const r = Math.max(0, Math.min(t, Number(remaining) || 0));
    const offset = RITUAL_RING_LEN * (1 - r / t);
    els.ritualRingProgress.style.strokeDasharray = String(RITUAL_RING_LEN);
    els.ritualRingProgress.style.strokeDashoffset = String(offset);
  }

  function setRitualTab(kind) {
    ritualTab = kind === "visual" ? "visual" : "robotic";
    const isRobotic = ritualTab === "robotic";
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
    renderRitualBar();
  }

  function renderRitualBar() {
    ensureDailyPlanDay({ persist: false });
    const plan = state.dailyPlan;
    const roboticText =
      state.roboticAffirmation?.trim() ||
      plan.goals?.trim() ||
      "还没有机械 A 短句。去对话点「今日复盘」生成，或点首页形象用当前肯定语练习。";
    const visualText =
      plan.visualScript?.trim() ||
      plan.goals?.trim() ||
      "还没有今日视觉化脚本。去对话点「今日复盘」生成。";

    if (els.ritualRoboticCopy) els.ritualRoboticCopy.textContent = roboticText;
    if (els.ritualVisualCopy) els.ritualVisualCopy.textContent = visualText;

    if (els.tabRobotic) {
      els.tabRobotic.classList.toggle("is-done", Boolean(plan.roboticDone));
    }
    if (els.tabVisual) {
      els.tabVisual.classList.toggle("is-done", Boolean(plan.visualDone));
    }

    const activeDone =
      ritualTab === "visual" ? Boolean(plan.visualDone) : Boolean(plan.roboticDone);
    if (els.ritualActiveDone) {
      els.ritualActiveDone.hidden = !activeDone;
    }

    if (els.btnStartRobotic) {
      els.btnStartRobotic.textContent = plan.roboticDone ? "再做一次机械 A" : "开始机械 A";
    }
    if (els.btnStartVisual) {
      els.btnStartVisual.textContent = plan.visualDone ? "再做一次视觉化" : "开始视觉化";
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
    if (ritualToastTimer) window.clearTimeout(ritualToastTimer);
    ritualToastTimer = window.setTimeout(() => {
      if (els.ritualToast) els.ritualToast.hidden = true;
      ritualToastTimer = 0;
    }, 2600);
  }

  function stopRitualTimer() {
    if (ritualRun?.timerId) window.clearInterval(ritualRun.timerId);
    ritualRun = null;
  }

  function closeRitualSession() {
    stopRitualTimer();
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
  }

  function completeRitualSession({ mark = true, cancelled = false } = {}) {
    if (!ritualRun) {
      closeRitualSession();
      return;
    }
    const kind = ritualRun.kind;
    const gained = ritualRun.sessionCount || 0;
    closeRitualSession();
    if (mark && !cancelled) markRitualDone(kind);
    refreshCounts();
    renderCalendar();
    renderDayList();
    if (cancelled) {
      if (kind === "robotic" && gained > 0) {
        showRitualToast(`已取消 · 本次 ${gained} 次`);
      }
      return;
    }
    if (kind === "robotic") {
      showRitualToast(gained > 0 ? `本次机械 A：${gained} 次` : "本次机械 A 结束");
    } else {
      showRitualToast("视觉化已完成");
    }
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
      : state.dailyPlan.visualScript?.trim() ||
        "闭眼，进入终点日常：目标已经实现，气氛轻松自然。只停留在已拥有的感觉里，不谈判、不祈求。";

    if (els.ritualSessionMode) {
      els.ritualSessionMode.textContent = isRobotic ? "机械 A" : "视觉化";
    }
    if (els.ritualSessionKicker) {
      els.ritualSessionKicker.textContent = isRobotic
        ? "点首页形象计数 · 结束后再报次数"
        : "停在终点日常 · 不抓取";
    }
    if (els.ritualSessionTimer) {
      els.ritualSessionTimer.textContent = formatRitualClock(remaining);
    }
    updateRitualRing(remaining, remaining);
    if (els.ritualSessionBody) els.ritualSessionBody.textContent = body;
    if (els.ritualSession) {
      els.ritualSession.classList.add(isRobotic ? "kind-robotic" : "kind-visual");
      els.ritualSession.hidden = false;
    }
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
      timerId: window.setInterval(tickRitualSession, 1000),
    };
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

  function renderAffirmHistoryPage() {
    els.historyCurrent.textContent = state.affirmation || "";
    if (els.historyRobotic) {
      els.historyRobotic.textContent = state.roboticAffirmation || DEFAULT_ROBOTIC;
    }
    els.affirmHistoryList.innerHTML = "";

    const items = [...state.affirmHistory].sort((a, b) =>
      a.savedAt < b.savedAt ? 1 : -1
    );

    if (items.length === 0) {
      const li = document.createElement("li");
      li.className = "empty-msg";
      li.textContent = "还没有修改记录";
      els.affirmHistoryList.appendChild(li);
      return;
    }

    for (const item of items) {
      const li = document.createElement("li");
      li.dataset.id = item.id;

      const meta = document.createElement("div");
      meta.className = "meta";
      const timeEl = document.createElement("span");
      timeEl.className = "meta-time";
      timeEl.textContent = formatTime(item.savedAt);
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "history-delete";
      delBtn.setAttribute("aria-label", "删除这条记录");
      delBtn.title = "删除";
      delBtn.textContent = "删除";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteAffirmHistory(item.id);
      });
      meta.appendChild(timeEl);
      meta.appendChild(delBtn);

      const snippet = document.createElement("div");
      snippet.className = "snippet";
      snippet.textContent = item.text;
      li.appendChild(meta);
      li.appendChild(snippet);
      li.addEventListener("click", () => openEditPage(item.text));
      els.affirmHistoryList.appendChild(li);
    }
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
      (els.pageAppearance && !els.pageAppearance.hidden)
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
      .map(([date, count]) => `${date}: ${count}次 / ${formatDuration(state.timeDays[date] || 0)}`)
      .join("\n");

    return [
      `今天：${getTodayCount()} 次`,
      `本周：${weekCount} 次，${formatDuration(weekTime)}`,
      `本月：${monthCount} 次，${formatDuration(monthTime)}`,
      `累计：${totalCount} 次，${formatDuration(totalTime)}`,
      recentDays ? `近两周明细：\n${recentDays}` : "近两周暂无记录",
      `当前故事稿：\n${state.affirmation || "（空）"}`,
      `当前机械 A 短句：\n${state.roboticAffirmation || "（空）"}`,
      `今日目标：\n${state.dailyPlan?.goals || "（尚未生成）"}`,
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
      "用中文回复。先定位问题，再给机制解释与可执行步骤。",
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
      empty.textContent = ai.apiKey
        ? "高阶显化 coach 已就绪。可点「今日复盘」，或直接说今天的状态。"
        : "先点右上角「设置」，粘贴你的 OpenAI API Key。";
      els.chatMessages.appendChild(empty);
      updateChatJumpBottom();
      return;
    }
    for (const msg of ai.messages) {
      const bubble = document.createElement("div");
      bubble.className = `chat-bubble ${msg.role}`;
      const shown =
        msg.role === "assistant"
          ? extractMemoryUpdate(msg.content).cleaned || msg.content
          : msg.content;
      fillChatBubble(bubble, shown, {
        markdown: msg.role === "assistant" || msg.role === "user",
      });
      els.chatMessages.appendChild(bubble);
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
  }

  function appendLocalBubble(role, content, extraClass = "") {
    if (!els.chatMessages) return null;
    const empty = els.chatMessages.querySelector(".chat-bubble.system");
    if (empty) empty.remove();
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}${extraClass ? ` ${extraClass}` : ""}`;
    const useMd =
      !extraClass.includes("pending") && (role === "assistant" || role === "user");
    fillChatBubble(bubble, content, { markdown: useMd });
    els.chatMessages.appendChild(bubble);
    updateChatJumpBottom();
    return bubble;
  }

  async function openaiChat(messages) {
    if (!ai.apiKey.trim()) {
      throw new Error("还没有设置 API Key");
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
      let msg = apiMsg || `请求失败（${res.status}）`;
      if (res.status === 401) {
        msg = "API Key 无效。请到 platform.openai.com 创建 API Key（不是 ChatGPT 登录密码）。";
      } else if (
        res.status === 429 ||
        /quota|billing|insufficient/i.test(apiMsg)
      ) {
        msg =
          "API 额度不足或未开通计费。ChatGPT 会员不能用于这里——请到 platform.openai.com/settings/organization/billing 开通 API 付费。";
      } else if (res.status === 404 || /model/i.test(apiMsg)) {
        msg = apiMsg || "模型不可用，请换一个模型或检查账号权限。";
      }
      throw new Error(msg);
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("模型没有返回内容");
    return text;
  }

  async function askPingu(userText) {
    if (chatBusy) return false;
    const content = (userText || "").trim();
    if (!content) return false;

    if (!ai.apiKey.trim()) {
      if (els.chatSettings) els.chatSettings.hidden = false;
      appendLocalBubble("error", "请先在设置里填写 OpenAI API Key");
      return false;
    }

    setChatBusy(true);
    ai.messages.push({ role: "user", content });
    ai.messages = ai.messages.slice(-MAX_CHAT_MESSAGES);
    saveAi();
    appendLocalBubble("user", content);

    const pending = appendLocalBubble("assistant", "Pingu 思考中…", "pending");

    try {
      const apiMessages = [
        { role: "system", content: systemPrompt() },
        {
          role: "system",
          content: `以下是用户本地活动摘要（仅供参考）：\n${buildActivityBrief()}`,
        },
        ...ai.messages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const replyRaw = await openaiChat(apiMessages);
      const { cleaned, facts, affirm, affirmShort, daily, profilePatch } =
        extractMemoryUpdate(replyRaw);
      const reply = cleaned || replyRaw;
      if (pending) pending.remove();
      ai.messages.push({ role: "assistant", content: reply });
      ai.messages = ai.messages.slice(-MAX_CHAT_MESSAGES);
      saveAi();
      appendLocalBubble("assistant", reply);
      const profileChanged = applyProfilePatch(profilePatch);
      const added = mergeCoachMemory(facts);
      if (profileChanged > 0) {
        appendLocalBubble("system", `档案字段已更新 +${profileChanged}`);
      }
      if (added > 0) {
        appendLocalBubble("system", `备注已补充 +${added}`);
      }
      if (daily && applyDailyPlanUpdate(daily)) {
        appendLocalBubble("system", "今日目标已同步到首页仪式");
      }
      if (affirm && applyAffirmationUpdate(affirm)) {
        appendLocalBubble("system", "故事稿已同步到记录与气泡");
      }
      if (affirmShort && applyRoboticUpdate(affirmShort)) {
        appendLocalBubble("system", "机械 A 短句已同步");
      }
      return true;
    } catch (err) {
      if (pending) pending.remove();
      appendLocalBubble("error", err?.message || "请求失败");
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
    openProfilePage();
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

  function openProfilePage() {
    setDrawer(null);
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageChat) els.pageChat.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.iconAffirm) els.iconAffirm.classList.remove("active");
    if (els.iconChat) els.iconChat.classList.remove("active");
    if (els.iconSettings) els.iconSettings.classList.remove("active");
    if (els.pageProfile) els.pageProfile.hidden = false;
    profileDraft = { ...(ai.coachProfile || DEFAULT_COACH_PROFILE) };
    fillProfileForm(profileDraft);
  }

  function openAppearancePage() {
    setDrawer(null);
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageChat) els.pageChat.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.iconAffirm) els.iconAffirm.classList.remove("active");
    if (els.iconChat) els.iconChat.classList.remove("active");
    if (els.pageAppearance) els.pageAppearance.hidden = false;
    if (els.iconSettings) els.iconSettings.classList.add("active");
    appearanceDraft = { ...theme };
    syncAppearanceFields();
  }

  function closeProfilePage({ backToChat = true } = {}) {
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (backToChat) openChatPage();
  }

  function saveProfileFromForm() {
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
    closeProfilePage({ backToChat: true });
    appendLocalBubble("system", "显化档案已保存");
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
  }

  function openChatPage() {
    setDrawer(null);
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.pageChat) els.pageChat.hidden = false;
    if (els.iconAffirm) els.iconAffirm.classList.remove("active");
    if (els.iconSettings) els.iconSettings.classList.remove("active");
    if (els.iconChat) els.iconChat.classList.add("active");
    if (els.chatSettings) els.chatSettings.hidden = true;
    fillChatSettingsForm();
    renderChatMessages({ stickToBottom: true });
    loadCoachManual();

    if (ai.autoAnalyze && ai.apiKey && ai.lastAutoAnalyzeDate !== todayKey() && !chatBusy) {
      window.setTimeout(() => {
        if (els.pageChat && !els.pageChat.hidden) analyzeRecent(true);
      }, 350);
    }
  }

  function setDrawer(which) {
    openDrawer = which;
    const calendarOn = which === "calendar";
    const statsOn = which === "stats";
    const resourcesOn = which === "resources";
    els.calendarDrawer.hidden = !calendarOn;
    if (els.statsDrawer) els.statsDrawer.hidden = !statsOn;
    if (els.resourcesDrawer) els.resourcesDrawer.hidden = !resourcesOn;
    if (els.drawerBackdrop) els.drawerBackdrop.hidden = !which;
    els.screen.classList.toggle("drawer-open", Boolean(which));
    els.iconCalendar.classList.toggle("active", calendarOn);
    els.iconCalendar.setAttribute("aria-expanded", calendarOn ? "true" : "false");
    if (els.iconStats) {
      els.iconStats.classList.toggle("active", statsOn);
      els.iconStats.setAttribute("aria-expanded", statsOn ? "true" : "false");
    }
    if (els.iconResources) {
      els.iconResources.classList.toggle("active", resourcesOn);
      els.iconResources.setAttribute("aria-expanded", resourcesOn ? "true" : "false");
    }
    if (statsOn) refreshStats();
    if (resourcesOn) renderResources();
  }

  function closePages() {
    if (els.pageHistory) els.pageHistory.hidden = true;
    if (els.pageEdit) els.pageEdit.hidden = true;
    if (els.pageChat) els.pageChat.hidden = true;
    if (els.pageProfile) els.pageProfile.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.iconAffirm) els.iconAffirm.classList.remove("active");
    if (els.iconChat) els.iconChat.classList.remove("active");
    if (els.iconSettings) els.iconSettings.classList.remove("active");
  }

  function openHistoryPage() {
    setDrawer(null);
    if (els.pageChat) els.pageChat.hidden = true;
    if (els.pageAppearance) els.pageAppearance.hidden = true;
    if (els.iconChat) els.iconChat.classList.remove("active");
    if (els.iconSettings) els.iconSettings.classList.remove("active");
    els.pageEdit.hidden = true;
    els.pageHistory.hidden = false;
    els.iconAffirm.classList.add("active");
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
    if (els.affirmInput) {
      els.affirmInput.placeholder = robotic
        ? "写一句机械 A 短句…"
        : "从空白开始写故事稿，当前肯定语不会预填在这里…";
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
    els.pageHistory.hidden = true;
    els.pageEdit.hidden = false;
    els.iconAffirm.classList.add("active");
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
        closeProfilePage({ backToChat: false });
        closePages();
        return;
      }
      if (els.pageAppearance && !els.pageAppearance.hidden) {
        closePages();
        return;
      }
      if (openDrawer) setDrawer(null);
      return;
    }

    if (e.code !== "Space" && e.key !== " ") return;
    if (isTypingTarget(e.target)) return;
    if (isAnyPageOpen()) return;
    if (ritualRun && ritualRun.kind === "visual") return;
    e.preventDefault();
    affirm();
  });

  els.iconCalendar.addEventListener("click", () => {
    if (isAnyPageOpen()) closePages();
    setDrawer(openDrawer === "calendar" ? null : "calendar");
  });

  const RAIL_STORAGE_KEY = "affirm-pingu-rail-collapsed";
  const RITUAL_COLLAPSE_KEY = "affirm-pingu-ritual-collapsed";

  function setRitualCollapsed(collapsed) {
    const on = Boolean(collapsed);
    const stage = els.stage || els.ritualBar?.closest(".stage");
    stage?.classList.toggle("ritual-collapsed", on);
    if (els.ritualExpand) {
      els.ritualExpand.hidden = !on;
    }
    try {
      localStorage.setItem(RITUAL_COLLAPSE_KEY, on ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function initRitualCollapsed() {
    let collapsed = false;
    try {
      collapsed = localStorage.getItem(RITUAL_COLLAPSE_KEY) === "1";
    } catch {
      collapsed = false;
    }
    setRitualCollapsed(collapsed);
  }

  if (els.ritualCollapse) {
    els.ritualCollapse.addEventListener("click", () => setRitualCollapsed(true));
  }
  if (els.ritualExpand) {
    els.ritualExpand.addEventListener("click", () => setRitualCollapsed(false));
  }
  initRitualCollapsed();

  function setRailCollapsed(collapsed) {
    const on = Boolean(collapsed);
    els.screen?.classList.toggle("rail-collapsed", on);
    if (els.railToggle) {
      els.railToggle.setAttribute("aria-expanded", on ? "false" : "true");
      els.railToggle.setAttribute("aria-label", on ? "展开侧栏" : "收起侧栏");
      els.railToggle.title = on ? "展开侧栏" : "收起侧栏";
    }
    try {
      localStorage.setItem(RAIL_STORAGE_KEY, on ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function initRailCollapsed() {
    let collapsed = false;
    try {
      collapsed = localStorage.getItem(RAIL_STORAGE_KEY) === "1";
    } catch {
      collapsed = false;
    }
    if (!collapsed && window.matchMedia("(max-width: 780px)").matches) {
      collapsed = true;
    }
    setRailCollapsed(collapsed);
  }

  if (els.railToggle) {
    els.railToggle.addEventListener("click", () => {
      const next = !els.screen?.classList.contains("rail-collapsed");
      setRailCollapsed(next);
    });
  }
  initRailCollapsed();

  els.closeCalendar.addEventListener("click", () => setDrawer(null));
  if (els.closeStats) {
    els.closeStats.addEventListener("click", () => setDrawer(null));
  }
  if (els.closeResources) {
    els.closeResources.addEventListener("click", () => setDrawer(null));
  }
  if (els.statsTabWeek) {
    els.statsTabWeek.addEventListener("click", () => setStatsRange("week"));
  }
  if (els.statsTabMonth) {
    els.statsTabMonth.addEventListener("click", () => setStatsRange("month"));
  }
  if (els.tabResFaq) {
    els.tabResFaq.addEventListener("click", () => setResourcesView("faq"));
  }
  if (els.tabResLinks) {
    els.tabResLinks.addEventListener("click", () => setResourcesView("links"));
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
        window.alert(err?.message || "添加失败");
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
    els.drawerBackdrop.addEventListener("click", () => setDrawer(null));
  }

  if (els.iconStats) {
    els.iconStats.addEventListener("click", () => {
      if (isAnyPageOpen()) closePages();
      setDrawer(openDrawer === "stats" ? null : "stats");
    });
  }

  if (els.iconResources) {
    els.iconResources.addEventListener("click", () => {
      if (isAnyPageOpen()) closePages();
      setDrawer(openDrawer === "resources" ? null : "resources");
    });
  }

  if (els.iconChat) {
    els.iconChat.addEventListener("click", () => {
      if (els.pageChat && !els.pageChat.hidden) {
        closePages();
        return;
      }
      openChatPage();
    });
  }

  if (els.iconSettings) {
    els.iconSettings.addEventListener("click", () => {
      if (els.pageAppearance && !els.pageAppearance.hidden) {
        closePages();
        return;
      }
      openAppearancePage();
    });
  }

  if (els.backFromAppearance) {
    els.backFromAppearance.addEventListener("click", closePages);
  }
  if (els.saveAppearance) {
    els.saveAppearance.addEventListener("click", () => {
      commitAppearance();
      closePages();
    });
  }
  if (els.resetAppearance) {
    els.resetAppearance.addEventListener("click", () => {
      appearanceDraft = defaultTheme();
      syncAppearanceFields();
      commitAppearance();
    });
  }
  for (const btn of [
    els.homeModeGradient,
    els.homeModeImage,
    els.homeModeColor,
    els.chatModeImage,
    els.chatModeColor,
  ]) {
    if (!btn) continue;
    btn.addEventListener("click", () => {
      setAppearanceMode(btn.dataset.target, btn.dataset.mode);
    });
  }
  if (els.homeBgColor) {
    els.homeBgColor.addEventListener("input", () => {
      appearanceDraft.homeColor = els.homeBgColor.value;
      updateAppearancePreview();
      commitAppearance({ alertOnFail: false });
    });
  }
  if (els.chatBgColor) {
    els.chatBgColor.addEventListener("input", () => {
      appearanceDraft.chatColor = els.chatBgColor.value;
      updateAppearancePreview();
      commitAppearance({ alertOnFail: false });
    });
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
      if (appearanceDraft.homeMode !== "image") return;
      pickAppearanceImage(els.homeBgUpload);
    });
  }
  if (els.chatBgPreview) {
    els.chatBgPreview.addEventListener("click", () => {
      if (appearanceDraft.chatMode === "color") return;
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

  els.iconAffirm.addEventListener("click", () => {
    if (els.pageChat && !els.pageChat.hidden) {
      closePages();
    }
    if (!els.pageHistory.hidden || !els.pageEdit.hidden) {
      closePages();
      return;
    }
    openHistoryPage();
  });

  els.backFromHistory.addEventListener("click", closePages);
  els.gotoEdit.addEventListener("click", () => openEditPage(""));
  els.backFromEdit.addEventListener("click", discardAffirmation);
  els.saveAffirm.addEventListener("click", saveAffirmation);
  els.discardAffirm.addEventListener("click", discardAffirmation);
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
    els.backFromChat.addEventListener("click", closePages);
  }
  if (els.chatSettingsBtn) {
    els.chatSettingsBtn.addEventListener("click", () => {
      if (!els.chatSettings) return;
      els.chatSettings.hidden = !els.chatSettings.hidden;
      if (!els.chatSettings.hidden) fillChatSettingsForm();
    });
  }
  if (els.openaiModel) {
    els.openaiModel.addEventListener("change", syncCustomModelField);
  }
  if (els.saveChatSettings) {
    els.saveChatSettings.addEventListener("click", () => {
      ai.apiKey = (els.openaiKey?.value || "").trim();
      ai.model = selectedModelId();
      ai.autoAnalyze = Boolean(els.autoAnalyze?.checked);
      saveAi();
      if (els.chatSettings) els.chatSettings.hidden = true;
      renderChatMessages();
      appendLocalBubble(
        "system",
        ai.apiKey ? `设置已保存 · 模型 ${ai.model}` : "已清除 API Key"
      );
    });
  }
  if (els.clearChat) {
    els.clearChat.addEventListener("click", () => {
      ai.messages = [];
      saveAi();
      renderChatMessages();
    });
  }
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
    els.ritualSessionCancel.addEventListener("click", () =>
      completeRitualSession({ mark: false, cancelled: true })
    );
  }
  if (els.ritualSessionFinish) {
    els.ritualSessionFinish.addEventListener("click", () => finishRitualSession());
  }
  if (els.backFromProfile) {
    els.backFromProfile.addEventListener("click", () => closeProfilePage({ backToChat: true }));
  }
  if (els.saveProfile) {
    els.saveProfile.addEventListener("click", () => saveProfileFromForm());
  }
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

  els.tabCalendar.addEventListener("click", () => setCalView("calendar"));
  els.tabList.addEventListener("click", () => setCalView("list"));

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
})();
