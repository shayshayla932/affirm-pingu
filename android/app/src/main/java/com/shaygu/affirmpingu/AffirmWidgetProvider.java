package com.shaygu.affirmpingu;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class AffirmWidgetProvider extends AppWidgetProvider {
  public static final String ACTION_AFFIRM = "com.shaygu.affirmpingu.ACTION_WIDGET_AFFIRM";

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    for (int appWidgetId : appWidgetIds) {
      updateWidget(context, appWidgetManager, appWidgetId);
    }
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    super.onReceive(context, intent);
    if (intent == null || intent.getAction() == null) return;
    if (ACTION_AFFIRM.equals(intent.getAction())) {
      String day = todayKey();
      AffirmStore.incrementToday(context, day);
      updateAll(context);
    }
  }

  static void updateAll(Context context) {
    AppWidgetManager manager = AppWidgetManager.getInstance(context);
    int[] ids = manager.getAppWidgetIds(new ComponentName(context, AffirmWidgetProvider.class));
    for (int id : ids) {
      updateWidget(context, manager, id);
    }
  }

  private static void updateWidget(Context context, AppWidgetManager manager, int appWidgetId) {
    String day = todayKey();
    int count = AffirmStore.getCountForDay(context, day);
    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_affirm);
    views.setTextViewText(R.id.widget_count, String.valueOf(count));

    Intent affirmIntent = new Intent(context, AffirmWidgetProvider.class);
    affirmIntent.setAction(ACTION_AFFIRM);
    PendingIntent affirmPending =
        PendingIntent.getBroadcast(
            context,
            1,
            affirmIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    views.setOnClickPendingIntent(R.id.widget_pingu, affirmPending);
    views.setOnClickPendingIntent(R.id.widget_root, affirmPending);

    Intent openIntent = new Intent(context, LiteActivity.class);
    openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
    PendingIntent openPending =
        PendingIntent.getActivity(
            context,
            2,
            openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    views.setOnClickPendingIntent(R.id.widget_count, openPending);

    manager.updateAppWidget(appWidgetId, views);
  }

  private static String todayKey() {
    return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
  }
}
