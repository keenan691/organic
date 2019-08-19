package com.from.chaos.to.organization.organic;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.github.amarcruz.rntextsize.RNTextSizePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.realm.react.RealmReactPackage;
import com.rnfs.RNFSPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage; // Import package
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

      return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
      return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
      // Add additional packages you require here
      // No need to add RnnPackage and MainReactPackage
      return Arrays.<ReactPackage>asList(
          new RealmReactPackage(),
          new RNFSPackage(),
          new RNTextSizePackage(),
          new RNGestureHandlerPackage(),
          new ReanimatedPackage(),
          new DocumentPickerPackage(),
          new ReactNativeDialogsPackage(),
          new RNFetchBlobPackage()
      );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
      return getPackages();
    }
}

//public class MainApplication extends Application implements ReactApplication {
//
//  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
//    @Override
//    public boolean getUseDeveloperSupport() {
//      return BuildConfig.DEBUG;
//    }
//
//    @Override
//    protected List<ReactPackage> getPackages() {
//      return Arrays.<ReactPackage>asList(
//          new MainReactPackage(),
//      );
//    }
//
//    @Override
//    protected String getJSMainModuleName() {
//      return "index";
//    }
//  };
//
//  @Override
//  public ReactNativeHost getReactNativeHost() {
//    return mReactNativeHost;
//  }
//
//  @Override
//  public void onCreate() {
//    super.onCreate();
//    SoLoader.init(this, /* native exopackage */ false);
//  }
//}
