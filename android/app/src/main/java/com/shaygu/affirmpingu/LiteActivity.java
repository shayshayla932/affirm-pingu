package com.shaygu.affirmpingu;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

public class LiteActivity extends BridgeActivity {
  private boolean loadedLite = false;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    attachBridge();
  }

  @Override
  public void onStart() {
    super.onStart();
    attachBridge();
    loadLiteIfNeeded();
  }

  private void attachBridge() {
    Bridge bridge = getBridge();
    if (bridge == null) return;
    WebView webView = bridge.getWebView();
    if (webView == null) return;
    webView.getSettings().setJavaScriptEnabled(true);
    webView.addJavascriptInterface(new AffirmJsBridge(this), "AffirmNative");
  }

  private void loadLiteIfNeeded() {
    if (loadedLite) return;
    Bridge bridge = getBridge();
    if (bridge == null || bridge.getWebView() == null) return;
    String local = bridge.getLocalUrl();
    if (local == null || local.isEmpty()) return;
    String base = local.endsWith("/") ? local : local + "/";
    // Capacitor localUrl is often https://localhost
    if (local.contains("lite.html")) {
      loadedLite = true;
      return;
    }
    String target = base.contains("index.html")
      ? local.replace("index.html", "lite.html")
      : base + "lite.html";
    bridge.getWebView().loadUrl(target);
    loadedLite = true;
  }
}
