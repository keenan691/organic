package com.from.chaos.to.organization.organic;

import android.app.Application;
import com.rngrp.RNGRPPackage;
import com.facebook.react.ReactApplication;
import com.beefe.picker.PickerViewPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import io.realm.react.RealmReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.github.airamrguez.RNMeasureTextPackage;

import com.reactnativenavigation.NavigationApplication;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

// public class MainApplication extends Application implements ReactApplication {

  // private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
  //   @Override
  //   public boolean getUseDeveloperSupport() {
  //     return BuildConfig.DEBUG;
  //   }

  //   @Override
  //   protected List<ReactPackage> getPackages() {
  //     return Arrays.<ReactPackage>asList(
  //         new MainReactPackage(),
  //     );
  //   }

  //   @Override
  //   protected String getJSMainModuleName() {
  //     return "index";
  //   }
  // };

  // @Override
  // public ReactNativeHost getReactNativeHost() {
  //   return mReactNativeHost;
  // }

  // @Override
  // public void onCreate() {
  //   super.onCreate();
  //   SoLoader.init(this, /* native exopackage */ false);
  // }

// }

public class MainApplication extends NavigationApplication {
  @Override
  public boolean isDebug() {
      // Make sure you are using BuildConfig from your own application
      return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
      // Add additional packages you require here
      // No need to add RnnPackage and MainReactPackage
      return Arrays.<ReactPackage>asList(
          // eg. new VectorIconsPackage()
                                         new VectorIconsPackage(),
          new RealmReactPackage(),
          new RNGRPPackage(),
          new ReactNativeDocumentPicker(),
          new RNFSPackage(),
          new RNGestureHandlerPackage(),
          new RNMeasureTextPackage(),
                                         new ReactNativeDialogsPackage(),
                                         new PickerViewPackage(),
                                         new ReactNativePushNotificationPackage()
                                         );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }
}
