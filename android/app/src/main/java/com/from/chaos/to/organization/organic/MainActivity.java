package com.from.chaos.to.organization.organic;

//import com.facebook.react.ReactActivity;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;
import android.widget.LinearLayout;
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
//    @Override
//    protected String getMainComponentName() {
//        return "Organic";
//    }
  @Override
  protected void addDefaultSplashLayout() {
    LinearLayout splash = new LinearLayout(this);
    Drawable splash_background = ContextCompat.getDrawable(getApplicationContext(), R.drawable.splash_background);
    splash.setBackground(splash_background);
    setContentView(splash);
  }
}
