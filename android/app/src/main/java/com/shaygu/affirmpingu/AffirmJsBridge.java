package com.shaygu.affirmpingu;

import android.app.Activity;
import android.webkit.JavascriptInterface;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class AffirmJsBridge {
  private final Activity activity;

  public AffirmJsBridge(Activity activity) {
    this.activity = activity;
  }

  private String todayKey() {
    return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
  }

  @JavascriptInterface
  public void syncToday(String day, int count) {
    AffirmStore.syncToday(activity, day, count);
    AffirmWidgetProvider.updateAll(activity);
  }

  @JavascriptInterface
  public String getToday() {
    return AffirmStore.getTodayJson(activity, todayKey());
  }

  @JavascriptInterface
  public void close() {
    activity.runOnUiThread(activity::finish);
  }
}
