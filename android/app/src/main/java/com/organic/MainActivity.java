package com.from.chaos.to.organization.organic;

import android.widget.LinearLayout;
import android.graphics.Color;
import android.widget.TextView;
import android.widget.ImageView;
import android.view.Gravity;
import android.util.TypedValue;
// import com.facebook.react.ReactActivity;

// public class MainActivity extends ReactActivity {

//     /**
//      * Returns the name of the main component registered from JavaScript.
//      * This is used to schedule rendering of the component.
//      */
//     @Override
//     protected String getMainComponentName() {
//         return "organic";
//     }
// }

import com.reactnativenavigation.controllers.SplashActivity;

 public class MainActivity extends SplashActivity {
   @Override
   public LinearLayout createSplashLayout() {
     LinearLayout view = new LinearLayout(this);
     TextView textView = new TextView(this);
     ImageView imageView = new ImageView(this);
     // return R.layout.activity_splash;
     // return setContentView(R.layout.activity_splash)
     view.setBackgroundColor(Color.parseColor("#2f4f4f"));
     view.setGravity(Gravity.RIGHT | Gravity.BOTTOM);

     // textView.setTextColor(Color.parseColor("#E74C3C"));
     // textView.setText("orgAssistant");
     // textView.setGravity(Gravity.CENTER);
     // textView.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 40);

     imageView.setImageResource(R.drawable.ic_splash_logo);
     view.addView(imageView);

     // view.addView(textView);
     return view;
   }
 }
