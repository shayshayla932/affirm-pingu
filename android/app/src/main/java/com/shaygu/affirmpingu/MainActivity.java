package com.shaygu.affirmpingu;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    attachNativeBridge();
  }

  @Override
  public void onStart() {
    super.onStart();
    attachNativeBridge();
  }

  private void attachNativeBridge() {
    Bridge bridge = getBridge();
    if (bridge == null) return;
    WebView webView = bridge.getWebView();
    if (webView == null) return;
    webView.getSettings().setJavaScriptEnabled(true);
    webView.addJavascriptInterface(new AffirmJsBridge(this), "AffirmNative");
  }
}
