package com.shaygu.affirmpingu;

import android.app.Activity;
import android.content.ComponentName;
import android.content.pm.PackageManager;
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
  public String getAppIcon() {
    return activity.getSharedPreferences("affirm_pingu_app", Activity.MODE_PRIVATE)
      .getString("launcher_icon", "default");
  }

  @JavascriptInterface
  public void setAppIcon(String requestedIcon) {
    final String icon = "squeeze".equals(requestedIcon) || "line".equals(requestedIcon)
      ? requestedIcon
      : "default";
    activity.runOnUiThread(() -> {
      PackageManager pm = activity.getPackageManager();
      String packageName = activity.getPackageName();
      String selected = "default".equals(icon)
        ? packageName + ".LauncherDefault"
        : "squeeze".equals(icon)
          ? packageName + ".LauncherSqueeze"
          : packageName + ".LauncherLine";
      String[] aliases = {
        packageName + ".LauncherDefault",
        packageName + ".LauncherSqueeze",
        packageName + ".LauncherLine"
      };
      pm.setComponentEnabledSetting(
        new ComponentName(packageName, selected),
        PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
        PackageManager.DONT_KILL_APP
      );
      for (String alias : aliases) {
        if (alias.equals(selected)) continue;
        pm.setComponentEnabledSetting(
          new ComponentName(packageName, alias),
          PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
          PackageManager.DONT_KILL_APP
        );
      }
      activity.getSharedPreferences("affirm_pingu_app", Activity.MODE_PRIVATE)
        .edit()
        .putString("launcher_icon", icon)
        .apply();
    });
  }

  @JavascriptInterface
  public void close() {
    activity.runOnUiThread(activity::finish);
  }
}
