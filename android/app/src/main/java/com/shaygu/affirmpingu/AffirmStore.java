package com.shaygu.affirmpingu;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONObject;

public final class AffirmStore {
  private static final String PREFS = "affirm_pingu_widget";
  private static final String KEY_DAY = "day";
  private static final String KEY_COUNT = "count";

  private AffirmStore() {}

  private static SharedPreferences prefs(Context context) {
    return context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
  }

  public static void syncToday(Context context, String day, int count) {
    if (day == null || day.isEmpty()) return;
    prefs(context)
      .edit()
      .putString(KEY_DAY, day)
      .putInt(KEY_COUNT, Math.max(0, count))
      .apply();
  }

  public static int getCountForDay(Context context, String day) {
    SharedPreferences p = prefs(context);
    String storedDay = p.getString(KEY_DAY, "");
    if (day == null || !day.equals(storedDay)) return 0;
    return p.getInt(KEY_COUNT, 0);
  }

  public static String getTodayJson(Context context, String day) {
    try {
      JSONObject obj = new JSONObject();
      SharedPreferences p = prefs(context);
      String storedDay = p.getString(KEY_DAY, day);
      int count = storedDay != null && storedDay.equals(day) ? p.getInt(KEY_COUNT, 0) : 0;
      obj.put("day", day);
      obj.put("count", count);
      return obj.toString();
    } catch (Exception e) {
      return "{\"day\":\"" + day + "\",\"count\":0}";
    }
  }

  public static int incrementToday(Context context, String day) {
    SharedPreferences p = prefs(context);
    String storedDay = p.getString(KEY_DAY, "");
    int count = day.equals(storedDay) ? p.getInt(KEY_COUNT, 0) : 0;
    count += 1;
    p.edit().putString(KEY_DAY, day).putInt(KEY_COUNT, count).apply();
    return count;
  }
}
