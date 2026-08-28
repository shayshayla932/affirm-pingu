(() => {
  const STORAGE_KEY = "affirm-pingu-data-v3";
  const countEl = document.getElementById("lite-count");
  const pinguBtn = document.getElementById("lite-pingu");
  const fxEl = document.getElementById("lite-fx");
  const closeBtn = document.getElementById("lite-close");

  let lastAffirmAt = 0;

  function todayKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { days: {}, timeDays: {}, affirmation: "", affirmHistory: [] };
      const data = JSON.parse(raw);
      return {
        days: data.days && typeof data.days === "object" ? data.days : {},
        timeDays: data.timeDays && typeof data.timeDays === "object" ? data.timeDays : {},
        affirmation: typeof data.affirmation === "string" ? data.affirmation : "",
        affirmHistory: Array.isArray(data.affirmHistory) ? data.affirmHistory : [],
      };
    } catch {
      return { days: {}, timeDays: {}, affirmation: "", affirmHistory: [] };
    }
  }

  function saveState(state) {
    try {
      const prev = loadState();
      const next = {
        ...prev,
        ...state,
        days: state.days || prev.days,
        timeDays: state.timeDays || prev.timeDays,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    syncNative(state);
  }

  function syncNative(state) {
    const day = todayKey();
    const count = Number(state.days?.[day]) || 0;
    try {
      if (window.AffirmNative && typeof window.AffirmNative.syncToday === "function") {
        window.AffirmNative.syncToday(day, count);
      }
    } catch {
      /* ignore */
    }
  }

  function pullNativeIfNeeded(state) {
    try {
      if (!window.AffirmNative || typeof window.AffirmNative.getToday !== "function") {
        return state;
      }
      const raw = window.AffirmNative.getToday();
      if (!raw) return state;
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      const day = String(parsed.day || "");
      const count = Number(parsed.count) || 0;
      if (!day) return state;
      const local = Number(state.days[day]) || 0;
      if (count > local) {
        state.days[day] = count;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      /* ignore */
    }
    return state;
  }

  let state = pullNativeIfNeeded(loadState());

  function refresh() {
    const today = Number(state.days[todayKey()]) || 0;
    countEl.textContent = String(today);
    syncNative(state);
  }

  function affirm() {
    const now = Date.now();
    if (now - lastAffirmAt < 120) return;
    lastAffirmAt = now;
    const key = todayKey();
    state.days[key] = (Number(state.days[key]) || 0) + 1;
    saveState(state);
    refresh();

    pinguBtn.classList.remove("jump");
    void pinguBtn.offsetWidth;
    pinguBtn.classList.add("jump");
    fxEl.hidden = false;
    fxEl.classList.remove("show");
    void fxEl.offsetWidth;
    window.setTimeout(() => {
      fxEl.hidden = true;
      pinguBtn.classList.remove("jump");
    }, 700);
  }

  pinguBtn.addEventListener("click", affirm);
  pinguBtn.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      affirm();
    },
    { passive: false }
  );

  closeBtn.addEventListener("click", () => {
    try {
      if (window.AffirmNative && typeof window.AffirmNative.close === "function") {
        window.AffirmNative.close();
        return;
      }
    } catch {
      /* ignore */
    }
    window.close();
    history.back();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      state = pullNativeIfNeeded(loadState());
      refresh();
    }
  });

  refresh();
})();
